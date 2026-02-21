/** Contact page aligned with the backend contact module. */
"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    const res = await fetch("http://localhost:4000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      setStatus("\uC694\uCCAD \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC785\uB825\uAC12\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694.");
      return;
    }

    setStatus("\uBB38\uC758\uAC00 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBE60\uB974\uAC8C \uB2F5\uBCC0\uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4.");
    event.currentTarget.reset();
  }

  return (
    <main className="detail-wrap">
      <a href="/" className="back-link">
        Back to index
      </a>
      <h1>Contact Jason</h1>
      <p className="summary">{"\uD504\uB85C\uC81D\uD2B8 \uBAA9\uC801\uACFC \uD544\uC694\uD55C \uACB0\uACFC\uB97C \uACF5\uC720\uD574\uC8FC\uC2DC\uBA74 \uBE60\uB974\uAC8C \uC81C\uC548\uB4DC\uB9BD\uB2C8\uB2E4."}</p>
      <form onSubmit={onSubmit} className="contact-form">
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <textarea name="message" placeholder="Project brief" rows={6} required />
        <button type="submit">Send Inquiry</button>
      </form>
      {status ? <p className="client">{status}</p> : null}
    </main>
  );
}
