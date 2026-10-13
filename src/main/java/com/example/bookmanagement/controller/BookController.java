package com.example.bookmanagement.controller;

import com.example.bookmanagement.dto.Book;
import com.example.bookmanagement.repository.BookRepository;
import com.example.bookmanagement.service.BookService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController                  // ⚠️ RestController：API作成には必ずつける
@RequestMapping("/api/books") // 基本のURL
public class BookController {
    private final BookRepository bookRepository;
    private final BookService bookService;

    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    // 全件取得
    @GetMapping
    public ResponseEntity<List<Book>> findAllBooks() {
        List<Book> books = bookService.findAll();

        return ResponseEntity.ok(books);
    }

    @PostMapping
    public ResponseEntity<Book> saveBook(@RequestBody Book book,
                                           UriComponentsBuilder uriBuilder) {
        Book createdBook = bookService.saveBook(book);
        URI location = uriBuilder.path("/api/books/{id}")
                .buildAndExpand(createdBook.getId()).toUri();
        return ResponseEntity.created(location).body(createdBook);
    }

}
