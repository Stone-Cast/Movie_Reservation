import { Link, useLocation } from "wouter";
import { useUserContext } from "../contexts/AuthContext";

const Navbar = () => {
    const { userData, updateUserData } = useUserContext();
    const [, setLocation] = useLocation();
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    function handleLogout() {
        fetch(`${apiUrl}/auth/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then(() => updateUserData(undefined))
            .catch((err) => console.log("Logout failed. ", err));
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
                .font-serif-display { font-family: 'DM Serif Display', serif; }
                .font-mono-dm       { font-family: 'DM Mono', monospace; }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-down   { animation: fadeDown 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .animate-fade-down-1 { animation: fadeDown 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
                .navbar-shine::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                }
                .user-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(0,250,0,0.5);
                    display: inline-block;
                    margin-right: 0.5rem;
                    position: relative;
                    top: -1px;
                }
                .user-dot::after {
                    content: '';
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    background: rgba(240,237,230,0.12);
                    animation: pulse 2.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0; transform: scale(2); }
                }
            `}</style>

            <nav className="font-mono-dm navbar-shine animate-fade-down relative z-50 flex items-center justify-between bg-[#0c0c0e]/90 px-8 py-4 backdrop-blur-sm">
                {/* Logo */}
                <Link href="/">
                    <button className="animate-fade-down group flex items-center gap-3 outline-none">
                        {/* Small film-frame icon */}
                        <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-white/15 bg-white/[0.04] transition-all duration-200 group-hover:border-white/30 group-hover:bg-white/[0.08]">
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="0.5"
                                    y="0.5"
                                    width="12"
                                    height="12"
                                    rx="1"
                                    stroke="rgba(240,237,230,0.4)"
                                    strokeWidth="0.8"
                                />
                                <rect
                                    x="1.5"
                                    y="1.5"
                                    width="2"
                                    height="2"
                                    rx="0.3"
                                    fill="rgba(240,237,230,0.35)"
                                />
                                <rect
                                    x="9.5"
                                    y="1.5"
                                    width="2"
                                    height="2"
                                    rx="0.3"
                                    fill="rgba(240,237,230,0.35)"
                                />
                                <rect
                                    x="1.5"
                                    y="9.5"
                                    width="2"
                                    height="2"
                                    rx="0.3"
                                    fill="rgba(240,237,230,0.35)"
                                />
                                <rect
                                    x="9.5"
                                    y="9.5"
                                    width="2"
                                    height="2"
                                    rx="0.3"
                                    fill="rgba(240,237,230,0.35)"
                                />
                                <rect
                                    x="4.5"
                                    y="4.5"
                                    width="4"
                                    height="4"
                                    rx="0.5"
                                    fill="rgba(240,237,230,0.15)"
                                />
                            </svg>
                        </span>
                        <span className="font-serif-display text-lg font-normal tracking-tight text-[#f0ede6] transition-colors duration-200 group-hover:text-white">
                            MovieReserve
                        </span>
                    </button>
                </Link>

                {/* Right side */}
                <div className="animate-fade-down-1 flex items-center gap-4">
                    {userData?.loggedIn ? (
                        <>
                            {/* Username */}
                            <span className="hidden items-center text-[0.7rem] tracking-wide text-white/40 sm:flex">
                                <span className="user-dot" />
                                {userData.user.name}
                            </span>

                            {/* Divider */}
                            <span className="hidden h-4 w-px bg-white/[0.08] sm:block" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="rounded-sm border border-white/10 px-4 py-[0.45rem] text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/40 transition-all duration-200 hover:border-white/20 hover:text-white/70"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            =
                            <button className="rounded-sm bg-[#f0ede6] px-5 py-[0.5rem] text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#0c0c0e] transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(240,237,230,0.12)] active:scale-[0.98]">
                                Sign in
                            </button>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
