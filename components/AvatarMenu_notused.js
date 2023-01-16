import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function AvatarMenu({ ...rest }) {
    const user = useUser();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key == "Esc" || e.key == "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <>
            <div className="relative" {...rest}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative z-10 block h-10 w-10 overflow-hidden rounded-full border-2 border-indigo-400 focus:border-indigo-600 focus:outline-none"
                >
                    <img
                        src={user?.user_metadata.avatar_url}
                        className="h-full w-full object-cover"
                    />
                </button>
                {isOpen && (
                    <button
                        onClick={() => setIsOpen(false)}
                        tabIndex="-1"
                        className="fixed inset-0 h-full w-full cursor-default"
                    />
                )}
                {isOpen && (
                    <div className="absolute right-0 w-64 rounded-lg bg-indigo-100 py-2 text-gray-800 shadow-xl">
                        <a
                            href="#"
                            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-500 hover:text-white"
                        >
                            Welcome, {user?.user_metadata.full_name}
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2  text-indigo-700 hover:bg-indigo-500 hover:text-white"
                        >
                            Sign Out
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
