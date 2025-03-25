// ✅ عرض المنتجات داخل عربة التسوق
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let totalPrice = 0;

    cartItemsContainer.innerHTML = "";

    cart.forEach((product, index) => {
        let productTotal = product.price * product.quantity;
        totalPrice += productTotal;

        let row = `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" width="50"> ${product.name}</td>
                <td>$${product.price}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                    ${product.quantity}
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td>$${productTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})"><i class="fa-solid fa-xmark fs-5"></i></button></td>
            </tr>
        `;
        cartItemsContainer.innerHTML += row;
    });

    document.getElementById("cart-total").innerText = `$${totalPrice.toFixed(2)}`;
}

// ✅ تغيير الكمية
function changeQuantity(index, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // تأكد من أن الكمية الجديدة صالحة
    if (cart[index].quantity + amount < 0) {
        alert("الكمية لا يمكن أن تكون أقل من صفر.");
        return;
    }

    // تعديل الكمية
    cart[index].quantity += amount;

    // حذف المنتج إذا كانت الكمية صفر أو أقل
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // حذف المنتج من العربة
    }

    // حفظ التغييرات في localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // تحديث العرض
    displayCart();
}


// ✅ حذف المنتج
function removeFromCart(index) {
    Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من استعادة هذا المنتج بعد الحذف!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، احذفه!",
        cancelButtonText: "إلغاء"
    }).then((result) => {
        if (result.isConfirmed) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();

            // إظهار رسالة نجاح بعد الحذف
            Swal.fire("تم الحذف!", "تم حذف المنتج من العربة.", "success");
        }
    });
}





document.addEventListener("DOMContentLoaded", function () {
    updateCartCount(); // تحديث عدد المنتجات عند تحميل الصفحة
});


// ✅ تحميل العربة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", displayCart);


document.getElementById("checkoutForm").addEventListener("submit", function (event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    let fullName = document.getElementById("fullName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;
    let deliveryAddress = document.getElementById("deliveryAddress").value;

    // التحقق من صحة البيانات
    if (fullName && phoneNumber && email && deliveryAddress) {
        Swal.fire({
            title: "✅ تم تقديم طلبك!",
            text: "شكرًا لك، سيتم التواصل معك قريبًا لتأكيد الطلب.",
            icon: "success",
            confirmButtonText: "حسنًا"
        });

        // يمكنك إرسال البيانات إلى السيرفر هنا إذا كان لديك نظام معالجة
    }
});



document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // جمع معلومات المشتري
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('deliveryAddress').value;

    // جمع تفاصيل المنتجات من العربة
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDetailsHTML = ``;
    let totalAmount = 0;

    cart.forEach(product => {
        const productTotal = product.price * product.quantity;
        cartDetailsHTML += `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" width="50"> ${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.price} DH</td>
                <td>${productTotal.toFixed(2)} DH</td>
            </tr>
        `;
        totalAmount += productTotal;
    });

    // إنشاء بريد إلكتروني كامل بصيغة HTML
    const emailBody = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
                .container { padding: 20px; background-color: #f4f4f9; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { width: 120px; margin-bottom: 15px; }
                .header h1 { font-size: 24px; color: #333; }
                .order-details table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .order-details table th, .order-details table td { 
                    padding: 10px; text-align: center; border: 1px solid #ddd; 
                }
                .order-details table th { background-color: #f1f1f1; }
                .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; color: #333; }
            </style>
        </head>
        <body dir="rtl">
            <div class="container">
                <div class="header">
                    <h1>طلب جديد من ${fullName}</h1>
                </div>

                <div class="customer-info">
                    <h3>معلومات المشتري:</h3>
                    <p>الاسم الكامل: ${fullName}</p>
                    <p>رقم الهاتف: ${phone}</p>
                    <p>البريد الإلكتروني: ${email}</p>
                    <p>مكان التوصيل: ${address}</p>
                </div>

                <div class="order-details">
                    <h3>تفاصيل الطلب:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>السعر الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cartDetailsHTML}
                        </tbody>
                    </table>
                </div>

                <div class="total">
                    <p>المجموع الكلي: ${totalAmount.toFixed(2)} DH</p>
                </div>
            </div>
        </body>
        </html>
    `;

    // إرسال البريد الإلكتروني عبر EmailJS
    emailjs.send('service_xxm68km', 'template_pc135wr', {
        full_name: fullName,
        phone: phone,
        email: email,
        address: address,
        email_body: emailBody // إرسال البريد بالكامل
    }).then(function(response) {
        // عرض SweetAlert عند النجاح
        Swal.fire({
            icon: 'success',
            title: 'تم إرسال طلبك بنجاح',
            text: 'تمت معالجة طلبك بنجاح.',
            confirmButtonText: 'موافق'
        }).then(() => {
            // حذف المنتجات من localStorage
            localStorage.removeItem('cart');
            
            // إعادة التوجيه إلى الصفحة الرئيسية
            window.location.href = '../index.html'; // أو ضع رابط الصفحة الرئيسية الخاصة بك
        });
    }, function(error) {
        // عرض SweetAlert عند الفشل
        Swal.fire({
            icon: 'error',
            title: 'حدث خطأ أثناء إرسال الطلب',
            text: 'من فضلك حاول مرة أخرى.',
            confirmButtonText: 'موافق'
        });
    });
});



