import { useState } from 'react';
import axios from 'axios';
import { getUserFromToken } from '../../lib/auth';

interface Book {
  bookID: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
}

const UpdateBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [user, setUser] = useState<{ token: string } | null>(null);

  const fetchUser = () => {
    if (!user) {
      const u = getUserFromToken();
      if (u) setUser(u);
    }
  };

  const handleSearch = async () => {
    try {
      const userData = getUserFromToken();
      if (!userData) {
        alert("Not Authorized!");
        return;
      }
      setUser(userData); // set into state
      const res = await axios.get<Book[]>(`http://localhost:8080/api/books/search?title=${searchTerm}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      setSearchResults(res.data);
    } catch (error) {
      console.error('Error searching books:', error);
      alert('Failed to search books.');
    }
  };
  

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBook) return;
    const { name, value } = e.target;
    setSelectedBook((prev) =>
      prev ? { ...prev, [name]: name.includes('Copies') ? parseInt(value) : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    try {
      await axios.put(`http://localhost:8080/api/books/${selectedBook.bookID}`, selectedBook, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert('Book updated successfully!');
      setSelectedBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book.');
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Update Book</h1>

        {/* Search Section */}
        {!selectedBook && (
          <>
            <input
              type="text"
              placeholder="Search Book by Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>🔍 Search</button>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="results">
                {searchResults.map((book) => (
                  <div key={book.bookID} className="book-card">
                    <strong>{book.title}</strong> by {book.author}
                    <button onClick={() => handleSelectBook(book)}>✏️ Edit</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Form */}
        {selectedBook && (
          <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Title" value={selectedBook.title} onChange={handleFormChange} required />
            <input name="author" placeholder="Author" value={selectedBook.author} onChange={handleFormChange} required />
            <input name="isbn" placeholder="ISBN" value={selectedBook.isbn} onChange={handleFormChange} required />
            <input name="genre" placeholder="Genre" value={selectedBook.genre} onChange={handleFormChange} required />
            <input name="totalCopies" type="number" placeholder="Total Copies" value={selectedBook.totalCopies} onChange={handleFormChange} required />
            <input name="availableCopies" type="number" placeholder="Available Copies" value={selectedBook.availableCopies} onChange={handleFormChange} required />
            <button type="submit">✅ Save Changes</button>
            <button type="button" onClick={() => setSelectedBook(null)} style={{ backgroundColor: 'red' }}>❌ Cancel</button>
          </form>
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
          max-width: 600px;
          margin: auto;
        }
        input {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        button {
          margin-top: 16px;
          padding: 12px;
          background: #000;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
        }
        button:hover {
          background: #333;
        }
        .results {
          margin-top: 20px;
        }
        .book-card {
          background: #eee;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default UpdateBook;
