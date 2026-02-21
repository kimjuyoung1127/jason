/** 이 파일은 Nodemailer를 사용한 이메일 전송 유틸리티를 제공합니다. */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
});

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  budgetRange?: string;
  projectType?: string;
  timeline?: string;
  referralSource?: string;
  message: string;
}

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.warn("[email] CONTACT_TO_EMAIL not set — skipping email send");
    return;
  }

  const budgetLabel = data.budgetRange
    ? `예산 범위: ${data.budgetRange}`
    : "예산 범위: 미지정";

  const html = `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 2rem; background: #0a0a0a; color: #ffffff;">
      <h2 style="font-family: sans-serif; color: #E52A2A; margin-bottom: 1.5rem;">새로운 프로젝트 문의</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 0.5rem 0; color: #999;">이름</td><td style="padding: 0.5rem 0;">${data.name}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">이메일</td><td style="padding: 0.5rem 0;">${data.email}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">회사</td><td style="padding: 0.5rem 0;">${data.company || "—"}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">예산</td><td style="padding: 0.5rem 0;">${budgetLabel}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">프로젝트 유형</td><td style="padding: 0.5rem 0;">${data.projectType || "—"}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">희망 일정</td><td style="padding: 0.5rem 0;">${data.timeline || "—"}</td></tr>
        <tr><td style="padding: 0.5rem 0; color: #999;">유입 경로</td><td style="padding: 0.5rem 0;">${data.referralSource || "—"}</td></tr>
      </table>
      <div style="margin-top: 1.5rem; padding: 1rem; border: 1px solid #222; border-radius: 8px;">
        <p style="color: #999; margin-bottom: 0.5rem;">프로젝트 내용</p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
      <p style="margin-top: 2rem; font-size: 0.75rem; color: #666;">Jason Portfolio — Auto-generated email</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Jason Portfolio" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: `[Portfolio] 새 프로젝트 문의: ${data.name}`,
    html,
  });
}
