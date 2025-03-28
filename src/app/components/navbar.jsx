"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Code, 
  FileText, 
  BarChart, 
  User, 
  Menu 
} from "lucide-react";
import "./Navbar.css";

export default function Navbar2() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-inner">
            <Link href="/" className="logo-link">
              <span className="logo-text">Query-Box</span>
            </Link>

            <nav className="desktop-nav">
              <Link href="/" className="nav-link">
                <Code size={20} className="navbar-icon" />
                Editor
              </Link>
              <Link href="/tables" className="nav-link">
                <FileText size={20} className="navbar-icon" />
                View Tables
              </Link>
              {/* <Link href="/history" className="nav-link">
                <BarChart size={20} className="navbar-icon" />
                History
              </Link> */}
              <Link href="/explore" className="nav-link">
                <FileText size={20} className="navbar-icon" />
                Explore
              </Link>
            </nav>

            <div className="navbar-user">
              <div className="user-profile">
                <div className="user-icon">
                  <User color='#000000' size={24} />
                </div>
                <div className="user-info">
                  <span className="user-name" style={{ color: '#000000' }}>Kunal Passan</span>
                  <span className="user-email" style={{ color: '#000000' }}>kunalpassan30@gmail.com</span>
                </div>
              </div>
              
              <button
                className="mobile-menu-button"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="icon" color='#00FF00' />
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}