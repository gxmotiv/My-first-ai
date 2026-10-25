# My First AI

A zero-budget, mobile-first AI project built step by step.

## Our non-negotiable rule

**₹0 budget. No paid API keys. No credit-card requirement.**

We will prefer open-source/open-weight models and free tools. A model's weights being free does not automatically mean its hosting or inference is free, so we will verify the limits of every service before depending on it.

## Current status

- `index.html`: first mobile-friendly chat UI prototype.
- The current prototype uses demo replies; it is **not connected to a real AI model yet**.
- GitHub Pages can host the static interface for free in a public repository, but it cannot run a private AI backend by itself.
- Do not put API tokens, passwords, or private data in frontend files or this public repository.

## Build roadmap

1. **Stable frontend:** make the chat interface usable on a phone and clearly label demo features.
2. **Free model research:** compare options that can be used without buying API credits. Check current quotas and terms before integration.
3. **Model connection:** choose an architecture that does not expose secret credentials in browser code. If no reliable free hosted inference is available, keep the app usable in demo/offline-tools mode rather than silently requiring payment.
4. **Research assistant:** add source-aware answers, evidence notes, and uncertainty labels.
5. **Small-model experiments:** only after the app works; use available free compute or small local experiments, without assuming a phone can run a large model.

## Design principles

- Mobile-first and lightweight for low-end Android devices.
- Honest labels: demo responses must never be presented as real model output.
- Sources and uncertainty should be visible for research answers.
- No hidden paid fallback or automatic spending.
- Keep provider/model integration replaceable so the project is not locked to one service.

## How to test the prototype

Open `index.html` from the repository to inspect the source. For a public live website, configure GitHub Pages in **Settings → Pages** and publish from the `main` branch and root folder. GitHub Pages deployment is separate from connecting an AI model.

## Next milestone

Review the current chat UI, then implement the smallest safe improvement before selecting any model provider.