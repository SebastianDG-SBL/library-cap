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


    /***
     * Return all books in a given return transaction on customer = loanee_ID
     */
    srv.on('returnLoanItems', async (req) => {
        const {loanee_ID, books } = req.data;

        if (!loanee_ID || !books){
            console.warn("Loanee ID and/or books invalid");
            return;
        }

        // Get all loan items under the customer's ID
        const activeLoanItems = await cds.read('LoanItems')
    .join('BookLoans').on('loan_ID = BookLoans.ID')
    .where({ 'BookLoans.loanee_ID': loanee_ID, 'LoanItems.returnDate': null })
    .columns(['LoanItems.ID', 'LoanItems.book_ID', 'LoanItems.returnDate', 'LoanItems.loan_ID']);

        if (activeLoanItems.length ===0 ){
            console.warn("No pending returns found, cannot return");
            return;
       }

       // Check for matches with each book in loan items array
        // Be cautious for errors in books list, may try to return item twice, so remove any successful returns from the books list as you go
        let returnCount = 0;
        for (const bookID of books) {
            // If book.id matches one of the loan items' book ids
            for (let i = 0; i < activeLoanItems.length; i++){
                if (activeLoanItems[i].book_ID === bookID){
                    // Return book, remove activeLoanItems[i] from the array once returned
                    await cds.run(
                      UPDATE('LoanItems')
                      .set({ returnDate: new Date() })
                      .where({ ID: activeLoanItems[i].ID }));

                    activeLoanItems.splice(i, 1);
                    returnCount++;
                }
            }
            
        }

        // If some books were not returnable, log it
        if (returnCount != books.length){
            console.warn(`Not all books returned...`);
        }


    });

    srv.after('returnLoanItems', async (req) => {
        const {loanee_ID, books } = req.data;

         // Update any loans that are now completely returned with a new fullReturDate = time.now

         const allLoansToCheck = await cds.read('BookLoans')
    .where({ loanee_ID: loanee_ID, returnDate: null })
    .columns(['ID', 'loanDate', 'dueDate', { items: ['ID', 'book_ID', 'returnDate'] }]);

         for (const loan of allLoansToCheck){

            let allReturned = true;
            for (let i = 0; i < loan.items.length; i++){
                const curr = loan.items[i];
                if (!curr.returnDate){
                    allReturned = false;
                    break;
                }
            }

            if (allReturned){
                await cds.run(UPDATE('BookLoans').set({returnDate: new Date()}).where({ID: loan.ID}));
            }

         }
    });

}