import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="auth-brand-panel">
        <p className="auth-mark">BDMS</p>
        <p className="auth-brand-title">Bakery distribution, made orderly.</p>
        <p className="auth-brand-copy">
          Keep products, stock, customers, and deliveries moving from one clear workspace.
        </p>
      </div>
      <div className="auth-form-panel">
        <Outlet />
      </div>
    </main>
  );
}

export default AuthLayout;
