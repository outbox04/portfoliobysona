(function () {
  const form = document.querySelector('.login-form[action="/register"]');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const submitButton = form ? form.querySelector('.login-submit') : null;
  const matchText = document.getElementById('passwordMatch');

  if (!form || !passwordInput || !confirmInput || !submitButton) return;

  const rules = {
    length: {
      element: document.querySelector('[data-rule="length"]'),
      test: value => value.length >= 8
    },
    uppercase: {
      element: document.querySelector('[data-rule="uppercase"]'),
      test: value => /[A-Z]/.test(value)
    },
    lowercase: {
      element: document.querySelector('[data-rule="lowercase"]'),
      test: value => /[a-z]/.test(value)
    },
    special: {
      element: document.querySelector('[data-rule="special"]'),
      test: value => /[^A-Za-z0-9]/.test(value)
    }
  };

  function setState(element, valid, active) {
    if (!element) return;
    element.classList.toggle('is-valid', Boolean(active && valid));
    element.classList.toggle('is-invalid', Boolean(active && !valid));
  }

  function updatePasswordState() {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const hasTypedPassword = password.length > 0;

    const validity = Object.values(rules).map(rule => {
      const valid = rule.test(password);
      setState(rule.element, valid, hasTypedPassword);
      return valid;
    });

    const passwordStrong = validity.every(Boolean);
    const confirmActive = confirmPassword.length > 0;
    const passwordsMatch = passwordStrong && password === confirmPassword;
    const formReady = passwordStrong && passwordsMatch;

    if (matchText) {
      matchText.textContent = confirmActive
        ? (passwordsMatch ? 'Mật khẩu xác nhận khớp' : 'Mật khẩu xác nhận chưa khớp')
        : '';
      setState(matchText, passwordsMatch, confirmActive);
    }

    form.classList.toggle('is-ready', formReady);
    submitButton.disabled = !formReady;
  }

  passwordInput.addEventListener('input', updatePasswordState);
  confirmInput.addEventListener('input', updatePasswordState);
  updatePasswordState();
})();
