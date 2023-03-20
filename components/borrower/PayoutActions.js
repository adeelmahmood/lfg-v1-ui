import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import InitiatePayoutDialog from "./InitiatePayoutDialog";

export default function ({ loanProposal }) {
    const [initiatePayoutModal, setInitiatePayoutModal] = useState();
    const [selectedProposal, setSelectedProposal] = useState();

    const listTransfers = async () => {
        const url = `/api/circle/listTransfers`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletId: loanProposal.fiat_settlement_wallet }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            console.log(data.error);
        } else {
            console.log(data);
        }
    };

    useEffect(() => {
        console.log("listing transfers ", loanProposal.fiat_settlement_wallet);
        listTransfers();
    }, []);

    const showInitiatePayoutDialog = (lp) => {
        setSelectedProposal(lp);
        setInitiatePayoutModal(true);
    };

    return (
        <>
            {initiatePayoutModal && (
                <InitiatePayoutDialog
                    isModelOpen={initiatePayoutModal}
                    modelCloseHandler={() => {
                        setInitiatePayoutModal(false);
                        // window.location.reload(false);
                    }}
                    loanProposal={selectedProposal}
                />
            )}

            <button
                className="btn-primary flex items-center"
                onClick={() => showInitiatePayoutDialog(loanProposal)}
            >
                <CurrencyDollarIcon className="mr-2 inline h-6 fill-current dark:text-gray-800" />
                <span>Initiate Payout</span>
            </button>
        </>
    );
}
