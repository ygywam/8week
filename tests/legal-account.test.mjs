import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('notices contain confirmed operator, Mumbai and source links',async()=>{
 const {notices}=await import('../public/legal.mjs');
 assert.match(notices.privacy.body,/뭄바이/);
 assert.match(notices.privacy.body,/무료 요금제/);
 assert.match(notices.support.body,/instagram\.com\/record_tuner\//);
 assert.match(notices.privacy.body,/2026년 11월 6일/);
});
test('account deletion SQL binds deletion to authenticated uid',async()=>{
 const sql=await readFile(new URL('../supabase/migrations/20261106_delete_own_account.sql',import.meta.url),'utf8');
 assert.match(sql,/security definer/i);assert.match(sql,/set search_path\s*=\s*''/i);
 assert.match(sql,/caller_id uuid := auth\.uid\(\)/i);
 assert.match(sql,/delete from auth\.users where id = caller_id/i);
 assert.match(sql,/revoke all on function public\.delete_own_account\(\) from public, anon, authenticated/i);
 assert.match(sql,/grant execute on function public\.delete_own_account\(\) to authenticated/i);
});
