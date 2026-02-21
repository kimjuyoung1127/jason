/* FAQ - Accordion-style frequently asked questions section with expand/collapse
   toggling via useState. Questions in Korean with smooth max-height transitions
   and a rotating +/- indicator. */
"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/faq.module.css";

const faqs = [
  {
    question: "\uC5B4\uB5A4 \uD504\uB85C\uC81D\uD2B8\uB97C \uC9C4\uD589\uD558\uB098\uC694?",
    answer:
      "\uC6F9\uC0AC\uC774\uD2B8, \uC6F9 \uC560\uD50C\uB9AC\uCF00\uC774\uC158, AI \uD1B5\uD569 \uC11C\uBE44\uC2A4, \uB300\uC2DC\uBCF4\uB4DC, \uC774\uCEE4\uBA38\uC2A4 \uD504\uB860\uD2B8 \uB4F1 \uB2E4\uC591\uD55C \uB514\uC9C0\uD138 \uD504\uB85C\uC81D\uD2B8\uB97C \uC9C4\uD589\uD569\uB2C8\uB2E4. \uB79C\uB529\uD398\uC774\uC9C0\uBD80\uD130 \uBCF5\uC7A1\uD55C \uC0DD\uC0B0 \uC11C\uBE44\uC2A4\uAE4C\uC9C0 \uBAA8\uB450 \uAC00\uB2A5\uD569\uB2C8\uB2E4.",
  },
  {
    question: "\uC77C\uBC18\uC801\uC778 \uD504\uB85C\uC81D\uD2B8 \uD0C0\uC784\uB77C\uC778\uC740?",
    answer:
      "\uD504\uB85C\uC81D\uD2B8 \uADDC\uBAA8\uC5D0 \uB530\uB77C \uB2E4\uB985\uB2C8\uB2E4. \uC77C\uBC18\uC801\uC73C\uB85C \uB79C\uB529\uD398\uC774\uC9C0\uB294 1~2\uC8FC, \uC911\uD615\uAE09 \uC6F9\uC571\uC740 4~8\uC8FC \uC815\uB3C4\uC774\uBA70, \uADDC\uBAA8 \uD504\uB85C\uC81D\uD2B8\uB294 \uAC1C\uBCC4 \uD611\uC758\uB85C \uC9C4\uD589\uD569\uB2C8\uB2E4.",
  },
  {
    question: "\uBE44\uC6A9\uC740 \uC5B4\uB5BB\uAC8C \uCC45\uC815\uD558\uB098\uC694?",
    answer:
      "\uD504\uB85C\uC81D\uD2B8 \uBC94\uC704, \uBCF5\uC7A1\uB3C4, \uAE30\uAC04\uC5D0 \uB530\uB77C \uACAC\uC801\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4. \uCD08\uAE30 \uC0C1\uB2F4\uC740 \uBB34\uB8CC\uC774\uBA70, \uC0C1\uB2F4 \uD6C4 \uC0C1\uC138 \uACAC\uC801\uC11C\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
  },
  {
    question: "\uC720\uC9C0\uBCF4\uC218 \uC9C0\uC6D0\uC774 \uAC00\uB2A5\uD55C\uAC00\uC694?",
    answer:
      "\uB124, \uD504\uB85C\uC81D\uD2B8 \uC644\uB8CC \uD6C4\uC5D0\uB3C4 \uC720\uC9C0\uBCF4\uC218 \uACC4\uC57D\uC744 \uD1B5\uD574 \uC9C0\uC18D\uC801\uC778 \uC5C5\uB370\uC774\uD2B8\uC640 \uAE30\uC220 \uC9C0\uC6D0\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4.",
  },
  {
    question: "\uC5B4\uB5A4 \uAE30\uC220 \uC2A4\uD0DD\uC744 \uC0AC\uC6A9\uD558\uB098\uC694?",
    answer:
      "\uC8FC\uB85C Next.js, React, TypeScript, Three.js\uB97C \uC0AC\uC6A9\uD558\uBA70, \uBC31\uC5D4\uB4DC\uB294 Node.js, Python\uC744 \uD65C\uC6A9\uD569\uB2C8\uB2E4. AI \uD504\uB85C\uC81D\uD2B8\uC758 \uACBD\uC6B0 LangChain, OpenAI API \uB4F1\uC744 \uD1B5\uD569\uD569\uB2C8\uB2E4.",
  },
  {
    question: "\uC6D0\uACA9 \uC791\uC5C5\uC774 \uAC00\uB2A5\uD55C\uAC00\uC694?",
    answer:
      "\uB124, \uBAA8\uB4E0 \uD504\uB85C\uC81D\uD2B8\uB294 \uC6D0\uACA9\uC73C\uB85C \uC9C4\uD589 \uAC00\uB2A5\uD569\uB2C8\uB2E4. Slack, Notion \uB4F1\uC744 \uD65C\uC6A9\uD558\uC5EC \uC2E4\uC2DC\uAC04 \uC18C\uD1B5\uD558\uBA70, \uC911\uAC04 \uBCF4\uACE0\uB97C \uD1B5\uD574 \uC9C4\uD589 \uC0C1\uD669\uC744 \uACF5\uC720\uD569\uB2C8\uB2E4.",
  },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section id="faq" className="section-block">
      <div className="container-reading">
        <SectionHeading label="FAQ" title="Common Questions" />

        <div className={styles.list}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={styles.item}>
                <button
                  type="button"
                  className={styles.question}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`${styles.indicator} ${isOpen ? styles.open : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`${styles.answer} ${isOpen ? styles.answerOpen : ""}`}
                >
                  <p className={styles.answerText}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
