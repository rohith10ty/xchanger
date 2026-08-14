import { useState } from "react";
import { FiCheck, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import "./Profile.css";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  password: "",
};

function Profile({ user, onUserChange }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    email: user?.email || "",
  }));
  const [settings, setSettings] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  }));
  const [message, setMessage] = useState("");

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAuth = (event) => {
    event.preventDefault();
    setMessage("");

    if (mode === "signup") {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        setMessage("Please complete your name, email and password.");
        return;
      }

      const account = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        password: form.password,
      };
      const publicUser = { ...account };
      delete publicUser.password;
      localStorage.setItem("quantumAccount", JSON.stringify(account));
      localStorage.setItem("quantumUser", JSON.stringify(publicUser));
      onUserChange(publicUser);
      setSettings(publicUser);
      setMessage("Your Quantum account is ready.");
      return;
    }

    const account = (() => {
      try {
        return JSON.parse(localStorage.getItem("quantumAccount"));
      } catch {
        return null;
      }
    })();

    if (
      !account ||
      account.email !== form.email.trim().toLowerCase() ||
      account.password !== form.password
    ) {
      setMessage(
        "Email or password is incorrect. Create an account first if you are new.",
      );
      return;
    }

    const publicUser = { ...account };
    delete publicUser.password;
    localStorage.setItem("quantumUser", JSON.stringify(publicUser));
    onUserChange(publicUser);
    setSettings(publicUser);
    setMessage("Signed in successfully.");
  };

  const saveSettings = (event) => {
    event.preventDefault();
    const cleanSettings = {
      name: settings.name.trim(),
      email: settings.email.trim().toLowerCase(),
      phone: settings.phone.trim(),
      country: settings.country.trim(),
    };
    const account = JSON.parse(localStorage.getItem("quantumAccount") || "{}");
    localStorage.setItem(
      "quantumAccount",
      JSON.stringify({ ...account, ...cleanSettings }),
    );
    localStorage.setItem("quantumUser", JSON.stringify(cleanSettings));
    onUserChange(cleanSettings);
    setMessage("Profile settings saved.");
  };

  const signOut = () => {
    localStorage.removeItem("quantumUser");
    onUserChange(null);
    setForm(emptyForm);
    setMode("signin");
    setMessage("You have been signed out.");
  };

  if (user) {
    return (
      <main className="profile-page">
        <section className="profile-page-header">
          <div>
            <div className="dashboard-eyebrow">
              <span></span>YOUR ACCOUNT
            </div>
            <h1>Profile settings</h1>
            <p>Manage the personal details shown on your Quantum account.</p>
          </div>
          <button className="secondary-action" onClick={signOut}>
            <FiLogOut /> Sign out
          </button>
        </section>

        <section className="profile-settings-layout">
          <aside className="profile-summary-card">
            <div className="profile-large-avatar">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <h2>{user.name}</h2>
            <span>{user.email}</span>
            <div>
              <FiCheck /> Verified Quantum profile
            </div>
          </aside>

          <form className="profile-form-card" onSubmit={saveSettings}>
            <div className="profile-form-heading">
              <FiSettings />
              <div>
                <h2>Personal details</h2>
                <p>Update your account information.</p>
              </div>
            </div>
            <ProfileFields
              form={settings}
              setForm={setSettings}
              includePassword={false}
            />
            {message && <div className="profile-message">{message}</div>}
            <button className="primary-action profile-submit" type="submit">
              Save changes
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FiUser />
        </div>
        <span className="section-kicker">QUANTUM ACCOUNT</span>
        <h1>{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p>
          {mode === "signin"
            ? "Sign in to access your profile settings."
            : "Add your details to set up your Quantum profile."}
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "signin" ? "active" : ""}
            onClick={() => {
              setMode("signin");
              setMessage("");
            }}
          >
            Sign in
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleAuth}>
          {mode === "signup" && (
            <ProfileFields form={form} setForm={setForm} includePassword />
          )}
          {mode === "signin" && (
            <>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateForm}
                  required
                />
              </label>
            </>
          )}
          {message && <div className="profile-message">{message}</div>}
          <button className="primary-action profile-submit" type="submit">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function ProfileFields({ form, setForm, includePassword }) {
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="profile-fields">
      <label>
        Full name
        <input name="name" value={form.name} onChange={update} required />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />
      </label>
      <label>
        Phone number
        <input name="phone" type="tel" value={form.phone} onChange={update} />
      </label>
      <label>
        Country
        <input name="country" value={form.country} onChange={update} />
      </label>
      {includePassword && (
        <label className="profile-field-wide">
          Password
          <input
            name="password"
            type="password"
            minLength="6"
            value={form.password}
            onChange={update}
            required
          />
        </label>
      )}
    </div>
  );
}

export default Profile;
