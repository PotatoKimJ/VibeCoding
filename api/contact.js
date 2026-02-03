const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "ekfmfmd2412@gmail.com";

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, phone, email } = req.body || {};

  if (!name || !phone || !email) {
    return res.status(400).json({ message: "이름, 전화번호, 이메일을 모두 입력해 주세요." });
  }

  if (!RESEND_API_KEY) {
    return res.status(503).json({
      message: "메일 서비스가 설정되지 않았습니다. Vercel 대시보드에서 RESEND_API_KEY를 설정해 주세요.",
    });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "日本語クイズ 연락 <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      subject: `[일본어 퀴즈] 연락 요청 - ${name}`,
      html: `
        <h2>일본인 친구 만나기 연락 요청</h2>
        <p><strong>이름:</strong> ${escapeHtml(name)}</p>
        <p><strong>전화번호:</strong> ${escapeHtml(phone)}</p>
        <p><strong>이메일:</strong> ${escapeHtml(email)}</p>
        <hr>
        <p><small>일본어 단어 퀴즈 사이트에서 제출됨</small></p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        message: error.message || "메일 전송에 실패했습니다.",
      });
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    res.status(500).json({
      message: "서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
    });
  }
};
