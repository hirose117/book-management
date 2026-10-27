package com.example.bookmanagement.exception.handler;

import com.example.bookmanagement.exception.BookArgumentNotValidException;
import com.example.bookmanagement.exception.BookNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ページが見つからないエラーに対応
    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<String> handleBookNotFoundException(BookNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    // 送信データの形式が一致しないエラーに対応
    @ExceptionHandler(BookArgumentNotValidException.class)
    public ResponseEntity<String> handleBookArgumentNotValidException(BookArgumentNotValidException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
