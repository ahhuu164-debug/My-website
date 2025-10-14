// protection.js - الخطوة الأولى
function openWhatsApp(message = "مرحباً، أريد الاستفسار عن خدمات التوصيل") {
    const myNumber = "963947275347"; // ضع رقمك الحقيقي هنا
    const url = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// منع النقر بزر الماوس الأيمن
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});