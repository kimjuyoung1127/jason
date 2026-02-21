/** 이 파일은 상담 폼 데이터를 수집하고 이메일을 전송하는 contact 엔드포인트를 제공합니다. */
import { Router } from "express";
import { sendContactEmail, type ContactPayload } from "./email.js";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const {
    name,
    email,
    message,
    company,
    budgetRange,
    projectType,
    timeline,
    referralSource,
  } = (req.body ?? {}) as ContactPayload;

  if (!name || !email || !message) {
    res
      .status(400)
      .json({ success: false, message: "name, email, message are required" });
    return;
  }

  const requestId = `lead_${Date.now()}`;

  try {
    await sendContactEmail({
      name,
      email,
      message,
      company,
      budgetRange,
      projectType,
      timeline,
      referralSource,
    });
    console.log(
      `[contact] Lead ${requestId} — email sent to ${process.env.CONTACT_TO_EMAIL ?? "(not set)"}`,
    );
    res.status(201).json({ success: true, requestId });
  } catch (err) {
    console.error(`[contact] Lead ${requestId} — email failed:`, err);
    res
      .status(500)
      .json({ success: false, message: "Email delivery failed" });
  }
});
