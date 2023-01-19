import InputWithAISuggestedOption from "./InputWithAISuggestedOption";

export default function BusinessInformation({ loanProposal, setLoanProposal, handle, ...rest }) {
    return (
        <>
            <InputWithAISuggestedOption
                data={loanProposal}
                setData={setLoanProposal}
                handle={handle}
                fieldName="business_description"
                genFieldName="business_gen_description"
                manualPickFieldName="description_manual_picked"
                genPickFieldName="description_gen_picked"
                heading="Tell us more about your business"
                inputType="textarea"
                label="Provide a bit more detailed description of your business or organization"
                placeHolder="Description of your business"
                generateAction="summarize"
            />
        </>
    );
}
