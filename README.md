# Creator Canvas

선택지 기반 인터랙티브 서사 툴. Season 1에서 우주를 고르고 16단계 질문에 답하며, 완료 후 AI 시놉시스를 생성합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다. 인트로 화면에서 **Y** 키를 누르면 시작합니다.

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
```

`.env.example`을 복사해 사용할 수 있습니다.

```bash
cp .env.example .env.local
```

**중요:** `GEMINI_API_KEY`는 **서버 전용**입니다. `NEXT_PUBLIC_` 접두사를 붙이지 마세요. 클라이언트에 노출되면 안 됩니다.

API 키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 발급할 수 있습니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |

## Vercel 배포

1. 이 저장소를 Vercel에 연결합니다.
2. **Settings → Environment Variables**에 다음을 등록합니다.

| 변수 | 환경 | 설명 |
|------|------|------|
| `GEMINI_API_KEY` | Production, Preview, Development | Google Generative AI API 키 |

3. 배포 후 확인할 기능:
   - Season 1 질문 생성: `POST /api/generate-question`
   - 시놉시스 생성: `POST /api/generate-synopsis`
   - 브릿지 화면 → 「1페이지 시놉시스 보기」

Framework Preset은 **Next.js**이며, 별도 빌드 설정 없이 기본값으로 동작합니다.

## 아키텍처 메모

- Gemini 호출은 **App Router API Route**에서만 수행됩니다 (`src/app/api/*`).
- 프론트엔드는 `/api/generate-question`, `/api/generate-synopsis`를 `fetch`로 호출합니다.
- API 실패 시 시놉시스는 로컬 fallback으로 섹션형 문서를 표시합니다.
