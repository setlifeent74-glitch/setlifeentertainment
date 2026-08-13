"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";

export default function ContactForm() {
  const [state, action, isPending] = useActionState<ContactState, FormData>(submitContact, null);

  if (state?.ok) {
    return (
      <p className="form-success" role="status">
        Message sent — we typically reply within 3–5 business days.
      </p>
    );
  }

  return (
    <form action={action}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cname">Name</label>
          <input type="text" id="cname" name="cname" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="cemail">Email</label>
          <input type="email" id="cemail" name="cemail" required autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <select id="subject" name="subject" defaultValue="General Inquiry">
          <option>General Inquiry</option>
          <option>Press / Media</option>
          <option>Advertising</option>
          <option>Feature Follow-up</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required rows={5} />
      </div>
      {state?.error && (
        <p role="alert" className="form-error" aria-live="polite">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
