
// API KEYS
const spaceId = 'r3bner2cqrh8';
const accessToken = 'o5u_OoaEVt3BfjO7f6ohokvbzWqTV7z53G-wbRJaq2U';
const environment = 'master';

const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const productContainer = document.querySelector('.productContainer');

        data.items.forEach(item => {
            // Extract product details
            const productName = item.fields.name;
            const productDescription = item.fields.description;
            const productPrice = item.fields.price;
            const category = item.fields.category;
            const oldPrice = item.fields.oldPrice;
            const evaluation = item.fields.evaluation; // عدد النجوم
            // Extract image URL
            const asset = data.includes.Asset.find(asset => asset.sys.id === item.fields.image.sys.id);
            const productImage = asset.fields.file.url.startsWith('//') ? `https:${asset.fields.file.url}` : asset.fields.file.url;


            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += `<div class="bi-star${i < evaluation ? '-fill' : ''}"></div>`;
            }
            // Create the card HTML
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100" data-category=${category}>
                        <!-- شارة الخصم -->
                        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                        <!-- صورة المنتج -->
                        <img class="card-img-top" src="${productImage}" alt="${productName}" />
                        <!-- تفاصيل المنتج -->
                        <div class="card-body p-4 text-center">
                            <h5 class="fw-bolder">${productName}</h5>
                            <!-- التقييم -->
                            <div class="d-flex justify-content-center small text-warning mb-2">
                                ${stars}
                            </div>
                            <!-- السعر -->
                            <span class="text-muted text-decoration-line-through">$${oldPrice}</span>
                            <strong> $${productPrice}</strong>
                        </div>
                        <!-- زر الإضافة إلى السلة -->
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
                            <a class="btn btn-outline-dark mt-auto addToCartBtn" 
   href="product-detils.html?name=${encodeURIComponent(productName)}&image=${encodeURIComponent(productImage)}&price=${productPrice}&oldPrice=${oldPrice}&evaluation=${evaluation}&description=${productDescription}&category=${category}">
   Add to cart
</a>

                        </div>
                    </div>
                </div>
            `;

            // Append the card to the container
            productContainer.innerHTML += productCard;
        });
    })
    .catch(error => console.error('Error fetching data:', error));



    document.addEventListener("DOMContentLoaded", function () {
        updateCartCount(); // تحديث عدد المنتجات عند تحميل الصفحة
    });
    document.addEventListener("DOMContentLoaded", function () {
        let cartForm = document.getElementById("cartForm");
        let cartCount = document.getElementById("cartCount");
    
        // منع إعادة تحميل الصفحة عند الضغط على الزر
        cartForm.addEventListener("submit", function (event) {
            event.preventDefault(); // ⛔️ يمنع السلوك الافتراضي للنموذج
            window.location.href = "cart.html"; // ✅ تحويل المستخدم إلى صفحة العربة
        });
    
        // تحديث عدد المنتجات في العربة
        function updateCartCount() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalQuantity;
        }
    
        updateCartCount();
    });    