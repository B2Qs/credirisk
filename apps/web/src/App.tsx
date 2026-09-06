import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { ScoreForm } from "./components/ScoreForm";
import { setAuthToken } from "./services/api";
import { decodeToken } from "./services/auth";
import type { Role } from "@credirisk/shared";

interface Session {
  role: Role;
  rut?: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  function handleLoginSuccess(token: string) {
    setAuthToken(token);
    const payload = decodeToken(token);
    setSession({ role: payload.role, rut: payload.rut });
  }

  function handleLogout() {
    setAuthToken(null);
    setSession(null);
  }

  return (
    <div className="app-container">
      <h1>CrediRisk</h1>
      {!session ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <>
          <p>
            Sesión: {session.rut ?? session.role} ({session.role}){" "}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </p>
          <ScoreForm role={session.role} ownRut={session.rut} />
        </>
      )}
    </div>
  );
}

export default App;
