namespace library;

using {
    sap.common.CodeList,
    managed
} from '@sap/cds/common';

entity Genres : CodeList {
    key ID : String (20);
    name : String(20);
}

entity Sections {
    key ID : String (20);
    type : String(10) enum {
        display;
        shelf;
    };
    code : String(2);
// Optional: computed field for combined display (like "shelf A1")
//label : String(20) virtual;
}

entity BookLoans : managed {
    key ID         : String(20);
        loanee     : Association to Customers;
        loanDate   : Date;
        dueDate    : Date;
        returnDate : Date; // set when all items are returned
        items      : Composition of many LoanItems
                         on items.loan = $self;
}

entity LoanItems {
    key ID         : String(20);
        loan       : Association to BookLoans;
        book       : Association to Books;
        returnDate : Date; // optional; set when this specific book is returned
}

entity Books {
    key ID       : String(25);
        genre    : Association to one Genres   @assert.target;
        stock    : Integer default 1;
        location : Association to one Sections;
        author   : Association to one Authors  @mandatory  @assert.target;
        title    : String(90)                  @mandatory;
}

entity Authors {
    key ID    : String(23);
        name  : String(60);
        works : Association to many Books
                    on works.author = $self;
}

entity Customers : managed {
    key ID    : String(15);
        name  : String(50) @mandatory;
        loans : Association to many BookLoans
                    on loans.loanee = $self;
}
