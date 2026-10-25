package com.example.bookmanagement.mapper;

import com.example.bookmanagement.dto.Book;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BookMapper {
    // R : 全件取得
    @Select("SELECT id, title, author, overview, price, publisher, ndc, created_at FROM books ORDER BY created_at DESC")
    List<Book> findAll();

    // C : id、タイムスタンプ以外のデータを入力
    @Insert("INSERT INTO books (title, author, overview, price, publisher, ndc, created_at) VALUES (#{title}, #{author}, #{overview}, #{price}, #{publisher}, #{ndc}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insert(Book book);

    // R : 1件取得
    @Select("SELECT id, title, author, overview, price, publisher, ndc, createdAt FROM books WHERE id = #{id}")
    Book findById(long id);

    // D : 1件削除
    @Delete("DELETE FROM books WHERE id =#{id}")
    int delete(long id);

    // U : 1件更新
    @Update("UPDATE books SET title = #{title}, author = #{author}, overview = #{overview}, price = #{price}, publisher = #{publisher}, ndc = #{ndc} WHERE id = #{id}")
    int update(Book book);
}
