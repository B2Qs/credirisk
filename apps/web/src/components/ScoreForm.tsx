import { useState, FormEvent } from "react";
import type { ScoreResponse, Role } from "@credirisk/shared";
import { api } from "../services/api";

interface Props {
  role: Role;
  ownRut?: string;
}

export function ScoreForm({ role, ownRut }: Props) {
  const [rut, setRut] = useState(role === "user" ? (ownRut ?? "") : "");
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleRutChange(value: string) {
    setRut(value);
    setResult(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const { data } = await api.get<ScoreResponse>(
        `/score/${encodeURIComponent(rut)}`,
      );
      setResult(data);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) setError("Sesión expirada, vuelve a iniciar sesión");
      else if (status === 403)
        setError("No autorizado para consultar este RUT");
      else if (status === 400) setError("RUT inválido");
      else if (status === 404) setError("RUT no encontrado");
      else setError("Error al consultar el score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Consultar score financiero</h2>
      {role === "admin" && (
        <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          Como administrador, puedes consultar el score de cualquier RUT.
        </p>
      )}
      <input
        placeholder="RUT (ej: 12.345.678-9)"
        value={rut}
        onChange={(e) => handleRutChange(e.target.value)}
        disabled={role === "user"}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Consultando..." : "Consultar"}
      </button>

      {error && <div className="error-banner">{error}</div>}
      {result && (
        <div className="result-card">
          <p>RUT: {result.rut}</p>
          <p>Score: {result.score}</p>
          <p>Fecha: {result.fecha}</p>
        </div>
      )}
    </form>
  );
}
