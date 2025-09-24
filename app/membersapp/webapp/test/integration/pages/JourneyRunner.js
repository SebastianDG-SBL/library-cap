sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"membersapp/test/integration/pages/MembersList",
	"membersapp/test/integration/pages/MembersObjectPage"
], function (JourneyRunner, MembersList, MembersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('membersapp') + '/test/flp.html#app-preview',
        pages: {
			onTheMembersList: MembersList,
			onTheMembersObjectPage: MembersObjectPage
        },
        async: true
    });

    return runner;
});

