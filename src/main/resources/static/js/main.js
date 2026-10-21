const API_BASE_URL = '/api/books';

// 画面読み込み時に、画面ごとの処理を振り分ける
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    if (pageId === 'index') {
        loadBooks(); // 一覧画面
    } else if (pageId === 'create') {
        setupCreateForm(); // 新規作成画面
    } else if (pageId === 'edit') {
        setupEditForm(); // 編集画面
    }
});

// ----------------------------------------------------
// 1. 一覧表示 (GET /api/books)
// ----------------------------------------------------
async function loadBooks() {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        const books = await response.json();
        bookList.innerHTML = '';

        if (books.length === 0) {
            bookList.innerHTML = '<p>登録されている書籍はありません。</p>';
            return;
        }

        books.forEach(book => {
            const card = `
                <div class="book-card">
                    <img src="${book.imageUrl || 'img/ダミー画像.webp'}" class="bk-img mg-lr" alt="表紙画像">
                    <div class="bk-info">
                        <a href="edit.html?id=${book.id}" class="book-title">${book.title}</a>
                        <p>発行日: ${book.publishedAt || '未設定'}</p>
                        <div class="mg-lr">
                            <a href="edit.html?id=${book.id}" class="edit-btn">編集</a>
                            <button type="button" class="delete-btn" onclick="deleteBook(${book.id})">削除</button>
                        </div>
                    </div>
                </div>
            `;
            bookList.insertAdjacentHTML('beforeend', card);
        });
    } catch (error) {
        console.error('一覧の取得に失敗しました:', error);
    }
}

// ----------------------------------------------------
// 2. 新規作成 (POST /api/books)
// ----------------------------------------------------
function setupCreateForm() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 画面の各入力要素から値を取得
        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            publishedAt: document.getElementById('publishedAt').value,
            price: document.getElementById('price').value,
            publisher: document.getElementById('publisher').value,
            type: document.getElementById('edt-type').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });

            if (response.ok) {
                alert('書籍を登録しました！');
                window.location.href = 'index.html'; // 一覧へ移動
            } else {
                alert('登録に失敗しました。');
            }
        } catch (error) {
            console.error('送信エラー:', error);
        }
    });
}

// ----------------------------------------------------
// 3. 編集データ取得 & 更新 (GET & PUT /api/books/{id})
// ----------------------------------------------------
async function setupEditForm() {
    const form = document.querySelector('form');
    if (!form) return;

    // URLのパラメータから bookId を取得 (?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        alert('書籍IDが指定されていません。');
        window.location.href = 'index.html';
        return;
    }

    // ① 編集対象のデータを既存取得してフォームにセット
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`);
        if (!response.ok) throw new Error('データ取得失敗');

        const book = await response.json();
        document.getElementById('title').value = book.title || '';
        document.getElementById('author').value = book.author || '';
        document.getElementById('publishedAt').value = book.publishedAt || '';
        document.getElementById('price').value = book.price || '';
        document.getElementById('publisher').value = book.publisher || '';
        document.getElementById('edt-type').value = book.type !== null ? book.type : '';
        document.getElementById('description').value = book.description || '';
    } catch (error) {
        console.error('詳細取得エラー:', error);
    }

    // ② フォーム送信時に PUT リクエスト送信
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            publishedAt: document.getElementById('publishedAt').value,
            price: document.getElementById('price').value,
            publisher: document.getElementById('publisher').value,
            type: document.getElementById('edt-type').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook)
            });

            if (response.ok) {
                alert('書籍情報を更新しました！');
                window.location.href = 'index.html';
            } else {
                alert('更新に失敗しました。');
            }
        } catch (error) {
            console.error('更新エラー:', error);
        }
    });
}

// ----------------------------------------------------
// 4. 削除 (DELETE /api/books/{id})
// ----------------------------------------------------
async function deleteBook(id) {
    if (!confirm(`ID: ${id} の書籍を削除しますか？`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('削除しました。');
            loadBooks(); // 一覧を再読込
        } else {
            alert('削除に失敗しました。');
        }
    } catch (error) {
        console.error('削除エラー:', error);
    }
}