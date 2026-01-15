"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type AuthFlow = "signIn" | "signUp";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<AuthFlow>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn("password", { email, password, flow });
    } catch (err) {
      setError(
        flow === "signIn"
          ? "Invalid email or password. Please try again."
          : "Could not create account. Email may already be in use."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Brand header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3rem",
              height: "3rem",
              background: "var(--color-accent)",
              color: "var(--color-surface)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            SS
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-ink)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Silver Sycamore
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-ink-muted)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginTop: "0.25rem",
            }}
          >
            Staff Hub
          </p>
        </div>

        {/* Auth card */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "2rem",
          }}
        >
          {/* Flow toggle */}
          <div
            style={{
              display: "flex",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setFlow("signIn");
                setError(null);
              }}
              style={{
                flex: 1,
                padding: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: flow === "signIn" ? 600 : 400,
                color: flow === "signIn" ? "var(--color-accent)" : "var(--color-ink-muted)",
                background: "transparent",
                border: "none",
                borderBottom: flow === "signIn" ? "2px solid var(--color-accent)" : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setFlow("signUp");
                setError(null);
              }}
              style={{
                flex: 1,
                padding: "0.75rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: flow === "signUp" ? 600 : 400,
                color: flow === "signUp" ? "var(--color-accent)" : "var(--color-ink-muted)",
                background: "transparent",
                border: "none",
                borderBottom: flow === "signUp" ? "2px solid var(--color-accent)" : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                background: "rgba(185, 74, 72, 0.1)",
                border: "1px solid rgba(185, 74, 72, 0.3)",
                color: "#B94A48",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                hint={flow === "signUp" ? "Minimum 8 characters" : undefined}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !email || !password}
              style={{ width: "100%" }}
            >
              {isLoading
                ? "Please wait..."
                : flow === "signIn"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-ink-muted)",
          }}
        >
          Internal access only. Contact your administrator if you need an account.
        </p>
      </div>
    </div>
  );
}
