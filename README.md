# testmu-sdet1-shruti

Playwright test automation with LLM-powered failure analysis.

## Prerequisites

- Node.js 18+
- npm

## How to Run

### 1. Install dependencies

```bash
npm install
npx playwright install
```

### 2. Configure (optional)

Add your API key to `.env` for the failure explainer (uses Groq free tier):

```
GROQ_API_KEY=your-key
```

Get a free key at https://console.groq.com

### 3. Run tests

```bash
npm test
```

The demo app starts automatically. Tests run in Chromium, Firefox, and WebKit.

### 4. View report

```bash
npm run report
```

Opens the HTML report in your browser (default: http://localhost:9922).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run login tests (demo app starts automatically) |
| `npm run dev` | Start demo app manually on http://localhost:3000 |
| `npm run report` | Open HTML test report |
| `npm run test:ui` | Run tests in interactive UI mode |

## Project Structure

```
├── config/llm.config.ts      # LLM settings
├── llm/                      # Failure explainer (Groq/Google)
├── public/                   # Demo login page
├── tests/
│   ├── login.spec.ts         # 5 login tests
│   └── hooks.ts              # Failure explainer hook
├── playwright.config.ts
├── package.json
└── .env
```

