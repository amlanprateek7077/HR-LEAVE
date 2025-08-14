function token() { return localStorage.getItem('token'); }

async function loadPending() {
  const res = await fetch('/api/admin/leaves/pending', { headers: { 'Authorization': 'Bearer ' + token() } });
  const data = await res.json();
  const tbody = document.querySelector('#pendingTable tbody');
  tbody.innerHTML = '';
  data.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l.user?.name || ''}</td>
      <td>${l.user?.department || ''}</td>
      <td>${l.type}</td>
      <td>${new Date(l.startDate).toLocaleDateString()}</td>
      <td>${new Date(l.endDate).toLocaleDateString()}</td>
      <td>${l.reason || ''}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="approve('${l._id}')">Approve</button>
        <button class="btn btn-sm btn-danger" onclick="reject('${l._id}')">Reject</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function approve(id) {
  const res = await fetch('/api/admin/leaves/' + id + '/approve', {
    method: 'PATCH',
    headers: { 'Authorization': 'Bearer ' + token() }
  });
  if (res.ok) { loadPending(); } else { alert('Failed'); }
}

async function reject(id) {
  const comments = prompt('Reason (optional):') || '';
  const res = await fetch('/api/admin/leaves/' + id + '/reject', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() },
    body: JSON.stringify({ comments })
  });
  if (res.ok) { loadPending(); } else { alert('Failed'); }
}

loadPending();
