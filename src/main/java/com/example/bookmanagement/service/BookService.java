package com.example.bookmanagement.service;

import com.example.bookmanagement.dto.Book;
import com.example.bookmanagement.exception.BookNotFoundException;
import com.example.bookmanagement.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // 全件取得
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // 保存時の処理
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

    // 取得
    public Book findById(long id) {
        Book book = bookRepository.findById(id);
        // idがない場合の処理
        if(book == null){
            throw new BookNotFoundException(id);
        }
        return book;
    }

    // 削除
    public boolean delete(long id) {
        // 削除するidがない場合
        if(!bookRepository.delete(id)) {
            throw new BookNotFoundException(id);
        }
        return true;
    }

    // 更新の処理
    @Transactional
    public Book update(Book book, long id) {
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
        if (book.getNdc() == null || book.getNdc().isEmpty()){
            throw new IllegalArgumentException("Ndc is empty");
        }

        // ndcが空のバリデーション
        if (book.getPublisher() == null || book.getPublisher().isEmpty()){
            throw new IllegalArgumentException("Publisher is empty");
        }

        // 指定されたIDが存在しない場合のバリデーション
        Book targetBook = bookRepository.findById(id);
        if(targetBook == null){
            throw new BookNotFoundException(id);

        }

        // IDや作成日時を正しくセットしてデータベースを更新する処理
        book.setId(id);
        book.setCreatedAt(targetBook.getCreatedAt());
        return bookRepository.update(book);
    }
}
