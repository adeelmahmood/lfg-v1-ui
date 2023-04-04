import { ethers } from "ethers";
import { SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS } from "./Constants";

export const findEvent = (abi, logs, moreData) => {
    return new Promise((resolve) => {
        let iface = new ethers.utils.Interface(abi);
        const events = logs.map((log) => {
            try {
                const eventData = iface.parseLog(log);
                const args = {};
                for (let k in eventData.args) {
                    if (isNaN(k)) args[k] = eventData.args[k]?.toString();
                }

                return {
                    event_type: eventData.name,
                    event_data: args,
                    address: log.address,
                    ...moreData,
                };
            } catch (e) {
                console.error(e);
            }
        });

        resolve(events);
    });
};

export const saveEvent = (supabase, event) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const { data, error } = await supabase
                .from(SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS)
                .insert(event)
                .select();
            if (error) {
                return reject(error);
            }

            return resolve(data);
        })();
    });
};
