import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Smart Travel Planner
          </Link>

          {user ? (
            <div className="hidden items-center gap-4 text-sm text-slate-600 sm:flex">
              <NavLink to="/form" className="hover:text-slate-900">
                Form
              </NavLink>
              <NavLink to="/results" className="hover:text-slate-900">
                Results
              </NavLink>
              <NavLink to="/saved" className="hover:text-slate-900">
                Saved
              </NavLink>
            </div>
          ) : null}
        </div>

        {!user ? (
          <LoginButton />
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
