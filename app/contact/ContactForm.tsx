"use client";

import { useActionState } from "react";
import { LIMITS } from "@/lib/validation";
import { submitContact, type ContactState } from "./actions";

const initialState: ContactState = { ok: false, message: "" };
const inputClass = "rounded-md border border-black/10 px-3 py-2";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label htmlFor="contact-name" className="sr-only">
        Your name
      </label>
      <input
        id="contact-name"
        name="name"
        type="text"
        placeholder="Your name"
        required
        maxLength={LIMITS.name}
        className={inputClass}
      />
      <label htmlFor="contact-email" className="sr-only">
        Email
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        placeholder="Email"
        required
        maxLength={LIMITS.email}
        className={inputClass}
      />
      <label htmlFor="contact-message" className="sr-only">
        Message
      </label>
      <textarea
        id="contact-message"
        name="message"
        rows={5}
        placeholder="Message"
        required
        minLength={10}
        maxLength={LIMITS.contactMessage}
        className={inputClass}
      />

      {state.message ? (
        <p role="status" className={`text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
