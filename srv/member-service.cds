using library as db from '../db/schema';


service MemberService @(path: '/members') {
    entity Members   as
        projection on db.Customers

        {
            ID,
            // read-only
            name,
            // editable
            createdAt,
            // read-only
            createdBy,
            // read-only
            modifiedAt,
            // read-only
            modifiedBy,
            // read-only
            loans,
        // read-only association


        }
        actions {
            @Core.OperationAvailable           : true
            @Common.SideEffects #editMemberName: {TargetProperties: ['name'] // tell FE to refresh the name after this action
            }
            action editMemberName(newName: String @Common.Label: 'New Name' );
            action orderMembershipCard();
            action createMember(newMemberName: String @Common.Label: 'Member Name' );
        };


    @readonly
    entity Loans     as projection on db.BookLoans;

    @readonly
    entity LoanItems as projection on db.LoanItems;


}
