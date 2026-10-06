package com.example.bookmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Book {
    private long id;
    private String title;            // 本のタイトル
    private String overview;         // 概要
    private LocalDateTime createdAt; // データを入力した時間
}
