const API_BASE_URL = '/api/books';

// ----------------------------------------------------
// 画面読み込み時の振り分け
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    if (pageId === 'index') {
        loadBooks(); // 初回一覧読み込み

        // フォーム送信（Enterキー含む）の画面リロードを防止して検索実行
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                loadBooks();
            });
        }

        // 検索ボタンクリック時の挙動
        document.getElementById('search-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            loadBooks();
        });

        // ↕️ 出版日ソート変更時の挙動
        document.getElementById('sort')?.addEventListener('change', loadBooks);

        // 書籍区分変更時の挙動
        document.getElementById('type')?.addEventListener('change', loadBooks);

    } else if (pageId === 'create') {
        setupCreateForm(); // 新規作成画面
    } else if (pageId === 'edit') {
        setupEditForm(); // 編集画面
    } else if (pageId === 'detail') {
        setupDetailForm();
}

});

// ----------------------------------------------------
// 1. 一覧表示 & 検索・ソート (GET /api/books)
// ----------------------------------------------------
async function loadBooks() {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    // index.html の各入力要素から値を取得
    const keyword = document.getElementById('search')?.value || '';
    const sortValue = document.getElementById('sort')?.value || '';
    const ndc = document.getElementById('type')?.value || '';

    // ソート指定の変換 ("old" -> "asc", "new" またはデフォルト -> "desc")
    let sort = 'desc';
    if (sortValue === 'old') {
        sort = 'asc';
    } else if (sortValue === 'new') {
        sort = 'desc';
    }

    // クエリパラメータを作成 (/api/books?keyword=〇〇&sort=asc&ndc=〇〇)
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (sort) params.append('sort', sort);
    if (ndc) params.append('ndc', ndc);

    try {
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        const books = await response.json();
        bookList.innerHTML = '';

        if (books.length === 0) {
            bookList.innerHTML = '<p>該当する書籍は見つかりませんでした。</p>';
            return;
        }

        books.forEach(book => {
            const card = `
                <div class="book-card">
                    <img src="${book.imageUrl || 'img/ダミー画像.webp'}" class="bk-img mg-lr" alt="表紙画像">
                    <div class="bk-info">
                        <a href="detail.html?id=${book.id}" class="book-title">${book.title}</a>
                        <p>発行日: ${book.createdAt || '未設定'}</p>
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

        // 画像ファイルパスの作成
        const fileInput = document.getElementById('image-uploader');
        let imageUrl = 'img/ダミー画像.webp';

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            imageUrl = `img/${fileInput.files[0].name}`;
        }

        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            createdAt: document.getElementById('createdAt').value,
            price: document.getElementById('price').value ? Number(document.getElementById('price').value) : null,
            publisher: document.getElementById('publisher').value,
            ndc: document.getElementById('ndc').value,
            overview: document.getElementById('overview').value,
            imageUrl: imageUrl
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });

            if (response.ok) {
                alert('書籍を登録しました！');
                window.location.href = 'index.html';
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

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        alert('書籍IDが指定されていません。');
        window.location.href = 'index.html';
        return;
    }

    let currentImageUrl = 'img/ダミー画像.webp';

    // 1. 詳細データ取得
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`);
        if (!response.ok) throw new Error('データ取得失敗');

        const book = await response.json();
        document.getElementById('title').value = book.title || '';
        document.getElementById('author').value = book.author || '';
        document.getElementById('createdAt').value = book.createdAt || '';
        document.getElementById('price').value = book.price !== null ? book.price : '';
        document.getElementById('publisher').value = book.publisher || '';
        document.getElementById('ndc').value = book.ndc || '';
        document.getElementById('overview').value = book.overview || '';

        if (book.imageUrl) {
            currentImageUrl = book.imageUrl;
            const preview = document.getElementById('preview');
            if (preview) {
                preview.src = book.imageUrl;
            }
        }
    } catch (error) {
        console.error('詳細取得エラー:', error);
    }

    // 2. 更新データ送信
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById('image-uploader');
        let imageUrl = currentImageUrl;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            imageUrl = `img/${fileInput.files[0].name}`;
        }

        const updatedBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            createdAt: document.getElementById('createdAt').value,
            price: document.getElementById('price').value ? Number(document.getElementById('price').value) : null,
            publisher: document.getElementById('publisher').value,
            ndc: document.getElementById('ndc').value,
            overview: document.getElementById('overview').value,
            imageUrl: imageUrl
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
            loadBooks();
        } else {
            alert('削除に失敗しました。');
        }
    } catch (error) {
        console.error('削除エラー:', error);
    }
}

// ----------------------------------------------------
// 5. 詳細表示 (GET /api/books/{id})
// ----------------------------------------------------
async function setupDetailForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        alert('書籍IDが指定されていません。');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`);
        if (!response.ok) throw new Error('詳細データの取得に失敗しました');

        const book = await response.json();

        // 編集画面と同じ ID と value 属性を使ってセット
        document.getElementById('title').value = book.title || '';
        document.getElementById('author').value = book.author || '';
        document.getElementById('createdAt').value = book.createdAt || '';
        document.getElementById('price').value = book.price !== null ? book.price : '';
        document.getElementById('publisher').value = book.publisher || '';
        document.getElementById('ndc').value = book.ndc || '';
        document.getElementById('overview').value = book.overview || '';

        // 画像プレビューのセット (id="preview")
        const preview = document.getElementById('preview');
        if (preview && book.imageUrl) {
            preview.src = book.imageUrl;
        }

        // 編集画面へのリンクを設定 (id="edit-link")
        const editLink = document.getElementById('edit-link');
        if (editLink) {
            editLink.href = `edit.html?id=${book.id}`;
        }
    } catch (error) {
        console.error('詳細取得エラー:', error);
        alert('書籍情報の取得に失敗しました。');
    }
}