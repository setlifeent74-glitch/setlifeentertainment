"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";

export default function DemoForm({
  submitLabel,
  children,
}: {
  submitLabel: string;
  children: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sent">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sent") return; // no duplicate submission on double-click
    setState("sent");
    formRef.current?.reset();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState("idle"), 2500);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {children}
      <button type="submit" className="btn btn-primary" disabled={state === "sent"}>
        {state === "sent" ? "Sent ✓" : submitLabel}
      </button>
    </form>
  );
}
