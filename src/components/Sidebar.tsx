import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewClick: () => void;
}

const BatchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const SamplesIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const SlidesIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ScanIcon = () => (
  <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/>
    <rect x="7" y="7" width="10" height="10" rx="1"/>
  </svg>
);

const navItems = [
  { label: 'Batches', path: '/batches', icon: <BatchIcon /> },
  { label: 'Samples', path: '/samples', icon: <SamplesIcon /> },
  { label: 'Slides',  path: '/slides',  icon: <SlidesIcon /> },
];

const Sidebar = ({ collapsed, onToggle, onNewClick }: SidebarProps) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{`
        .sb-search::placeholder { color: rgba(255,255,255,0.4); }
        .sb-nav-link:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .sb-new-btn:hover { background: rgba(255,255,255,0.28) !important; }
        .sb-logout:hover { color: #fff !important; }
        .sb-toggle:hover { background: rgba(255,255,255,0.15) !important; }
      `}</style>

      <aside
        style={{
          width: collapsed ? 68 : 210,
          height: "100vh",
          background: "linear-gradient(180deg, #3730a3 0%, #4338ca 100%)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo + toggle arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: "0 14px",
            height: 64,
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={logo}
                alt="QuantumCyte"
                style={{
                  height: 28,
                  width: "auto",
                  maxWidth: 140,
                  objectFit: "contain",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const span = document.createElement("span");
                  span.textContent = "QuantumCyte";
                  span.style.cssText =
                    "color:#fff;font-weight:700;font-size:15px;white-space:nowrap;";
                  el.parentNode?.appendChild(span);
                }}
              />
            </div>
          )}

          {/* Arrow toggle — always visible in header row */}
          <button
            className="sb-toggle"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.75)",
              padding: 6,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: collapsed ? 0 : 4,
              transition: "background 0.15s",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              style={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.25s",
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div style={{ padding: "0 12px 14px" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.13)",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 11px",
              }}
            >
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="sb-search"
                placeholder="Search"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 13,
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
              <ScanIcon />
            </div>
          </div>
        )}

        {/* New button */}
        <div style={{ padding: collapsed ? "0 10px 16px" : "0 12px 16px" }}>
          <button
            className="sb-new-btn"
            onClick={onNewClick}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.18)",
              border: "none",
              borderRadius: 20,
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              padding: collapsed ? "9px 0" : "9px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
          >
            <PlusIcon />
            {!collapsed && "New"}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "0 8px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sb-nav-link"
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 10,
                marginBottom: 2,
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.15s, color 0.15s",
              })}
            >
              {item.icon}
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            padding: collapsed ? "14px 0" : "14px",
            flexShrink: 0,
          }}
        >
          {!collapsed ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {session?.role?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    MadScientist
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 11,
                      textTransform: "capitalize",
                    }}
                  >
                    {session?.role ?? "Lab Tech"}
                  </div>
                </div>
              </div>
              <button
                className="sb-logout"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  padding: "5px 2px",
                  borderRadius: 6,
                  fontFamily: "inherit",
                  transition: "color 0.15s",
                }}
              >
                <LogoutIcon />
                Log out
              </button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {session?.role?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <button
                className="sb-logout"
                onClick={handleLogout}
                title="Log out"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                  display: "flex",
                  transition: "color 0.15s",
                }}
              >
                <LogoutIcon />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;