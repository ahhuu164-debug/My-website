// protection.js - الإصدار المتقدم
class WhatsAppProtector {
    constructor() {
        this.phoneNumber = this.getEncryptedNumber();
        this.initProtection();
    }

    // تشفير متقدم للرقم
    getEncryptedNumber() {
        // طريقة 1: التشفير بالعكس
        const reversed = '743572749369'.split('').reverse().join('');
        
        // طريقة 2: التشفير الرياضي
        const mathEncrypted = this.mathDecrypt('102,105,108,45,48,51,45,54,57,51');
        
        // طريقة 3: Base64 encoding - غير الرقم هنا فقط
        const base64Encoded = atob('OTYzOTQ3Mjc1MzQ3');
        
        return base64Encoded;
    }

    // فك التشفير الرياضي
    mathDecrypt(encoded) {
        return encoded.split(',')
            .map(num => String.fromCharCode(parseInt(num) - 50))
            .join('');
    }

    // نظام الحماية المتقدم
    initProtection() {
        // منع أدوات المطور
        this.blockDevTools();
        
        // مراقبة التغييرات
        this.monitorChanges();
        
        // إرباك المهاجم
        this.createDecoys();
    }

    // منع فتح أدوات المطور
    blockDevTools() {
        // منع F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                return false;
            }
        });

        // منع النقر الأيمن
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // كشف فتح أدوات المطور
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                alert('تم اكتشاف محاولة تعديل غير مصرح بها');
                return 'blocked';
            }
        });
        console.log('%c', element);
    }

    // مراقبة التغييرات في الكود
    monitorChanges() {
        const originalOpen = window.open;
        window.open = function(url, ...args) {
            if (url && url.includes('wa.me')) {
                // التحقق من أن الرابط يحتوي على الرقم الصحيح
                if (!url.includes('963947275347')) {
                    console.error('محاولة تعديل الرقم مرفوضة');
                    return null;
                }
            }
            return originalOpen.apply(this, [url, ...args]);
        };
    }

    // إنشاء إرباكات للمهاجم
    createDecoys() {
        // إضافة أرقام وهمية في الصفحة
        setTimeout(() => {
            const fakeScript = document.createElement('script');
            fakeScript.textContent = `
                // أرقام وهمية لإرباك المهاجم
                var fakeNumbers = [
                    '963000000000',
                    '963111111111', 
                    '963999999999'
                ];
                function fakeWhatsApp() { 
                    return 'هذا رقم وهمي'; 
                }
            `;
            document.head.appendChild(fakeScript);
        }, 1000);
    }

    // فتح واتساب آمن
    openSecureWhatsApp(message = "مرحباً، أريد الاستفسار عن خدمات التوصيل") {
        // التحقق من صحة الرقم قبل الإرسال
        if (!this.validatePhoneNumber(this.phoneNumber)) {
            console.error('رقم الواتساب غير صحيح');
            return;
        }

        const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // فتح الرابط بشكل آمن
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // التحقق من صحة الرقم
    validatePhoneNumber(phone) {
        return /^963\d{9}$/.test(phone) && phone.length === 12;
    }
}

// تهيئة النظام
const waProtector = new WhatsAppProtector();

// جعل الدالة متاحة globally مع حماية إضافية
Object.defineProperty(window, 'openWhatsApp', {
    value: function(message) {
        return waProtector.openSecureWhatsApp(message);
    },
    writable: false,    // لا يمكن التعديل
    configurable: false // لا يمكن الحذف
});

// حماية إضافية: منع تعديل الكائن
Object.freeze(waProtector);