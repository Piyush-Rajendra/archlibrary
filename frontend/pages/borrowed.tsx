import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../lib/auth';

interface BorrowedBook {
  borrowedID: number;
  bookID: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  title: string;
  author: string;
}

const BorrowedBooksPage: React.FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? getUserFromToken() : null;
    if (user) {
      setToken(user.token);
      setUserId(user.id);
      fetchBorrowedBooks(user.token, user.id);
    }
  }, []);

  const fetchBorrowedBooks = async (authToken: string, userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/borrowed/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const borrowedData = await res.json();

      // Fetch the details of the books for each borrowed entry
      const booksWithDetails = await Promise.all(
        borrowedData.map(async (borrowed: any) => {
          const bookRes = await fetch(`http://localhost:8080/api/books/${borrowed.bookID}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const book = await bookRes.json();

          return {
            borrowedID: borrowed.borrowedID,
            bookID: borrowed.bookID,
            borrowDate: borrowed.borrowDate,
            dueDate: borrowed.dueDate,
            returnDate: borrowed.returnDate,
            title: book.title,
            author: book.author,
          };
        })
      );

      setBorrowedBooks(booksWithDetails);
    } catch (e) {
      console.error('Error fetching borrowed books:', e);
    }
  };

  const handleReturnBook = async (bookID: number) => {
    if (!token || !userId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/library/return?userId=${userId}&bookId=${bookID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.ok) {
        alert('Book returned successfully!');
        fetchBorrowedBooks(token, userId); // Refresh the borrowed books list
      } else {
        const error = await res.text();
        alert(`Failed to return book: ${error}`);
      }
    } catch (e) {
      alert('Error while returning book.');
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>📚 Borrowed Books</h1>
        {borrowedBooks.length > 0 ? (
          <div className="book-list">
            {borrowedBooks.map((book) => (
              <div key={book.borrowedID} className="book-item">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Borrow Date:</strong> {book.borrowDate}</p>
                <p><strong>Due Date:</strong> {book.dueDate}</p>
                <p><strong>Return Date:</strong> {book.returnDate ? book.returnDate : 'Not Returned'}</p>
                {/* Return Button - Show only if the book is not yet returned */}
                {book.returnDate === null && (
                  <button onClick={() => handleReturnBook(book.bookID)}>Return</button>
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

export default BorrowedBooksPage;
