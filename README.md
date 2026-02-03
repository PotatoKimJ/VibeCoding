# 일본어 단어 퀴즈 | 日本語クイズ

일본어 단어 퀴즈와 연락하기(Resend 메일 전송) 기능이 있는 웹 사이트입니다.

## 실행 방법

### 1. 퀴즈만 사용 (메일 전송 없음)

`index.html`을 브라우저에서 열면 됩니다. 연락하기 제출 시 "서버에 연결할 수 없습니다" 메시지가 나옵니다.

### 2. 연락하기 메일 전송까지 사용

1. [Resend](https://resend.com)에서 가입 후 API 키 발급 (Dashboard → API Keys)
2. 의존성 설치 및 서버 실행:

```bash
cd "프로젝트_폴더_경로"   # 예: c:\Users\User\Desktop\VibeCoding
npm install
set RESEND_API_KEY=re_여기에_발급받은_키
node server.js
```

3. 브라우저에서 **http://localhost:3000** 접속
4. "일본인 친구를 만나고 싶으면 클릭하세요" → **연락하기** 버튼으로 이름/전화번호/이메일 입력 후 제출하면 `ekfmfmd2412@gmail.com`으로 메일이 전송됩니다.

## 환경 변수

| 변수 | 설명 |
|------|------|
| `RESEND_API_KEY` | Resend API 키 (없으면 연락하기 전송 비활성화) |
| `PORT` | 서버 포트 (기본 3000) |

## GitHub 저장소

- **저장소**: [https://github.com/PotatoKimJ/VibeCoding.git](https://github.com/PotatoKimJ/VibeCoding.git)
- 이 프로젝트에서 수정 후 커밋·푸시는 Cursor 규칙(`.cursor/rules/git-commit.mdc`)에 따라 진행됩니다.
- 최초 1회: 이 폴더가 아직 Git 저장소가 아니면 터미널에서 다음을 실행한 뒤 푸시하세요.
  ```bash
  git init
  git remote add origin https://github.com/PotatoKimJ/VibeCoding.git
  git add .
  git commit -m "초기 커밋: 일본어 퀴즈 + 연락하기"
  git branch -M main
  git push -u origin main
  ```
  (저장소에 이미 해당 폴더가 있다면, 상위 폴더에서 clone한 뒤 이 폴더 내용을 복사하고 커밋·푸시해도 됩니다.)
  **폴더 이름은 한글보다 영어로 두면 터미널/Git에서 더 안정적으로 동작합니다.** (예: `VibeCoding`, `vibe-coding-lecture`)
