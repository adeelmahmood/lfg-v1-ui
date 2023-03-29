import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SUPABASE_TABLE_PAYOUTS } from "../../../utils/Constants";
import { useEffect, useState } from "react";
import StartTransferDialog from "./StartTransferDialog";
import { getCircleTransactionLink } from "../../../utils/BlockExplorerHelper";
import { ArrowPathIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import ListBoxComponent from "../../ui/ListBoxComponent";

export default function ({ loanProposal }) {
    const [payoutStatuses, setPayoutStatuses] = useState();
    const [transferModal, setTransferModal] = useState();
    const [transfer, setTransfer] = useState();
    const [wireTransfer, setWireTransfer] = useState();
    const [isCompleted, setIsCompleted] = useState();

    const [wire, setWire] = useState({});
    const [availableWires, setAvailableWires] = useState();

    const [listTransferLoading, setListTransferLoading] = useState();
    const [submitPayoutLoading, setSubmitPayoutLoading] = useState();
    const [wireTrasnsferLoading, setWireTransferLoading] = useState();
    const [bankLoading, setBankLoading] = useState();

    const supabase = useSupabaseClient();
    const user = useUser();

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";

    const getPayoutStatuses = async () => {
        const { data, error } = await supabase
            .from(SUPABASE_TABLE_PAYOUTS)
            .select("*")
            .eq("proposal_id", loanProposal.id)
            .eq("user_id", user.id);
        if (error) {
            console.log("error in getting payout statuses", error.message);
        } else {
            setPayoutStatuses(data);
        }
    };

    const isPayoutStatusDone = (status) => {
        return payoutStatuses?.find((p) => p.status === status);
    };

    const listTransfers = async () => {
        setListTransferLoading(true);
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
            const pending = data.data?.find((d) => d.status == "pending");
            if (pending) {
                setTransfer(pending);
            } else {
                const complete = data.data?.find((d) => d.status == "complete");
                setTransfer(complete);
                setIsCompleted(true);
            }
        }
        setListTransferLoading(false);
    };

    const getBank = async () => {
        setBankLoading(true);
        const url = `/api/circle/getBank`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.status !== 200) {
            console.log(data.error);
        } else {
            setWire(data.data);
            setAvailableWires([data.data]);
        }
        setBankLoading(false);
    };

    const submitPayoutRequest = async () => {
        setSubmitPayoutLoading(true);
        const url = `/api/circle/createPayout`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: loanProposal.id,
                walletId: loanProposal.fiat_settlement_wallet,
                destinationId: wire.id,
                amount: loanProposal.amount.toString(),
            }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            console.log("error from creating payout", data);
        } else {
            await updatePayoutStatus("Paid", data.data);
        }
        setSubmitPayoutLoading(false);
        // sorta refresh
        getPayoutStatuses();
    };

    const getWireTransfer = async (id) => {
        setWireTransferLoading(true);
        const url = `/api/circle/getPayout`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            console.log(data.error);
        } else {
            setWireTransfer(data.data);
        }
        setWireTransferLoading(false);
    };

    async function updatePayoutStatus(status, md = null) {
        const { error } = await supabase.from(SUPABASE_TABLE_PAYOUTS).insert({
            status,
            metadata: md,
            proposal_id: loanProposal.id,
            user_id: user.id,
        });
        if (error) {
            console.log("error in updating payout status", error);
        }
    }

    const displayDate = (date) => {
        return (date ? new Date(date) : new Date()).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    };

    useEffect(() => {
        if (!payoutStatuses) getPayoutStatuses();
    }, [payoutStatuses]);

    return (
        <>
            {transferModal && (
                <StartTransferDialog
                    isModelOpen={transferModal}
                    modelCloseHandler={() => {
                        setTransferModal(false);
                        window.location.reload(false);
                    }}
                    loanProposal={loanProposal}
                />
            )}

            <div className="mt-8 max-w-xl">
                <div className="rounded-lg p-4 shadow">
                    <div className="">Step 1. Transfer USDC</div>
                    <span className="max-w-xs text-sm text-gray-800 dark:text-gray-300">
                        This step only needed in testing environments, where the USDC tokens are
                        represented by different addresses
                    </span>
                    <div className="mt-4">
                        {isPayoutStatusDone("Sent") ? (
                            <div>
                                <button
                                    className="btn-primary mb-2 flex items-center justify-center rounded-full py-1.5 text-sm "
                                    onClick={listTransfers}
                                    disabled={listTransferLoading}
                                >
                                    Get Status
                                </button>

                                {transfer && (
                                    <>
                                        <div className="flex items-center">
                                            <div className="mr-2  dark:text-gray-300">
                                                <span className="mr-1">USDC Transfer</span>
                                                {isCompleted ? "Completed" : "In Progress"}
                                            </div>
                                            <a
                                                href={getCircleTransactionLink(
                                                    chainId,
                                                    transfer?.transactionHash
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ArrowTopRightOnSquareIcon className="h-4 fill-current text-indigo-600 dark:text-gray-300" />
                                            </a>
                                        </div>
                                        <div className="dark:text-gray-300">
                                            Amount {transfer?.amount.amount}
                                            <span className="ml-1">
                                                {transfer?.amount.currency}
                                            </span>
                                        </div>
                                        <div className="dark:text-gray-300">
                                            Sent on {displayDate(transfer?.createDate)}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button
                                className="btn-primary mb-2 flex items-center justify-center rounded-full py-1.5 text-sm "
                                onClick={() => setTransferModal(true)}
                            >
                                Transfer USDC
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-lg p-4 shadow">
                    <div className="mb-4">Step 2. Choose Bank for Wire Transfer</div>
                    <div className="flex flex-col-reverse items-start lg:flex-row lg:items-center">
                        <div className="mr-4 w-full">
                            <ListBoxComponent
                                value={wire}
                                setValue={setWire}
                                valueDisplay={(w) =>
                                    w && (
                                        <>
                                            <div>{w.description}</div>
                                            <div>
                                                <span className="text-sm">
                                                    {w.billingDetails?.name}
                                                </span>
                                                <span className="ml-2 text-xs">
                                                    {w.billingDetails?.line1}
                                                </span>
                                                <span className="ml-1 text-xs">
                                                    {w.billingDetails?.city}
                                                </span>
                                                <span className="ml-1 text-xs">
                                                    {w.billingDetails?.country}
                                                </span>
                                            </div>
                                        </>
                                    )
                                }
                                options={availableWires}
                            />
                        </div>
                        <button onClick={getBank} disabled={bankLoading}>
                            <ArrowPathIcon className="h-6 fill-current text-indigo-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                <div className="mt-6 rounded-lg p-4 shadow">
                    <div className="">Step 3. Initiate Wire Transfer</div>
                    <span className="max-w-xs text-sm text-gray-800 dark:text-gray-300">
                        Keep in mind there will be a settlment fee in addition to the transaction
                        fees. The process may take a few days
                    </span>
                    <div className="mt-4">
                        {isPayoutStatusDone("Paid") ? (
                            <div className="">
                                <button
                                    className="btn-primary mb-2 flex items-center justify-center rounded-full py-1.5 text-sm "
                                    onClick={() => {
                                        const paid = isPayoutStatusDone("Paid");
                                        getWireTransfer(paid.metadata.id);
                                    }}
                                    disabled={wireTrasnsferLoading}
                                >
                                    Get Status
                                </button>

                                {wireTransfer && (
                                    <div>
                                        <div className="mr-2 font-semibold dark:text-gray-300">
                                            <span className="mr-1">Wire Transfer</span>
                                            {wireTransfer.status == "complete"
                                                ? "Completed"
                                                : "In Progress"}
                                        </div>
                                        <div>Sent To: {wireTransfer.destination?.name}</div>
                                        <div>Tracking Ref: {wireTransfer.trackingRef}</div>
                                        <div>
                                            <span className="mr-1">
                                                Amount: {wireTransfer.amount?.amount}
                                            </span>
                                            {wireTransfer.amount?.currency}
                                        </div>
                                        <div>
                                            <span className="mr-1">
                                                Fees: {wireTransfer.fees?.amount}
                                            </span>
                                            {wireTransfer.fees?.currency}
                                        </div>
                                        <div>Sent On: {displayDate(wireTransfer.createDate)}</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 flex w-full items-center">
                                <button
                                    type="button"
                                    className="btn-primary mb-2 flex items-center justify-center rounded-full py-1.5 text-sm "
                                    onClick={submitPayoutRequest}
                                    disabled={submitPayoutLoading}
                                >
                                    Submit Payout Request
                                    {submitPayoutLoading ? (
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
