// api/push-and-deploy.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub Personal Access Token
  const REPO = 'SoulFlameAdmin/bbqcorner';
  const VERCEL_HOOK = process.env.VERCEL_DEPLOY_HOOK_URL;

  try {
    // 1. Малък commit в GitHub, за да стартираме Action-а
    const commitMsg = `Auto update from index5.html ${new Date().toISOString()}`;
    const apiUrl = `https://api.github.com/repos/${REPO}/dispatches`;

    const gitRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        event_type: 'auto_update',
        client_payload: { msg: commitMsg }
      })
    });

    if (!gitRes.ok) throw new Error('GitHub push failed: ' + gitRes.status);

    // 2. След това извикваме Vercel hook за моментален билд
    const vercelRes = await fetch(VERCEL_HOOK, { method: 'POST' });
    if (!vercelRes.ok) throw new Error('Vercel deploy failed: ' + vercelRes.status);

    res.status(200).json({ ok: true, message: '✅ GitHub & Vercel обновени!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
