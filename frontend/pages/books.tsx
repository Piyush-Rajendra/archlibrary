import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../lib/auth';

interface Book {
  bookID: number;
  title: string;
  author: string;
  genre: string;
  availableCopies: number;
}

interface BorrowedBook {
  bookID: number;
  returnDate: string | null;
}

const BookSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? getUserFromToken() : null;
    if (user) {
      setToken(user.token);
      setUserId(user.id);
      fetchBorrowed(user.token, user.id);
      fetchBooks(user.token);
    }
  }, []);

  const fetchBooks = async (authToken = token, search = '') => {
    if (!authToken) return;
    try {
      const res = await fetch(`http://localhost:8080/api/books/search?title=${search}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setBooks(data.slice(0, 10)); // Show only first 10 results
    } catch (e) {
      console.error('Error fetching books', e);
    }
  };

  const fetchBorrowed = async (authToken: string, userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/borrowed/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      const borrowed = data.map((b: any) => ({
        bookID: b.bookID,
        returnDate: b.returnDate, // Store returnDate to check if it's returned
      }));
      setBorrowedBooks(borrowed);
    } catch (e) {
      console.error('Failed to fetch borrowed books', e);
    }
  };

  const borrowBook = async (bookId: number) => {
    if (!token || !userId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/library/borrow?userId=${userId}&bookId=${bookId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.ok) {
        alert('Book borrowed successfully!');
        fetchBorrowed(token, userId); // Refresh the borrowed books list
      } else {
        const error = await res.text();
        alert(`Failed to borrow: ${error}`);
      }
    } catch (e) {
      alert('Error while borrowing book.');
    }
  };

  const returnBook = async (bookId: number) => {
    if (!token || !userId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/library/return?userId=${userId}&bookId=${bookId}`,
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
        fetchBorrowed(token, userId); // Refresh borrowed books after return
      } else {
        const error = await res.text();
        alert(`Failed to return book: ${error}`);
      }
    } catch (e) {
      alert('Error while returning book.');
    }
  };

  // Check if the book is available for borrowing
  const isBookAvailable = (bookId: number) => {
    // Check if book is borrowed and not returned yet
    const borrowedBook = borrowedBooks.find((book) => book.bookID === bookId);
    return !borrowedBook || borrowedBook.returnDate !== null;
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>📚 Book Explorer</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBooks(token, query);
          }}
        >
          <input
            type="text"
            placeholder="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="book-list">
          {books.map((book) => (
            <div key={book.bookID} className="book-item">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Available:</strong> {book.availableCopies}</p>

              {/* Check if the book is available for borrowing */}
              {isBookAvailable(book.bookID) ? (
                <button onClick={() => borrowBook(book.bookID)}>Borrow</button>
              ) : (
                <button disabled className="disabled-btn">Already Borrowed</button>
              )}

              {/* Add Return Button */}
              {borrowedBooks.some((bookObj) => bookObj.bookID === book.bookID) && (
                <button onClick={() => returnBook(book.bookID)}>Return</button>
              )}
            </div>
          ))}
        </div>
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
        form {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        button {
          padding: 12px 24px;
          border: none;
          background: black;
          color: white;
          border-radius: 8px;
          cursor: pointer;
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
        .disabled-btn {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BookSearchPage;
