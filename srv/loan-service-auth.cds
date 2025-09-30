using {
    LoanService.BookLoans,
    LoanService.Books,
    LoanService.Customers,
    LoanService.LoanItems
} from './loan-service';

annotate BookLoans with @(restrict: [{
    grant: [
        'READ',
        'CREATE',
        'UPDATE'
    ],
    to   : 'admin'
}]);

annotate LoanItems with @(restrict: [{
    grant: [
        'READ',
        'CREATE',
        'UPDATE'
    ],
    to   : 'admin'
}]);

annotate Books with @(restrict: [{
    grant: ['READ',
    ],
    to   : 'admin'
}]);

annotate Customers with @(restrict: [{
    grant: ['READ',
    ],
    to   : 'admin'
}]);

type LoginResult {
    success : Boolean;
    message : String;
}

service AuthService @(path: '/auth') {
    action login(username: String,
                 password: String) returns LoginResult;
}
