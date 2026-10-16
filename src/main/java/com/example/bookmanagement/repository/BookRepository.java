package com.example.bookmanagement.repository;

import com.example.bookmanagement.dto.Book;
import com.example.bookmanagement.exception.BookNotFoundException;
import com.example.bookmanagement.mapper.BookMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BookRepository {
    private final BookMapper bookMapper;

    public BookRepository(BookMapper bookMapper) {
        this.bookMapper = bookMapper;
    }

    // 全件取得
    public List<Book> findAll() {
        return bookMapper.findAll();
    }
    // データ入力
    public int insert(Book book) {
        return bookMapper.insert(book);
    }
    // 取得
    public Book findById(long id) {
        return bookMapper.findById(id);
    }
    // 削除
    public boolean delete(long id) {
        return bookMapper.delete(id) == 1;
    }
    // 更新
    public Book update(Book book) {
        if(bookMapper.update(book) == 0) {
            throw new BookNotFoundException(book.getId());
        }
        return book;
    }
}
