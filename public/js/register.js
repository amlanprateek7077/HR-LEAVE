document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const department = document.getElementById('department').value;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, department })
  });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'Register failed'); return; }
  localStorage.setItem('tempToken', data.tempToken);
  document.getElementById('qrBlock').style.display = 'block';
  document.getElementById('qrImg').src = data.totp.qrDataURL;
});

document.getElementById('enableTotpBtn').addEventListener('click', async () => {
  const code = document.getElementById('totpCode').value;
  const tempToken = localStorage.getItem('tempToken');
  const res = await fetch('/api/auth/totp-enable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tempToken },
    body: JSON.stringify({ token: code })
  });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'Enable TOTP failed'); return; }
  alert('TOTP enabled! Please login now.');
  window.location.href = '/index.html';
});
