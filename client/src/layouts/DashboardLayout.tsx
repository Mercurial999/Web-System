import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;