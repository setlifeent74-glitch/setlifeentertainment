"use client";

import { useActionState, useId, useState } from "react";
import { subscribeToNewsletter, saveNewsletterPreferences, type SubscribeState } from "@/app/actions/newsletter";

const PREFERENCES = [
  "Daily Headlines",
  "Weekly Edition",
  "Casting & Crew",
  "Festival Deadlines",
  "Reviews",
  "Magazine",
];

/**
 * §37 The Call Sheet — Newsletter. Real server-side validation and
 * persistence (app/actions/newsletter.ts), not a UI mock. Preferences are
 * a genuine post-signup step, not inline with the initial form.
 */
export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState<SubscribeState, FormData>(subscribeToNewsletter, null);
  const [selected, setSelected] = useState<string[]>([]);
  const errorId = useId();

  if (state?.ok) {
    const togglePreference = (pref: string) => {
      const next = selected.includes(pref) ? selected.filter((p) => p !== pref) : [...selected, pref];
      setSelected(next);
      if (state.id) saveNewsletterPreferences(state.id, next);
    };

    return (
      <div className="newsletter-success" role="status">
        <p>You&apos;re on the list. Now — what do you want to hear about?</p>
        {state.id && (
          <fieldset className="newsletter-preferences">
            <legend className="sr-only">Newsletter preferences</legend>
            {PREFERENCES.map((pref) => (
              <label key={pref}>
                <input
                  type="checkbox"
                  checked={selected.includes(pref)}
                  onChange={() => togglePreference(pref)}
                />
                {pref}
              </label>
            ))}
          </fieldset>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="newsletter-form" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        aria-describedby={state?.error ? errorId : undefined}
        aria-invalid={state?.error ? true : undefined}
      />
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Signing Up…" : "Sign Up"}
      </button>
      {state?.error && (
        <p id={errorId} className="newsletter-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
