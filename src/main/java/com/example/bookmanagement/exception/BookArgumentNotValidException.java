package com.example.bookmanagement.exception;

public class BookArgumentNotValidException extends RuntimeException {
    public BookArgumentNotValidException(String message) {
        super(message);
    }
}
