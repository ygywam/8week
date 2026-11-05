from playwright.sync_api import sync_playwright
from pathlib import Path
out=Path('/data/eight-week-qa');out.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/local/bin/chromium',args=['--no-sandbox'])
 for width in [320,390,1200]:
  page=browser.new_page(viewport={'width':width,'height':850},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.goto('http://127.0.0.1:8132/',wait_until='networkidle');page.screenshot(path=str(out/f'{width}-auth.png'),full_page=True)
  page.get_by_role('button',name='미리보기 · 저장 안 됨').click();page.locator('input[name=date]').fill('2026-11-05');page.get_by_role('button',name='일정 시작').click();page.get_by_text('1주차',exact=False).first.wait_for();page.screenshot(path=str(out/f'{width}-home.png'),full_page=True)
  page.locator('[data-item="0"]').check();page.get_by_role('button',name='하루 운동 완료').click();assert page.get_by_text('✓ 오늘 완료 · 취소').count()==1
  page.get_by_role('button',name='현재 화면 사용법').click();page.screenshot(path=str(out/f'{width}-guide.png'));assert page.locator('.guide-card').is_visible();page.get_by_role('button',name='닫기',exact=True).click()
  page.get_by_role('button',name='일정',exact=True).click();assert page.locator('.day').count()==7;page.get_by_role('button',name='5주',exact=True).click();assert page.get_by_text('근력 A',exact=True).count()>=1;page.screenshot(path=str(out/f'{width}-schedule.png'),full_page=True)
  page.get_by_role('button',name='기록',exact=True).click();page.locator('input[name=date]').fill('2026-11-05');page.locator('input[name=kg]').fill('80');page.get_by_role('button',name='저장',exact=True).click();page.locator('input[name=date]').fill('2026-11-06');page.locator('input[name=kg]').fill('79.5');page.get_by_role('button',name='저장',exact=True).click();assert page.get_by_text('-0.5 kg').count()==1;page.screenshot(path=str(out/f'{width}-weight.png'),full_page=True)
  page.get_by_role('button',name='채팅',exact=True).click();page.get_by_role('button',name='＋ 새 대화').click();assert page.get_by_text('미리보기에서는 AI 연결을 사용할 수 없습니다.').count()==1;page.screenshot(path=str(out/f'{width}-chat.png'),full_page=True)
  page.get_by_role('button',name='설정',exact=True).click();page.screenshot(path=str(out/f'{width}-settings.png'),full_page=True)
  overflow=page.evaluate('document.documentElement.scrollWidth > window.innerWidth');assert not overflow, f'overflow {width}'
  assert not errors, errors
  print('PASS',width)
  page.close()
 browser.close()
