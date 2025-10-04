using library as db from '../db/schema';

service LoanService @(path: '/lendAndReturn') {
    entity LoanItems as
        projection on db.LoanItems {
            *,
            loan.loanee.ID as loanee_ID,
        };

    entity BookLoans as projection on db.BookLoans;

    entity Customers as projection on db.Customers;

    entity Books     as
        projection on db.Books {
            *,
        }
        excluding {
            genre,
            location,
        };


    action createLoan(loanee_ID: db.Customers:ID, // the customer borrowing the books
                      books: array of db.Books:ID // list of books to loan
    ) returns {
        newLoan : db.BookLoans:ID; // the created BookLoan ID, or null if failed
    };

    action returnLoanItems(loanee_ID: db.Customers:ID,
                           books: array of db.Books:ID);


}
