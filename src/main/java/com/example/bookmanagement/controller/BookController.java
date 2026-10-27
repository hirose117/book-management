package com.example.bookmanagement.controller;

import com.example.bookmanagement.dto.Book;
import com.example.bookmanagement.mapper.BookMapper;
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
    private final BookMapper bookMapper;

    public BookController(BookRepository bookRepository, BookService bookService, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    // 全件取得 & 検索・ソート機能（1つに統合）
    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String ndc,
            @RequestParam(defaultValue = "desc") String sort) {

        // Service 側のメソッドを呼び出す（※ Service に search メソッドを作成）
        List<Book> books = bookService.search(keyword, ndc, sort);
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

    // 指定されたidのJSONをリクエスト
    @GetMapping("/{id}")
    public ResponseEntity<Book> findById(@PathVariable long id) {
        Book book = bookService.findById(id);

        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable long id,
                                       @RequestBody Book book) {
        bookService.update(book, id);
        return ResponseEntity.ok(book);
    }
}
