import InputWithAISuggestedOption from "./InputWithAISuggestedOption";

export default function Tagline({ loanProposal, setLoanProposal, handle, ...rest }) {
    return (
        <>
            <InputWithAISuggestedOption
                data={loanProposal}
                setData={setLoanProposal}
                handle={handle}
                fieldName="business_title"
                genFieldName="business_tagline"
                manualPickFieldName="tagline_manual_picked"
                genPickFieldName="tagline_gen_picked"
                heading="Lets come up with a tagline"
                inputType="text"
                label="Provide a short description of your business or organization"
                placeHolder="Short description of your business"
                generateAction="tagline"
            />
        </>
    );
}
