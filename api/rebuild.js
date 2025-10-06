// api/rebuild.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!hook) {
      return res.status(500).json({ ok: false, error: 'Missing VERCEL_DEPLOY_HOOK_URL env' });
    }

    // (по избор) минимална анти-спам защита чрез secret key в заглавие
    const clientKey = req.headers['x-rebuild-key'];
    const expected = process.env.REBUILD_CLIENT_KEY || '';
    if (expected && clientKey !== expected) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const r = await fetch(hook, { method: 'POST' });
    if (!r.ok) {
      const txt = await r.text().catch(()=> '');
      return res.status(500).json({ ok: false, error: `Hook failed ${r.status}: ${txt}` });
    }

    return res.status(200).json({ ok: true, message: 'Deploy triggered' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
