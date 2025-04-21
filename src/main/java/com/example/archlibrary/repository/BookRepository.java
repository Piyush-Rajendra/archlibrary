package com.example.archlibrary.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.archlibrary.model.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByGenre(String genre);
}
