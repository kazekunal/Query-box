"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Code, 
  FileText, 
  BarChart, 
  User, 
  Menu,
  X
} from "lucide-react";
import "./navbar.css";

export default function Navbar() {
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

  const navLinks = [
    { 
      href: "/", 
      label: "Editor", 
      icon: <Code size={20} className="navbar-icon" /> 
    },
    { 
      href: "/tables", 
      label: "View Tables", 
      icon: <FileText size={20} className="navbar-icon" /> 
    },
    { 
      href: "/explore", 
      label: "Explore", 
      icon: <FileText size={20} className="navbar-icon" /> 
    }
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-inner">
            <Link href="/" className="logo-link">
              <span className="logo-text">Query-Box</span>
            </Link>

            <nav className="desktop-nav">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="nav-link"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
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
                aria-label="Open Menu"
              >
                <Menu className="icon" color='#000000' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <button 
              className="mobile-menu-close"
              onClick={closeMenu}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>

            <div className="mobile-user-profile">
              <div className="mobile-user-icon">
                <User color='#000000' size={36} />
              </div>
              <div className="mobile-user-info">
                <span className="mobile-user-name">Kunal Passan</span>
                <span className="mobile-user-email">kunalpassan30@gmail.com</span>
              </div>
            </div>

            <nav className="mobile-nav">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="mobile-nav-link"
                  onClick={closeMenu}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}