package com.example.bookmanagement.service;

import com.example.bookmanagement.dto.Book;
import com.example.bookmanagement.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        // titleが空のバリデーション
        if(book.getTitle() == null || book.getTitle().isEmpty()){
            throw new IllegalArgumentException("Title is empty");
        }
        // authorが空のバリデーション
        if(book.getAuthor() == null || book.getAuthor().isEmpty()){
            throw new IllegalArgumentException("Author is empty");
        }
        // overviewが空のバリデーション
        if(book.getOverview() == null || book.getOverview().isEmpty()){
            throw new IllegalArgumentException("Overview is empty");
        }
        // priceが空で0円未満のバリデーション
        if (book.getPrice() == null || book.getPrice() < 0) {
            throw new IllegalArgumentException("Price is invalid");
        }
        // publisherが空のバリデーション
        if(book.getPublisher() == null || book.getPublisher().isEmpty()){
            throw new IllegalArgumentException("Publisher is empty");
        }
        // ndcが空のバリデーション
        if(book.getNdc() == null || book.getNdc().isEmpty()){
            throw new IllegalArgumentException("Ndc is empty");
        }

        bookRepository.insert(book);
        return book;
    }
}
