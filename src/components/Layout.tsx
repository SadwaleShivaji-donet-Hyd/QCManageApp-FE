import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NewAccessionModal from "../components/NewAccessionModal";
const SIDEBAR_FULL = 210;
const SIDEBAR_COLLAPSED = 68;
const MOBILE_BP = 768;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BP);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAccessionOpen, setIsAccessionOpen] = useState(false);
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f8fc" }}>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar wrapper — fixed, slides on mobile */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          height: "100vh",
          transform:
            isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <Sidebar
          collapsed={isMobile ? false : collapsed}
          onToggle={() => {
            if (isMobile) setMobileOpen((o) => !o);
            else setCollapsed((c) => !c);
          }}
          onNewClick={() => setIsAccessionOpen(true)}
        />
      </div>

      {/* Mobile top bar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 98,
            height: 56,
            background: "linear-gradient(90deg, #3730a3, #4338ca)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            boxShadow: "0 2px 10px rgba(55,48,163,0.3)",
          }}
        >
          <button
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              padding: 6,
              borderRadius: 8,
            }}
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            QuantumCyte
          </span>
        </div>
      )}

      {/* Main scrollable content */}
      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: isMobile ? 56 : 0,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          minHeight: "100vh",
          overflowY: "auto",
          transition:
            "margin-left 0.25s cubic-bezier(.4,0,.2,1), width 0.25s cubic-bezier(.4,0,.2,1)",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>
      <NewAccessionModal
        open={isAccessionOpen}
        onOpenChange={setIsAccessionOpen}
      />
    </div>
  );
};

export default Layout;