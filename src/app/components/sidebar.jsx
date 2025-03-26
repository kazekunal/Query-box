'use client'
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Code, 
  BarChart, 
  Settings, 
  ChevronDown, 
  User,
  CircleUserRound
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isTablesOpen, setIsTablesOpen] = useState(false);

  const toggleTables = () => {
    setIsTablesOpen(!isTablesOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span>QB</span>
        </div>
        <span className="brand-name">Query-Box</span>
      </div>

      <nav className="sidebar-menu">
        <ul>
          <li>
            <a href="#" className="sidebar-item">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </a>
          </li>
          
          <li className="has-submenu">
            <a href="#" className="sidebar-item" onClick={toggleTables}>
              <FileText size={16} />
              <span>Tables</span>
              <ChevronDown 
                size={16} 
                className={`submenu-toggle ${isTablesOpen ? 'rotated' : ''}`} 
              />
            </a>
            {isTablesOpen && (
              <ul className="submenu">
                <li>
                  <a href="#" className="sidebar-item">
                    <span>Test database</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a href="#" className="sidebar-item">
              <Code size={16} />
              <span>Editor</span>
            </a>
          </li>

          <li>
            <a href="#" className="sidebar-item">
              <BarChart size={16} />
              <span>History</span>
            </a>
          </li>

          <li>
            <a href="#" className="sidebar-item">
              <FileText size={16} />
              <span>Explore</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-icon">
            {/* <CircleUserRound color='black' size={40} /> */}
            <User color='black' size={20}/>
          </div>
          <div className="user-info">
            <span className="user-name">Kunal Passan</span>
            <span className="user-email">kunalpassan30@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;