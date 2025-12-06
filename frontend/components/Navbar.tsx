"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      style={{
        backgroundColor: "#343a40",
        padding: "10px 20px",
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          HOTEL PREMIER
        </a>

        {user.role === "ROLE_ADMIN" && (
          <a href="/admin" style={{ color: "white", textDecoration: "none" }}>
            Panel Admin
          </a>
        )}
        {user.role === "ROLE_CONSERJE" && (
          <a href="/conserje" style={{ color: "white", textDecoration: "none" }}>
            Panel Conserje
          </a>
        )}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>
          Usuario: <strong>{user.username}</strong> | Rol: <strong>{user.role}</strong>
        </span>
        <button
            onClick={handleLogout}
            className="nav-option nav-option-secondary"
            style={{
                backgroundColor: "transparent",
                border: "0.5px solid white", // 🔹 borde más fino
                borderRadius: "4px",
                padding: "5px 10px",
                color: "white",
                cursor: "pointer",
            }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}