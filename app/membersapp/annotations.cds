using MemberService as service from '../../srv/member-service';

annotate service.Members with @(
    UI.LineItem                     : [
        {
            $Type: 'UI.DataField',
            Value: ID,
            Label: '{i18n>Memberid}',
        },
        {
            $Type: 'UI.DataField',
            Value: name,
            Label: '{i18n>FullName}',
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt,
            Label: '{i18n>JoinedOn}',
        },
        {
            $Type: 'UI.DataField',
            Value: createdBy,
            Label: '{i18n>AddedBy}',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'MemberService.signUpNewMember',
            Label : '{i18n>SignUp}',
        },
    ],
    UI.SelectionFields              : [
        ID,
        name,
    ],
    UI.Identification               : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'MemberService.editMemberName',
            Label : '{i18n>EditName}',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'MemberService.orderMembershipCard',
            Label : '{i18n>OrderNewCard}',
        },
    ],
    UI.HeaderInfo                   : {
        TypeName      : 'Member',
        TypeNamePlural: 'Members',
        Title         : {
            $Type: 'UI.DataField',
            Value: name,
        },
    },
    UI.Facets                       : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Member Information',
            ID    : 'MemberInformation',
            Target: '@UI.FieldGroup#MemberInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Loans',
            ID    : 'Loans',
            Target: 'loans/@UI.LineItem#Loans',
        },
    ],
    UI.FieldGroup #MemberInformation: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: name,
            },
            {
                $Type: 'UI.DataField',
                Value: ID,
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
        ],
    },
);

annotate service.Members with {
    ID @Common.Label: '{i18n>Memberid}'
};

annotate service.Members with {
    name @Common.Label: '{i18n>FullName}'
};

annotate service.Loans with @(
    UI.LineItem #Loans            : [
        {
            $Type: 'UI.DataField',
            Value: ID,
            Label: '{i18n>LoanNumber}',
        },
        {
            $Type: 'UI.DataField',
            Value: dueDate,
            Label: '{i18n>DueDate}',
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt,
            Label: 'Loaned on',
        },
        {
            $Type: 'UI.DataField',
            Value: createdBy,
            Label: 'Loaned by',
        },
        {
            $Type: 'UI.DataField',
            Value: returnDate,
            Label: 'Date of Return',
        },
    ],
    UI.HeaderInfo                 : {
        TypeName      : 'Loan',
        TypeNamePlural: 'Loans',
        Title         : {
            $Type: 'UI.DataField',
            Value: ID,
        },
    },
    UI.Facets                     : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Loan Information',
            ID    : 'LoanInformation',
            Target: '@UI.FieldGroup#LoanInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Loan Items',
            ID    : 'LoanItems',
            Target: 'items/@UI.LineItem#LoanItems',
        },
    ],
    UI.FieldGroup #LoanInformation: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ID,
                Label: 'ID',
            },
            {
                $Type: 'UI.DataField',
                Value: loanee_ID,
                Label: 'loanee_ID',
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: dueDate,
                Label: 'dueDate',
            },
            {
                $Type: 'UI.DataField',
                Value: returnDate,
                Label: 'returnDate',
            },
        ],
    },
);

annotate service.LoanItems with @(UI.LineItem #LoanItems: [
    {
        $Type: 'UI.DataField',
        Value: ID,
        Label: 'ID',
    },
    {
        $Type: 'UI.DataField',
        Value: book_ID,
        Label: 'book_ID',
    },
    {
        $Type: 'UI.DataField',
        Value: returnDate,
        Label: 'returnDate',
    },
]);
