exports.handler = async (event) => {
  // الرقم الآمن هنا - لا يرى المستخدم
  const WHATSAPP_NUMBER = "963957275347";
  
  try {
    const orderData = JSON.parse(event.body);
    
    // ✅ التحقق من الأسعار هنا (آمن)
    const validatedOrder = validateOrder(orderData);
    
    // ✅ إرسال لواتساب (آمن)
    const message = formatWhatsAppMessage(validatedOrder);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: "تم التحقق من الطلب",
        whatsappUrl: whatsappUrl
      })
    };
    
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};

// التحقق من صحة الطلب
function validateOrder(order) {
  // الأسعار الحقيقية الثابتة لجميع المطاعم
  const menuPrices = {
    // 🍕 بيتزا سلمية
    "1": 45000, // بيتزا بيبروني
    "2": 40000, // بيتزا الخضار
    "3": 35000, // معكرونة بولونيز
    "4": 25000, // سلطة سيزر
    "5": 38000, // بيتزا مارجريتا
    "6": 42000, // لازانيا
    
    // 🍖 مشاوي العائلة (نفس الأرقام ولكن بأسعار مختلفة)
    "1": 35000, // شاورما لحم - نفس الرقم ولكن سعر مختلف!
    "2": 30000, // شاورما دجاج - نفس الرقم ولكن سعر مختلف!
    "3": 40000, // كبة مقلية - نفس الرقم ولكن سعر مختلف!
    "4": 45000, // كباب مشوي - نفس الرقم ولكن سعر مختلف!
    "5": 15000, // صحن حمص - نفس الرقم ولكن سعر مختلف!
    "6": 12000  // سلطة فتوش - نفس الرقم ولكن سعر مختلف!
  };
  
  // هذا يسبب المشكلة! لا يمكن أن يكون لنفس الرقم سعرين مختلفين
  
  // الحل: نغير طريقة التحقق
  const restaurantPrices = {
    "pizza": {
      "1": 45000, "2": 40000, "3": 35000, "4": 25000, "5": 38000, "6": 42000
    },
    "mashawi": {
      "1": 35000, "2": 30000, "3": 40000, "4": 45000, "5": 15000, "6": 12000
    }
  };
  
  // نحدد المطعم من خلال أول منتج
  let restaurantType = "pizza"; // افتراضي
  const firstItem = order.items[0];
  
  if (firstItem) {
    // إذا كان سعر المنتج الأول يتطابق مع مشاوي، فهو مشاوي
    if (firstItem.price === 35000 || firstItem.price === 30000) {
      restaurantType = "mashawi";
    }
  }
  
  // التحقق من كل عنصر بناءً على المطعم
  order.items.forEach(item => {
    const realPrice = restaurantPrices[restaurantType][item.id];
    if (realPrice === undefined) {
      throw new Error(`المنتج غير موجود: ${item.name}`);
    }
    if (item.price !== realPrice) {
      throw new Error(`سعر غير صحيح للمنتج: ${item.name} - السعر الصحيح: ${realPrice} ل.س`);
    }
  });
  
  return order;
}

// تنسيق رسالة الواتساب
function formatWhatsAppMessage(order) {
  let restaurantName = "المطعم";
  let restaurantEmoji = "🍽️";
  
  // تحديد اسم المطعم بناءً على الأسعار
  const firstItem = order.items[0];
  if (firstItem) {
    if (firstItem.price === 35000 || firstItem.price === 30000) {
      restaurantName = "مشاوي العائلة";
      restaurantEmoji = "🍖";
    } else {
      restaurantName = "بيتزا سلمية";
      restaurantEmoji = "🍕";
    }
  }
  
  let message = `${restaurantEmoji} طلب جديد من ${restaurantName}\n\n`;
  message += `👤 الاسم: ${order.customer.name}\n`;
  message += `📞 الهاتف: ${order.customer.phone}\n`;
  message += `📍 العنوان: ${order.customer.address}\n`;
  message += `💳 طريقة الدفع: ${getPaymentMethodName(order.payment)}\n\n`;
  message += `📋 الطلبات:\n`;
  
  order.items.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - ${item.price * item.quantity} ل.س\n`;
  });
  
  message += `\n💰 المجموع: ${order.total} ل.س`;
  message += `\n\nشكراً لطلبكم! 🚀`;
  
  return encodeURIComponent(message);
}

// الحصول على اسم طريقة الدفع
function getPaymentMethodName(method) {
  switch(method) {
    case 'cash': return 'نقداً عند الاستلام';
    case 'shamcash': return 'شام كاش';
    case 'usdt': return 'USDT';
    default: return 'غير محدد';
  }
}