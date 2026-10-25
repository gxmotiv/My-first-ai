# My First AI — Cloudflare Workers AI setup (Hindi)

यह setup GitHub Pages वाली वेबसाइट के लिए है। फोन सिर्फ वेबसाइट चलाएगा; मॉडल Cloudflare के सर्वर पर चलेगा।

## सुरक्षा पहले
- API token/secret किसी चैट, screenshot, GitHub file या index.html में न डालें।
- नीचे वाला Worker Workers AI binding इस्तेमाल करता है; इसमें API token की ज़रूरत नहीं होती।
- Cloudflare account को Free plan पर ही रखें। Paid upgrade या billing method की माँग आए तो रुकें।
- CORS दूसरे browser origins को रोकने में मदद करता है; यह login/access control नहीं है। अभी इस endpoint को निजी परीक्षण तक सीमित रखें।

## चरण A — Worker बनाना
1. https://dash.cloudflare.com/ खोलें और login करें।
2. Workers & Pages खोलें।
3. Create application चुनें।
4. यदि LLM Chat App template दिखता है, तो उसे Deploy करके पहले Cloudflare में AI परीक्षण किया जा सकता है। यह हमारी वेबसाइट integration का अलग परीक्षण है।
5. Custom Worker के लिए Create Worker / Hello World जैसा विकल्प चुनें और नाम my-first-ai-api रखें।
6. Worker खोलें → Edit Code।
7. इस repo की cloudflare/worker.js file का पूरा code copy करके editor में paste करें और Deploy करें।

## चरण B — Workers AI binding जोड़ना
1. Worker का Settings खोलें।
2. Bindings में जाएँ → Add binding।
3. Workers AI चुनें।
4. Binding variable name AI रखें।
5. Save करें और Worker redeploy करें।

## चरण C — परीक्षण
1. Worker का https://...workers.dev URL नोट करें। URL सार्वजनिक हो सकता है; कोई token उसमें न लगाएँ।
2. Cloudflare Dashboard के Worker logs/AI usage में errors और usage देखें।
3. अगर error कहे कि model उपलब्ध नहीं है या binding missing है, तो error text का screenshot भेजें—token/secret छिपाकर।
4. Cloudflare की मुफ्त Workers AI allocation दैनिक 10,000 Neurons है और 00:00 UTC पर reset होती है। सीमा पार होने पर requests fail होंगी। यह 10,000 requests नहीं हैं।

## अभी तक क्या नहीं हुआ
- यह file backend code तैयार करती है; Worker आपके खाते में अपने-आप deploy नहीं हुआ है।
- जब तक Worker URL ज्ञात न हो, index.html को live AI endpoint से नहीं जोड़ा जा सकता।
- Worker के CORS allowlist में अभी https://gxmotiv.github.io है। अगर आपकी Pages origin अलग है, तो इसे बदलना होगा।
- CORS authentication नहीं है; कोई व्यक्ति direct request करके quota consume करने की कोशिश कर सकता है। बड़े सार्वजनिक launch से पहले rate-limit/access control जोड़ें।
