/* ConsultationForm - Contact form with name, email, company, budget range, and project
   brief fields. Submits JSON to the backend API with idle/sending/success/error states.
   Includes inline CTA-style submit button and a trust signal beneath the form. */
"use client";

import { useState, type FormEvent } from "react";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/consultation-form.module.css";

type Status = "idle" | "sending" | "success" | "error";

export default function ConsultationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budgetRange, message }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setBudgetRange("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-block">
      <div className="container-shell">
        <SectionHeading label="GET IN TOUCH" title="Start Your Project" />

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder={"\uC774\uB984"}
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder={"\uD68C\uC0AC\uBA85 (\uC120\uD0DD)"}
            className={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <select
            className={styles.select}
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
          >
            <option value="">{"\uC608\uC0B0 \uBC94\uC704 (\uC120\uD0DD)"}</option>
            <option value="under-500">{"500\uB9CC\uC6D0 \uBBF8\uB9CC"}</option>
            <option value="500-1000">{"500\uB9CC\uC6D0 ~ 1,000\uB9CC\uC6D0"}</option>
            <option value="1000-3000">{"1,000\uB9CC\uC6D0 ~ 3,000\uB9CC\uC6D0"}</option>
            <option value="over-3000">{"3,000\uB9CC\uC6D0 \uC774\uC0C1"}</option>
          </select>
          <textarea
            required
            rows={6}
            placeholder="Tell us about your project"
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            className={styles.button}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Inquiry"}
          </button>

          {status === "success" && (
            <p className={styles.success}>
              {"\uBB38\uC758\uAC00 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. 24\uC2DC\uAC04 \uB0B4\uC5D0 \uB2F5\uBCC0\uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4."}
            </p>
          )}
          {status === "error" && (
            <p className={styles.error}>
              {"\uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694."}
            </p>
          )}
        </form>

        <p className={styles.trust}>
          {"\uC0C1\uB2F4\uC740 \uBB34\uB8CC\uC785\uB2C8\uB2E4. \uBD80\uB2F4 \uC5C6\uC774 \uBB38\uC758\uD558\uC138\uC694."}
        </p>
      </div>
    </section>
  );
}
