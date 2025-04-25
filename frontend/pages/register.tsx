import React, { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'LIBRARIAN'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      alert("Registration successful!");
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="role-select">
            <label>
              <input
                type="radio"
                value="STUDENT"
                checked={role === 'STUDENT'}
                onChange={() => setRole('STUDENT')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="LIBRARIAN"
                checked={role === 'LIBRARIAN'}
                onChange={() => setRole('LIBRARIAN')}
              />
              Librarian
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="signup">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
      <style jsx>{`
        .wrapper {
          background: #f0f0f0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .card {
          background: #fff;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 360px;
          text-align: center;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input {
          padding: 12px 16px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 9999px;
          font-size: 14px;
        }
        .role-select {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .error {
          color: red;
          font-size: 12px;
          margin-bottom: 10px;
        }
        button {
          background: #000;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 9999px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
