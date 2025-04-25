import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
  
      localStorage.setItem('token', data.token);
  
      console.log("JWT Token:", data);
      router.push('/dashboard');
  
    } catch (err: any) {
      setError(err.message || 'An error occurred while logging in.');
    } finally {
      setIsLoading(false);
    }
  };
  ;

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
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
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#">Forgot password</a>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="signup">
          Don't have an account? <a href="/signup">Sign Up</a>
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
        h1 {
          margin-bottom: 24px;
          font-size: 24px;
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input[type="email"],
        input[type="password"] {
          padding: 12px 16px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 9999px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type="email"]:focus,
        input[type="password"]:focus {
          border-color: #888;
        }
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #666;
          margin-bottom: 24px;
        }
        .options a {
          color: #0070f3;
          text-decoration: none;
        }
        .options a:hover {
          text-decoration: underline;
        }
        button {
          background: #000;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 9999px;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .signup {
          margin-top: 24px;
          font-size: 14px;
          color: #555;
        }
        .signup a {
          color: #000;
          text-decoration: none;
          font-weight: bold;
        }
        .signup a:hover {
          text-decoration: underline;
        }
        .error {
          color: #e00;
          font-size: 12px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
