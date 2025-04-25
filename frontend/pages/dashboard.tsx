import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFromToken } from '../lib/auth';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string; token: string } | null>(null);

  useEffect(() => {
    const userData = getUserFromToken();
    if (!userData) {
      alert("Not authorized. Please login.");
      router.push('/login');
    } else {
      setUser(userData);
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Welcome to ArchLibrary</h1>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <div className="menu">
              {user.role !== 'LIBRARIAN' ? (
                <>
                  <a href="/books">📚 Search Books</a>
                  <a href="/profile">👤 Your Profile</a>
                  <a href="/borrowed">📦 Borrowed Books</a>
                  <a href="/return">🔁 Return Book</a>
                  <a href="/fines">💸 View Fines</a>
                </>
              ) : (
                <>
                  <h3>Admin Panel</h3>
                  <a href="/admin/fines">💸 Manage Fines</a>
                  <a href="/admin/add-book">➕ Add New Book</a>
                  <a href="/admin/update-book">✏️ Update Book</a>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
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
          max-width: 400px;
          text-align: center;
        }
        .menu {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        a {
          text-decoration: none;
          background: #000;
          color: white;
          padding: 10px;
          border-radius: 12px;
          transition: 0.3s;
        }
        a:hover {
          background: #333;
        }
        h3 {
          margin-bottom: 16px;
          font-size: 1.3rem;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
