import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
try { for (const line of (await readFile(resolve(root,'.env.local'),'utf8')).split('\n')) { const at = line.indexOf('='); if(at > 0 && !process.env[line.slice(0,at)]) process.env[line.slice(0,at)] = line.slice(at+1).trim(); } } catch {}
const env = process.env;
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
function json(res,status,data) {res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const attempts = new Map();
export async function subscribe(email, fetcher = fetch) {
  if(!env.OMNISEND_API_KEY) throw new Error('Email collection is not configured. Please try again later.');
  const now = new Date().toISOString();
  const contact = await fetcher('https://api.omnisend.com/v3/contacts', {method:'POST',signal:AbortSignal.timeout(12000),headers:{'Content-Type':'application/json','X-API-KEY':env.OMNISEND_API_KEY},body:JSON.stringify({email,status:'subscribed',statusDate:now,tags:['welcome','newsletter','website_signup'],identifiers:[{type:'email',id:email,channels:{email:{status:'subscribed',statusDate:now}}}]})});
  if(!contact.ok) throw new Error('Your email was saved, but subscription could not be completed. Please try again.');
  // The optional database mirror must not block a confirmed Omnisend subscription.
  try {
  const db = await fetcher(`${env.SUPABASE_URL}/rest/v1/subscribers`, { method:'POST',signal:AbortSignal.timeout(12000),headers:{'Content-Type':'application/json',apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,Prefer:'return=minimal'},body:JSON.stringify({email}) });
  if(!db.ok) {const error = await db.json().catch(() => ({}));if(db.status !== 409 || error.code !== '23505') throw new Error('Unable to save your email. Please try again.');}
  } catch { console.warn('Subscriber database mirror unavailable; Omnisend signup confirmed.'); }
  return {success:true};
}
export function createApplication(fetcher = fetch) { return createServer(async (req,res) => {
  if(req.url === '/api/subscribe') {
    if(req.method !== 'POST') return json(res,405,{error:'Method not allowed.'});
    const origin = req.headers.origin;
    if(origin) { try { if(new URL(origin).host !== req.headers.host) return json(res,403,{error:'Request not allowed.'}); } catch { return json(res,403,{error:'Request not allowed.'}); } }
    const address = req.socket.remoteAddress;const now = Date.now();const record = attempts.get(address) || {count:0,start:now};
    if(now-record.start > 60000) {record.count = 0;record.start = now;} record.count++;attempts.set(address,record);
    if(attempts.size > 10000) for(const [key,value] of attempts) if(now-value.start>60000) attempts.delete(key);
    if(record.count > 12) return json(res,429,{error:'Please wait a minute before trying again.'});
    try {
      let body = '';for await(const chunk of req) {body += chunk;if(body.length > 2048) return json(res,413,{error:'Request too large.'});}
      const {email} = JSON.parse(body);if(typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return json(res,400,{error:'Enter a valid email address.'});
      return json(res,200,await subscribe(email.trim().toLowerCase(), fetcher));
    } catch(error) {return json(res,502,{error:error.name === 'TimeoutError' ? 'Connection timed out. Please try again.' : error.message});}
  }
  if(req.url?.startsWith('/api/')) return json(res,404,{error:'Not found.'});
  if(!['GET','HEAD'].includes(req.method)) return json(res,405,{error:'Method not allowed.'});
  try {
    const directory = resolve(root,'dist');const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = resolve(directory,`.${pathname}`);if(file !== directory && !file.startsWith(directory+'/')) return json(res,403,{error:'Forbidden.'});
    if(file === directory) file = resolve(directory,'index.html');
    const info = await stat(file);if(!info.isFile()) return json(res,404,{error:'Not found.'});
    const bytes = await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600','X-Content-Type-Options':'nosniff'});res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { json(res,404,{error:'Not found.'}); }
}); }
export const server = createApplication();
if(process.argv[1] === fileURLToPath(import.meta.url)) {const port = Number(env.PORT || 3001);server.listen(port,env.HOST || '127.0.0.1',() => console.log(`GUDSEX server: http://localhost:${port}`));}
