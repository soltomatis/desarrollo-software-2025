"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const router = useRouter();

  const { user, login, loading } = useAuth({ skipInitialCheck: true });

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingForm(true);

    try {
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px", maxWidth: "500px", margin: "80px auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center" }}>
        Iniciar Sesión
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="nav-option"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="nav-option"
        />
        <button
          type="submit"
          disabled={loadingForm}
          className="nav-option nav-option-secondary"
        >
          {loadingForm ? "Ingresando..." : "Entrar"}
        </button>
      </form>
      {error && (
        <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}