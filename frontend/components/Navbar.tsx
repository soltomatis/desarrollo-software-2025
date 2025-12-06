"use client";

import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // si no hay sesión, no mostramos el navbar

  return (
    <header
      style={{
        backgroundColor: "#343a40",
        padding: "15px 40px",
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

        {/* 🔹 Navegación condicional por rol */}
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

      <div style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "15px" }}>
        Usuario: <strong>{user.username}</strong> | Rol: <strong>{user.role}</strong>
        <button
          onClick={logout}
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderRadius: "4px",
            padding: "5px 10px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}