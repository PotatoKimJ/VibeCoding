const path = require("path");
const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "ekfmfmd2412@gmail.com";

if (!RESEND_API_KEY) {
  console.warn("경고: RESEND_API_KEY 환경 변수가 없습니다. 연락하기 메일 전송이 동작하지 않습니다.");
  console.warn("실행 예: set RESEND_API_KEY=re_xxxx && node server.js (Windows)");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 연락하기 API: Resend로 ekfmfmd2412@gmail.com 으로 전송
app.post("/api/contact", async (req, res) => {
  const { name, phone, email } = req.body || {};

  if (!name || !phone || !email) {
    return res.status(400).json({ message: "이름, 전화번호, 이메일을 모두 입력해 주세요." });
  }

  if (!resend) {
    return res.status(503).json({
      message: "메일 서비스가 설정되지 않았습니다. RESEND_API_KEY를 설정해 주세요.",
    });
  }

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

    res.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    res.status(500).json({
      message: "서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
    });
  }
});

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

app.listen(PORT, () => {
  console.log(`서버: http://localhost:${PORT}`);
  console.log("브라우저에서 위 주소로 접속하세요.");
});
