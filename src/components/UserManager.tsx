'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

const emptyForm = {
  email: '',
  login: '',
  role: 'CLIENT' as 'ADMIN' | 'CLIENT',
  password: '',
  avatarUrl: '', 
};

export function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit() {
    try {
      if (!form.email.trim()) {
        alert('Введите email');
        return;
      }

      if (!form.login.trim()) {
        alert('Введите login');
        return;
      }

      if (!editingId && !form.password.trim()) {
        alert('Введите пароль');
        return;
      }

      if (editingId) {
        await api.updateUser(editingId, {
          email: form.email,
          login: form.login,
          role: form.role,
          avatarUrl: form.avatarUrl,
          ...(form.password.trim() ? { password: form.password } : {}),
        });
      } else {
        await api.createUser({
          email: form.email,
          login: form.login,
          role: form.role,
          password: form.password,
          avatarUrl: form.avatarUrl,
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'User save failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Удалить пользователя?')) return;

    try {
      await api.deleteUser(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="stack">
      <div className="card stack">
        <h3>{editingId ? 'Edit user' : 'Create user'}</h3>

        <div className="form-grid">
          <label className="field">
            <span>Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Login</span>
            <input
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Role</span>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as 'ADMIN' | 'CLIENT' })
              }
            >
              <option value="CLIENT">CLIENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

<label className="field">
  <span>Avatar URL</span>
  <input
    value={form.avatarUrl}
    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
    placeholder="https://..."
  />
</label>
        </div>

        <div className="actions">
          <button className="btn" onClick={submit}>
            {editingId ? 'Save' : 'Create'}
          </button>

          <button
            className="btn secondary"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Users</h3>

        {loading ? <p>Loading...</p> : null}
        {error ? <p>{error}</p> : null}

<div className="table-wrap">
  <table className="table">
    <thead>
      <tr>
        {/* Добавили заголовок */}
        <th>Аватар</th> 
        <th>Login</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          {/* Добавили ячейку с самой картинкой */}
<td>
  {user.avatarUrl ? (
    <img src={user.avatarUrl} alt="ava" className="avatar-small" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
  ) : (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee' }} />
  )}
</td>
          <td>{user.login || '—'}</td>
          <td>{user.email}</td>
          <td>
            <span className="badge">{user.role}</span>
          </td>
          <td>
            <div className="actions">
              <button
                className="btn secondary"
                onClick={() => {
                  setEditingId(user.id);
                  setForm({
                    email: user.email,
                    login: user.login || '',
                    role: user.role,
                    password: '',
                    avatarUrl: user.avatarUrl || '', // НЕ ЗАБУДЬ добавить это сюда, чтобы при редактировании ссылка подтягивалась в форму
                  });
                }}
              >
                Edit
              </button>

              <button
                className="btn danger"
                onClick={() => void remove(user.id)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}

              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4}>No users</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}