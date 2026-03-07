import { useStore } from "../../store/useStore";
import "./sidebarComponent.css";
import { LayoutDashboard, FileBarChart, Files, Settings, Plus } from 'lucide-react';


function SidebarComponent() {


const recentFiles = useStore((state) => state.recentFiles);

  return (
         <aside className="sidebar">
        {/* Logo Section */}
        <div className="logo-container">
          <div className="logo-icon">AI</div>
          <h1 className="logo-text">Spreadsheet Analyst AI</h1>
        </div>
        <p className="logo-subtitle">
         Upload an Excel file (.xlsx) and receive intelligent analysis.
       </p>
        
        {/* Navigation Menu */}
        <nav className="menu">
          <button className="menu-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="menu-item">
            <FileBarChart size={20} />
            <span>Reports</span>
          </button>
          <button className="menu-item">
            <Files size={20} />
            <span>Files</span>
          </button>
          <button className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Action Button */}
        {/* <div className="sidebar-footer">
          <button className="new-analysis-btn">
            <Plus size={18} />
            <span>New Analysis</span>
          </button>
        </div> */}
        <div className="fileArea">
          <h4>Recent files</h4>

          {recentFiles.length === 0 && (
            <div className="empty">No recent files</div>
          )}

          {recentFiles.map((file, index) => (
            <div key={index} className="recent-file-item">
              {file}
            </div>
          ))}
        </div>

        
      </aside>
   
  );
}

export default SidebarComponent;




