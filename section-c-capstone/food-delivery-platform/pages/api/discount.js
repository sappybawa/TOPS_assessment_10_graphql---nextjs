// Mock "server" that validates discount codes (the async call used by the Redux thunk).
const CODES = { SAVE10: 10, FOOD20: 20 };

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const code = String(req.body?.code || '').trim().toUpperCase();
  const percent = CODES[code];
  // small delay so the loading state is visible
  setTimeout(() => {
    if (!percent) return res.status(400).json({ message: `"${code}" is not a valid code` });
    res.status(200).json({ code, percent });
  }, 600);
}
