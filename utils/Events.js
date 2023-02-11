import { ethers } from "ethers";

export const findEvent = (abi, logs, loanProposal) => {
    return new Promise((resolve) => {
        let iface = new ethers.utils.Interface(abi);
        logs.map((log) => {
            try {
                const eventData = iface.parseLog(log);
                const args = {};
                for (let k in eventData.args) {
                    if (isNaN(k)) args[k] = eventData.args[k]?.toString();
                }

                resolve({
                    event_type: eventData.name,
                    proposal_id: loanProposal.id,
                    event_data: args,
                });
            } catch (e) {
                console.error(e);
            }
        });

        resolve(null);
    });
};
