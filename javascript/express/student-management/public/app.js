let token = '';
const output = document.querySelector('#students-output');
const status = document.querySelector('#auth-status');

async function requestJson(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, { ...options, headers });
    const data = response.status === 204 ? {} : await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
}

function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const data = await requestJson('/api/auth/login', { method: 'POST', body: JSON.stringify(formData(event.target)) });
        token = data.token;
        status.textContent = `Logged in as ${data.user.name} (${data.user.role}). JWT is held in memory.`;
    } catch (error) { status.textContent = error.message; }
});

document.querySelector('#register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const data = await requestJson('/api/auth/register', { method: 'POST', body: JSON.stringify(formData(event.target)) });
        status.textContent = `Registered ${data.user.email}. Log in to receive a JWT.`;
    } catch (error) { status.textContent = error.message; }
});

document.querySelector('#student-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const data = await requestJson('/api/students', { method: 'POST', body: JSON.stringify(formData(event.target)) });
        output.textContent = JSON.stringify(data, null, 2);
        event.target.reset();
    } catch (error) { output.textContent = error.message; }
});

document.querySelector('#load-students').addEventListener('click', async () => {
    try { output.textContent = JSON.stringify(await requestJson('/api/students'), null, 2); }
    catch (error) { output.textContent = error.message; }
});

document.querySelector('#save-cookie').addEventListener('click', async () => {
    await requestJson('/api/preferences', { method: 'POST', body: JSON.stringify({ theme: 'dark' }) });
    document.querySelector('#cookie-output').textContent = 'Dark theme cookie saved.';
});
document.querySelector('#read-cookie').addEventListener('click', async () => {
    document.querySelector('#cookie-output').textContent = JSON.stringify(await requestJson('/api/preferences'), null, 2);
});
document.querySelector('#delete-cookie').addEventListener('click', async () => {
    document.querySelector('#cookie-output').textContent = JSON.stringify(await requestJson('/api/preferences', { method: 'DELETE' }), null, 2);
});
document.querySelector('#logout').addEventListener('click', async () => {
    await requestJson('/api/auth/logout', { method: 'POST' });
    token = '';
    status.textContent = 'Session logged out and JWT cleared.';
});