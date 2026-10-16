"use client";

import { useState } from "react";
import { Field, TextArea } from "@/components/Field";

export function ContactForm() {
  const [notice, setNotice] = useState(false);

  return (
    <form
      className="max-w-2xl space-y-8"
      onSubmit={(e) => {
        // Enquiries are stored and emailed by the API in a later step; nothing is sent yet.
        e.preventDefault();
        setNotice(true);
      }}
    >
      <Field label="Full name" name="name" autoComplete="name" required />
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <TextArea label="How can we help?" name="message" required />
      <button
        type="submit"
        className="border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink"
      >
        Send enquiry
      </button>
      {notice && (
        <p role="status" className="text-[13px] leading-[1.7] text-warm">
          Enquiries are not connected yet, so nothing was sent. This form will go live with the backend.
        </p>
      )}
    </form>
  );
}
