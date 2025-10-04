const cds = require('@sap/cds');
const { UPDATE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = (srv) => {

    const { Books, LoanItems, BookLoans, Customers } = cds.entities;


    srv.on('createLoan', async (req) => {
        const { loanee_ID, books } = req.data;

        // Reject if more than 5 books
        if (!Array.isArray(books) || books.length === 0 || books.length > 5) {
            return { newLoan: null };
        }

        // Check available stock for each book
        for (let bookId of books) {
            const book = await cds.read(Books).where({ ID: bookId }).columns(['ID', 'stock']).then(res => res[0]);
            if (!book) return { newLoan: null };

            // Count active loan items
            const activeLoans = await cds.read(LoanItems)
                .where({ book_ID: bookId, returnDate: null })
                .columns([{ count: { '*': 'count' } }])
                .then(res => res[0]?.count || 0);

            const available = book.stock - activeLoans;
            if (available <= 0) {
                // No stock available, reject the entire loan
                return { newLoan: null };
            }
        }

        // All checks passed, create the BookLoan
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 14);

        const newLoanEntry = await cds.run(INSERT.into(BookLoans).entries({
            loanee_ID,
            loanDate: today,
            dueDate
        }));

        // Get the ID of the new loan
        const loanId = newLoanEntry.ID || newLoanEntry[0]?.ID;

        // Create LoanItems
        const loanItems = books.map(bookId => ({
            loan_ID: loanId,
            book_ID: bookId
        }));
        await cds.run(INSERT.into(LoanItems).entries(loanItems));

        return { newLoan: loanId };
    });


    srv.on('returnLoanItems', async (req) => {
        const { loanee_ID, books } = req.data;

        if (!loanee_ID || !books || !books.length) {
            console.warn("Loanee ID and/or books invalid");
            return;
        }

        const now = new Date();

        // Update all LoanItems for this member and these books that have not been returned yet
        const updated = await cds.run(UPDATE('LoanItems'))
            .set({ returnDate: now })
            .where({
                book_ID: books,
                returnDate: null
            })
            .and({ 'BookLoans.loanee_ID': loanee_ID }) // join condition
            .join('BookLoans').on('loan_ID = BookLoans.ID');

        if (!updated) {
            console.warn("No matching pending loan items found to return");
            return;
        }

        // Now update any BookLoans where all items are returned
        const loansToCheck = await cds.read('BookLoans')
            .where({ loanee_ID, returnDate: null })
            .columns(['ID', { items: ['ID', 'returnDate'] }]);

        for (const loan of loansToCheck) {
            const allReturned = loan.items.every(item => item.returnDate !== null);
            if (allReturned) {
                await cds.run(UPDATE('BookLoans').set({ returnDate: now }).where({ ID: loan.ID }));
            }
        }

        console.log(`Returned ${updated} book(s) for member ${loanee_ID}`);
    });

    srv.after('returnLoanItems', async (req) => {
        const { loanee_ID, books } = req.data;

        // Update any loans that are now completely returned with a new fullReturDate = time.now

        // Now update any BookLoans where all items are returned
        const loansToCheck = await cds.read('BookLoans')
            .where({ loanee_ID, returnDate: null })
            .columns(['ID', { items: ['ID', 'returnDate'] }]);

        for (const loan of loansToCheck) {
            const allReturned = loan.items.every(item => item.returnDate !== null);
            if (allReturned) {
                await cds.run(UPDATE('BookLoans').set({ returnDate: now }).where({ ID: loan.ID }));
            }
        }

        console.log(`Returned ${updated} book(s) for member ${loanee_ID}`);
    });

}