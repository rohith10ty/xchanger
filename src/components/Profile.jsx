import { FiLogOut, FiRefreshCw, FiShield, FiUser } from "react-icons/fi";
import { formatINR, useExchange } from "./exchangeStore";

function Profile({ user, onLogout, onNavigate }) {
  const { portfolioSummary, resetWallet } = useExchange();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-8 text-center">
        <FiUser className="mx-auto h-10 w-10 text-zinc-500" />
        <h1 className="mt-4 text-xl font-bold text-white">
          Sign in to view your Xchanger Profile
        </h1>
        <p className="mt-2 text-xs text-zinc-400">
          Access your simulated Demat ID, KYC verification badge, and paper
          trading controls.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-xs font-medium text-white hover:border-white"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onNavigate("signup")}
            className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black hover:bg-zinc-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-black">
              {user.name?.charAt(0)?.toUpperCase() || "X"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="text-xs text-zinc-400">{user.email}</p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <FiShield className="h-3 w-3" />
                Paper Demat Verified • {user.dematId || "XCH-40928174"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
          >
            <FiLogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Paper Account Net Worth
          </div>
          <div className="font-mono-num mt-2 text-2xl font-bold text-white">
            {formatINR(portfolioSummary.totalAccountValue)}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Available Cash Balance
          </div>
          <div className="font-mono-num mt-2 text-2xl font-bold text-white">
            {formatINR(portfolioSummary.cash)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
        <div>
          <h2 className="text-sm font-bold text-white">
            Reset Paper Trading Account
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Restore your virtual balance to ₹5,00,000.00 and default NSE
            holdings.
          </p>
        </div>
        <button
          type="button"
          onClick={resetWallet}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          Reset Wallet
        </button>
      </div>
    </div>
  );
}

export default Profile;
