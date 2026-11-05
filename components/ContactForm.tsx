"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONTACT } from "@/lib/site";

type Field = "name" | "email" | "topic" | "message";

const MESSAGES: Record<Field, string> = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  topic: "Please choose a topic.",
  message: "Please write a short message.",
};

const INPUT =
  "w-full border border-ink bg-white px-3.5 py-3 text-ink transition-[box-shadow] focus:shadow-[4px_4px_0_var(--color-green)] focus:outline-none aria-[invalid=true]:border-[#c0392b] aria-[invalid=true]:shadow-[4px_4px_0_#c0392b]"

// Checks the fields in the page. Online sending isn't set up yet, so a valid
// form shows how to reach the club instead.
function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink">
      {children}{" "}
      {optional ? <span className="font-normal normal-case tracking-normal text-ink/60">(optional)</span> : <span aria-hidden="true" className="text-ink">*</span>}
    </label>
  );
}

function FieldError({ errors, name }: { errors: Partial<Record<Field, string>>; name: Field }) {
  return errors[name] ? <p id={`${name}-error`} className="mt-1.5 text-sm text-[#c0392b]">{errors[name]}</p> : null;
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [notice, setNotice] = useState(false);

  const check = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const name = el.name as Field;
    const ok = el.value.trim() !== "" && el.checkValidity();
    setErrors((e) => ({ ...e, [name]: ok ? undefined : MESSAGES[name] }));
    return ok;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Array.from(formRef.current!.querySelectorAll<HTMLInputElement>("[required]"));
    let first: HTMLElement | null = null;
    for (const f of fields) if (!check(f) && !first) first = f;
    if (first) {
      first.focus();
      setNotice(false);
      return;
    }
    setNotice(true);
  };

  const field = (name: Field) => ({
    name,
    id: name,
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur: (e: { currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }) => {
      if (e.currentTarget.value.trim() !== "") check(e.currentTarget);
    },
    onInput: (e: { currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }) => {
      if (errors[name]) check(e.currentTarget);
    },
  });

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1 max-sm:gap-0">
        <div className="mb-5">
          <Label htmlFor="name">Name</Label>
          <input type="text" autoComplete="name" className={INPUT} {...field("name")} />
          <FieldError errors={errors} name="name" />
        </div>
        <div className="mb-5">
          <Label htmlFor="email">Email</Label>
          <input type="email" autoComplete="email" className={INPUT} {...field("email")} />
          <FieldError errors={errors} name="email" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1 max-sm:gap-0">
        <div className="mb-5">
          <Label htmlFor="phone" optional>Phone</Label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={INPUT} />
        </div>
        <div className="mb-5">
          <Label htmlFor="age-group" optional>Player age group</Label>
          <select id="age-group" name="age_group" className={INPUT} defaultValue="">
            <option value="">Select an age group</option>
            <option>Under 8</option>
            <option>U8 &ndash; U10</option>
            <option>U11 &ndash; U12</option>
            <option>U13 &ndash; U14</option>
            <option>U15 &ndash; U18</option>
            <option>Adult</option>
          </select>
        </div>
      </div>
      <div className="mb-5">
        <Label htmlFor="topic">What can we help with?</Label>
        <select className={INPUT} defaultValue="" {...field("topic")}>
          <option value="">Choose a topic</option>
          <option>Power FC Academy / assessment</option>
          <option>Soccer schools</option>
          <option>Summer camps</option>
          <option>Private training</option>
          <option>Adult clinics</option>
          <option>General question</option>
        </select>
        <FieldError errors={errors} name="topic" />
      </div>
      <div className="mb-5">
        <Label htmlFor="message">Message</Label>
        <textarea rows={6} className={`${INPUT} min-h-[140px] resize-y`} {...field("message")} />
        <FieldError errors={errors} name="message" />
      </div>
      <button
        type="submit"
        className="min-h-12 min-w-[200px] cursor-pointer border-2 border-ink bg-ink px-6 py-3 font-mono text-[0.85rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-green hover:text-ink"
      >
        Send Message
      </button>
      <p role="status" aria-live="polite" className={notice ? "mt-4 border border-ink border-l-8 border-l-green bg-white px-4 py-3.5 text-ink" : "sr-only"}>
        {notice && (
          <>
            Online messages aren&apos;t available yet. Please email <a href={CONTACT.emailHref}>{CONTACT.email}</a> or call{" "}
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.
          </>
        )}
      </p>
    </form>
  );
}
