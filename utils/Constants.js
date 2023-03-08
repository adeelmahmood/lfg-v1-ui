export const SUPABASE_TABLE_LOAN_PROPOSALS = "loan_proposals";
export const SUPABASE_TABLE_LOAN_PROPOSALS_STATUS = "loan_proposals_status";
export const SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS = "loan_proposals_events";
export const SUPABASE_TABLE_LOAN_AGREEMENT_SIGNATURES = "loan_agreement_signatures";

export const SUPABASE_STORAGE_LOAN_PROPOSALS = "loanproposals";

export const WEBSITE_EMAILADDRESS = "adeelmahmood+lfg-v1@gmail.com";

export const HELLOSIGN_TEMPLATE = "legalagreement.pdf";

export const BLOCK_TIMES = {
    31337: 12,
    80001: 2,
};

export const PROPOSAL_STATES = [
    {
        key: "Pending",
        state: "Voting Starts In",
        info: "To participate in voting, you must assign a delegate",
    },
    {
        key: "Active",
        state: "Voting In Progress",
        info: "You can vote on this proposal",
    },
    {
        key: "Cancelled",
        state: "Proposal Canceled",
        info: "",
    },
    {
        key: "Defeated",
        state: "Proposal Failed",
        info: "",
    },
    {
        key: "Succeeded",
        state: "Proposal Passed",
        info: "Proposal can now be queued for execution",
    },
    {
        key: "Queued",
        state: "Queued To Be Executed",
        info: "Currently waiting before the proposal can be executed",
    },
    {
        key: "Expired",
        state: "Proposal Expired",
        info: "",
    },
    {
        key: "Executed",
        state: "Proposal Executed",
        info: "This proposal has been successfully approved and executed",
    },
];
