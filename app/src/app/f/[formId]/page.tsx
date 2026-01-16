"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FormRenderer } from "../../../components/FormRenderer";
import Button from "../../../components/ui/Button";

type SubmissionState = "idle" | "submitting" | "success" | "error";

// Simple SVG icons to avoid adding dependencies
function CheckCircleIcon({ size = 64, color = "#16a34a" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function AlertCircleIcon({ size = 48, color = "var(--color-ink-muted)" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  // Query form by string formId (public query)
  const form = useQuery(api.forms.getByFormId, { formId });

  // Mutation for submitting response
  const submitResponse = useMutation(api.forms.submitResponse);

  // Submission state
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!form) return;

    setSubmissionState("submitting");
    setErrorMessage(null);

    try {
      await submitResponse({
        formSchemaId: form._id,
        data: JSON.stringify(data),
      });
      setSubmissionState("success");
    } catch (err) {
      setSubmissionState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  // Reset form to allow another submission
  const handleSubmitAnother = () => {
    setSubmissionState("idle");
    setErrorMessage(null);
  };

  // Loading state
  if (form === undefined) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--color-ink-muted)",
              }}
            >
              Loading form...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form not found or not published
  if (form === null) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <AlertCircleIcon size={48} color="var(--color-ink-muted)" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.75rem",
              }}
            >
              Form Not Found
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--color-ink-light)",
                maxWidth: "400px",
              }}
            >
              This form may have been removed or is no longer accepting submissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submissionState === "success") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <CheckCircleIcon size={64} color="#16a34a" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.75rem",
              }}
            >
              Thank you for your submission!
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--color-ink-light)",
                maxWidth: "400px",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              We&apos;ve received your response and will be in touch soon.
            </p>
            <Button variant="secondary" onClick={handleSubmitAnother}>
              Submit Another Response
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (submissionState === "error") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <AlertCircleIcon size={64} color="#dc2626" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "0.75rem",
              }}
            >
              Submission Failed
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--color-ink-light)",
                maxWidth: "400px",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            <Button onClick={handleSubmitAnother}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Form display (idle or submitting state)
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <FormRenderer
          formSchema={{
            _id: form._id,
            formId: form.formId,
            title: form.title,
            description: form.description,
            fields: form.fields,
          }}
          onSubmit={handleSubmit}
          isSubmitting={submissionState === "submitting"}
        />
      </div>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--color-surface-dim)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "2rem 1rem",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "640px",
  background: "var(--color-surface)",
  padding: "2.5rem",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
};
