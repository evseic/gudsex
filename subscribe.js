import { subscribe } from '../server.mjs';

export function createSubscribeHandler(subscribeEmail = subscribe) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const reply = (status, body) => res.status(status).json(body);
    if (req.method !== 'POST') return reply(405, { error: 'Method not allowed.' });
    if (req.headers.origin) {
      try {
        if (new URL(req.headers.origin).host !== req.headers.host) return reply(403, { error: 'Request not allowed.' });
      } catch { return reply(403, { error: 'Request not allowed.' }); }
    }
    let body = req.body;
    try {
      if (typeof body === 'string') {
        if (Buffer.byteLength(body) > 2048) return reply(413, { error: 'Request too large.' });
        body = JSON.parse(body);
      }
      if (Buffer.byteLength(JSON.stringify(body ?? {})) > 2048) return reply(413, { error: 'Request too large.' });
    } catch { return reply(400, { error: 'Enter a valid email address.' }); }
    const email = body?.email;
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return reply(400, { error: 'Enter a valid email address.' });
    try {
      return reply(200, await subscribeEmail(email.trim().toLowerCase()));
    } catch (error) {
      return reply(502, { error: error.name === 'TimeoutError' ? 'Connection timed out. Please try again.' : error.message });
    }
  };
}
export default createSubscribeHandler();
