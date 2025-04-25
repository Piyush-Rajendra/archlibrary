import { useState } from 'react';
import axios from 'axios';
import { getUserFromToken } from '../../lib/auth';

const AddBook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    totalCopies: 0,
    availableCopies: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('Copies') ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = getUserFromToken();
      await axios.post('http://localhost:8080/api/books', form, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert('Book added successfully!');
      setForm({ title: '', author: '', isbn: '', genre: '', totalCopies: 0, availableCopies: 0 });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book.');
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Add New Book</h1>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
          <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
          <input name="totalCopies" placeholder="Total Copies" type="number" value={form.totalCopies} onChange={handleChange} required />
          <input name="availableCopies" placeholder="Available Copies" type="number" value={form.availableCopies} onChange={handleChange} required />
          <button type="submit">➕ Add Book</button>
        </form>
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
          max-width: 500px;
          margin: auto;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        button {
          padding: 12px;
          background: #000;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        button:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default AddBook;
