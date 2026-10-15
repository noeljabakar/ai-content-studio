
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAuth() {
    setLoading(true);
    setMessage("");

    try {
      const result =
        mode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({
              email,
              password,
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (mode === "signup" && result.data.user && !result.data.session) {
        setMessage(
          "Account created. Check your email if verification is required."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="midnight-page">
      <div className="space-scene" aria-hidden="true">
        <div className="space-stars" />
        <div className="planet planet-one" />
        <div className="planet planet-two" />
        <div className="planet planet-three" />
        <div className="planet planet-four" />
        <div className="horizon-glow" />
        <div className="water-reflection" />
        <div className="light-trail light-trail-one" />
        <div className="light-trail light-trail-two" />
      </div>

      <div className="midnight-layout">
        <section className="intro-panel">
          

          <div className="intro-content">
            <p className="eyebrow">AI CONTENT STUDIO</p>

            <h1>
              Create something
              <br />
              <span>remarkable</span>
            </h1>

            <p className="intro-description">
              Turn your ideas into powerful content
              <br className="desktop-break" /> with the help of AI.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✧</span>
                <span>Generate content</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">▰</span>
                <span>Save your work</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">ϟ</span>
                <span>Bring ideas to life</span>
              </div>
            </div>
          </div>

          <p className="intro-footer">
            YOUR IDEAS. POWERED BY AI.
          </p>
        </section>

        <section className="auth-panel">
          <div className="glass-card">
            <div className="card-heading">
              <div className="brand-mark" aria-hidden="true">
                <span>✧</span>
              </div>

              <h2>AI Content Studio</h2>
              <p>
                {mode === "login"
                  ? "Create something remarkable"
                  : "Your next big idea starts here"}
              </p>
            </div>

            <div
              className="auth-toggle"
              role="group"
              aria-label="Choose authentication option"
            >
              <button
                type="button"
                className={`toggle-option ${
                  mode === "login" ? "active" : ""
                }`}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                disabled={loading}
              >
                Sign in
              </button>

              <button
                type="button"
                className={`toggle-option ${
                  mode === "signup" ? "active" : ""
                }`}
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                disabled={loading}
              >
                Create account
              </button>
            </div>

            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                void handleAuth();
              }}
            >
              <div className="field-group">
                <label htmlFor="email">Email address</label>

                <div className="input-shell">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                    />
                    <path d="m4 7 8 6 8-6" />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="password">Password</label>

                <div className="input-shell">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login"
                        ? "current-password"
                        : "new-password"
                    }
                    minLength={6}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3" />
                        <path d="M6.2 6.2C4.2 7.5 3 9.5 2.5 12c1 2.5 4.5 7 9.5 7 1.2 0 2.3-.3 3.3-.8" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <p className="auth-message" role="status">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                <span>
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Sign in"
                      : "Create account"}
                </span>
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="card-divider">
              <span />
              <span>or</span>
              <span />
            </div>

            <p className="card-footnote">
              {mode === "login"
                ? "Your creative space is waiting."
                : "Start creating something remarkable."}
            </p>

            <div className="secure-note">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure access to your creative workspace
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .midnight-page {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          min-height: 100svh;
          overflow: hidden;
          background: #030713;
          color: #f8fbff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .space-scene {
          position: absolute;
          z-index: -1;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 20% 75%, #102d6a 0%, transparent 32%),
            radial-gradient(ellipse at 79% 17%, #101d55 0%, transparent 31%),
            linear-gradient(120deg, #030713, #07142c 54%, #030713);
        }

        .space-stars {
          position: absolute;
          inset: 0;
          opacity: 0.65;
          background-image:
            radial-gradient(circle, #fff 0.7px, transparent 1px),
            radial-gradient(circle, #8dbbff 0.8px, transparent 1.3px),
            radial-gradient(circle, #7c91ff 0.7px, transparent 1.2px);
          background-size: 83px 91px, 127px 113px, 173px 151px;
          background-position: 5px 9px, 37px 21px, 61px 72px;
          animation: star-drift 35s linear infinite;
        }

        .planet {
          position: absolute;
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 26%, #b8eaff 0%, #5ba9ff 5%, #1b55b8 24%, #121b56 53%, #050a21 76%);
          box-shadow:
            inset -14px -18px 35px #020512,
            inset 5px 5px 18px #90d8ff,
            0 0 22px #297aff88,
            0 0 65px #315dff44;
          animation: planet-float 8s ease-in-out infinite;
        }

        .planet-one {
          width: clamp(130px, 18vw, 260px);
          aspect-ratio: 1;
          right: -3%;
          top: 4%;
        }

        .planet-two {
          width: clamp(100px, 14vw, 200px);
          aspect-ratio: 1;
          left: 10%;
          bottom: 9%;
          animation-delay: -3s;
        }

        .planet-three {
          width: clamp(52px, 7vw, 92px);
          aspect-ratio: 1;
          right: 4%;
          bottom: 11%;
          animation-delay: -5s;
        }

        .planet-four {
          width: 15px;
          aspect-ratio: 1;
          right: 7%;
          top: 56%;
          box-shadow: 0 0 18px #4198ff;
        }

        .horizon-glow {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: 5%;
          height: 21%;
          background:
            radial-gradient(ellipse at 50% 100%, #137cff66, transparent 60%),
            linear-gradient(transparent, #1053a622, transparent);
          filter: blur(13px);
        }

        .water-reflection {
          position: absolute;
          bottom: -3%;
          left: -15%;
          width: 130%;
          height: 23%;
          opacity: 0.65;
          transform: perspective(280px) rotateX(47deg);
          transform-origin: bottom;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0 9px,
            #328cff35 10px 11px,
            transparent 12px 22px
          );
          mask-image: linear-gradient(to bottom, transparent, #000 35%, transparent);
        }

        .light-trail {
          position: absolute;
          width: 70%;
          height: 1px;
          left: -12%;
          bottom: 17%;
          background: linear-gradient(90deg, transparent, #248aff, #72dfff, transparent);
          box-shadow: 0 0 16px #328bff;
          transform: rotate(-5deg);
          animation: trail-glow 5s ease-in-out infinite;
        }

        .light-trail-two {
          left: 38%;
          bottom: 11%;
          width: 75%;
          animation-delay: -2.5s;
          transform: rotate(4deg);
        }

        .midnight-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.92fr);
          align-items: center;
          gap: clamp(32px, 7vw, 112px);
          width: min(1240px, 100%);
          min-height: 100vh;
          min-height: 100svh;
          margin: 0 auto;
          padding: 40px clamp(24px, 5vw, 76px);
        }

        .intro-panel {
          display: flex;
          min-height: 580px;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px 0;
        }

        .design-label {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .design-number {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -2px;
        }

        .design-name {
          border-left: 1px solid #7bbaff88;
          padding-left: 12px;
          color: #d6e5ff;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          line-height: 1.6;
        }

        .intro-content {
          margin: 40px 0;
        }

        .eyebrow {
          margin-bottom: 14px;
          color: #c6ddff;
          font-size: 10px;
          letter-spacing: 3px;
        }

        .intro-content h1 {
          margin: 0;
          font-size: clamp(36px, 4.2vw, 58px);
          font-weight: 750;
          letter-spacing: -2.5px;
          line-height: 1.05;
        }

        .intro-content h1 span {
          color: #8bc6ff;
          background: linear-gradient(100deg, #d6f0ff, #64a9ff 60%, #a7a3ff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .intro-description {
          margin-top: 20px;
          color: #bdcbe0;
          font-size: 14px;
          line-height: 1.8;
        }

        .feature-list {
          display: grid;
          gap: 18px;
          margin-top: 34px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 13px;
          color: #e6eeff;
          font-size: 13px;
        }

        .feature-icon {
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          color: #7ec9ff;
          font-size: 23px;
          text-shadow: 0 0 15px #348bff;
        }

        .intro-footer {
          color: #8299bf;
          font-size: 9px;
          letter-spacing: 3px;
        }

        .auth-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .glass-card {
          position: relative;
          width: 100%;
          max-width: 430px;
          overflow: hidden;
          padding: 30px 28px 24px;
          border: 1px solid #91caff70;
          border-radius: 23px;
          background:
            radial-gradient(ellipse at 50% 0%, #1d6ac72c, transparent 50%),
            linear-gradient(140deg, #172741df, #091328ed 65%, #141638e8);
          box-shadow:
            0 0 0 1px #ffffff08,
            0 0 28px #2f88ff3b,
            0 22px 75px #000b1caa,
            inset 0 1px 1px #ffffff36,
            inset 0 -1px 1px #89aaff22;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: card-appear 900ms cubic-bezier(.2, .8, .2, 1) both;
        }

        .glass-card::before {
          position: absolute;
          top: 0;
          left: 12%;
          width: 76%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d2f0ff, transparent);
          content: "";
          box-shadow: 0 0 15px #56b7ff;
        }

        .card-heading {
          text-align: center;
        }

        .brand-mark {
          display: none;
          width: 38px;
          height: 38px;
          margin: 0 auto 12px;
          place-items: center;
          border: 1px solid #7ecaff66;
          border-radius: 12px;
          background: #4d9eff17;
          color: #a4ddff;
          font-size: 23px;
          box-shadow: 0 0 24px #2685ff20;
        }

        .card-heading h2 {
          margin: 0;
          font-size: clamp(23px, 2.2vw, 29px);
          font-weight: 700;
          letter-spacing: -0.8px;
        }

        .card-heading p {
          margin-top: 8px;
          color: #b7c9e4;
          font-size: 13px;
        }

        .auth-toggle {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          margin-top: 25px;
          padding: 3px;
          border: 1px solid #649bff61;
          border-radius: 999px;
          background: #030a1a91;
          box-shadow: inset 0 1px 8px #0008;
        }

        .toggle-option {
          min-height: 38px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #c4d2ea;
          font-size: 12px;
          cursor: pointer;
          transition:
            color 250ms ease,
            background 300ms ease,
            box-shadow 300ms ease,
            transform 200ms ease;
        }

        .toggle-option:hover:not(:disabled) {
          color: white;
        }

        .toggle-option.active {
          background: linear-gradient(110deg, #18c8ff, #1761ff 70%, #524dff);
          color: white;
          box-shadow:
            0 0 18px #197cff85,
            inset 0 1px 1px #ffffff6b;
        }

        .toggle-option:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .auth-form {
          display: grid;
          gap: 19px;
          margin-top: 24px;
        }

        .field-group label {
          display: block;
          margin-bottom: 9px;
          color: #edf4ff;
          font-size: 12px;
          font-weight: 600;
        }

        .input-shell {
          display: flex;
          min-height: 43px;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border: 1px solid #7894ba45;
          border-radius: 10px;
          background: linear-gradient(115deg, #15233bde, #0c1930e8);
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
        }

        .input-shell:focus-within {
          border-color: #53aaff;
          background: #12233beF;
          box-shadow:
            0 0 0 3px #348cff1c,
            0 0 20px #277dff16;
        }

        .input-shell > svg {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          stroke: #9cb9e3;
          stroke-width: 1.7;
        }

        .input-shell input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font: inherit;
          font-size: 12px;
        }

        .input-shell input::placeholder {
          color: #91a4c2;
        }

        .password-toggle {
          display: grid;
          flex-shrink: 0;
          width: 26px;
          height: 30px;
          place-items: center;
          border: 0;
          background: transparent;
          color: #a9c5e9;
          cursor: pointer;
        }

        .password-toggle svg {
          width: 17px;
          height: 17px;
          stroke: currentColor;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .password-toggle:hover {
          color: white;
        }

        .submit-button {
          display: flex;
          min-height: 45px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 1px;
          border: 1px solid #a8ddff55;
          border-radius: 11px;
          background: linear-gradient(105deg, #14bfff, #1463ff 57%, #393dff);
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 0 24px #167cff63,
            inset 0 1px 1px #ffffff80;
          transition:
            transform 200ms ease,
            box-shadow 250ms ease,
            filter 250ms ease;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.12);
          box-shadow:
            0 0 35px #218bff9c,
            inset 0 1px 1px #ffffffa3;
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .submit-button span:last-child {
          font-size: 17px;
        }

        .auth-message {
          padding: 10px 12px;
          border: 1px solid #fbbf2433;
          border-radius: 9px;
          background: #f59e0b0d;
          color: #fcd889;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .card-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 19px 0 15px;
          color: #94a7c5;
          font-size: 11px;
        }

        .card-divider span:first-child,
        .card-divider span:last-child {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #819bc555);
        }

        .card-divider span:last-child {
          background: linear-gradient(90deg, #819bc555, transparent);
        }

        .card-footnote {
          color: #c0cee5;
          font-size: 11px;
          text-align: center;
        }

        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 21px;
          color: #8298b9;
          font-size: 9px;
          text-align: center;
        }

        .secure-note svg {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
          stroke: #83b9ec;
          stroke-width: 1.7;
        }

        @keyframes planet-float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -12px, 0);
          }
        }

        @keyframes star-drift {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-90px);
          }
        }

        @keyframes trail-glow {
          0%, 100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes card-appear {
          from {
            opacity: 0;
            transform: translateY(14px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (min-width: 1500px) {
          .midnight-layout {
            width: min(1380px, 100%);
          }
        }

        @media (max-width: 760px) {
          .midnight-layout {
            grid-template-columns: 1fr;
            gap: 26px;
            padding: 25px 20px 32px;
          }

          .intro-panel {
            min-height: 0;
            gap: 25px;
          }

          .intro-content {
            margin: 14px 0 0;
          }

          .intro-content h1 {
            font-size: clamp(35px, 8vw, 49px);
          }

          .intro-description {
            margin-top: 12px;
            font-size: 13px;
          }

          .feature-list {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 18px;
          }

          .feature-item {
            font-size: 12px;
          }

          .intro-footer {
            display: none;
          }

          .auth-panel {
            width: 100%;
          }

          .glass-card {
            max-width: 470px;
            padding: 25px 22px 22px;
          }

          .planet-one {
            right: -18%;
            top: 14%;
          }

          .planet-two {
            left: -16%;
            bottom: 8%;
          }

          .desktop-break {
            display: none;
          }
        }

        @media (max-width: 390px) {
          .midnight-layout {
            padding-right: 14px;
            padding-left: 14px;
          }

          .glass-card {
            padding-right: 17px;
            padding-left: 17px;
          }

          .design-number {
            font-size: 30px;
          }

          .card-heading h2 {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .space-stars,
          .planet,
          .light-trail,
          .glass-card {
            animation: none !important;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
