namespace library;

using {
    cuid,
    sap.common.CodeList,
    managed
} from '@sap/cds/common';

entity Genres : cuid, CodeList {
    name : String(20);
}

entity Sections : cuid {
    type : String(10) enum {
        display;
        shelf;
    };
    code : String(2);
// Optional: computed field for combined display (like "shelf A1")
//label : String(20) virtual;
}

entity BookLoans : cuid, managed {
    loanee     : Association to Customers;
    loanDate   : Date;
    dueDate    : Date;
    returnDate : Date; // set when all items are returned
    items      : Composition of many LoanItems
                     on items.loan = $self;
}

entity LoanItems : cuid {
    loan       : Association to BookLoans;
    book       : Association to Books;
    returnDate : Date; // optional; set when this specific book is returned
}

entity Books : cuid {
    genre    : Association to one Genres   @assert.target;
    stock    : Integer default 1;
    location : Association to one Sections;
    author   : Association to one Authors  @mandatory  @assert.target;
    title    : String(90)                  @mandatory;
}

entity Authors : cuid {
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
