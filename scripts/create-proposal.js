import { useSupabaseClient } from "@supabase/auth-helpers-react";

async function create() {
    console.log("Creating proposal");

    const supabase = useSupabaseClient();
}

create()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
