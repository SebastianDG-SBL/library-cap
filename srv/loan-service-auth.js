const cds = require('@sap/cds');
const mockUsers = require('../package.json').cds.requires.auth.users;

module.exports = cds.service.impl(async function () {

    this.on('login', async (req) => {
        const { username, password } = req.data;


        // Check mocked users from package.json
        const user = mockUsers[username];
        if (user && user.roles.includes('admin') && password === user.password) {
            // Attach role to session
            req.user = new cds.User({ id: username, roles: user.roles });
            return { success: true };
        }

        // Return failure WITHOUT triggering HTTP 401
        console.log("invalid");
        return { success: false, message: "Invalid credentials" }
    });


});