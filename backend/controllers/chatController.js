// Chat controller — proxies to Gemini if available, otherwise returns rule-based guidance.
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'logs', 'chat_usage.log');
const ensureLogDir = () => {
  try { fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true }); } catch (e) { /* ignore */ }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) return res.status(400).json({ success: false, message: 'Message is required.' });

    const userId = req.user?.id || null;

    // Enforce per-user daily chat quota (20 requests/day).
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (userId) {
        const [uCountRows] = await pool.query('SELECT daily_chat_count, daily_chat_count_date FROM users WHERE id = ?', [userId]);
        if (uCountRows && uCountRows.length > 0) {
          const row = uCountRows[0];
          const storedDate = row.daily_chat_count_date ? row.daily_chat_count_date.toString().slice(0, 10) : null;
          let currentCount = Number(row.daily_chat_count) || 0;
          if (storedDate !== today) {
            currentCount = 0;
            try { await pool.query('UPDATE users SET daily_chat_count = 0, daily_chat_count_date = ? WHERE id = ?', [today, userId]); } catch (e) { /* non-fatal */ }
          }
          if (currentCount >= 20) {
            return res.status(429).json({ success: false, message: 'Daily chat limit reached (20 requests per day). Please try again tomorrow.' });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to enforce daily chat quota:', e && e.message ? e.message : e);
    }

    // Gather user context (best-effort)
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
      console.warn('Failed to read user context for chat:', e.message || e);
    }

    // Build context-aware system prompt
    const contextParts = [];
    if (userLevel) contextParts.push(`User level: ${userLevel}`);
    if (recentFiveDScores.length > 0) contextParts.push(`Recent 5D scores: ${recentFiveDScores.join(', ')}`);
    const contextText = contextParts.length ? `\n\nUser context: ${contextParts.join(' | ')}` : '';

    const system = `You are a knowledgeable Kundalini practice assistant for a meditation and breathwork tracking app. You help users understand and deepen their practice.

TOPICS YOU CAN HELP WITH:
- Breathwork techniques (pranayama, Breath of Fire, Nadi Shodhana, Kapalabhati, etc.)
- Mantras and bija sounds (LAM, VAM, RAM, YAM, HAM, OM, etc.) and their uses
- Chakras (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown) — meanings, benefits, activation methods
- Yoga postures and body alignment for meditation
- Meditation techniques and practice tips
- Practice preparation and recovery
- Understanding 5D scores and practice progress
- General wellness related to meditation practice

GUIDELINES:
- Be helpful, warm, and encouraging. Give practical, actionable advice.
- If a question is clearly unrelated to meditation, yoga, breathwork, chakras, or spiritual practice, politely redirect to what you can help with.
- Do NOT provide medical, therapeutic, legal, or psychological advice. If someone describes a health condition, suggest they consult a professional.
- Keep replies concise but informative (under 200 words).${contextText}`;

    // Attempt Gemini call with retries
    const apiKey = process.env.GEMINI_API_KEY || process.env.GENERATIVE_AI_KEY;
    if (apiKey) {
      let fetchFn = (typeof fetch !== 'undefined') ? fetch : null;
      if (!fetchFn) {
        try { fetchFn = require('node-fetch'); } catch (e) { fetchFn = null; }
      }

      if (fetchFn) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const body = {
          contents: [{ parts: [{ text: `${system}\n\nUser: ${message}` }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 }
        };

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
            // Gemini 1.5 response format
            generated = json?.candidates?.[0]?.content?.parts?.[0]?.text || null;

            if (generated) {
              success = true;
              const latency = Date.now() - start;
              try {
                ensureLogDir();
                fs.appendFileSync(LOG_PATH, JSON.stringify({ ts: new Date().toISOString(), userId, promptLen: `${system}\n\nUser: ${message}`.length, success: true, latencyMs: latency, respLen: generated.length }) + '\n');
              } catch (e) { /* ignore */ }
              try {
                if (userId) await pool.query('UPDATE users SET daily_chat_count = COALESCE(daily_chat_count,0) + 1, daily_chat_count_date = ? WHERE id = ?', [today, userId]);
              } catch (e) { /* non-fatal */ }
              return res.status(200).json({ success: true, data: { reply: generated } });
            }
          } catch (err) {
            lastErr = err.message || String(err);
            attempt += 1;
            if (attempt <= maxRetries) {
              await sleep(300 * Math.pow(2, attempt));
              continue;
            }
          }
        }

        try {
          ensureLogDir();
          fs.appendFileSync(LOG_PATH, JSON.stringify({ ts: new Date().toISOString(), userId, promptLen: `${system}\n\nUser: ${message}`.length, success: false, attempts: attempt + 1, error: lastErr }) + '\n');
        } catch (e) { /* ignore */ }
      }
    }

    // Fallback: rule-based responses when Gemini is unavailable
    const lower = message.toLowerCase();
    let reply = "I'm here to help with breathwork, mantra, chakra, and meditation guidance. What would you like to know?";

    // Breathwork
    if (lower.includes('breath') || lower.includes('inhale') || lower.includes('exhale') || lower.includes('pranayama') || lower.includes('breathwork')) {
      const tips = [
        'Try Nadi Shodhana (alternate nostril breathing): close the right nostril, inhale left for 4 counts, close left, exhale right for 4. Repeat 5-10 rounds to balance energy.',
        'Start with box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Great for calming the mind before meditation.',
        'Kapalabhati: exhale sharply through the nose while pulling the belly in, then let the inhale happen naturally. Start with 15-20 pumps. Avoid if pregnant or have high blood pressure.',
        'Beginner tip: just focus on slow, even breaths for 5 minutes. Don\'t force anything — let the breath flow naturally and gently deepen over time.',
        'For deeper meditation, try 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8. It activates the parasympathetic nervous system.'
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    // Mantras
    else if (lower.includes('mantra') || lower.includes('bija') || lower.includes('chant') || lower.includes('sound')) {
      const tips = [
        'LAM is the Root chakra bija mantra. Chanting it grounds energy and builds a sense of safety. Try 7 repetitions while focusing on the base of the spine.',
        'For the Heart chakra, use YAM. Chant softly with eyes closed, visualizing green light at your chest center. This opens compassion and emotional balance.',
        'RAM is the Solar Plexus bija. Chant it to build confidence and personal power. Focus on the area just above the navel.',
        'VAM connects to the Sacral chakra. Use it for creativity and emotional flow. Sit comfortably, breathe deeply, and repeat 7-10 times.',
        'HAM is the Throat chakra mantra. Great for communication and self-expression. Chant while gently pressing the throat area.',
        'OM is universal — it resonates with all chakras and calms the mind instantly. End any practice with 3 OM chants.',
        'For a full chakra sequence, chant LAM → VAM → RAM → YAM → HAM → OM → OM, spending about 30 seconds on each.'
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    // Chakras
    else if (lower.includes('chakra') || lower.includes('root') || lower.includes('sacral') || lower.includes('solar') || lower.includes('heart') || lower.includes('throat') || lower.includes('third eye') || lower.includes('crown') || lower.includes('muladhara') || lower.includes('svadhisthana') || lower.includes('manipura') || lower.includes('anahata') || lower.includes('vishuddha') || lower.includes('ajna') || lower.includes('sahasrara')) {
      const tips = [
        'The 7 main chakras run along your spine: Root (base) → Sacral (below navel) → Solar Plexus (above navel) → Heart (chest) → Throat → Third Eye (forehead) → Crown (top of head). Each governs different aspects of well-being.',
        'Root chakra (Muladhara): color red, mantra LAM. It represents safety and grounding. If you feel anxious or unsteady, focus here with root-focused meditation.',
        'Heart chakra (Anahata): color green, mantra YAM. It governs love and compassion. Heart-opening breaths and gentle backbends activate it.',
        'Third Eye (Ajna): color indigo, mantra OM. It relates to intuition and inner vision. Practice focused gazing (trataka) or deep meditation to stimulate it.',
        'Solar Plexus (Manipura): color yellow, mantra RAM. It\'s your center of willpower and confidence. Strong core engagement during practice helps activate it.',
        'Crown chakra (Sahasrara): color violet/white, mantra OM. It connects to higher awareness. Silent meditation with spine erect is the best way to open it.'
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    // Posture
    else if (lower.includes('posture') || lower.includes('spine') || lower.includes('sit') || lower.includes('seat') || lower.includes('asana')) {
      const tips = [
        'Sit with a straight spine — imagine a string pulling the crown of your head upward. Keep shoulders relaxed and rolled back gently.',
        'Use a cushion or folded blanket to elevate your hips above your knees. This naturally straightens the spine and makes sitting more comfortable.',
        'If cross-legged is uncomfortable, try sitting on a chair with feet flat on the floor. The key is a straight spine and relaxed body.',
        'Before meditation, do 2-3 gentle spinal rolls to release tension. Then settle into stillness with your spine tall.'
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    // Practice / general
    else if (lower.includes('practice') || lower.includes('meditat') || lower.includes('session') || lower.includes('kundalini') || lower.includes('yoga') || lower.includes('start') || lower.includes('begin') || lower.includes('routine') || lower.includes('daily') || lower.includes('consistency') || lower.includes('progress') || lower.includes('score') || lower.includes('5d') || lower.includes('five') || lower.includes('level') || lower.includes('beginner') || lower.includes('advanced') || lower.includes('program') || lower.includes('day')) {
      const tips = [
        'Start with 5-10 minutes daily. Consistency matters more than length — a short daily practice builds stronger energy than occasional long sessions.',
        'Track your progress with 5D scores (physical, prana, mind, emotion, spiritual). Over time, you\'ll see which dimensions need more attention.',
        'Before each session, take 3 deep breaths and set an intention. After practice, notice how you feel compared to before — that awareness is part of the journey.',
        'A good daily routine: morning breathwork (5 min) → mantra meditation (10 min) → brief journaling. Adjust times as you grow comfortable.',
        'Rest days are important. If a program day feels too intense, take a gentler practice or simply do breath awareness.',
        'The beginner 14-day program starts with Root and Sacral chakras. Don\'t rush — each chakra needs time to open and integrate.',
        'Your overall 5D score reflects balance across all five dimensions. A score above 70 means good integration; below 50 suggests an area to focus on.'
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    // Fallback
    else {
      const fallbacks = [
        'I can help with breathwork techniques, mantra guidance, chakra information, posture tips, and general practice advice. What interests you?',
        'Could you tell me more about what you\'re looking for? I can help with breath techniques, mantras, chakra meanings, or meditation guidance.',
        'Great question! I specialize in Kundalini practice topics — breathwork, mantras, chakras, and meditation. Let me know what area you\'d like to explore.'
      ];
      reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Increment daily counter
    try {
      if (userId) await pool.query('UPDATE users SET daily_chat_count = COALESCE(daily_chat_count,0) + 1, daily_chat_count_date = ? WHERE id = ?', [today, userId]);
    } catch (e) { /* non-fatal */ }

    return res.status(200).json({ success: true, data: { reply } });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ success: false, message: 'Chat failed.' });
  }
};
