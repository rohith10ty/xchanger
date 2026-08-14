import { FiArrowUpRight, FiPlus } from "react-icons/fi";

function DashboardHeader() {
  return (
    <section className="dashboard-header">
      <div>
        <div className="dashboard-eyebrow">
          <span></span>
          Live Market
        </div>

        <h1>Markets Overview</h1>

        <p>
          Track market performance, analyse price movements and manage your
          crypto assets.
        </p>
      </div>

      <div className="dashboard-header-actions">
        <button className="secondary-action">
          <FiPlus />
          Deposit
        </button>

        <button className="primary-action">
          Start Trading
          <FiArrowUpRight />
        </button>
      </div>
    </section>
  );
}

export default DashboardHeader;
