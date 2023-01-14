import TopGradient from "../../components/TopGradient";
import BottomGradient from "../../components/BottomGradient";
import Navbar from "../../components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";

export default function BorrowerGenInfo() {
    const user = useUser();
    console.log(user);

    return (
        <>
            <div className="container mx-auto p-6">
                <TopGradient />
                <Navbar />

                <section id="">Borrower First page</section>
            </div>
        </>
    );
}
