// API KEYS
const spaceId = 'r3bner2cqrh8';
const accessToken = 'o5u_OoaEVt3BfjO7f6ohokvbzWqTV7z53G-wbRJaq2U';
const environment = 'master';

const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=offer`;

// get offer api 
fetch(url)
.then(response => response.json())
.then(data => {
    const offer = document.getElementById("offer");


    if (data.items.length > 0) {
        const content = data.items[0].fields;

        // جلب رابط الصورة الخلفية
const offerImgId = data.items[0]?.fields?.offerImg?.sys?.id;

// Find the asset using the extracted ID
const imageAsset = data.includes?.Asset.find(asset => asset.sys.id === offerImgId);

// Extract the image URL
const imageUrl = imageAsset ? `https:${imageAsset.fields.file.url}` : "No image found";





        
        // تحديث خلفية الهيدر
        offer.style.backgroundImage = `url(${imageUrl})`;
        offer.style.backgroundSize = "cover";
        offer.style.backgroundPosition = "center";
        offer.style.backgroundRepeat = "no-repeat";
    }
})
.catch(error => console.error("Error fetching data:", error));



fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=prudacts`)
    .then(response => response.json())
    .then(data => {
        const productContainer = document.querySelector('.productContainer');  // تأكد من وجود العنصر في الـ HTML

        // مرر عبر المنتجات المسترجعة من الـ API
        data.items.forEach(item => {
            // استخراج تفاصيل المنتج
            const productName = item.fields.name;
            const productDescription = item.fields.description;
            const productPrice = item.fields.price;
            const category = item.fields.category;
            const oldPrice = item.fields.oldPrice;
            const evaluation = item.fields.evaluation || 0; // تعيين 0 إذا لم يكن التقييم موجوداً

            // التحقق من أن السعر أقل من 79
            if (productPrice < 79) {
                // استخراج رابط الصورة
                const asset = data.includes.Asset.find(asset => asset.sys.id === item.fields.image.sys.id);
                const productImage = asset.fields.file.url.startsWith('//') ? `https:${asset.fields.file.url}` : asset.fields.file.url;

                // إنشاء التقييم على شكل نجوم
                let stars = '';
                for (let i = 0; i < 5; i++) {
                    stars += `<div class="bi-star${i < evaluation ? '-fill' : ''}"></div>`;
                }

                // إنشاء الكارت الخاص بالمنتج
                const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100"  data-category="${category}">
                            <!-- شارة الخصم -->
                            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Offer</div>
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
                                   href="product-detils.html?name=${encodeURIComponent(productName)}&image=${encodeURIComponent(productImage)}&price=${productPrice}&oldPrice=${oldPrice}&evaluation=${evaluation}&description=${encodeURIComponent(productDescription)}&category=${category}">
                                   Product view
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                // إضافة الكارت إلى الحاوية
                productContainer.innerHTML += productCard;
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));

