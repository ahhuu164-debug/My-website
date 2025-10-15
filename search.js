// search.js - ملف البحث المنفصل

// بيانات البحث
const searchData = [
    { 
        name: "بيتزا سلمية", 
        type: "مطعم", 
        category: "بيتزا", 
        icon: "fas fa-pizza-slice",
        url: "restaurant-pizza-salamia.html",
        highlightItem: null
    },
    { 
        name: "برغر هاوس", 
        type: "مطعم", 
        category: "برغر", 
        icon: "fas fa-hamburger",
        url: "restaurant-burger-house.html", 
        highlightItem: null
    },
    { 
        name: "مشاوي العائلة", 
        type: "مطعم", 
        category: "مشاوي", 
        icon: "fas fa-drumstick-bite",
        url: "restaurant-family-grill.html",
        highlightItem: null
    },
    { 
        name: "بيتزا مارغريتا", 
        type: "وجبة", 
        category: "بيتزا", 
        icon: "fas fa-pizza-slice",
        url: "restaurant-pizza-salamia.html",
        highlightItem: "pizza-margherita"
    },
    { 
        name: "بيتزا بيبروني", 
        type: "وجبة", 
        category: "بيتزا", 
        icon: "fas fa-pizza-slice",
        url: "restaurant-pizza-salamia.html",
        highlightItem: "pizza-pepperoni"
    },
    { 
        name: "بيتزا خضار", 
        type: "وجبة", 
        category: "بيتزا", 
        icon: "fas fa-pizza-slice",
        url: "restaurant-pizza-salamia.html",
        highlightItem: "pizza-vegetable"
    },
    { 
        name: "برغر دجاج", 
        type: "وجبة", 
        category: "برغر", 
        icon: "fas fa-hamburger",
        url: "restaurant-burger-house.html",
        highlightItem: "chicken-burger"
    },
    { 
        name: "برغر لحم", 
        type: "وجبة", 
        category: "برغر", 
        icon: "fas fa-hamburger",
        url: "restaurant-burger-house.html",
        highlightItem: "beef-burger"
    },
    { 
        name: "شاورما دجاج", 
        type: "وجبة", 
        category: "شاورما", 
        icon: "fas fa-drumstick-bite",
        url: "restaurant-family-grill.html",
        highlightItem: "chicken-shawarma"
    },
    { 
        name: "كباب مشوي", 
        type: "وجبة", 
        category: "مشاوي", 
        icon: "fas fa-drumstick-bite",
        url: "restaurant-family-grill.html",
        highlightItem: "grilled-kebab"
    }
];

// وظيفة عرض نتائج البحث
function showSearchResults(query, searchResults, searchInput) {
    if (!query.trim()) {
        searchResults.style.display = 'none';
        return;
    }

    const filteredResults = searchData.filter(item => 
        item.name.includes(query) || item.category.includes(query)
    );

    if (filteredResults.length > 0) {
        searchResults.innerHTML = filteredResults.map(item => `
            <div class="search-result-item" data-url="${item.url}" data-highlight="${item.highlightItem || ''}">
                <i class="${item.icon} result-icon"></i>
                <span class="result-text">
                    ${item.name} 
                    <small style="color: var(--medium-gray); font-size: 0.9rem;">
                        - ${item.type === 'مطعم' ? 'مطعم' : 'وجبة'} ${item.category}
                    </small>
                </span>
            </div>
        `).join('');
        searchResults.style.display = 'block';
    } else {
        searchResults.innerHTML = '<div class="no-results">لا توجد نتائج مطابقة لبحثك</div>';
        searchResults.style.display = 'block';
    }

    // إضافة مستمعي الأحداث لعناصر النتائج
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemUrl = this.getAttribute('data-url');
            const highlightItem = this.getAttribute('data-highlight');
            
            searchInput.value = '';
            searchResults.style.display = 'none';
            performSearch(itemUrl, highlightItem);
        });
    });
}

// وظيفة إجراء البحث والانتقال
function performSearch(url, highlightItem = null) {
    let targetUrl = url;
    
    // إذا كان هناك عنصر محدد لتسليط الضوء عليه
    if (highlightItem) {
        targetUrl += `?highlight=${encodeURIComponent(highlightItem)}`;
    }
    
    console.log('الانتقال إلى:', targetUrl);
    window.location.href = targetUrl;
}

// تهيئة البحث
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchBtn || !searchResults) {
        console.warn('عناصر البحث غير موجودة في الصفحة');
        return;
    }

    // إضافة مستمعي الأحداث
    searchInput.addEventListener('input', function() {
        showSearchResults(this.value, searchResults, searchInput);
    });

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value;
        if (query.trim()) {
            const filteredResults = searchData.filter(item => 
                item.name.includes(query) || item.category.includes(query)
            );
            
            if (filteredResults.length > 0) {
                const firstResult = filteredResults[0];
                performSearch(firstResult.url, firstResult.highlightItem);
            } else {
                window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
            }
        } else {
            window.location.href = 'restaurants.html';
        }
    });

    // تحسين البحث بالضغط على Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // إخفاء نتائج البحث عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });

    console.log('تم تهيئة نظام البحث بنجاح');
}

// تصدير الوظائف للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSearch, searchData, performSearch };
}