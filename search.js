// search.js - إصدار مبسط للجوال

console.log('search.js محمل');

function initSearch() {
    console.log('بدء تهيئة البحث');
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput) {
        console.log('لم يتم العثور على search-input');
        return;
    }

    // بيانات البحث المبسطة
    const searchData = [
        { 
            name: "بيتزا سلمية", 
            url: "restaurant-pizza-salamia.html"
        },
        { 
            name: "بيتزا خضار", 
            url: "restaurant-pizza-salamia.html"
        }
    ];

    // عند الكتابة في البحث
    searchInput.addEventListener('input', function() {
        const query = this.value;
        console.log('بحث عن:', query);
        
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        const results = searchData.filter(item => 
            item.name.includes(query)
        );

        if (results.length > 0) {
            searchResults.innerHTML = results.map(item => `
                <div class="search-result-item" data-url="${item.url}">
                    <i class="fas fa-utensils result-icon"></i>
                    <span class="result-text">${item.name}</span>
                </div>
            `).join('');
            searchResults.style.display = 'block';

            // إضافة النقر على النتائج
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const url = this.getAttribute('data-url');
                    console.log('الانتقال إلى:', url);
                    window.location.href = url;
                });
            });
        } else {
            searchResults.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
            searchResults.style.display = 'block';
        }
    });

    // عند الضغط على زر البحث
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value;
        if (query.includes('بيتزا')) {
            window.location.href = 'restaurant-pizza-salamia.html';
        } else {
            alert('جرب البحث عن "بيتزا"');
        }
    });

    console.log('تم تهيئة البحث');
}

// تشغيل البحث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('الصفحة محملة - بدء البحث');
    initSearch();
});