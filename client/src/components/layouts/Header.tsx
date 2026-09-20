import { useAuth } from "../../context/useAuth";

function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div>
        <p className="header-kicker">Bakery Distribution Management System</p>
        <h1>Operations workspace</h1>
      </div>

      <div className="header-user">
        <strong>{user ? `${user.firstName} ${user.lastName}` : "User"}</strong>
        <span>{user?.role.name ?? ""}</span>
      </div>
    </header>
  );
}

export default Header;