import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import SignUp from "../components/SignUp";
import logo from "../../images/logo.png";

const leftPanelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  .login-wrapper { font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; overflow: hidden; }
  .panel-left { flex: 1; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .bg-image { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.72) contrast(1.12) saturate(1.18); transform: scale(1.02); }
  .green-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,45,26,0.82) 0%, rgba(15,45,26,0.18) 38%, rgba(15,45,26,0.10) 62%, rgba(15,45,26,0.75) 100%); }
  .left-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 44px 52px; }
  .logo-box { background: rgba(255,255,255,0.95); border-radius: 14px; padding: 14px 22px; display: inline-flex; align-items: center; box-shadow: 0 4px 28px rgba(0,0,0,0.22); width: fit-content; }
  .logo-box img { height: 58px; width: auto; display: block; }
  .hero-text { color: #fff; margin-top: 36px; }
  .hero-text h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; line-height: 1.18; margin-bottom: 16px; letter-spacing: -0.01em; text-shadow: 0 2px 16px rgba(0,0,0,0.45); }
  .hero-text h1 span { color: #f0d078; }
  .hero-text p { font-size: 0.93rem; line-height: 1.75; color: rgba(255,255,255,0.80); max-width: 360px; font-weight: 300; }
  .feature-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .feature-item { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 12px 16px; backdrop-filter: blur(8px); }
  .feature-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fi-gold { background: rgba(201,162,39,0.28); border: 1px solid rgba(201,162,39,0.4); }
  .fi-red  { background: rgba(176,58,46,0.28);  border: 1px solid rgba(176,58,46,0.4); }
  .fi-blue { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.28); }
  .feature-icon svg { width: 20px; height: 20px; }
  .feature-text { line-height: 1.35; }
  .feature-text strong { display: block; font-size: 0.85rem; color: #fff; font-weight: 600; }
  .feature-text span { font-size: 0.76rem; color: rgba(255,255,255,0.62); font-weight: 300; }
  .institution-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); border-radius: 100px; padding: 8px 16px 8px 10px; color: rgba(255,255,255,0.88); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.04em; backdrop-filter: blur(8px); }
  .inst-dot { width: 8px; height: 8px; border-radius: 50%; background: #4caf6e; box-shadow: 0 0 0 3px rgba(76,175,110,0.35); animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(76,175,110,0.35); } 50% { box-shadow: 0 0 0 7px rgba(76,175,110,0.10); } }
  @media (max-width: 900px) { .panel-left { display: none; } }
`;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, userState: { errorMessage }, signUpWithEmail } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [messageAlert, setMessageAlert] = useState("");

  async function crearUsuario(data) {
    try {
      await signUpWithEmail(data);
      setMessageAlert("Usuario creado exitosamente");
      setSeverity("success");
      setOpenAlert(true);
      setOpenSignUpModal(false);
    } catch (err) {
      setMessageAlert(err.message);
      setSeverity("error");
      setOpenAlert(true);
    }
  }

  const handleLogin = async () => {
    setError("");
    // Validar dominio antes de llamar al backend
    const correo = email.toLowerCase().trim();
    if (!correo.endsWith("@tdea.edu.co") && !correo.endsWith("@correo.tdea.edu.co")) {
      setError("Solo se permiten correos institucionales @tdea.edu.co o @correo.tdea.edu.co");
      return; // No llama al backend
    }
    setLoading(true);
    const isLogged = await login({ email, password });
    setLoading(false);
    if (!isLogged) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  const BG_URL = "https://www.tdea.edu.co/images/tdea/edificio-tdea.jpg";

  return (
    <>
      <style>{leftPanelStyles}</style>
      <div className="login-wrapper">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="panel-left">
          <div className="bg-image" style={{ backgroundImage: `url('${BG_URL}')` }} />
          <div className="green-overlay" />
          <div className="left-content">
            <div>
              <div className="logo-box">
                <img
                  // src="https://www.tdea.edu.co/images/tdea/logo-tdea.png"
                  src={logo}
                  alt="Tecnológico de Antioquia"
                  onError={e => { e.target.style.display='none'; }}
                />
              </div>
              <div className="hero-text">
                <h1>PRO<span>@</span>CTIVA:<br /><span>Un viaje hacia la excelencia.</span></h1>
                <p>Plataforma educativa de la Facultad de Ciencias Administrativas y Económicas.</p>
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon fi-gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f0d078" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M2 8v8c0 0 3.5 3 10 3s10-3 10-3V8"/><path d="M6 10.5v5"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <strong>Docencia e Investigación</strong>
                      <span>Gestión de materias, notas y proyectos académicos</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon fi-red">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f07068" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h2M14 14h2M8 17.5h2M14 17.5h2"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <strong>Gestión Académica</strong>
                      <span>Horarios, matrículas, certificados y seguimiento</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon fi-blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(180,210,255,0.9)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9"/><path d="M2 12h20"/><path d="M12 2a15.5 15.5 0 010 20M12 2a15.5 15.5 0 000 20"/>
                      </svg>
                    </div>
                    <div className="feature-text">
                      <strong>Acceso Multiplataforma</strong>
                      <span>Disponible en web, móvil y escritorio 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="institution-badge">
                <div className="inst-dot" />
                Acreditación de Alta Calidad · MEN 2020–2028
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 52px", position: "relative", boxShadow: "-12px 0 60px rgba(26,92,42,0.10)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1a5c2a, #c9a227, #b03a2e, #1a4a7a)" }} />

          <div style={{ marginBottom: 34 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2e7d43", marginBottom: 8 }}>Portal Proactiva</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0f2d1a", lineHeight: 1.2, margin: 0 }}>Inicia sesión</h2>
            <p style={{ marginTop: 8, fontSize: "0.88rem", color: "#7aa88a", fontWeight: 300 }}>Ingresa tus credenciales institucionales para continuar</p>
          </div>

          {/* Correo */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#3a5c45", marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase" }}>Correo institucional</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7aa88a", pointerEvents: "none" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input type="email" placeholder="usuario@tdea.edu.co" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown}
                style={{ width: "100%", padding: "13px 14px 13px 42px", border: "1.5px solid #d4e4da", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem", color: "#0f2d1a", background: "#f7faf8", outline: "none" }} />
            </div>
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#3a5c45", marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase" }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7aa88a", pointerEvents: "none" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                style={{ width: "100%", padding: "13px 42px 13px 42px", border: "1.5px solid #d4e4da", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem", color: "#0f2d1a", background: "#f7faf8", outline: "none" }} />
              <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7aa88a", padding: 4, display: "flex" }}>
                {showPass
                  ? <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" width={17} height={17}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  : <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" width={17} height={17}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Recordarme */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.83rem", color: "#3a5c45" }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2e7d43" }} />
              Recordarme
            </label>
            <a href="#" style={{ fontSize: "0.83rem", color: "#2e7d43", textDecoration: "none", fontWeight: 500 }}>¿Olvidaste tu contraseña?</a>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, fontSize: "0.85rem", color: "#b91c1c" }}>{error}</div>
          )}

          {/* Botón ingresar */}
          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: 14, background: loading ? "#7aa88a" : "linear-gradient(135deg, #1a5c2a 0%, #2e7d43 100%)", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.04em", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 18px rgba(26,92,42,0.30)" }}>
            {loading ? "Verificando..." : "Ingresar al sistema"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0", color: "#c8d8ce", fontSize: "0.75rem", letterSpacing: "0.06em" }}>
            <div style={{ flex: 1, height: 1, background: "#e2ece6" }} /> o también puedes <div style={{ flex: 1, height: 1, background: "#e2ece6" }} />
          </div>

          {/* Botón registro */}
          <button onClick={() => setOpenSignUpModal(true)}
            style={{ width: "100%", padding: 13, background: "transparent", border: "1.5px solid #d4e4da", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "#3a5c45", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" width={18} height={18}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Registrarse con cuenta institucional TdeA
          </button>

          {/* Footer sellos */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "#aac4b2" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["#1a5c2a","#c9a227","#b03a2e","#1a4a7a"].map(c => (
                  <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                ))}
              </div>
              Tecnológico de Antioquia I.U. &nbsp;·&nbsp; Medellín, Colombia
            </div>
          </div>
        </div>
      </div>

      <SignUp open={openSignUpModal} onClose={() => setOpenSignUpModal(false)} onCreate={crearUsuario} />

      <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setOpenAlert(false)} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {messageAlert}
        </Alert>
      </Snackbar>
    </>
  );
}