(() => {
  const splash = document.getElementById('first-visit-splash');
  if (!splash) return;
  const key = '8week-splash-do-not-show-v1';
  try {
    if (localStorage.getItem(key) === 'yes') { splash.remove(); return; }
  } catch (_) {
    // With unavailable storage, default to showing the introduction.
  }
  const confirm = document.getElementById('splash-confirm');
  const checkbox = document.getElementById('splash-hide-next');
  const error = document.getElementById('splash-error');
  splash.addEventListener('cancel', event => event.preventDefault());
  confirm.addEventListener('click', () => {
    if (checkbox.checked) {
      try { localStorage.setItem(key, 'yes'); }
      catch (_) {
        error.hidden = false;
        error.textContent = '설정을 저장하지 못했습니다. 체크를 해제하면 계속할 수 있습니다.';
        return;
      }
    }
    splash.close();
    splash.remove();
  });
  checkbox.addEventListener('change', () => { error.hidden = true; error.textContent = ''; });
  splash.querySelector('img').src = '/splash-8-v1.svg';
  try {
    splash.showModal();
    confirm.focus();
  } catch (_) {
    // Do not prevent access to the app if the browser cannot open a dialog.
    splash.remove();
  }
})();
