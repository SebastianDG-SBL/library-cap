const cds = require('@sap/cds');
const { UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');

class MemberService extends cds.ApplicationService {
    init() {

        const { Customers, LoanItems, BookLoans } = cds.entities;

        this.before('createMember', async (req) => {
            const maxIdRow = await cds.read(Customers).columns(['ID']).orderBy({ ID: 'desc' }).limit(1);
            let nextId = 1;
            if (maxIdRow.length > 0) {
                const currentMax = parseInt(maxIdRow[0].ID.replace('c', ''));
                nextId = currentMax + 1;
            }

            req.data.ID = `c${nextId}`;
        });

        this.on('createMember', async (req) => {
            const { newMemberName } = req.data;
            console.log(`New id is ${req.data.ID}, new name is ${newMemberName}`);

            const result = await cds.run(
                INSERT.into(Customers).entries({
                    ID: req.data.ID,
                    name: newMemberName
                })
            );

            console.log(result ? `Created new member ${newMemberName} with ID ${result.ID}` : "Failed to create member");

        });




        this.on('orderMembershipCard', async (req) => {
            const memberID = req.params[0];
            console.log(req.params);
            console.log(req.data);
            console.log(req.subject);
            const member = await cds.read(Customers).where({ ID: memberID }).then(r => r[0]);

            if (!member) {
                console.warn(`Error finding member information for ID: ${memberID}`);
                return;
            }

            console.log(`Ordered new membership card for ${member.name}!`);

        });



        this.on('editMemberName', async (req) => {

            const { newName } = req.data;
            const memberID = req.params[0].ID;

            console.log(req.params);
            console.log(`New name is :${newName}, on ID:${memberID}`);


            const result = await UPDATE(Customers)
                .set({ name: newName })
                .where({ ID: memberID });

            if (result > 0)
                console.log("Name updated");
            else
                console.warn("Could not update name for customer with ID: " + memberID);

        });


        // Add base class's handlers. Handlers registered above go first.
        return super.init()


    }
}



module.exports = { MemberService }