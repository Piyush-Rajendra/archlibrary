import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../lib/auth';

interface Fine {
  fineID: number;
  userID: number;
  amount: number;
  status: string;
  reason: string;
}

const FinesPage: React.FC = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? getUserFromToken() : null;
    if (user) {
      setToken(user.token);
      setUserId(user.id);
      setRole(user.role);  // Set role to determine UI behavior
      fetchFines(user.token, user.id);  // Fetch fines for the user
    }
  }, []);

  // Fetch the fines from the backend
  const fetchFines = async (authToken: string, userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/fines/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setFines(data);
    } catch (e) {
      console.error('Error fetching fines:', e);
    }
  };

  const payFine = async (fineId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8080/api/fines/${fineId}/pay`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to pay fine: ${error}`);
      }
  
      alert('Fine paid successfully!');
      fetchFines(token, userId!);  // Refresh fine list after paying
  
    } catch (e: any) {
      console.error('Error paying fine:', e);
      alert(e.message || 'Error while paying fine.');
    }
  };
  

  return (
    <div className="wrapper">
      <div className="card">
        <h1>💸 Fines</h1>
        {fines.length > 0 ? (
          <div className="fine-list">
            {fines.map((fine) => (
              <div key={fine.fineID} className="fine-item">
                <h3>Fine Amount: ${fine.amount}</h3>
                <p><strong>Status:</strong> {fine.status}</p>
                <p><strong>Reason:</strong> {fine.reason}</p>
                {role === "LIBRARIAN" && fine.status === "Unpaid" && (
                  <button onClick={() => payFine(fine.fineID)}>Pay Fine</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No fines found.</p>
        )}
      </div>

      <style jsx>{`
        .wrapper {
          background: #f7f7f7;
          min-height: 100vh;
          padding: 32px;
          display: flex;
          justify-content: center;
        }
        .card {
          background: white;
          padding: 40px;
          max-width: 720px;
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          margin-bottom: 24px;
        }
        .fine-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .fine-item {
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 12px;
          background: #fafafa;
        }
        button {
          padding: 10px 20px;
          border: none;
          background: black;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default FinesPage;
