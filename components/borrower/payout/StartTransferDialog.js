import { useEffect, useState } from "react";
import useIsMounted from "../../../hooks/useIsMounted";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import DialogComponent from "../../ui/DialogComponent";
import addresses from "../../../constants/contract.json";
import {
    erc20ABI,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { parseUnits } from "ethers/lib/utils.js";
import { SUPABASE_TABLE_PAYOUTS } from "../../../utils/Constants";

export default function StartTransferDialog({ isModelOpen, modelCloseHandler, loanProposal }) {
    let [isOpen, setIsOpen] = useState(isModelOpen || false);

    const { isConnected } = useAccount();

    const [isLoading, setIsLoading] = useState(false);

    const supabase = useSupabaseClient();
    const user = useUser();

    const isMounted = useIsMounted();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
    const fiatPayoutToken = addresses[chainId].fiatPayoutToken;

    // send fiat tokens to fiat settlement address
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: fiatPayoutToken.address,
        abi: erc20ABI,
        functionName: "transfer",
        args: [
            loanProposal.fiat_settlement_address,
            parseUnits(loanProposal.amount.toString(), fiatPayoutToken.decimals),
        ],
        enabled: isConnected && loanProposal.amount > 0,
        onError(err) {
            console.log("prepare error", err);
        },
    });

    const {
        write: transfer,
        data,
        error,
        isLoading: isTransferLoading,
        isError,
    } = useContractWrite(config);

    const { isLoading: isTransferTxLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            // TODO this is gonna happen in background
            closeModal(true);
        },
        onError(err) {
            console.log("tx error", err);
        },
    });

    useEffect(() => {
        setIsLoading(isTransferLoading || isTransferTxLoading);
    }, [isTransferLoading || isTransferTxLoading]);

    async function closeModal(success = false) {
        setIsOpen(false);
        if (success) updatePayoutStatus("Sent");
        modelCloseHandler?.();
    }

    async function updatePayoutStatus(status) {
        const { error } = await supabase.from(SUPABASE_TABLE_PAYOUTS).insert({
            status,
            proposal_id: loanProposal.id,
            user_id: user.id,
        });
        if (error) {
            console.log("error in updating payout status", error);
        }
    }

    useEffect(() => {
        setIsOpen(isModelOpen);
    }, [isModelOpen]);

    return (
        <>
            <DialogComponent
                heading={`Initiate ${fiatPayoutToken.symbol} Payout`}
                isModelOpen={isModelOpen}
                modelCloseHandler={closeModal}
                explicitClose={true}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-200">
                        Send borrowed USDC (Circle) tokens to the settlement service for a payout in
                        USD
                    </p>

                    <div className="mt-6 flex w-full items-center">
                        <button
                            type="button"
                            className="btn-secondary inline-flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => transfer?.()}
                            disabled={isLoading}
                        >
                            Approve & Transfer
                            {isMounted() && isLoading ? (
                                <svg
                                    className="text-indigo ml-3 h-6 w-6 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : null}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-2 w-full">
                        <div className="text-red-500">{error.message}</div>
                    </div>
                )}
            </DialogComponent>
        </>
    );
}
