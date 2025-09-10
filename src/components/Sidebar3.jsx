import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import Logo from "./../../src/assets/images/white_logo.png"

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  // Initialize Bootstrap tooltips
useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  // Dispose old tooltips if any
  tooltipTriggerList.forEach((el) => {
    if (el._tooltipInstance) {
      el._tooltipInstance.dispose();
      delete el._tooltipInstance;
    }
  });

  // Enable tooltip only for screens <= 768px
  if (window.innerWidth <= 768) {
    tooltipTriggerList.forEach((el) => {
      const instance = new bootstrap.Tooltip(el, {
        trigger: 'click',
        delay: { show: 200, hide: 100 },
      });
      // Store instance for cleanup
      el._tooltipInstance = instance;
    });
  }
}, [isOpen]);



  return (
    <div className={`sidebar third-option text-white ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Header with Logo */}
      <div className="sidebar-header d-flex align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
           <button className="btn toggle-btn" onClick={toggle}>
         <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 137 106"
              >
                <title>hamburger</title>
                <rect className="humbarg-icon-sorath" width="137" height="10.28" />
                <rect
                  className="humbarg-icon-sorath"
                  y="43.86"
                  width="117.99"
                  height="10.28"
                />
                <rect
                  className="humbarg-icon-sorath"
                  y="87.72"
                  width="91.47"
                  height="10.28"
                />
              </svg>
      </button>

          <div className="logo-img">
            <img src={Logo} alt="Cloud court" className='img-fluid'/>
          </div>
          {/* {isOpen && <h5 className="mb-0">Gibson</h5>} */}
        </div>
      </div>

      {/* Sidebar Links */}
      <ul className="list-unstyled mt-2 sorath-header-li">
         <li className={`btn-style2 px-3 ${location.pathname === '/dashboard1' ? 'active' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard1"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard"
          >
            <i className="bi bi-house"></i>
            <span className="menu-text ms-3">Dashboard</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/testimony"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard"
          >
            <i className="bi bi-house"></i>
            <span className="menu-text ms-3">Seatch All Testimony</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard2' ? 'active2' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard2"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dashboard2"
          >
            <i className="bi bi-person"></i>
            <span className="menu-text ms-3">Testimony by Topic</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3 ${location.pathname === '/dashboard3' ? 'active3' : ''}`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Transcripts</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Topics</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Topics by Frequency</span>
          </Link>
        </li>
        <li className={`btn-style2 px-3`}>
          <Link
            className="text-decoration-none d-flex align-items-center"
            to="/dashboard3"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Settings"
          >
            <i className="bi bi-gear"></i>
            <span className="menu-text ms-3">Word Cloud</span>
          </Link>
        </li>
      </ul>

      
    </div>
  );
};

export default Sidebar;
