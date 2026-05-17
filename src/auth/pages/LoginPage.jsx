import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import tdeaBg from "../../images/tdea.jpg";
import logoTdea from "../../images/logo.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .tdea-root {
    --green-dark:  #1a5c2a;
    --green-mid:   #2e7d43;
    --green-light: #4caf6e;
    --green-pale:  #e8f5ec;
    --gold:        #c9a227;
    --gold-light:  #f0d078;
    --red-accent:  #b03a2e;
    --blue-accent: #1a4a7a;
    --white:       #ffffff;
    --off-white:   #f7faf8;
    --text-dark:   #0f2d1a;
    --text-mid:    #3a5c45;
    --text-light:  #7aa88a;
    width: 100vw;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    overflow: hidden;
  }

  /* LEFT PANEL */
  .tdea-panel-left {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .tdea-bg-image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.72) contrast(1.12) saturate(1.18);
    transform: scale(1.02);
  }
  .tdea-green-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(15,45,26,0.82) 0%,
      rgba(15,45,26,0.18) 38%,
      rgba(15,45,26,0.10) 62%,
      rgba(15,45,26,0.75) 100%
    );
  }
  .tdea-left-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 44px 52px;
  }

  /* Logo */
  .tdea-logo-box {
    background: rgba(255,255,255,0.95);
    border-radius: 14px;
    padding: 14px 22px;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 4px 28px rgba(0,0,0,0.22);
    width: fit-content;
  }
  .tdea-logo-box img { height: 58px; width: auto; display: block; }

  /* Hero */
  .tdea-hero-text { color: #fff; margin-top: 36px; }
  .tdea-hero-text h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem; font-weight: 700;
    line-height: 1.18; margin-bottom: 16px;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 16px rgba(0,0,0,0.45);
  }
  .tdea-hero-text h1 span { color: var(--gold-light); }
  .tdea-hero-text p {
    font-size: 0.93rem; line-height: 1.75;
    color: rgba(255,255,255,0.80); max-width: 360px; font-weight: 300;
    text-align: initial;
  }

  /* Feature cards */
  .tdea-feature-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .tdea-feature-item {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
    padding: 12px 16px;
    backdrop-filter: blur(8px);
    transition: background 0.2s;
  }
  .tdea-feature-item:hover { background: rgba(255,255,255,0.16); }
  .tdea-feature-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .tdea-fi-gold { background: rgba(201,162,39,0.28); border: 1px solid rgba(201,162,39,0.4); }
  .tdea-feature-icon svg { width: 20px; height: 20px; }
  .tdea-feature-text { line-height: 1.35; }
  .tdea-feature-text strong { display: block; font-size: 0.85rem; color: #fff; font-weight: 600; text-align: initial }
  .tdea-feature-text span { font-size: 0.76rem; color: rgba(255,255,255,0.62); font-weight: 300; }

  /* Footer badge */
  .tdea-institution-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22);
    border-radius: 100px; padding: 8px 16px 8px 10px;
    color: rgba(255,255,255,0.88); font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.04em; backdrop-filter: blur(8px);
  }
  .tdea-inst-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green-light);
    box-shadow: 0 0 0 3px rgba(76,175,110,0.35);
    animation: tdeaPulse 2.4s ease-in-out infinite;
  }
  @keyframes tdeaPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(76,175,110,0.35); }
    50%      { box-shadow: 0 0 0 7px rgba(76,175,110,0.10); }
  }

  /* RIGHT PANEL */
  .tdea-panel-right {
    width: 480px; background: var(--white);
    display: flex; flex-direction: column; justify-content: center;
    padding: 56px 52px; position: relative;
    box-shadow: -12px 0 60px rgba(26,92,42,0.10);
  }
  .tdea-panel-right::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--green-dark), var(--gold), var(--red-accent), var(--blue-accent));
  }

  /* Form header */
  .tdea-form-header { margin-bottom: 34px; }
  .tdea-form-header .tdea-welcome {
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--green-mid); margin-bottom: 8px;
  }
  .tdea-form-header h2 {
    font-family: 'Playfair Display', serif; font-size: 2rem;
    font-weight: 700; color: var(--text-dark); line-height: 1.2;
    margin: 0;
  }
  .tdea-form-header p { margin-top: 8px; font-size: 0.88rem; color: var(--text-light); font-weight: 300; }

  /* Form groups */
  .tdea-form-group { margin-bottom: 20px; }
  .tdea-label {
    display: block; font-size: 0.8rem; font-weight: 600;
    color: var(--text-mid); margin-bottom: 8px;
    letter-spacing: 0.03em; text-transform: uppercase;
  }
  .tdea-input-wrap { position: relative; }
  .tdea-input-ico {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px; color: var(--text-light);
    pointer-events: none; transition: color 0.2s;
    display: flex; align-items: center;
  }
  .tdea-input {
    width: 100%; padding: 13px 14px 13px 42px;
    border: 1.5px solid #d4e4da; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.93rem;
    color: var(--text-dark); background: var(--off-white);
    transition: border-color 0.25s, box-shadow 0.25s, background 0.2s;
    outline: none; box-sizing: border-box;
  }
  .tdea-input:focus {
    border-color: var(--green-mid); background: #fff;
    box-shadow: 0 0 0 3px rgba(46,125,67,0.12);
  }
  .tdea-input-suffix {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    cursor: pointer; color: var(--text-light); background: none; border: none;
    padding: 4px; display: flex; transition: color 0.2s;
  }
  .tdea-input-suffix:hover { color: var(--green-mid); }

  /* Footer row */
  .tdea-form-footer-row {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px;
  }
  .tdea-checkbox-wrap { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .tdea-checkbox-wrap input[type="checkbox"] {
    width: 16px; height: 16px; accent-color: var(--green-mid); cursor: pointer; padding: 0;
  }
  .tdea-checkbox-wrap span { font-size: 0.83rem; color: var(--text-mid); }
  .tdea-forgot-link {
    font-size: 0.83rem; color: var(--green-mid); text-decoration: none;
    font-weight: 500; transition: color 0.2s; background: none; border: none; cursor: pointer;
  }
  .tdea-forgot-link:hover { color: var(--green-dark); }

  /* Buttons */
  .tdea-btn-login {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%);
    color: var(--white); border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    letter-spacing: 0.04em; cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 18px rgba(26,92,42,0.30); position: relative; overflow: hidden;
  }
  .tdea-btn-login:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,92,42,0.38); }
  .tdea-btn-login:active { transform: translateY(0); }

  .tdea-divider {
    display: flex; align-items: center; gap: 14px; margin: 22px 0;
    color: #c8d8ce; font-size: 0.75rem; letter-spacing: 0.06em;
  }
  .tdea-divider::before, .tdea-divider::after { content: ''; flex: 1; height: 1px; background: #e2ece6; }

  .tdea-btn-secondary {
    width: 100%; padding: 13px; background: transparent;
    border: 1.5px solid #d4e4da; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
    color: var(--text-mid); cursor: pointer; transition: border-color 0.2s, background 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .tdea-btn-secondary:hover {
    border-color: var(--green-mid); background: var(--green-pale); color: var(--green-dark);
  }

  /* Footer seal */
  .tdea-form-footer { margin-top: 28px; display: flex; justify-content: center; }
  .tdea-seal {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.72rem; color: #aac4b2; letter-spacing: 0.04em;
  }
  .tdea-seals { display: flex; gap: 4px; }
  .tdea-seal-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* Error message */
  .tdea-error {
    background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;
    padding: 10px 14px; margin-bottom: 16px;
    font-size: 0.83rem; color: #b91c1c;
  }

  @media (max-width: 900px) {
    .tdea-panel-left { display: none; }
    .tdea-panel-right { width: 100%; }
  }

html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
}

`;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, userState: { errorMessage }, signUpWithEmail } = useContext(UserContext);

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [remember, setRemember]     = useState(false);
  const [localError, setLocalError] = useState("");
  const [openSignUp, setOpenSignUp] = useState(false);
  const [snackOpen, setSnackOpen]   = useState(false);
  const [snackMsg, setSnackMsg]     = useState("");
  const [snackSev, setSnackSev]     = useState("success");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) { setLocalError("Por favor completa todos los campos."); return; }
    const ok = await login({ email, password });
    if (!ok) {
      setLocalError("Credenciales incorrectas: " + (errorMessage || "Intenta de nuevo."));
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSignUp = async (data) => {
    try {
      await signUpWithEmail(data);
      setSnackMsg("Cuenta creada exitosamente");
      setSnackSev("success");
      setSnackOpen(true);
      setOpenSignUp(false);
    } catch (err) {
      setSnackMsg(err.message);
      setSnackSev("error");
      setSnackOpen(true);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="tdea-root">

        {/* ── LEFT PANEL ── */}
        <div className="tdea-panel-left">
          <div
            className="tdea-bg-image"
            style={{ backgroundImage: `url(${tdeaBg})` }}
          />
          <div className="tdea-green-overlay" />
          <div className="tdea-left-content">
            <div>
              <div className="tdea-logo-box">
                {/* <img src={`data:image/png;base64,${LOGO_SRC}`} alt="Tecnológico de Antioquia" /> */}
                <img src={`${logoTdea}`} alt="Tecnológico de Antioquia" />
              </div>

              <div className="tdea-hero-text">
                <h1>Transformar el presente,<br /><span>inspirar el futuro.</span></h1>
                <p>Plataforma académica institucional para la comunidad educativa del Tecnológico de Antioquia.</p>

                <div className="tdea-feature-list">
                  <div className="tdea-feature-item">
                    <div className="tdea-feature-icon tdea-fi-gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f0d078" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3L2 8l10 5 10-5-10-5z"/>
                        <path d="M2 8v8c0 0 3.5 3 10 3s10-3 10-3V8"/>
                        <path d="M6 10.5v5"/>
                      </svg>
                    </div>
                    <div className="tdea-feature-text">
                      <strong>Docencia e Investigación</strong>
                      <span>Gestión de materias, notas y proyectos académicos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="tdea-institution-badge">
                <div className="tdea-inst-dot" />
                Acreditación de Alta Calidad · MEN 2020–2028
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="tdea-panel-right">
          <div className="tdea-form-header">
            <div className="tdea-welcome">Portal Proactiva</div>
            <h2>Inicia sesión</h2>
            <p>Ingresa tus credenciales institucionales para continuar</p>
          </div>

          {localError && <div className="tdea-error">{localError}</div>}

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="tdea-form-group">
              <label className="tdea-label" htmlFor="tdea-correo">Correo institucional</label>
              <div className="tdea-input-wrap">
                <span className="tdea-input-ico">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <input
                  id="tdea-correo" type="email" className="tdea-input"
                  placeholder="usuario@tdea.edu.co" autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="tdea-form-group">
              <label className="tdea-label" htmlFor="tdea-pass">Contraseña</label>
              <div className="tdea-input-wrap">
                <span className="tdea-input-ico">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  id="tdea-pass" type={showPass ? "text" : "password"} className="tdea-input"
                  placeholder="••••••••" autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: "42px" }}
                />
                <button type="button" className="tdea-input-suffix"
                  onClick={() => setShowPass(v => !v)} aria-label="Mostrar contraseña">
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth="1.8" width="17" height="17">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="tdea-form-footer-row">
              <label className="tdea-checkbox-wrap">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Recordarme</span>
              </label>
              <a href="/" className="tdea-forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="tdea-btn-login">Ingresar al sistema</button>
          </form>

          <div className="tdea-divider">o también puedes</div>

          <button type="button" className="tdea-btn-secondary" onClick={() => setOpenSignUp(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="1.8" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Registrarse con cuenta institucional TdeA
          </button>

          <div className="tdea-form-footer">
            <div className="tdea-seal">
              <div className="tdea-seals">
                <div className="tdea-seal-dot" style={{ background: "#1a5c2a" }} />
                <div className="tdea-seal-dot" style={{ background: "#c9a227" }} />
                <div className="tdea-seal-dot" style={{ background: "#b03a2e" }} />
                <div className="tdea-seal-dot" style={{ background: "#1a4a7a" }} />
              </div>
              Tecnológico de Antioquia I.U. &nbsp;·&nbsp; Medellín, Colombia
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      <SignUp open={openSignUp} onClose={() => setOpenSignUp(false)} onCreate={handleSignUp} />

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackSev} variant="filled" sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </>
  );
}