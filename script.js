// Veri Yönetimi
class BookLibrary {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('books')) || [];
        this.toReadList = JSON.parse(localStorage.getItem('toReadList')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || this.getDefaultCategories();
        this.currentSection = 'okuduklarim';
        this.init();
    }

    getDefaultCategories() {
        return [
            { id: 1, name: 'Roman', color: '#e74c3c', count: 0 },
            { id: 2, name: 'Bilim Kurgu', color: '#3498db', count: 0 },
            { id: 3, name: 'Tarih', color: '#f39c12', count: 0 },
            { id: 4, name: 'Felsefe', color: '#9b59b6', count: 0 },
            { id: 5, name: 'Biyografi', color: '#2ecc71', count: 0 }
        ];
    }

    init() {
        this.updateCategoryOptions();
        this.updateCategoryFilter();
        this.render();
        this.setupEventListeners();
        this.updateCategoryCounts();
    }

    setupEventListeners() {
        // Navigasyon
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Arama
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.search(e.target.value);
        });

        // Filtreler
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('ratingFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        // Form gönderme
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });

        document.getElementById('toReadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addToReadBook();
        });

        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        // Modal dışına tıklama
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    switchSection(sectionName) {
        // Navigasyon butonlarını güncelle
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Bölümleri güncelle
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
        this.render();
    }

    addBook() {
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const categoryId = document.getElementById('bookCategory').value;
        const rating = document.getElementById('bookRating').value;
        const notes = document.getElementById('bookNotes').value;
        const readDate = document.getElementById('readDate').value;

        const book = {
            id: Date.now(),
            title,
            author,
            categoryId: parseInt(categoryId),
            rating: rating ? parseInt(rating) : null,
            notes,
            readDate: readDate || null,
            dateAdded: new Date().toISOString()
        };

        this.books.push(book);
        this.saveToStorage();
        this.updateCategoryCounts();
        this.render();
        this.closeAllModals();
        this.resetForm('bookForm');
        this.showNotification('Kitap başarıyla eklendi!');
    }

    addToReadBook() {
        const title = document.getElementById('toReadTitle').value;
        const author = document.getElementById('toReadAuthor').value;
        const categoryId = document.getElementById('toReadCategory').value;
        const priority = document.getElementById('toReadPriority').value;

        const book = {
            id: Date.now(),
            title,
            author,
            categoryId: categoryId ? parseInt(categoryId) : null,
            priority,
            dateAdded: new Date().toISOString()
        };

        this.toReadList.push(book);
        this.saveToStorage();
        this.render();
        this.closeAllModals();
        this.resetForm('toReadForm');
        this.showNotification('Kitap okunacaklar listesine eklendi!');
    }

    addCategory() {
        const name = document.getElementById('categoryName').value;
        const color = document.getElementById('categoryColor').value;

        const category = {
            id: Date.now(),
            name,
            color,
            count: 0
        };

        this.categories.push(category);
        this.saveToStorage();
        this.updateCategoryOptions();
        this.updateCategoryFilter();
        this.render();
        this.closeAllModals();
        this.resetForm('categoryForm');
        this.showNotification('Kategori başarıyla eklendi!');
    }

    deleteBook(bookId) {
        if (confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
            this.books = this.books.filter(book => book.id !== bookId);
            this.saveToStorage();
            this.updateCategoryCounts();
            this.render();
            this.showNotification('Kitap silindi!');
        }
    }

    deleteToReadBook(bookId) {
        if (confirm('Bu kitabı okunacaklar listesinden çıkarmak istediğinizden emin misiniz?')) {
            this.toReadList = this.toReadList.filter(book => book.id !== bookId);
            this.saveToStorage();
            this.render();
            this.showNotification('Kitap okunacaklar listesinden çıkarıldı!');
        }
    }

    moveToRead(bookId) {
        const book = this.toReadList.find(b => b.id === bookId);
        if (book) {
            // Okunacaklar listesinden çıkar
            this.toReadList = this.toReadList.filter(b => b.id !== bookId);
            
            // Okuduklarım listesine ekle
            const readBook = {
                id: Date.now(),
                title: book.title,
                author: book.author,
                categoryId: book.categoryId,
                rating: null,
                notes: '',
                readDate: new Date().toISOString().split('T')[0],
                dateAdded: new Date().toISOString()
            };
            
            this.books.push(readBook);
            this.saveToStorage();
            this.updateCategoryCounts();
            this.render();
            this.showNotification('Kitap okuduklarım listesine taşındı!');
        }
    }

    editBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            document.getElementById('bookTitle').value = book.title;
            document.getElementById('bookAuthor').value = book.author;
            document.getElementById('bookCategory').value = book.categoryId;
            document.getElementById('bookRating').value = book.rating || '';
            document.getElementById('bookNotes').value = book.notes;
            document.getElementById('readDate').value = book.readDate || '';
            
            // Eski kitabı sil ve formu düzenle modunda aç
            this.deleteBook(bookId);
            openBookModal();
        }
    }

    showBookDetail(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        const category = this.categories.find(c => c.id === book.categoryId);
        const modal = document.getElementById('bookDetailModal');
        const content = document.getElementById('bookDetailContent');

        content.innerHTML = `
            <div class="book-detail">
                <div class="book-detail-info">
                    <h2 class="book-detail-title">${book.title}</h2>
                    <p class="book-detail-author">Yazar: ${book.author}</p>
                    <div class="book-detail-meta">
                        <span class="book-category" style="background-color: ${category ? category.color : '#3498db'}">
                            ${category ? category.name : 'Kategori Yok'}
                        </span>
                        ${book.rating ? `<span class="book-rating">${'⭐'.repeat(book.rating)}</span>` : ''}
                        ${book.readDate ? `<span class="book-date">Okunma Tarihi: ${new Date(book.readDate).toLocaleDateString('tr-TR')}</span>` : ''}
                    </div>
                    ${book.notes ? `
                        <div class="book-detail-notes">
                            <h4>Notlarım:</h4>
                            <p>${book.notes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    search(query) {
        const searchTerm = query.toLowerCase();
        const allCards = document.querySelectorAll('.book-card, .to-read-card, .category-card');
        
        allCards.forEach(card => {
            const title = card.querySelector('.book-title, .category-name')?.textContent.toLowerCase() || '';
            const author = card.querySelector('.book-author')?.textContent.toLowerCase() || '';
            const notes = card.querySelector('.book-notes')?.textContent.toLowerCase() || '';
            
            const isVisible = title.includes(searchTerm) || 
                            author.includes(searchTerm) || 
                            notes.includes(searchTerm);
            
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const ratingFilter = document.getElementById('ratingFilter').value;
        
        const bookCards = document.querySelectorAll('.book-card');
        
        bookCards.forEach(card => {
            const bookCategoryId = card.dataset.categoryId;
            const bookRating = card.dataset.rating;
            
            let visible = true;
            
            if (categoryFilter && bookCategoryId !== categoryFilter) {
                visible = false;
            }
            
            if (ratingFilter && bookRating !== ratingFilter) {
                visible = false;
            }
            
            card.style.display = visible ? 'block' : 'none';
        });
    }

    updateCategoryOptions() {
        const selects = ['bookCategory', 'toReadCategory'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            // Mevcut seçenekleri temizle (ilk seçenek hariç)
            select.innerHTML = select.children[0].outerHTML;
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        });
    }

    updateCategoryFilter() {
        const select = document.getElementById('categoryFilter');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">Tüm Kategoriler</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    }

    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.books.filter(book => book.categoryId === category.id).length;
        });
        this.saveToStorage();
    }

    render() {
        switch(this.currentSection) {
            case 'okuduklarim':
                this.renderBooks();
                break;
            case 'okunacaklar':
                this.renderToReadList();
                break;
            case 'kategoriler':
                this.renderCategories();
                break;
        }
    }

    renderBooks() {
        const container = document.getElementById('booksList');
        
        if (this.books.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: white; font-size: 1.2rem; grid-column: 1 / -1;">
                    <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Henüz hiç kitap eklemediniz.</p>
                    <p>Yukarıdaki "Kitap Ekle" butonuna tıklayarak başlayın!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.books.map(book => {
            const category = this.categories.find(c => c.id === book.categoryId);
            return `
                <div class="book-card" data-category-id="${book.categoryId}" data-rating="${book.rating || ''}" onclick="library.showBookDetail(${book.id})">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">Yazar: ${book.author}</p>
                    <span class="book-category" style="background-color: ${category ? category.color : '#3498db'}">
                        ${category ? category.name : 'Kategori Yok'}
                    </span>
                    ${book.rating ? `<div class="book-rating">${'⭐'.repeat(book.rating)}</div>` : ''}
                    ${book.notes ? `<p class="book-notes">${book.notes.substring(0, 100)}${book.notes.length > 100 ? '...' : ''}</p>` : ''}
                    ${book.readDate ? `<p class="book-date">Okunma Tarihi: ${new Date(book.readDate).toLocaleDateString('tr-TR')}</p>` : ''}
                    <div class="book-actions" onclick="event.stopPropagation()">
                        <button class="btn-small btn-edit" onclick="library.editBook(${book.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small btn-delete" onclick="library.deleteBook(${book.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderToReadList() {
        const container = document.getElementById('toReadList');
        
        if (this.toReadList.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: white; font-size: 1.2rem; grid-column: 1 / -1;">
                    <i class="fas fa-bookmark" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Okunacaklar listeniz boş.</p>
                    <p>Yukarıdaki "Kitap Ekle" butonuna tıklayarak kitap ekleyin!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.toReadList.map(book => {
            const category = this.categories.find(c => c.id === book.categoryId);
            const priorityText = {
                'high': 'Yüksek',
                'medium': 'Orta',
                'low': 'Düşük'
            };

            return `
                <div class="book-card to-read-card priority-${book.priority}">
                    <div class="priority-badge">${priorityText[book.priority]}</div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">Yazar: ${book.author}</p>
                    ${category ? `
                        <span class="book-category" style="background-color: ${category.color}">
                            ${category.name}
                        </span>
                    ` : ''}
                    <p class="book-date">Eklenme Tarihi: ${new Date(book.dateAdded).toLocaleDateString('tr-TR')}</p>
                    <div class="book-actions">
                        <button class="btn-small btn-move" onclick="library.moveToRead(${book.id})">
                            <i class="fas fa-check"></i> Okudum
                        </button>
                        <button class="btn-small btn-delete" onclick="library.deleteToReadBook(${book.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCategories() {
        const container = document.getElementById('categoriesList');
        
        container.innerHTML = this.categories.map(category => `
            <div class="category-card" style="border-top: 5px solid ${category.color}">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-count">${category.count} kitap</p>
            </div>
        `).join('');
    }

    saveToStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
        localStorage.setItem('toReadList', JSON.stringify(this.toReadList));
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Modal Fonksiyonları
function openBookModal() {
    document.getElementById('bookModal').style.display = 'block';
}

function closeBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

function openToReadModal() {
    document.getElementById('toReadModal').style.display = 'block';
}

function closeToReadModal() {
    document.getElementById('toReadModal').style.display = 'none';
}

function openCategoryModal() {
    document.getElementById('categoryModal').style.display = 'block';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

function closeBookDetailModal() {
    document.getElementById('bookDetailModal').style.display = 'none';
}

// CSS Animasyonları
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Uygulamayı başlat
let library;
document.addEventListener('DOMContentLoaded', () => {
    library = new BookLibrary();
}); 