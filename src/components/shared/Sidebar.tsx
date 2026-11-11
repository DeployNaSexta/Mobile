import { NavLink } from "react-router-dom";
import Icon from "../icons/Icon";
import { NAV_ITEMS, SETTINGS_ITEM } from "./navConfig";

export default function Sidebar({ open, onClose, variant = "drawer" }) {
  const items = [...NAV_ITEMS, SETTINGS_ITEM];

  return (
    <>
      {variant === "drawer" && <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />}
      <aside className={variant === "drawer" ? `sidebar ${open ? "open" : ""}` : "sidebar sidebar--static"}>
        <div className="sb-head">
          <div><span className="logo-text" style={{ color: "var(--primary)", fontWeight: 900 }}>SENSUS</span><div className="ver">v2.4.1</div></div>
          {variant === "drawer" && (
            <button className="icon-btn" onClick={onClose} aria-label="Fechar menu"><Icon name="close" /></button>
          )}
        </div>
        <div className="sb-profile">
          <div className="avatar" style={{ width: 38, height: 38, fontSize: 15 }}>C</div>
          <div><div className="nm">Carlos Ferreira</div><div className="fz">Fazenda São Bento</div></div>
        </div>
        <nav className="sb-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `sb-link ${isActive ? "active" : ""}`}
              onClick={variant === "drawer" ? onClose : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="l1">Última sincronização</div>
          <div className="l2">Hoje às 09:38</div>
          <div className="l3"><span className="dot" />4 sensores conectados</div>
        </div>
      </aside>
    </>
  );
}
