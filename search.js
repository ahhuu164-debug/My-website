// search.js - إصدار بسيط جداً
console.log('✅ search.js محمل');

function initSearch() {
    console.log('🚀 بدء البحث');
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput) {
        console.log('❌ لم يتم العثور على search-input');
        return;
    }
    
    console.log('✅ تم العثور على عناصر البحث');

    // عند الضغط على زر البحث
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value;
        console.log('🔍 بحث عن:', query);
        
        if (query.includes('بيتزا')) {
            console.log('➡️ الانتقال إلى صفحة بيتزا سلمية');
            window.location.href = 'restaurant-pizza-salamia.html';
        } else {
            alert('جرب البحث عن "بيتزا"');
        }
    });

    // عند الضغط على Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// تشغيل البحث
document.addEventListener('DOMContentLoaded', initSearch);