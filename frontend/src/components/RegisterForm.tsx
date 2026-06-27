import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation } from "wouter";

const RegisterForm = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [, setLocation] = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setInput((prevState) => ({ ...prevState, [name]: value }));
        if (errorMessage) setErrorMessage("");
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (input.password !== input.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: input.email.split("@")[0],
                email: input.email,
                password: input.password,
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) return data;
                else return Promise.reject(data);
            })
            .then(() => {
                setLocation("/sign-in");
            })
            .catch((err) => {
                const error = err as { message: string };
                setErrorMessage(error.message);
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
                .font-serif-display { font-family: 'DM Serif Display', serif; }
                .font-mono-dm { font-family: 'DM Mono', monospace; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-fade-up   { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .animate-fade-up-1 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .animate-fade-up-2 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .animate-fade-up-3 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .animate-fade-up-4 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .animate-fade-up-5 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .animate-spin-fast { animation: spin 0.6s linear infinite; }
                .bg-grid {
                    background-image:
                        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.04) 0%, transparent 70%),
                        repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px),
                        repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px);
                }
                .card-shine::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                }
                    input::-ms-reveal {display: none;}
            `}</style>

            <div className="font-mono-dm bg-grid min-h-screen flex items-center justify-center bg-[#0c0c0e] p-8">
                <div className="card-shine animate-fade-up relative w-full max-w-[420px] rounded-sm border border-white/[0.08] bg-white/[0.03] px-12 pb-10 pt-12">
                    <p className="animate-fade-up mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/30">
                        Get started
                    </p>

                    <h1 className="font-serif-display animate-fade-up mb-10 text-[2.4rem] font-normal leading-[1.1] tracking-tight text-[#f0ede6]">
                        Create <em className="text-[#f0ede6]/50">your</em>
                        <br />
                        account
                    </h1>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="animate-fade-up-1 mb-5">
                            <label
                                htmlFor="email"
                                className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/35"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={input.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                className="w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 py-[0.85rem] text-sm font-light text-[#f0ede6] placeholder:text-white/15 outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 focus:ring-white/[0.04]"
                            />
                        </div>

                        {/* Password */}
                        <div className="animate-fade-up-2 mb-5">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/35"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={input.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-sm border border-white/10 bg-white/[0.04] py-[0.85rem] pl-4 pr-14 text-sm font-light text-[#f0ede6] placeholder:text-white/15 outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 focus:ring-white/[0.04]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-1 py-1 text-[0.7rem] tracking-wide text-white/25 transition-colors duration-200 hover:text-white/55"
                                >
                                    {showPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="animate-fade-up-3 mb-0">
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/35"
                            >
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={input.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-sm border border-white/10 bg-white/[0.04] py-[0.85rem] pl-4 pr-14 text-sm font-light text-[#f0ede6] placeholder:text-white/15 outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 focus:ring-white/[0.04]"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {errorMessage && (
                            <div
                                role="alert"
                                className="animate-fade-up mt-5 flex items-center gap-2 rounded-sm border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-[0.75rem] tracking-wide text-red-300/90"
                            >
                                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-red-400/80" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="animate-fade-up-4 mt-7 w-full rounded-sm bg-[#f0ede6] py-[0.95rem] text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#0c0c0e] transition-all duration-200 hover:enabled:bg-white hover:enabled:shadow-[0_0_24px_rgba(240,237,230,0.15)] active:enabled:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading && (
                                    <span className="animate-spin-fast h-3 w-3 rounded-full border border-[#0c0c0e]/30 border-t-[#0c0c0e]" />
                                )}
                                {isLoading
                                    ? "Creating account…"
                                    : "Create account"}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="animate-fade-up-5 mt-8 border-t border-white/[0.06] pt-6 text-center text-[0.7rem] tracking-wide text-white/20">
                        Already have an account?{" "}
                        <a
                            href="/sign-in"
                            className="text-white/45 transition-colors duration-200 hover:text-white/75"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterForm;
