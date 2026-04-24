async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    toast('Please enter email and password', 't-err');
    return;
  }

  try {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('ipq_token', res.token);
      window.location.href = 'dashboard.html';
    } else {
      toast(res.error || 'Login failed', 't-err');
    }
  } catch (err) {
    toast('Server error', 't-err');
  }
}

async function handleRegister() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const school = document.getElementById('school').value;
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    toast('Please fill all required fields', 't-err');
    return;
  }

  try {
    const res = await api.register({ name, email, school, password });
    if (res.success) {
      localStorage.setItem('ipq_token', res.token);
      window.location.href = 'dashboard.html';
    } else {
      toast(res.error || 'Registration failed', 't-err');
    }
  } catch (err) {
    toast('Server error', 't-err');
  }
}
