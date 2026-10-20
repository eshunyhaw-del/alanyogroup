"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Field, TextArea } from "@/components/Field";
import { SALES_EMAIL, WHATSAPP_NUMBER_E164 } from "@/lib/contact";

type Topic = "general" | "abroad" | "projects" | "product";

const OPENERS: Record<Topic, string> = {
  general: "",
  abroad: "I am planning a project in Ghana from abroad. ",
  projects: "I would like to discuss a larger project. ",
  product: "",
};

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const params = useSearchParams();
  const requested = params.get("topic");
  const product = params.get("product");
  const topic: Topic =
    requested === "abroad" || requested === "projects" ? requested : product ? "product" : "general";

  const [message, setMessage] = useState(
    topic === "product" && product ? `I would like to ask about this product: ${product}. ` : OPENERS[topic],
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // WhatsApp is the main way to reach us: it opens the chat with the details already typed in.
  function sendOnWhatsApp(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (name.length < 2) {
      setError("Please enter your name so we know who is writing.");
      document.getElementById("name")?.focus();
      return;
    }
    if (message.trim().length < 10) {
      setError("Please tell us a little about what you need.");
      document.getElementById("message")?.focus();
      return;
    }
    setError(null);
    const text = [`Hello Alanyo Group, my name is ${name}.`, message.trim(), phone ? `My phone number: ${phone}` : ""]
      .filter(Boolean)
      .join("\n\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") ?? "",
          topic,
          message,
          website: form.get("website") ?? "",
        }),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      const body = await response.json().catch(() => ({}));
      const first = Object.values(body).find((v) => Array.isArray(v) && typeof v[0] === "string") as string[] | undefined;
      setError(
        response.status === 429
          ? "Too many messages sent. Please wait a minute and try again."
          : first?.[0] ?? "We could not send your message. Please try WhatsApp, or email us directly.",
      );
    } catch {
      setError("We could not reach the server. Please try WhatsApp, or email us directly.");
    }
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div role="status" className="max-w-2xl">
        <h2 className="text-2xl font-light tracking-tight">Thank you. Your message has been sent.</h2>
        <p className="mt-4 text-[15px] font-light leading-[1.8] text-ink/80">
          Our team will come back to you. For anything urgent, call us or message us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form className="max-w-2xl space-y-8" onSubmit={onSubmit}>
      <Field label="Full name" name="name" autoComplete="name" required minLength={2} maxLength={120} />
      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          hint="Optional. Include your country code if you are abroad."
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          hint="Needed only if you send by email."
        />
      </div>
      <TextArea
        label="How can we help?"
        name="message"
        required
        minLength={10}
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Honeypot: invisible to people and to screen readers; bots tend to fill it in. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="border border-ink/40 p-4 text-[13px] leading-[1.6]">
          {error}
        </p>
      )}

      <div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={(e) => sendOnWhatsApp(e.currentTarget.form as HTMLFormElement)}
            className="border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink"
          >
            Contact us on WhatsApp
          </button>
          <button
            type="submit"
            disabled={status === "sending"}
            className="border-b border-ink/50 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-60 disabled:cursor-wait disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Or send by email"}
          </button>
        </div>
        <p className="mt-5 text-[12px] leading-[1.7] text-warm">
          WhatsApp opens a chat with your message ready to send, and is the fastest way to reach us. We use your details
          only to reply to you. See our{" "}
          <Link href="/privacy" className="border-b border-ink/30 hover:border-ink">
            Privacy Policy
          </Link>
          . You can also write to{" "}
          <a href={`mailto:${SALES_EMAIL}`} className="border-b border-ink/30 hover:border-ink">
            {SALES_EMAIL}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
