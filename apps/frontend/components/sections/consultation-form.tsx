/* ConsultationForm - Survey-style contact form with sectioned layout, project type chips,
   timeline/referral selects, client-side validation, and animated success state. */
"use client";

import { useState, type FormEvent } from "react";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/consultation-form.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type Status = "idle" | "sending" | "success" | "error";

const PROJECT_TYPES = [
  "Web Development",
  "AI Integration",
  "Design Engineering",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ConsultationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleChip(type: string) {
    setProjectType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "이름을 입력해주세요.";
    if (!email.trim()) next.email = "이메일을 입력해주세요.";
    else if (!EMAIL_RE.test(email)) next.email = "올바른 이메일 형식이 아닙니다.";
    if (!message.trim()) next.message = "프로젝트 내용을 입력해주세요.";
    else if (message.trim().length < 10)
      next.message = "최소 10자 이상 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const filledCount = [
    name,
    email,
    company,
    projectType.length > 0 ? "filled" : "",
    budgetRange,
    timeline,
    referralSource,
    message,
  ].filter(Boolean).length;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          projectType: projectType.join(", "),
          budgetRange,
          timeline,
          referralSource,
          message,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setProjectType([]);
      setBudgetRange("");
      setTimeline("");
      setReferralSource("");
      setMessage("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-block">
      <div className={`container-shell ${styles.sectionInner}`}>
        <SectionHeading label="GET IN TOUCH" title="Start Your Project" />

        {status === "success" ? (
          <div className={styles.successCard}>
            <div className={styles.checkmark} />
            <p className={styles.successTitle}>Thank You!</p>
            <p className={styles.successText}>
              {"문의가 접수되었습니다. 24시간 내에 답변드리겠습니다."}
            </p>
          </div>
        ) : (
          <>
            <p className={styles.completionIndicator}>
              {filledCount}/8 입력 완료
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* ---- ABOUT YOU ---- */}
              <div className={styles.formSection}>
                <span className={styles.formSectionLabel}>About You</span>
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
                <input
                  type="text"
                  placeholder={"회사명 (선택)"}
                  className={styles.input}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {/* ---- PROJECT DETAILS ---- */}
              <div className={styles.formSection}>
                <span className={styles.formSectionLabel}>
                  Project Details
                </span>
                <div className={styles.chipGroup}>
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.chip} ${projectType.includes(type) ? styles.chipActive : ""}`}
                      onClick={() => toggleChip(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <select
                  className={styles.select}
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                >
                  <option value="">{"예산 범위 (선택)"}</option>
                  <option value="under-500">{"500만원 미만"}</option>
                  <option value="500-1000">{"500만원 ~ 1,000만원"}</option>
                  <option value="1000-3000">
                    {"1,000만원 ~ 3,000만원"}
                  </option>
                  <option value="over-3000">{"3,000만원 이상"}</option>
                </select>
                <select
                  className={styles.select}
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="">{"희망 일정 (선택)"}</option>
                  <option value="1-2weeks">{"1~2주 이내"}</option>
                  <option value="1-2months">{"1~2개월"}</option>
                  <option value="3months+">{"3개월 이상"}</option>
                  <option value="undecided">{"아직 미정"}</option>
                </select>
              </div>

              {/* ---- MORE INFO ---- */}
              <div className={styles.formSection}>
                <span className={styles.formSectionLabel}>More Info</span>
                <select
                  className={styles.select}
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                >
                  <option value="">{"유입 경로 (선택)"}</option>
                  <option value="search">{"검색 (구글)"}</option>
                  <option value="social">{"소셜 미디어"}</option>
                  <option value="referral">{"추천"}</option>
                  <option value="portfolio">{"포트폴리오 사이트"}</option>
                  <option value="other">{"기타"}</option>
                </select>
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
              </div>

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
          </>
        )}
      </div>
    </section>
  );
}
