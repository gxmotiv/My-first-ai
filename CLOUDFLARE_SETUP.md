# My First AI — Cloudflare Workers AI Setup

This guide connects the GitHub Pages frontend to a Cloudflare Workers AI backend. The phone only runs the website; the model runs on Cloudflare's servers.

## Security first
- Never paste an API token or secret into a chat, screenshot, GitHub file, or public frontend code.
- The starter Worker uses a Workers AI binding named `AI`; it does not need an API token in the code.
- Keep the Cloudflare account on the Free plan. If a step asks for billing details or a paid upgrade, stop and check before proceeding.
- CORS restricts normal browser origins but is not authentication. Treat the starter endpoint as a private test, not a production-secure public API.

## A. Create the Worker
1. Open https://dash.cloudflare.com/ and sign in.
2. Open **Workers & Pages**.
3. Select **Create application**.
4. If **LLM Chat App** appears, you can deploy it as a separate test to confirm that Workers AI is available in your account.
5. For our custom backend, choose **Create Worker** or a **Hello World** starter and name it `my-first-ai-api`.
6. Open the Worker and choose **Edit Code**.
7. Open `cloudflare/worker.js` in this repository, copy the entire file, paste it into the editor, and select **Deploy**.

## B. Add the Workers AI binding
1. Open the Worker settings.
2. Find **Bindings** and select **Add binding**.
3. Choose **Workers AI**.
4. Set the variable name to `AI` (uppercase).
5. Save the binding and redeploy the Worker if prompted.

## C. Test it
1. Copy the Worker URL ending in `workers.dev`. Do not put any token in the URL.
2. Check the Worker logs and Workers AI usage in the Cloudflare dashboard.
3. If you see a model-unavailable or missing-binding error, send a screenshot of the error only. Hide tokens, account secrets, and other credentials.
4. The documented free Workers AI allocation is 10,000 Neurons per day, resetting at 00:00 UTC. Neurons are not the same as requests or tokens; consumption varies by model and workload. Requests can fail after the free allocation is exhausted.

## Important limitations
- Adding this file to GitHub does not deploy a Worker into your Cloudflare account.
- The website cannot connect to the live model until the Worker is deployed and its URL is configured in the frontend.
- The starter code allows the origin `https://gxmotiv.github.io`. Change it only if your Pages origin differs.
- CORS is not authentication; a person can try to call an endpoint directly. Add proper rate limiting/access control before making this a public service.
- The starter model ID may not be available in every account or forever. Check the current Cloudflare model catalogue and replace it if necessary.

## Token handling
If an API token was shared in chat or anywhere untrusted, treat it as exposed. In Cloudflare, open **My Profile → API Tokens**, find that token, use the three-dot menu, and choose **Roll** (or revoke/delete it if Roll is unavailable). Confirm the action. The old token should no longer be used. Create a replacement only if needed, with the minimum required permissions, and never share it.

Official references:
- Workers AI getting started: https://developers.cloudflare.com/workers-ai/get-started/
- Workers AI bindings: https://developers.cloudflare.com/workers-ai/configuration/bindings/
- Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Roll an exposed token: https://developers.cloudflare.com/fundamentals/api/how-to/roll-token/
