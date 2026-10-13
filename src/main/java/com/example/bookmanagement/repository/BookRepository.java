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
    // 1件取得
    public Book findById(int id) {
        return bookMapper.findById(id);
    }
    // 1件削除
    public int delete(long id) {
        return bookMapper.delete(id);
    }
    // 1件更新
    public int update(Book book) {
        if(bookMapper.update(book) == 0) {
            throw new BookNotFoundException(book.getId());
        }
        return book;
    }
}
