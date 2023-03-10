import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const Navbar = ({}) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="pt-2">
                    <Link href="/" className="focus:outline-none">
                        <ArrowPathIcon className="mb-2 inline h-6" fill="#4F46E5" />
                        <span className="px-2 text-2xl font-bold tracking-tighter text-indigo-600 hover:text-indigo-800">
                            Lending Marketplace
                        </span>
                    </Link>
                </div>
                <div className="hidden space-x-6">
                    <a href="#" className="hover:text-indigo-600">
                        Launch App
                    </a>
                    <a href="#" className="hover:text-indigo-600">
                        Learn More
                    </a>
                </div>
                <div className="hidden sm:flex">
                    <ConnectButton />
                </div>
            </div>
        </>
    );
};

export default Navbar;
