import { useMsal } from "@azure/msal-react";
import React, { useState, useRef, useEffect } from "react";
import "../assets/css/comment.css"

const Header = ({ isOpen, toggle }) => {
  const { accounts } = useMsal();
<<<<<<< HEAD

  const account = accounts[0];

  const email = account?.idTokenClaims?.preferred_username; // or .email depending on your tenant setup
  const msalId = account?.idTokenClaims?.oid; // Object ID (unique identifier)

  const name = accounts[0]?.idTokenClaims?.name; // Display Name
  // const upn = accounts[0]?.idTokenClaims?.preferred_username;
  // const initials = getInitials(name);
=======
  const name = accounts[0]?.idTokenClaims?.name; // Display Name
  const upn = accounts[0]?.idTokenClaims?.preferred_username;
  const initials = getInitials(name);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef();
    const toggleNotif = () => setIsNotifOpen(!isNotifOpen);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/login", // redirect to homepage or login
    });
  };

  function getInitials(name) {
    if (!name) return "";
<<<<<<< HEAD

    const words = name.trim().split(/\s+/); // Split by any amount of whitespace

    const firstInitial = words[0]?.[0] || "";
    const secondInitial = words[1]?.[0] || "";

    return (firstInitial + secondInitial).toUpperCase();
  }

=======
    const words = name.trim().split(/\s+/); // Split by any amount of whitespace
    const firstInitial = words[0]?.[0] || "";
    const secondInitial = words[1]?.[0] || "";
    return (firstInitial + secondInitial).toUpperCase();
  }


// Close notification when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
  
  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex justify-content-end">
      {/* Left: Toggle Button */}
      {/* <div>
        <h2>Testimonies</h2>
      </div> */}

      {/* Right: Notification + Profile */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification Icon */}
        <div className="position-relative" ref={notifRef}>
          <button
            className="bel-sorath btn position-relative"
            onClick={toggleNotif}
          >
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>

          {isNotifOpen && (
            <div className="notification-dropdown shadow-sm rounded-3">
              <div className="notfication-heading-dropdown border-bottom p-3">
                <h4 className="mb-0">Notifications</h4>
                <a href="#">Sell all</a>
              </div>
              
              <ul className="list-unstyled mb-0">
                <li className="px-3 py-2 border-bottom">
                  You approved a login.
                  <small className="text-muted d-block">5m ago</small>
                </li>
                <li className="px-3 py-2 border-bottom">
                  Friend suggestion: <strong>Kaju Bhadani</strong>
                  <small className="text-muted d-block">1h ago</small>
                </li>
                <li className="px-3 py-2 border-bottom">
                  Tony marked himself safe.
                  <small className="text-muted d-block">2d ago</small>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown (hover-enabled) */}
        <div className="dropdown dropdown-hover">
          <button
            className="btn dropdown-toggle p-0"
            type="button"
            id="profileDropdown"
          >
            {/* <i className="bi bi-person-circle fs-5 me-1"></i> */}
            <div
              style={{
                backgroundImage: 'url("https://i.pravatar.cc/150?img=4")',
              }}
              title={name}
            >
              {getInitials(name)}  {console.log(msalId)}
            </div>
            {/* <span className="d-none d-md-inline">Profile</span> */}
          </button>
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li>
              <a className="dropdown-item" href="#">
                👤 My Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                ⚙️ Settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item text-danger"
                href="#"
                onClick={handleLogout}
              >
                🚪 Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
