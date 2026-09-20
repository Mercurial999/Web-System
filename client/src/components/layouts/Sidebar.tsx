import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permission: null,
  },
  {
    label: "Users",
    path: "/users",
    permission: "users.read",
  },
  {
    label: "Roles",
    path: "/roles",
    permission: "roles.read",
  },
  {
    label: "Inventory",
    path: "/inventory",
    permission: "inventory.read",
  },
  {
    label: "Products",
    path: "/products",
    permission: "products.read",
  },
  {
    label: "Customers",
    path: "/customers",
    permission: "customers.read",
  },
  {
    label: "Deliveries",
    path: "/deliveries",
    permission: "deliveries.read",
  },
  {
    label: "Reports",
    path: "/reports",
    permission: "reports.read",
  },
];

function Sidebar() {
  const { logout, hasPermission } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>BDMS</h2>
        <span>Distribution operations</span>
      </div>

      <nav className="sidebar-navigation">
        {navigationItems.filter((item) => !item.permission || hasPermission(item.permission)).map((item) => (
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
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;