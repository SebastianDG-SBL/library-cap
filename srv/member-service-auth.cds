using {
    MemberService.Members,
    MemberService.Loans,
    MemberService.LoanItems
} from './member-service';

annotate Members with @requires: 'admin';

annotate LoanItems with @requires: 'admin';

annotate Loans with @requires: 'admin';
