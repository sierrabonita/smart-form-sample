# smart-form-sample

An intelligent Next.js form application featuring AI-powered auto-fill and real-time state synchronization.

🌍 **Live Demo:** https://smart-form-sample.vercel.app/

## 🤖 Harness Engineering (AI Governance)
- **AI Agent Guardrails:** AGENTS.md (Context provisioning and coding rules for AI assistants)
- **Prompt Engineering:** PROMPTS.md (Historical log of prompts used to generate and debug code)

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Package Manager:** npm
- **Runtime:** Node.js

## 📦 Libraries (Application Logic)

- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/google`(`gemini-2.5-flash`))
- **Form Management:** react-hook-form, @hookform/resolvers
- **Validation & Schema:** zod

## 🎨 UI & Design

- **Styling:** Tailwind CSS
- **Micro-interactions:** Custom CSS Keyframe Animations (For Auto-fill Highlighting)

## ⚙️ Tooling & Quality

- **Linting:** ESLint (Next.js default)

## 📋 Commit Message Format

|Prefix||
|---|---|
|feat|A new feature
|fix|A bug fix|
|docs|Documentation only changes|
|style|Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)|
|refactor|A code change that neither fixes a bug nor adds a feature|
|perf|A code change that improves performance|
|test|Adding missing or correcting existing tests|
|chore|Changes to the build process or auxiliary tools and libraries such as documentation generation|
