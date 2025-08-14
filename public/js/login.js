async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'Login failed'); return; }
  if (data.requiresTOTP) {
    localStorage.setItem('tempToken', data.tempToken);
    document.getElementById('totpSection').style.display = 'block';
  } else {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = data.user.role === 'admin' ? '/admin.html' : '/dashboard.html';
  }
}

async function loginTotp() {
  const totp = document.getElementById('totp').value;
  const tempToken = localStorage.getItem('tempToken');
  const res = await fetch('/api/auth/login/totp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tempToken },
    body: JSON.stringify({ token: totp })
  });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'TOTP failed'); return; }
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.location.href = data.user.role === 'admin' ? '/admin.html' : '/dashboard.html';
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const totpSectionShown = document.getElementById('totpSection').style.display === 'block';
  if (totpSectionShown) await loginTotp();
  else await login();
});
