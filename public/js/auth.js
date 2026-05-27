(function () {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach(toggle => {
    const field = toggle.closest('.password-field');
    const input = field ? field.querySelector('input') : null;

    if (!input) return;

    toggle.addEventListener('click', () => {
      const shouldShow = input.type === 'password';
      input.type = shouldShow ? 'text' : 'password';
      toggle.classList.toggle('is-visible', shouldShow);
      toggle.setAttribute('aria-pressed', String(shouldShow));
      toggle.setAttribute('aria-label', shouldShow ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });
  });
})();
