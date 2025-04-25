import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserFromToken } from '../../lib/auth';

interface Fine {
  fineID: number;
  userID: number;
  amount: number;
  status: string;
  reason: string;
}

const ManageFines = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string; token: string } | null>(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const userData = getUserFromToken();
        if (!userData || userData.role !== 'LIBRARIAN') {
          alert('Unauthorized');
          return;
        }
        setUser(userData);
        const res = await axios.get<Fine[]>('http://localhost:8080/api/fines', {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setFines(res.data);
      } catch (error) {
        console.error('Error fetching fines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  const handlePayFine = async (fineId: number) => {
    try {
      await axios.put(`http://localhost:8080/api/fines/${fineId}/pay`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert('Fine marked as paid!');
      // Refresh list
      window.location.reload();
    } catch (error) {
      console.error('Error paying fine:', error);
      alert('Failed to pay fine.');
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Manage Fines</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fine ID</th>
                <th>User ID</th>
                <th>Amount ($)</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.fineID} className={fine.status === 'Paid' ? 'paid' : ''}>
                  <td>{fine.fineID}</td>
                  <td>{fine.userID}</td>
                  <td>{fine.amount.toFixed(2)}</td>
                  <td>{fine.status}</td>
                  <td>{fine.reason}</td>
                  <td>
                    {fine.status === 'Unpaid' ? (
                      <button onClick={() => handlePayFine(fine.fineID)}>
                        Pay Fine
                      </button>
                    ) : (
                      <span>Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .wrapper {
          background: #f0f0f0;
          min-height: 100vh;
          padding: 32px;
        }
        .card {
          background: white;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-width: 1200px;
          margin: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
        }
        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: center;
        }
        tr.paid {
          background-color: #e0e0e0;
          color: #555;
        }
        button {
          background: #000;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default ManageFines;
