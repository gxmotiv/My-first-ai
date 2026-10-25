# My First AI — Project Alpha

A zero-budget, mobile-first personal AI assistant project. The current web UI is plain HTML, CSS, and JavaScript to keep it practical on a low-end Android phone.

## Non-negotiable rules

- **₹0 only:** no paid APIs, subscriptions, surprise billing, or upgrades without explicit approval.
- No API keys or Cloudflare tokens in public frontend code.
- Never label a planner/demo response as live research or verified fact.
- Keep private memory optional, editable, and clearable by the user.
- Test real behavior instead of relying on model names or marketing claims.

## Current app features

- Responsive mobile-first interface with dark/light theme.
- Assistant mode calls the configured Cloudflare endpoint at `https://1.gagandeep-hwr.workers.dev`.
- Requests include the current message plus recent conversation context and optional user-saved memory when the prompt fits the endpoint's 3,000-character limit. Very long user messages are sent without additional context.
- Chat history, theme settings, and optional memory are stored in this browser's local storage. They are not cloud-synced or model training.
- Memory is user-controlled through the memory button; notes are included in future prompts when space allows. Do not save passwords, API tokens, or sensitive secrets.
- Voice dictation uses the browser/device Speech Recognition API when available. Voice output uses browser speech synthesis. Support and language quality vary by browser/device; speech recognition may use a browser/device speech service.
- Copy and export chat, create/delete conversations, search local history.

## Known limitations — do not overclaim

- **Live web research is not implemented.** Research Planner creates a checklist only; it does not search the web, retrieve sources, or verify claims.
- Model Lab is a planning/learning mode; it does not train or run a model itself.
- Memory is browser-local prompt context, not persistent model memory. It may be unavailable in private browsing, after browser data is cleared, or on another device.
- GitHub Pages uses `POST https://1.gagandeep-hwr.workers.dev/api/chat` with a `messages` array. The frontend accepts either a JSON `{ "answer": "..." }` response or the Cloudflare template's Server-Sent Events stream.
- **Important deployment step:** GitHub commits do not update the active Cloudflare Worker unless Cloudflare is configured to deploy from this repo. The `cloudflare/worker.js` file now includes the expected `/api/chat` endpoint and CORS support for `https://gxmotiv.github.io`; deploy that file to the Worker with the `AI` binding enabled for the GitHub Pages version to work.
- The ChatGPT-side assistant can edit this GitHub repo but cannot publish code into the Cloudflare dashboard from here. The running Worker may still contain the original template code until it is redeployed. If the browser says `Failed to fetch`, verify Worker CORS/preflight support and that `/api/chat` is deployed.
- The frontend displays connection errors rather than substituting a fake AI answer.
- CORS is not authentication. A public Worker endpoint can potentially be called outside this web page; keep an eye on usage and do not place secrets in client code.

## Cloudflare usage and cost

The app is designed for a ₹0 budget. The configured hosted model has free-tier limits, which may change. Verify Cloudflare's current Workers AI quota and account settings before relying on it. Do not upgrade to a paid plan just to continue testing.

## How to test on Android

1. Open the GitHub Pages app and refresh after a commit has deployed.
2. In Assistant mode, send a follow-up that refers to the previous answer. Check whether recent context is used.
3. Open the memory button, save a harmless preference (for example, "Reply in simple Hinglish"), start a new chat, and ask the model to follow it. Clear memory afterward if desired.
4. Tap the microphone and check permission/support; review the transcript before sending. Tap **Speak** on an assistant reply to test speech output.
5. Check New chat, saved history, search, delete, theme toggle, copy, and export.
6. Switch to Research Planner and confirm it reports a plan, not actual web search.

## Automated smoke test

The GitHub Actions smoke test parses the inline JavaScript and checks for the expected feature wiring and honest research labels. It does **not** prove that a live Worker inference, microphone, or speech playback works on every device; those require live/device testing.

## Roadmap

1. Keep core chat, browser memory, and voice controls reliable.
2. Verify Cloudflare requests and the exact deployed Worker/model configuration.
3. Add real research only when a suitable free source-search approach exists; preserve source URLs, dates, counter-evidence, and uncertainty labels.
4. Build a small research evaluation set before adding more agent capabilities.
5. Investigate on-device models only after checking RAM, storage, WebGPU support, speed, and crash rate on the target phone.
6. Consider fine-tuning only later, if free compute is actually available. Training a capable model from scratch is not realistic on this phone and budget.
