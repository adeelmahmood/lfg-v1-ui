export const isSigned = (p) => {
    return p.loan_agreement_signatures?.find((s) => s.status == "signed") != null;
};

export const isVerified = (p) => {
    return p.user_identity_verifications?.find((v) => v.verification_status == "verified") != null;
};

export const isPublished = (p) => {
    return p?.onchain_proposal_id && p?.loan_proposals_status?.find((s) => s.status == "Published");
};

export const isExecuted = (p) => {
    return p?.onchain_proposal_id && p?.loan_proposals_status?.find((s) => s.status == "Executed");
};

export const isSignSubmitted = (p) => {
    return p?.agreement_signed;
};

export const isVerificationSubmitted = (p) => {
    return p?.identity_verification_requested;
};
