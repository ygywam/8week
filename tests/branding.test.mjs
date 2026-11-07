import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';

const read = p => readFile(new URL(`../public/${p}`, import.meta.url), 'utf8');
test('intro requires confirmation and only hides after explicit choice', async () => {
  const html = await read('index.html');
  const script = await read('splash.js');
  const css = await read('splash.css');
  assert.match(html, /src="\/splash\.js"/);
  assert.doesNotMatch(html, /<script\s*>/);
  assert.match(html, /id="splash-hide-next"/);
  assert.match(html, /다시 안 보기/);
  assert.match(html, /id="splash-confirm">확인/);
  assert.match(script, /8week-splash-do-not-show-v1/);
  assert.match(script, /checkbox\.checked/);
  assert.match(script, /splash\.showModal\(\)/);
  assert.doesNotMatch(script, /matchMedia|setTimeout/);
  assert.match(script, /splash-8-v1\.svg/);
  assert.match(css, /100dvh/);
  await access(new URL('../public/splash-8-v1.svg', import.meta.url));
});
test('manifest icons exist and use versioned paths', async () => {
  const manifest = JSON.parse(await read('manifest-v2.webmanifest'));
  assert.equal(manifest.icons.length, 3);
  assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'));
  for (const icon of manifest.icons) {
    assert.match(icon.src, /^\/icon-v2-/);
    await access(new URL(`../public${icon.src}`, import.meta.url));
  }
  const html = await read('index.html');
  for (const file of ['icon-v2.svg', 'apple-touch-icon-v2.png', 'favicon-v2-32.png']) {
    assert.ok(html.includes(file));
    await access(new URL(`../public/${file}`, import.meta.url));
  }
});
