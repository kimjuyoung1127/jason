/** Contact page - Split-layout form with scroll-reveal, client-side validation, and success animation. */
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useInView } from "@/lib/use-in-view";
import styles from "./styles/contact.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const introView = useInView<HTMLDivElement>({ threshold: 0.2 });
  const formView = useInView<HTMLDivElement>({ threshold: 0.1 });

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "이름을 입력해주세요.";
    if (!email.trim()) next.email = "이메일을 입력해주세요.";
    else if (!EMAIL_RE.test(email))
      next.email = "올바른 이메일 형식이 아닙니다.";
    if (!message.trim()) next.message = "프로젝트 내용을 입력해주세요.";
    else if (message.trim().length < 10)
      next.message = "최소 10자 이상 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.backLink}>
        {"← Back to Home"}
      </Link>

      <div className={styles.content}>
        {status === "success" ? (
          <div className={styles.successCard}>
            <div className={styles.checkmark} />
            <p className={styles.successTitle}>Thank You!</p>
            <p className={styles.successText}>
              {"문의가 접수되었습니다. 빠르게 답변드리겠습니다."}
            </p>
          </div>
        ) : (
          <>
            {/* ---- Left: Intro ---- */}
            <div
              ref={introView.ref}
              className={`${styles.intro} ${introView.isInView ? styles.visible : ""}`}
            >
              <span className={styles.label}>Contact</span>
              <h1 className={styles.heading}>
                {"Let's Build\nSomething\nGreat."}
              </h1>
              <p className={styles.subtitle}>
                {"프로젝트 목적과 필요한 결과를 공유해주시면 빠르게 제안드립니다."}
              </p>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <span className={styles.contactItemLabel}>Email</span>
                  <a
                    href="mailto:hello@jason.dev"
                    className={styles.contactItemValue}
                  >
                    hello@jason.dev
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactItemLabel}>Based</span>
                  <span className={styles.contactItemValue}>Seoul, KR</span>
                </div>
              </div>
            </div>

            {/* ---- Right: Form ---- */}
            <div
              ref={formView.ref}
              className={`${styles.formWrap} ${formView.isInView ? styles.visible : ""}`}
            >
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={"이름"}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <span className={styles.fieldError}>{errors.name}</span>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span className={styles.fieldError}>{errors.email}</span>
                )}

                <textarea
                  rows={6}
                  placeholder="Tell us about your project"
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && (
                  <span className={styles.fieldError}>{errors.message}</span>
                )}

                <button
                  type="submit"
                  className={styles.button}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Inquiry"}
                </button>

                {status === "error" && (
                  <p className={styles.error}>
                    {"전송에 실패했습니다. 다시 시도해주세요."}
                  </p>
                )}
              </form>

              <p className={styles.trust}>
                {"상담은 무료입니다. 부담 없이 문의하세요."}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
