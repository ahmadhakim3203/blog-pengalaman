// Data posts disimpan di localStorage
let posts = [];

// Load posts dari localStorage
function loadPosts() {
    const stored = localStorage.getItem('lifeBlogPosts');
    if (stored) {
        posts = JSON.parse(stored);
    } else {
        // Data contoh
        posts = [
            {
                id: Date.now(),
                title: "Selamat Datang di Blog Hidupku",
                content: "Ini adalah tempat di mana aku akan menuliskan semua pengalaman hidupku. Setiap suka, duka, pelajaran, dan kenangan akan kuabadikan di sini. Mulai dari masa kecil, perjuangan, kegagalan, hingga kebahagiaan. Semua akan kuceritakan dengan jujur.",
                author: "Aku",
                date: new Date().toISOString()
            }
        ];
        savePosts();
    }
    displayPosts();
}

// Simpan ke localStorage
function savePosts() {
    localStorage.setItem('lifeBlogPosts', JSON.stringify(posts));
}

// Tampilkan posts di grid
function displayPosts() {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;
    
    if (posts.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Belum ada cerita. Mulailah menulis pengalamanmu! ✨</p>';
        return;
    }
    
    grid.innerHTML = posts.map(post => `
        <div class="post-card" onclick="viewPost('${post.id}')">
            <div class="post-card-content">
                <h3>${escapeHtml(post.title)}</h3>
                <div class="post-meta">
                    ${post.author ? `Oleh ${escapeHtml(post.author)} • ` : ''}
                    ${new Date(post.date).toLocaleDateString('id-ID')}
                </div>
                <div class="post-preview">
                    ${escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}
                </div>
                <span class="read-more">Baca selengkapnya →</span>
            </div>
        </div>
    `).join('');
}

// Escape HTML untuk keamanan
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// View post detail
function viewPost(id) {
    const post = posts.find(p => p.id == id);
    if (post) {
        localStorage.setItem('currentPost', JSON.stringify(post));
        window.location.href = 'post.html';
    }
}

// Tambah post baru
function addPost(title, content, author) {
    const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        author: author || 'Anonim',
        date: new Date().toISOString()
    };
    posts.unshift(newPost); // Tambah di awal
    savePosts();
    displayPosts();
}

// Modal handling
const modal = document.getElementById('postModal');
const newPostBtn = document.getElementById('newPostBtn');
const closeBtn = document.querySelector('.close');
const postForm = document.getElementById('postForm');

if (newPostBtn) {
    newPostBtn.onclick = () => {
        modal.style.display = 'block';
    };
}

if (closeBtn) {
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

if (postForm) {
    postForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const author = document.getElementById('postAuthor').value;
        
        if (title && content) {
            addPost(title, content, author);
            modal.style.display = 'none';
            postForm.reset();
            alert('Cerita berhasil disimpan! 🎉');
        } else {
            alert('Judul dan cerita tidak boleh kosong!');
        }
    };
}

// Inisialisasi
loadPosts();