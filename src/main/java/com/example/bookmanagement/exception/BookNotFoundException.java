package com.example.bookmanagement.exception;

// RuntimeException : プログラマーの考慮漏れや不正な入力によるエラー
public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(long id) {
        super("指定されたIDのノートが見つかりません" + id);
    }
}
