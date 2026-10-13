package com.example.bookmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Book {
    private long id;
    private String title;            // 本のタイトル
    private String author;           // 著作者
    private String overview;         // 概要
    private Long price;            // 金額
    private String publisher;        // 出版社
    private String ndc;              // 書籍区分（技術書など）
    private LocalDateTime createdAt; // データを入力した時間
}
