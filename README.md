# My First AI — Project Alpha

A zero-budget, mobile-first AI project being built collaboratively: your ideas and vision plus practical engineering steps.

## Our non-negotiable rules

- **₹0 budget. No paid API keys, subscriptions, surprise billing, or credit-card requirements.**
- No pretending that demo replies are real model output.
- Never expose API secrets in public frontend code.
- Build and test from a phone whenever practical; keep the interface light for a low-end Android device.
- Verify current free-tier limits before relying on a hosted service. Open model weights do not automatically mean free hosting or free compute.

## Current version: v0.2 interface prototype

`index.html` now includes:
- Responsive, mobile-first interface with dark/light theme.
- Three prototype modes: **Assistant**, **Research Planner**, and **Model Lab**.
- New chats, local chat history, search through saved chats, delete/clear chat controls.
- Copy assistant demo replies and export the current conversation as a text file.
- Chat history and theme preference saved in this browser's local storage.
- A visible warning that the page is **not connected to a real AI model or live web search**.

The replies are simple local JavaScript rules. Research Planner creates a checklist; it does not search the web or verify sources. Model Lab explains a plan; it does not load or train a model. The page sends no chat message to an AI server.

## Our shared north star

We want more than a pretty chatbot. The long-term project has three connected goals:

1. **Our own useful AI app** — first make the app fast, usable and easy to test on a phone.
2. **A source-aware research agent** — compare multiple models/tools where feasible, preserve URLs and dates, separate verified facts from source-reported claims, calculations and interpretations, show counter-evidence, and ask for human approval before important actions.
3. **Small-model experiments** — after the app works, test an existing open model and only later explore small-scale fine-tuning if free compute and device compatibility make it practical.

The priorities are calculation/answer reliability, transparent uncertainty, replaceable model providers, and practical tests over hype. Use “Insufficient information to determine this reliably” when evidence is missing.

## Roadmap

1. **Frontend foundation** — done as an initial prototype; keep testing on the target Android phone.
2. **Device feasibility check** — check browser GPU support, available storage, download size, memory use, speed and crash rate before choosing a local model.
3. **Free model research** — check current free limits and terms. Do not assume any free endpoint is unlimited or permanent.
4. **Safe model connection** — never put a private API key in public JavaScript. Prefer a genuinely free local/on-device route or a safe backend only if its ongoing use fits the ₹0 constraint.
5. **Research-agent workflow** — source retrieval, evidence matrix, citations, uncertainty labels and human approval.
6. **Model experiments** — use a small evaluation set first; test quality and latency. Training a capable model from scratch is not realistic on this phone and budget, so do not promise it as an immediate step.

## Hosting notes

GitHub Pages serves static HTML, CSS and JavaScript; it does not run a private Node/Python AI backend. Publishing the frontend is separate from connecting a model.

## How to test

Open the live page on the phone, refresh it after a new commit is deployed, and try all three modes. Start a new chat, return to an older chat, search history, switch theme, copy a reply, and export a conversation. Saved chat history is local to that browser and may disappear if browser data is cleared.

## Project memory

Keep this README as the written source of truth for our constraints, shared vision and roadmap. Update it whenever we agree on a meaningful direction change.
