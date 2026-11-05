import {cp, mkdir, writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true}); await cp('public','dist',{recursive:true});
const url=process.env.SUPABASE_URL||'';const key=process.env.SUPABASE_PUBLISHABLE_KEY||'';
if(url&&!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) throw Error('Invalid SUPABASE_URL');
await writeFile('dist/config.js',`window.APP_CONFIG = ${JSON.stringify({url:url.replace(/\/$/,''),key}).replace(/</g,'\\u003c')};\n`);
console.log('Static build created.');
