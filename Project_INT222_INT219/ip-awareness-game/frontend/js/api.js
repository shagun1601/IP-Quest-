const API_URL = 'http://localhost:5001/api';

const api = {
  // Setup headers with token
  getHeaders() {
    const token = localStorage.getItem('ipq_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  },

  // Auth
  async register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async updateDetails(data) {
    const res = await fetch(`${API_URL}/auth/updatedetails`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Game Progress
  async saveProgress(progressData) {
    const res = await fetch(`${API_URL}/game/progress`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(progressData)
    });
    return res.json();
  },

  async getProgress() {
    const res = await fetch(`${API_URL}/game/progress`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(limit = 10) {
    const res = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
    return res.json();
  },

  // Delete account
  async deleteAccount() {
    const res = await fetch(`${API_URL}/auth/deleteaccount`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  }
};
