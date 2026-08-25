import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Users",
    path: "/users",
  },
  {
    label: "Roles",
    path: "/roles",
  },
  {
    label: "Inventory",
    path: "/inventory",
  },
  {
    label: "Deliveries",
    path: "/deliveries",
  },
  {
    label: "Reports",
    path: "/reports",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>BDMS</h2>
        <span>Management System</span>
      </div>

      <nav className="sidebar-navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button">Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;