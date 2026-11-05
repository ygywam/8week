// User-provided key is forwarded for this request only. Never log request bodies or headers.
module.exports = async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'요청 방식을 확인하세요.'});
 const url=process.env.SUPABASE_URL, pub=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!url||!pub||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url.replace(/\/$/,'')))return res.status(503).json({error:'서버 설정이 필요합니다.'});
 const bearer=req.headers.authorization||''; if(!/^Bearer [A-Za-z0-9._-]+$/.test(bearer))return res.status(401).json({error:'로그인이 필요합니다.'});
 try{
  const verify=await fetch(url.replace(/\/$/,'')+'/auth/v1/user',{headers:{apikey:pub,Authorization:bearer}});if(!verify.ok)return res.status(401).json({error:'로그인이 만료되었습니다.'});
  const body=req.body||{}; const key=body.key; const turns=body.turns;
  if(typeof key!=='string'||key.length<10||key.length>300||!/^[\w-]+$/.test(key)||!Array.isArray(turns)||turns.length<1||turns.length>30)return res.status(400).json({error:'요청 내용을 확인하세요.'});
  if(turns.some(x=>!['user','model'].includes(x.role)||typeof x.text!=='string'||!x.text.trim()||x.text.length>10000)||JSON.stringify(turns).length>55000)return res.status(400).json({error:'대화가 너무 깁니다.'});
  const content={systemInstruction:{parts:[{text:'당신은 일반적인 운동 정보를 제공하는 도우미입니다. 한국어로 간결하고 실용적으로 답하세요. 진단이나 개인별 처방을 하지 말고, 통증·부상·기저질환에는 의료 전문가 상담을 권하세요. 사용자의 신체 상태나 성과를 추정하지 마세요.'}]},contents:turns.map(x=>({role:x.role,parts:[{text:x.text}]}))};
  const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(content),signal:AbortSignal.timeout(45000)});
  if(!response.ok)return res.status(response.status===429?429:502).json({error:response.status===429?'사용 한도에 도달했습니다. 잠시 후 다시 시도하세요.':'Gemini 요청에 실패했습니다. API 키와 설정을 확인하세요.'});
  const data=await response.json(); const text=(data.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('').slice(0,10000); if(!text)return res.status(502).json({error:'답변을 받지 못했습니다. 질문을 바꿔 다시 시도하세요.'});return res.status(200).json({text});
 }catch{return res.status(502).json({error:'연결에 실패했습니다. 잠시 후 다시 시도하세요.'})}
}
