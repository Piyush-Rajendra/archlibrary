package com.example.archlibrary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.archlibrary.model.Book;
import com.example.archlibrary.repository.BookRepository;

@Service
public class BookService {

    @Autowired private BookRepository bookRepo;

    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public List<Book> searchByTitle(String title) {
        return bookRepo.findByTitleContainingIgnoreCase(title);
    }

    public Book addBook(Book book) {
        book.setAvailableCopies(book.getTotalCopies());
        return bookRepo.save(book);
    }

    public Book updateBook(int id, Book updatedBook) {
        Book book = bookRepo.findById(id).orElseThrow();
        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setGenre(updatedBook.getGenre());
        book.setIsbn(updatedBook.getIsbn());
        book.setTotalCopies(updatedBook.getTotalCopies());
        book.setAvailableCopies(updatedBook.getAvailableCopies());
        return bookRepo.save(book);
    }

    public void deleteBook(int id) {
        bookRepo.deleteById(id);
    }
}