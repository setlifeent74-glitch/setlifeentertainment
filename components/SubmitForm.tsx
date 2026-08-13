"use client";

import { useActionState } from "react";
import { submitStory, type SubmitState } from "@/app/actions/submissions";

export default function SubmitForm() {
  const [state, formAction, isPending] = useActionState<SubmitState, FormData>(submitStory, null);

  if (state?.ok) {
    return (
      <p className="form-success" role="status">
        Thanks — we&apos;ve got it. Our team reads every submission and reaches out within 2–3 weeks if it&apos;s a fit.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="fname">Full Name</label>
          <input type="text" id="fname" name="fname" required />
        </div>
        <div className="field">
          <label htmlFor="role">Primary Role</label>
          <select id="role" name="role" required defaultValue="">
            <option value="">Select one</option>
            <option>Actor</option>
            <option>Director</option>
            <option>Producer</option>
            <option>Writer</option>
            <option>Cinematographer</option>
            <option>Other Crew</option>
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="field">
          <label htmlFor="ig">Instagram Handle</label>
          <input type="text" id="ig" name="ig" placeholder="@yourhandle" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="project">Project Title</label>
        <input type="text" id="project" name="project" placeholder="Film, series, or project name" />
      </div>
      <div className="field">
        <label htmlFor="story">Tell Us Your Story</label>
        <textarea
          id="story"
          name="story"
          placeholder="What's the project about? Why does it matter to you? What should readers know?"
          required
        ></textarea>
      </div>
      <div className="field">
        <label htmlFor="link">Reel / Portfolio Link</label>
        <input type="url" id="link" name="link" placeholder="https://" />
      </div>
      {state?.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit for Review"}
      </button>
    </form>
  );
}
