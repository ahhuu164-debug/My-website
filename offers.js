// js/offers.js - الكود الكامل لإدارة العروض

// دالة جلب العروض من ملف JSON
async function loadOffers(filter = {}) {
    try {
        const response = await fetch('/data/offers.json');
        const data = await response.json();
        
        let offers = data.offers.filter(offer => offer.active);
        
        // الفلاتر التلقائية
        if (filter.restaurant_id) {
            offers = offers.filter(offer => 
                offer.restaurant_id === filter.restaurant_id && offer.show_in_restaurant
            );
        } else if (document.getElementById('index-offers-container')) {
            // إذا كنا في الصفحة الرئيسية
            offers = offers.filter(offer => offer.show_in_index);
        } else if (document.getElementById('all-offers-container')) {
            // إذا كنا في صفحة العروض
            offers = offers.filter(offer => offer.show_in_offers);
        }
        
        return offers;
    } catch (error) {
        console.error('Error loading offers:', error);
        return [];
    }
}

// دالة عرض العروض في container معين
function displayOffers(offers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    if (offers.length === 0) {
        container.innerHTML = '<p class="no-offers">لا توجد عروض متاحة حالياً</p>';
        return;
    }
    
    offers.forEach(offer => {
        const offerElement = createOfferElement(offer);
        container.appendChild(offerElement);
    });
}

// إنشاء كارت عرض واحد
function createOfferElement(offer) {
    const div = document.createElement('div');
    div.className = 'offer-card';
    div.setAttribute('data-offer-id', offer.id);
    
    div.innerHTML = `
        <div class="offer-badge">وفر ${offer.savings_percentage}%</div>
        <img src="${offer.image}" alt="${offer.title}" loading="lazy">
        <div class="restaurant-name">${offer.restaurant_name}</div>
        <h3 class="offer-title">${offer.title}</h3>
        <p class="offer-description">${offer.description}</p>
        
        <div class="items-included">
            ${offer.items_included.map(item => `<span class="item">• ${item}</span>`).join('')}
        </div>
        
        <div class="price-section">
            <span class="original-price">${formatPrice(offer.original_price)}</span>
            <span class="offer-price">${formatPrice(offer.offer_price)}</span>
            <span class="savings">وفر ${formatPrice(offer.savings)}</span>
        </div>
        
        <div class="delivery-info">
            <span class="prep-time">⏱ ${offer.preparation_time}</span>
            <span class="delivery-time">🚚 ${offer.delivery_time}</span>
        </div>
        
        <button class="add-to-cart-btn" onclick="addOfferToCart(${offer.id})">
            أضف إلى السلة - ${formatPrice(offer.offer_price)}
        </button>
    `;
    
    return div;
}

// تنسيق السعر
function formatPrice(price) {
    return new Intl.NumberFormat('ar-SA').format(price) + ' د.ع';
}

// إضافة العرض إلى السلة
async function addOfferToCart(offerId) {
    try {
        const offers = await loadOffers();
        const offer = offers.find(o => o.id === offerId);
        
        if (offer) {
            // هنا تكامل مع نظام السلة الخاص بك
            if (typeof addToCart === 'function') {
                // إذا كان لديك دالة سلة موجودة
                addToCart(offer.add_to_cart_data);
            } else {
                // نظام سلة مؤقت
                addToCartTemp(offer);
            }
            
            showNotification(`تم إضافة "${offer.title}" إلى السلة`);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('حدث خطأ أثناء الإضافة إلى السلة', 'error');
    }
}

// نظام سلة مؤقت (يمكنك استبداله بنظامك)
function addToCartTemp(offer) {
    let cart = JSON.parse(localStorage.getItem('offers_cart') || '[]');
    
    const existingItem = cart.find(item => item.id === offer.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: offer.id,
            title: offer.title,
            price: offer.offer_price,
            restaurant: offer.restaurant_name,
            image: offer.image,
            quantity: 1,
            add_to_cart_data: offer.add_to_cart_data
        });
    }
    
    localStorage.setItem('offers_cart', JSON.stringify(cart));
    updateCartCounter();
}

// تحديث عداد السلة
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('offers_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const counter = document.getElementById('cart-counter');
    if (counter) {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// إظهار الإشعارات
function showNotification(message, type = 'success') {
    // إنصراف عنصر الإشعار إذا كان موجوداً
    const existingNotification = document.querySelector('.offer-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `offer-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    
    // إضافة styles إذا لم تكن موجودة
    if (!document.querySelector('#offer-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'offer-notification-styles';
        styles.textContent = `
            .offer-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 15px;
                animation: slideIn 0.3s ease;
            }
            .offer-notification.error {
                background: #e74c3c;
            }
            .offer-notification button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // إزالة تلقائية بعد 4 ثواني
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// تهيئة العروض تلقائياً عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عداد السلة
    updateCartCounter();
    
    // تحميل العروض للصفحة الرئيسية
    if (document.getElementById('index-offers-container')) {
        loadOffers().then(offers => {
            displayOffers(offers, 'index-offers-container');
        });
    }
    
    // تحميل جميع العروض لصفحة العروض
    if (document.getElementById('all-offers-container')) {
        loadOffers().then(offers => {
            displayOffers(offers, 'all-offers-container');
        });
    }
    
    // تحميل عروض مطعم محدد إذا كان هناك معرف مطعم في الصفحة
    const restaurantContainer = document.querySelector('[data-restaurant-id]');
    if (restaurantContainer) {
        const restaurantId = restaurantContainer.getAttribute('data-restaurant-id');
        loadOffers({ restaurant_id: restaurantId }).then(offers => {
            displayOffers(offers, 'restaurant-offers-container');
        });
    }
});

// دالة مساعدة للبحث في العروض
function searchOffers(searchTerm, containerId) {
    loadOffers().then(offers => {
        const filteredOffers = offers.filter(offer => 
            offer.title.includes(searchTerm) ||
            offer.restaurant_name.includes(searchTerm) ||
            offer.tags.some(tag => tag.includes(searchTerm)) ||
            offer.description.includes(searchTerm)
        );
        displayOffers(filteredOffers, containerId);
    });
}

// دالة تصفية العروض حسب الفئة
function filterOffersByCategory(category, containerId) {
    loadOffers().then(offers => {
        const filteredOffers = category === 'all' 
            ? offers 
            : offers.filter(offer => offer.category === category);
        displayOffers(filteredOffers, containerId);
    });
}