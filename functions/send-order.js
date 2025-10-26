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
  // الأسعار الحقيقية الثابتة
  const menuPrices = {
    "1": 45000, // بيتزا بيبروني
    "2": 40000, // بيتزا الخضار
    "3": 35000, // معكرونة بولونيز
    "4": 25000, // سلطة سيزر
    "5": 38000, // بيتزا مارجريتا
    "6": 42000  // لازانيا
  };
  
  // التحقق من كل عنصر
  order.items.forEach(item => {
    const realPrice = menuPrices[item.id];
    if (item.price !== realPrice) {
      throw new Error(`سعر غير صحيح للمنتج: ${item.name}`);
    }
  });
  
  return order;
}

// تنسيق رسالة الواتساب
function formatWhatsAppMessage(order) {
  let message = `🍕 طلب جديد من بيتزا سلمية\n\n`;
  message += `👤 الاسم: ${order.customer.name}\n`;
  message += `📞 الهاتف: ${order.customer.phone}\n`;
  message += `📍 العنوان: ${order.customer.address}\n`;
  message += `💳 طريقة الدفع: ${order.payment}\n\n`;
  message += `📋 الطلبات:\n`;
  
  order.items.forEach(item => {
    message += `• ${item.name} (${item.quantity}x) - ${item.price * item.quantity} ل.س\n`;
  });
  
  message += `\n💰 المجموع: ${order.total} ل.س`;
  message += `\n\nشكراً لطلبكم! 🚀`;
  
  return encodeURIComponent(message);
}