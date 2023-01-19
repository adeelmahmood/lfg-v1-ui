import InputWithAISuggestedOption from "./InputWithAISuggestedOption";

export default function LoanReason({ loanProposal, setLoanProposal, handle, ...rest }) {
    return (
        <>
            <InputWithAISuggestedOption
                data={loanProposal}
                setData={setLoanProposal}
                handle={handle}
                fieldName="loan_reasoning"
                genFieldName="loan_gen_reasoning"
                manualPickFieldName="reasoning_manual_picked"
                genPickFieldName="reasoning_gen_picked"
                heading="Tell us more about why you need this loan"
                inputType="textarea"
                label="Provide a bit more detailed information on why you need this loan"
                placeHolder="Reason for the loan"
                generateAction="emphasize"
            />
        </>
    );
}
