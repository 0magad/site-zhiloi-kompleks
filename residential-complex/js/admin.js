/**
 * Админ-панель ЖК "Панорама" - JavaScript
 * Управление новостями и событиями
 */

// ========================================
// Data Storage (localStorage for demo)
// ========================================
let newsData = [];
let eventsData = [];

// Initialize data from localStorage or use defaults
function initializeData() {
    const storedNews = localStorage.getItem('rc_news');
    const storedEvents = localStorage.getItem('rc_events');
    
    if (storedNews) {
        newsData = JSON.parse(storedNews);
    } else {
        // Default news data
        newsData = [
            {
                id: 1,
                title: 'Открытие новой детской площадки',
                date: '2024-12-15',
                type: 'news',
                content: 'Приглашаем всех жителей на торжественное открытие обновлённой детской площадки во дворе корпуса А. Мероприятие состоится 20 декабря в 12:00.',
                image: 'images/news-1.jpg',
                featured: true,
                status: 'published'
            },
            {
                id: 2,
                title: 'График работы в новогодние праздники',
                date: '2024-12-10',
                type: 'announcement',
                content: 'Информируем об изменении графика работы управляющей компании в период новогодних каникул.',
                image: 'images/news-2.jpg',
                featured: false,
                status: 'published'
            },
            {
                id: 3,
                title: 'Общее собрание жильцов',
                date: '2024-12-05',
                type: 'important',
                content: 'Уважаемые жильцы! Приглашаем вас принять участие в общем собрании собственников помещений.',
                image: 'images/news-3.jpg',
                featured: false,
                status: 'published'
            }
        ];
        saveNews();
    }
    
    if (storedEvents) {
        eventsData = JSON.parse(storedEvents);
    } else {
        // Default events data
        eventsData = [
            {
                id: 1,
                title: 'Новогодний утренник',
                date: '2024-12-28',
                time: '11:00',
                location: 'Актовый зал корпуса А',
                description: 'Приглашаем детей жителей на новогоднее представление с Дедом Морозом и Снегурочкой.',
                image: 'images/event-1.jpg',
                status: 'upcoming'
            },
            {
                id: 2,
                title: 'Субботник',
                date: '2025-01-15',
                time: '10:00',
                location: 'Двор комплекса',
                description: 'Приглашаем всех желающих принять участие в субботнике по уборке территории.',
                image: 'images/event-2.jpg',
                status: 'upcoming'
            }
        ];
        saveEvents();
    }
}

function saveNews() {
    localStorage.setItem('rc_news', JSON.stringify(newsData));
}

function saveEvents() {
    localStorage.setItem('rc_events', JSON.stringify(eventsData));
}

// ========================================
// Navigation
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderDashboard();
    renderNewsTable();
    renderEventsTable();
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && adminSidebar) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                adminSidebar.classList.toggle('mobile-open');
            } else {
                adminSidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            
            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            showSection(section);
        });
    });
    
    // Form submissions
    setupNewsForm();
    setupEventForm();
});

function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('adminSidebar').classList.remove('mobile-open');
    }
}

// ========================================
// Dashboard
// ========================================
function renderDashboard() {
    // Update stats
    document.getElementById('totalNews').textContent = newsData.length;
    
    const today = new Date().toISOString().split('T')[0];
    const upcomingEventsCount = eventsData.filter(e => e.date >= today).length;
    document.getElementById('upcomingEvents').textContent = upcomingEventsCount;
    
    // Render recent news table
    const recentNewsTable = document.getElementById('recentNewsTable');
    const recentNews = newsData.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (recentNews.length === 0) {
        recentNewsTable.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <div class="empty-state-icon">📰</div>
                    <h3>Нет новостей</h3>
                    <p>Добавьте первую новость</p>
                </td>
            </tr>
        `;
        return;
    }
    
    recentNewsTable.innerHTML = recentNews.map(news => `
        <tr>
            <td>${escapeHtml(news.title)}</td>
            <td>${formatDate(news.date)}</td>
            <td><span class="status-badge ${news.status}">${getStatusText(news.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editNews(${news.id})">✏️</button>
                    <button class="action-btn delete" onclick="deleteNews(${news.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ========================================
// News Management
// ========================================
function renderNewsTable() {
    const newsTableBody = document.getElementById('newsTableBody');
    
    if (newsData.length === 0) {
        newsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">📰</div>
                    <h3>Нет новостей</h3>
                    <p>Нажмите "Добавить новость" чтобы создать первую запись</p>
                </td>
            </tr>
        `;
        return;
    }
    
    newsTableBody.innerHTML = newsData.map((news, index) => `
        <tr>
            <td>${news.id}</td>
            <td>${escapeHtml(news.title)}</td>
            <td>${formatDate(news.date)}</td>
            <td><span class="type-badge ${news.type}">${getTypeText(news.type)}</span></td>
            <td><span class="status-badge ${news.status}">${getStatusText(news.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewNews(${news.id})">👁️</button>
                    <button class="action-btn edit" onclick="editNews(${news.id})">✏️</button>
                    <button class="action-btn delete" onclick="deleteNews(${news.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openNewsModal() {
    document.getElementById('newsModalTitle').textContent = 'Добавить новость';
    document.getElementById('newsForm').reset();
    document.getElementById('newsId').value = '';
    document.getElementById('newsModal').classList.add('active');
}

function closeNewsModal() {
    document.getElementById('newsModal').classList.remove('active');
}

function setupNewsForm() {
    const newsForm = document.getElementById('newsForm');
    
    newsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newsId = document.getElementById('newsId').value;
        const title = document.getElementById('newsTitle').value.trim();
        const date = document.getElementById('newsDate').value;
        const type = document.getElementById('newsType').value;
        const image = document.getElementById('newsImage').value.trim();
        const content = document.getElementById('newsContent').value.trim();
        const featured = document.getElementById('newsFeatured').checked;
        
        if (!title || !date || !content) {
            showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        if (newsId) {
            // Edit existing news
            const index = newsData.findIndex(n => n.id == newsId);
            if (index !== -1) {
                newsData[index] = {
                    ...newsData[index],
                    title,
                    date,
                    type,
                    image,
                    content,
                    featured,
                    status: 'published'
                };
                showNotification('Новость обновлена', 'success');
            }
        } else {
            // Add new news
            const newId = newsData.length > 0 ? Math.max(...newsData.map(n => n.id)) + 1 : 1;
            newsData.push({
                id: newId,
                title,
                date,
                type,
                image,
                content,
                featured,
                status: 'published'
            });
            showNotification('Новость добавлена', 'success');
        }
        
        saveNews();
        renderNewsTable();
        renderDashboard();
        closeNewsModal();
    });
}

function editNews(id) {
    const news = newsData.find(n => n.id === id);
    if (!news) return;
    
    document.getElementById('newsModalTitle').textContent = 'Редактировать новость';
    document.getElementById('newsId').value = news.id;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsDate').value = news.date;
    document.getElementById('newsType').value = news.type;
    document.getElementById('newsImage').value = news.image || '';
    document.getElementById('newsContent').value = news.content;
    document.getElementById('newsFeatured').checked = news.featured || false;
    
    document.getElementById('newsModal').classList.add('active');
}

function viewNews(id) {
    const news = newsData.find(n => n.id === id);
    if (!news) return;
    
    alert(`Новость:\n\n${news.title}\n\n${news.content}`);
}

let newsToDelete = null;

function deleteNews(id) {
    newsToDelete = id;
    document.getElementById('deleteModal').classList.add('active');
    document.getElementById('confirmDeleteBtn').onclick = function() {
        newsData = newsData.filter(n => n.id !== newsToDelete);
        saveNews();
        renderNewsTable();
        renderDashboard();
        closeDeleteModal();
        showNotification('Новость удалена', 'success');
    };
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    newsToDelete = null;
}

// ========================================
// Events Management
// ========================================
function renderEventsTable() {
    const eventsTableBody = document.getElementById('eventsTableBody');
    
    if (eventsData.length === 0) {
        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <h3>Нет событий</h3>
                    <p>Нажмите "Добавить событие" чтобы создать первую запись</p>
                </td>
            </tr>
        `;
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    eventsTableBody.innerHTML = eventsData.map(event => {
        const status = event.date >= today ? 'upcoming' : 'completed';
        return `
            <tr>
                <td>${event.id}</td>
                <td>${escapeHtml(event.title)}</td>
                <td>${formatDate(event.date)}</td>
                <td>${escapeHtml(event.location)}</td>
                <td><span class="status-badge ${status}">${getStatusText(status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="viewEvent(${event.id})">👁️</button>
                        <button class="action-btn edit" onclick="editEvent(${event.id})">✏️</button>
                        <button class="action-btn delete" onclick="deleteEvent(${event.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openEventModal() {
    document.getElementById('eventModalTitle').textContent = 'Добавить событие';
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
}

function setupEventForm() {
    const eventForm = document.getElementById('eventForm');
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventId = document.getElementById('eventId').value;
        const title = document.getElementById('eventTitle').value.trim();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const location = document.getElementById('eventLocation').value.trim();
        const image = document.getElementById('eventImage').value.trim();
        const description = document.getElementById('eventDescription').value.trim();
        
        if (!title || !date || !location || !description) {
            showNotification('Заполните обязательные поля', 'error');
            return;
        }
        
        if (eventId) {
            // Edit existing event
            const index = eventsData.findIndex(e => e.id == eventId);
            if (index !== -1) {
                eventsData[index] = {
                    ...eventsData[index],
                    title,
                    date,
                    time,
                    location,
                    image,
                    description
                };
                showNotification('Событие обновлено', 'success');
            }
        } else {
            // Add new event
            const newId = eventsData.length > 0 ? Math.max(...eventsData.map(e => e.id)) + 1 : 1;
            eventsData.push({
                id: newId,
                title,
                date,
                time,
                location,
                image,
                description
            });
            showNotification('Событие добавлено', 'success');
        }
        
        saveEvents();
        renderEventsTable();
        renderDashboard();
        closeEventModal();
    });
}

function editEvent(id) {
    const event = eventsData.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('eventModalTitle').textContent = 'Редактировать событие';
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time || '';
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventImage').value = event.image || '';
    document.getElementById('eventDescription').value = event.description;
    
    document.getElementById('eventModal').classList.add('active');
}

function viewEvent(id) {
    const event = eventsData.find(e => e.id === id);
    if (!event) return;
    
    alert(`Событие:\n\n${event.title}\nДата: ${formatDate(event.date)}${event.time ? ' в ' + event.time : ''}\nМесто: ${event.location}\n\n${event.description}`);
}

let eventToDelete = null;

function deleteEvent(id) {
    eventToDelete = id;
    document.getElementById('deleteModal').classList.add('active');
    document.getElementById('confirmDeleteBtn').onclick = function() {
        eventsData = eventsData.filter(e => e.id !== eventToDelete);
        saveEvents();
        renderEventsTable();
        renderDashboard();
        closeDeleteModal();
        showNotification('Событие удалено', 'success');
    };
}

// ========================================
// Utility Functions
// ========================================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function getStatusText(status) {
    const statusMap = {
        'published': 'Опубликовано',
        'draft': 'Черновик',
        'upcoming': 'Предстоящее',
        'completed': 'Завершено'
    };
    return statusMap[status] || status;
}

function getTypeText(type) {
    const typeMap = {
        'news': 'Новость',
        'announcement': 'Объявление',
        'important': 'Важное'
    };
    return typeMap[type] || type;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#f56565';
            break;
        default:
            notification.style.backgroundColor = '#4299e1';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function logout() {
    if (confirm('Вы действительно хотите выйти?')) {
        window.location.href = 'index.html';
    }
}
