// Lightweight chat controller — proxies to Gemini if available, otherwise returns safe canned guidance.
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'logs', 'chat_usage.log');
const ensureLogDir = () => {
  try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  } catch (e) {
    // ignore
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) return res.status(400).json({ success: false, message: 'Message is required.' });

    const userId = req.user?.id || null;

    // Enforce per-user daily chat quota (10 requests/day). If DB check fails, allow request but log warning.
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (userId) {
        const [uCountRows] = await pool.query('SELECT daily_chat_count, daily_chat_count_date FROM users WHERE id = ?', [userId]);
        if (uCountRows && uCountRows.length > 0) {
          const row = uCountRows[0];
          const storedDate = row.daily_chat_count_date ? row.daily_chat_count_date.toString().slice(0, 10) : null;
          let currentCount = Number(row.daily_chat_count) || 0;
          if (storedDate !== today) {
            // reset counter for new day
            currentCount = 0;
            try { await pool.query('UPDATE users SET daily_chat_count = 0, daily_chat_count_date = ? WHERE id = ?', [today, userId]); } catch (e) { /* non-fatal */ }
          }
          if (currentCount >= 10) {
            return res.status(429).json({ success: false, message: 'Daily chat limit reached (10 requests per day). Please try again tomorrow.' });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to enforce daily chat quota:', e && e.message ? e.message : e);
    }

    // Gather small user context to improve responses (best-effort, non-blocking)
    let userLevel = null;
    let recentFiveDScores = [];
    try {
      if (userId) {
        const [uRows] = await pool.query('SELECT level FROM users WHERE id = ?', [userId]);
        if (uRows && uRows.length > 0) userLevel = uRows[0].level || null;

        const [sRows] = await pool.query('SELECT five_d_score FROM sessions WHERE user_id = ? AND five_d_score IS NOT NULL ORDER BY created_at DESC LIMIT 3', [userId]);
        recentFiveDScores = sRows.map(r => r.five_d_score).filter(Boolean);
      }
    } catch (e) {
      // non-fatal; proceed without context
      console.warn('Failed to read user context for chat:', e.message || e);
    }

    // Build a structured prompt — system instruction + user context + user message
    // Strict system instruction: remain on-topic and only provide brief insights, uses/advantages, or mantra names.
    const system = `You are a calm, concise Kundalini practice assistant. ONLY answer short, basic insights about breathwork, mantra, posture, chakra names, simple uses and advantages, or give a few mantra names. Do NOT provide medical, therapeutic, legal, or psychological advice. If the user asks to go off-topic or requests detailed protocols, politely refuse and offer a short alternative (1-2 sentences). Keep replies under 120 words.`;

    // Validate user message stays on allowed topics (breath, mantra, posture, practice, chakra)
    const allowed = ['breath','breathing','mantra','bija','chant','posture','spine','practice','chakra','breathwork','meditation','kundalini'];
    const lowerCheck = message.toLowerCase();
    const isAllowed = allowed.some(k => lowerCheck.includes(k));
    if (!isAllowed) {
      return res.status(400).json({ success: false, message: 'Please ask about breathwork, mantra, posture, chakras, or short practice tips. The assistant will not answer off-topic requests.' });
    }
    const contextParts = [];
    if (userLevel) contextParts.push(`User level: ${userLevel}`);
    if (recentFiveDScores.length > 0) contextParts.push(`Recent 5D scores: ${recentFiveDScores.join(', ')}`);
    const contextText = contextParts.length ? `Context: ${contextParts.join(' | ')}` : '';

    const fullPrompt = [system, contextText, `User: ${message}`].filter(Boolean).join('\n\n');

    // Attempt Gemini call with retries/backoff
    const apiKey = process.env.GEMINI_API_KEY || process.env.GENERATIVE_AI_KEY;
    if (apiKey) {
      let fetchFn = (typeof fetch !== 'undefined') ? fetch : null;
      if (!fetchFn) {
        try { fetchFn = require('node-fetch'); } catch (e) { fetchFn = null; }
      }

      if (fetchFn) {
        const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${apiKey}`;
        const body = { prompt: { text: fullPrompt }, temperature: 0.2, maxOutputTokens: 512 };

        const maxRetries = 2;
        let attempt = 0;
        let start = Date.now();
        let success = false;
        let generated = null;
        let lastErr = null;

        while (attempt <= maxRetries) {
          try {
            const resp = await fetchFn(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });

            if (!resp.ok) {
              lastErr = `HTTP ${resp.status}`;
              throw new Error(lastErr);
            }

            const json = await resp.json();
            let candidate = null;
            if (json.candidates && json.candidates.length > 0) candidate = json.candidates[0];
            if (!candidate && json.candidate && json.candidate.length > 0) candidate = json.candidate[0];
            generated = candidate?.output || candidate?.content || json?.output?.[0]?.content?.[0]?.text || null;
            if (generated) {
              success = true;
              const latency = Date.now() - start;
              // Log usage
              try {
                ensureLogDir();
                const record = { ts: new Date().toISOString(), userId, promptLen: fullPrompt.length, success: true, latencyMs: latency, respLen: (generated || '').length };
                fs.appendFileSync(LOG_PATH, JSON.stringify(record) + '\n');
              } catch (e) {
                // ignore logging failures
              }
              // Increment per-user daily chat counter (best-effort)
              try {
                if (userId) await pool.query('UPDATE users SET daily_chat_count = COALESCE(daily_chat_count,0) + 1, daily_chat_count_date = ? WHERE id = ?', [today, userId]);
              } catch (e) {
                console.warn('Failed to increment daily chat count:', e && e.message ? e.message : e);
              }
              return res.status(200).json({ success: true, data: { reply: generated } });
            }
          } catch (err) {
            lastErr = err.message || String(err);
            attempt += 1;
            if (attempt <= maxRetries) {
              const backoff = 300 * Math.pow(2, attempt);
              await sleep(backoff);
              continue;
            }
          }
        }

        // Log failed attempts
        try {
          ensureLogDir();
          const record = { ts: new Date().toISOString(), userId, promptLen: fullPrompt.length, success: false, attempts: attempt + 1, error: lastErr };
          fs.appendFileSync(LOG_PATH, JSON.stringify(record) + '\n');
        } catch (e) {}
      }
    }

    // Fallback simple rule-based helper responses (no external API calls or if Gemini failed).
    const lower = message.toLowerCase();
    let reply = "I'm here to help with practice tips and breath guidance. Try asking 'breath technique' or 'mantra for heart chakra'.";

    if (lower.includes('breath') || lower.includes('inhale') || lower.includes('exhale')) {
      reply = 'Try this paced breathing: inhale for 4, hold 4, exhale 4 (beginners). Match your spine and soften your shoulders.';
    } else if (lower.includes('mantra') || lower.includes('bija') || lower.includes('chant')) {
      reply = 'A simple bija mantra for Heart chakra is "YAM". Sit comfortably, take 3 calming breaths, then chant softly 7 times focusing on the chest center.';
    } else if (lower.includes('posture') || lower.includes('spine')) {
      reply = 'Keep a straight spine by imagining a string lifting the crown of your head; relax the jaw and keep shoulders rolled back gently.';
    } else if (lower.includes('beginner') || lower.includes('start')) {
      reply = 'Start with 5-10 minutes daily. Focus on breath and gentle movement; consistency matters more than session length.';
    }

    // Best-effort increment of daily counter for fallback replies as well
    try {
      if (userId) await pool.query('UPDATE users SET daily_chat_count = COALESCE(daily_chat_count,0) + 1, daily_chat_count_date = ? WHERE id = ?', [today, userId]);
    } catch (e) {
      console.warn('Failed to increment daily chat count for fallback reply:', e && e.message ? e.message : e);
    }

    return res.status(200).json({ success: true, data: { reply } });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ success: false, message: 'Chat failed.' });
  }
};
