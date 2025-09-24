const cds = require('@sap/cds');

module.exports = (srv) => {

    const { Books, LoanItems, BookLoans } = cds.entities;

    srv.after(['READ'], 'Books', async (each, req) => {
    if (!each.ID) return;

    // Count active LoanItems (books not yet returned)
    const activeLoans = await cds.read('LoanItems')
        .where({ book_ID: each.ID, returnDate: null })
        .columns([{ count: { '*': 'count' } }])
        .then(res => res[0] || { count: 0 });

    each.availableStock = each.stock - activeLoans.count;
    if (each.availableStock < 0) each.availableStock = 0;
});

}