const cds = require('@sap/cds');

module.exports = (srv) => {

    const { Customers, LoanItems, BookLoans } = cds.entities;


    srv.on('orderMembershipCard', async (req) => {
        const memberID = req.params[0];

        console.log(memberID);
        const member = await cds.read(Customers).where({ID: memberID}).then(r => r[0]);

        if (!member){
            console.warn(`Error finding member information for ID: ${memberID}`);
            return;
        }

        console.log(`Ordered new membership card for ${member.name}!`);

    });


}