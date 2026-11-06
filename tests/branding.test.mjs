import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';

const read = p => readFile(new URL(`../public/${p}`, import.meta.url), 'utf8');
test('intro is scoped to the first portrait mobile visit and does not block the app', async () => {
  const html = await read('index.html');
  assert.match(html, /8week-first-visit-intro-v1/);
  assert.match(html, /max-width: 600px/);
  assert.match(html, /orientation: portrait/);
  assert.match(html, /pointer-events:none/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /splash-8-v1\.svg/);
  assert.match(html, /1000/);
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
