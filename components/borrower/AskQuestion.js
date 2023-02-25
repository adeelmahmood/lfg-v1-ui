import { useState } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import DialogComponent from "../DialogComponent";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export default function AskQuestion({ loanProposal, setLoanProposal }) {
    const [askModalOpen, setAskModalOpen] = useState();
    const isMounted = useIsMounted();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [error, setError] = useState(false);

    function closeModal() {
        setAskModalOpen(false);
    }

    return (
        <>
            <button
                className="btn-primary w-full text-base"
                onClick={(e) => {
                    e.preventDefault();
                    setAskModalOpen(true);
                }}
            >
                <InformationCircleIcon className="inline h-6 fill-current align-top text-gray-200 dark:text-gray-800" />
                <span className="ml-2 text-gray-200 dark:text-gray-800">Ask a Question</span>
            </button>

            <DialogComponent
                heading="Ask a Question"
                isModelOpen={askModalOpen}
                modelCloseHandler={closeModal}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">
                        Functionality not implemented yet
                    </p>
                </div>

                <div className="mt-2 w-full">
                    {error && <div className="text-red-500">{error}</div>}
                </div>
            </DialogComponent>
        </>
    );
}
