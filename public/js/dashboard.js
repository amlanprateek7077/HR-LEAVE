function token() { return localStorage.getItem('token'); }
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/index.html';
});

document.getElementById('applyBtn').addEventListener('click', async () => {
  const payload = {
    type: document.getElementById('type').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    reason: document.getElementById('reason').value
  };
  const res = await fetch('/api/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) { alert(data.message || 'Failed'); return; }
  alert('Leave applied');
  loadLeaves();
});

async function loadLeaves() {
  const res = await fetch('/api/leaves/my', { headers: { 'Authorization': 'Bearer ' + token() } });
  const data = await res.json();
  const tbody = document.querySelector('#leavesTable tbody');
  tbody.innerHTML = '';
  data.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l.type}</td><td>${new Date(l.startDate).toLocaleDateString()}</td><td>${new Date(l.endDate).toLocaleDateString()}</td><td>${l.status}</td><td>${new Date(l.createdAt).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

loadLeaves();
