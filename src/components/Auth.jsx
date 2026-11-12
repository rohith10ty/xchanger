import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";

function Auth({ mode = "login", onNavigate, onAuthSuccess }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignup && name.trim().length < 2) {
      nextErrors.name = "Please enter your full name (min 2 characters).";
    }

    if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (isSignup && !/^[6-9]\d{9}$/.test(phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    } else if (isSignup && !/\d/.test(password)) {
      nextErrors.password = "Password must include at least one number.";
    }

    if (isSignup && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (isSignup && !acceptTerms) {
      nextErrors.acceptTerms = "Please accept the paper trading terms.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userPayload = {
      name: isSignup
        ? name.trim()
        : email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ") || "Trader",
      email: email.trim().toLowerCase(),
      phone: isSignup ? phone.trim() : "9876543210",
      dematId: `XCH-${Math.floor(10000000 + Math.random() * 89999999)}`,
      joinedAt: new Date().toISOString(),
    };

    onAuthSuccess(userPayload);
    onNavigate("markets");
  };

  const handleDemoLogin = () => {
    onAuthSuccess({
      name: "Aarav Sharma",
      email: "aarav.sharma@xchanger.in",
      phone: "9820112233",
      dematId: "XCH-40928174",
      joinedAt: new Date().toISOString(),
    });
    onNavigate("markets");
  };

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-6 shadow-2xl sm:p-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Xchanger India • Demat Access
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {isSignup ? "Create Xchanger Account" : "Sign in to Xchanger"}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {isSignup
              ? "Start paper trading NSE/BSE stocks & IPOs with ₹5,00,000 virtual capital."
              : "Access your stock watchlist, paper portfolio, and order terminal."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Full Name
              </label>
              <div className="flex items-center rounded-xl border border-zinc-800 bg-[#050505] px-3.5 py-2.5 focus-within:border-white">
                <FiUser className="mr-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              Email Address
            </label>
            <div className="flex items-center rounded-xl border border-zinc-800 bg-[#050505] px-3.5 py-2.5 focus-within:border-white">
              <FiMail className="mr-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>
            )}
          </div>

          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Mobile Number (+91)
              </label>
              <div className="flex items-center rounded-xl border border-zinc-800 bg-[#050505] px-3.5 py-2.5 focus-within:border-white">
                <FiPhone className="mr-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="font-mono-num w-full bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              Password
            </label>
            <div className="flex items-center rounded-xl border border-zinc-800 bg-[#050505] px-3.5 py-2.5 focus-within:border-white">
              <FiLock className="mr-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Min 6 chars + 1 number" : "Enter password"}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>
            )}
          </div>

          {isSignup && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Confirm Password
              </label>
              <div className="flex items-center rounded-xl border border-zinc-800 bg-[#050505] px-3.5 py-2.5 focus-within:border-white">
                <FiLock className="mr-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {isSignup && (
            <div>
              <label className="flex items-start gap-2.5 text-[11px] text-zinc-400">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 accent-white"
                />
                <span>
                  I understand Xchanger uses simulated Indian stock market data
                  for paper trading only (no real money).
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-[11px] text-red-400">
                  {errors.acceptTerms}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-zinc-200"
          >
            {isSignup ? "Create Account" : "Sign In"}
            <FiArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">
            OR
          </span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:border-white hover:text-white"
        >
          <FiCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          Continue as Demo Trader (Instant Access)
        </button>

        <p className="mt-5 text-center text-xs text-zinc-500">
          {isSignup ? "Already have an account?" : "New to Xchanger?"}{" "}
          <button
            type="button"
            onClick={() => onNavigate(isSignup ? "login" : "signup")}
            className="font-semibold text-white underline underline-offset-4 hover:text-zinc-300"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
