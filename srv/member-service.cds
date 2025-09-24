using library as db from '../db/schema';

service MemberService @(path: '/members') {
    entity Members   as projection on db.Customers;

    @readonly
    entity Loans     as projection on db.BookLoans;

    @readonly
    entity LoanItems as projection on db.LoanItems;

    action orderMembershipCard();

}
