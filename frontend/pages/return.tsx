import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../lib/auth';

interface ReturnPageProps {
  refreshBorrowedBooks: () => void;
}

interface BorrowedBookRaw {
  borrowedID: number;
  bookID: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
}

interface Book {
  bookID: number;
  title: string;
  author: string;
  genre: string;
}

interface BorrowedBook extends BorrowedBookRaw {
  title: string;
  author: string;
  genre: string;
}

const ReturnPage: React.FC<ReturnPageProps> = ({ refreshBorrowedBooks }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? getUserFromToken() : null;
    if (user) {
      setToken(user.token);
      setUserId(user.id);
      fetchActiveBorrowedBooks(user.token, user.id);
    }
  }, []);

  const fetchActiveBorrowedBooks = async (authToken: string, userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/borrowed/user/${userId}/details`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setBorrowedBooks(data);
    } catch (e) {
      console.error('Error fetching borrowed books:', e);
    }
  };
  

  const returnBook = async (bookId: number) => {
    if (!token || !userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/library/return?userId=${userId}&bookId=${bookId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to return book: ${error}`);
      }
  
      alert('Book returned successfully!');
  
      await fetchActiveBorrowedBooks(token, userId);
      refreshBorrowedBooks();
  
    } catch (e: any) {
      console.error('Error while returning book:', e);
      alert(e.message || 'Error while returning book.');
    }
  };
  

  return (
    <div className="wrapper">
      <div className="card">
        <h1>📦 Return Borrowed Books</h1>
        {borrowedBooks.length > 0 ? (
          <div className="book-list">
            {borrowedBooks.map((book) => (
              <div key={book.borrowedID} className="book-item">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Due Date:</strong> {book.dueDate}</p>
                {book.returnDate ? (
                  <p><strong>Returned:</strong> {book.returnDate}</p>
                ) : (
                  <button onClick={() => returnBook(book.bookID)}>Return</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No borrowed books found.</p>
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
        .book-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .book-item {
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

export default ReturnPage;
