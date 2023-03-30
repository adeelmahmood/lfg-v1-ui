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

export const saveEvent = async (supabase, event) => {
    return new Promise((resolve, reject) => {
        const { error } = supabase.from(SUPABASE_TABLE_LOAN_PROPOSALS_EVENTS).insert(event);
        if (error) {
            console.log(error.message);
            reject();
        }

        resolve();
    });
};
