import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const location = useLocation()

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const logout = () => {
    localStorage.removeItem("token")

    localStorage.removeItem("user")

    navigate("/")
  }

  const isActive = (path) =>
    location.pathname === path

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .navbar {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(8, 8, 12, 0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 3rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .navbar-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #6EE7B7;
          box-shadow: 0 0 20px #6EE7B7;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 12px;
          transition: 0.2s;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.06);
        }

        .nav-link.active {
          color: white;
          background: rgba(255,255,255,0.1);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .user-box {
          text-align: right;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
        }

        .user-role {
          font-size: 0.72rem;
          color: #6EE7B7;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .logout-btn {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.2);
          color: #FCA5A5;
          padding: 10px 18px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.2);
        }

        @media(max-width: 768px) {
          .navbar {
            padding: 0 1rem;
            flex-direction: column;
            height: auto;
            gap: 15px;
            padding-top: 15px;
            padding-bottom: 15px;
          }

          .navbar-left {
            flex-direction: column;
            gap: 15px;
          }

          .navbar-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-left">
          <Link
            to="/dashboard"
            className="navbar-brand"
          >
            <div className="brand-dot"></div>

            TaskFlow
          </Link>

          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`nav-link ${
                isActive("/dashboard")
                  ? "active"
                  : ""
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/projects"
              className={`nav-link ${
                isActive("/projects")
                  ? "active"
                  : ""
              }`}
            >
              Projects
            </Link>

            <Link
              to="/tasks"
              className={`nav-link ${
                isActive("/tasks")
                  ? "active"
                  : ""
              }`}
            >
              Tasks
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-box">
            <div className="user-name">
              {user?.name}
            </div>

            <div className="user-role">
              {user?.role}
            </div>
          </div>

          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar