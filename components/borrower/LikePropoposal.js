import { useState } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import DialogComponent from "../DialogComponent";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";

export default function LikeProposal({ loanProposal, setLoanProposal }) {
    const [likeModalOpen, setLikeModalOpen] = useState();
    const isMounted = useIsMounted();

    const supabase = useSupabaseClient();
    const user = useUser();

    const [error, setError] = useState(false);

    function closeModal() {
        setLikeModalOpen(false);
    }

    return (
        <>
            <button
                className="btn-clear"
                onClick={(e) => {
                    e.preventDefault();
                    setLikeModalOpen(true);
                }}
            >
                <HandThumbUpIcon className="inline h-6 fill-current align-top text-gray-800" />
                <span className="ml-2 hidden font-semibold text-gray-800 md:inline">
                    Like this Proposal
                </span>
            </button>

            <DialogComponent
                heading="Like Proposal"
                isModelOpen={likeModalOpen}
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
