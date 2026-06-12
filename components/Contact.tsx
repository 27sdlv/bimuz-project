"use client";

import { FormEvent, useRef, useState } from "react";
import { contactDetails } from "@/lib/data";
import FadeIn from "./FadeIn";
import { ContactIcon } from "./Icons";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState("loading");

    setTimeout(() => {
      setSubmitState("success");
      formRef.current?.reset();

      setTimeout(() => setSubmitState("idle"), 3000);
    }, 1200);
  };

  const buttonText =
    submitState === "loading"
      ? "Yuborilmoqda..."
      : submitState === "success"
        ? "Xabar yuborildi ✓"
        : "Xabar yuborish";

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <FadeIn className="contact-info" x={-40}>
          <span className="section-label">Aloqa</span>
          <h2 className="section-title display-title">BOG&apos;LANISH</h2>
          <p className="contact-desc">
            Loyihangizni muhokama qilish uchun biz bilan bog&apos;laning. Mutaxassislarimiz 24 soat
            ichida javob beradi.
          </p>
          <div className="contact-details">
            {contactDetails.map((item) => (
              <div key={item.label} className="contact-item">
                <ContactIcon name={item.icon} />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="contact-form-wrapper" x={40} delay={0.12}>
          <form
            ref={formRef}
            className="contact-form"
            id="contactForm"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">Ism</label>
              <input type="text" id="name" name="name" required placeholder="Ismingiz" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input type="tel" id="phone" name="phone" required placeholder="+998 XX XXX XX XX" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="email@example.com" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Xabar</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Loyihangiz haqida qisqacha yozing..."
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary btn-full${submitState === "success" ? " btn-success" : ""}`}
              disabled={submitState === "loading"}
            >
              {buttonText}
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
