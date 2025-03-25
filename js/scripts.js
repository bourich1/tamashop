// ✅ قراءة بيانات المنتج من الرابط
const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get("name");
const productImage = urlParams.get("image");
const productPrice = urlParams.get("price");
const oldPrice = urlParams.get("oldPrice");
const category = urlParams.get("category");
const productDescription = urlParams.get("description");
const sku = "BST-498"; // مثال، يمكن تغييره حسب الحاجة

// ✅ عرض بيانات المنتج الأساسي
document.getElementById("productName").innerText = productName;
document.getElementById("productImage").src = productImage;
document.getElementById("productPrice").innerText = `${productPrice} DH`;
document.getElementById("oldPrice").innerText = oldPrice
  ? `${oldPrice} DH`
  : "";
document.getElementById("productDescription").innerText = productDescription;
document.getElementById("sku").innerText = sku;
document.getElementById("productCategory").innerText = category;

// API KEYS
const spaceId = "r3bner2cqrh8";
const accessToken = "o5u_OoaEVt3BfjO7f6ohokvbzWqTV7z53G-wbRJaq2U";
const environment = "master";
const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}`;
// ✅ جلب جميع المنتجات من API أو قاعدة بيانات (مثال باستخدام Fetch)
fetch(url) // استبدل برابط API الحقيقي
  .then((response) => response.json())
  .then((data) => {
    if (!data.items || !Array.isArray(data.items)) {
      console.error("Invalid API response: No products found.");
      return;
    }

    // استخراج الفئة من الرابط
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("category");
    const currentProductName = urlParams.get("name");

    // استخراج الصور من includes
    const assetMap = {};
    if (data.includes && data.includes.Asset) {
      data.includes.Asset.forEach((asset) => {
        assetMap[asset.sys.id] = asset.fields.file.url.startsWith("//")
          ? "https:" + asset.fields.file.url
          : asset.fields.file.url;
      });
    }

    // تصفية المنتجات بناءً على الفئة وعدم تكرار المنتج الحالي
    const relatedProducts = data.items.filter(
      (product) =>
        product.fields?.category === currentCategory &&
        product.fields?.name !== currentProductName
    );

    const relatedContainer = document.querySelector(
      ".row.justify-content-center"
    );
    relatedContainer.innerHTML = ""; // تفريغ المحتوى قبل الإضافة الجديدة

    relatedProducts.forEach((product) => {
      const fields = product.fields || {}; // تجنب الخطأ إذا لم يكن `fields` معرفًا
      const imageUrl =
        assetMap[fields.image?.sys?.id] ||
        "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";
      const oldPrice = fields.oldPrice ? `${fields.oldPrice} DH` : "";

      const productCard = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <img class="card-img-top" src="${imageUrl}" alt="${
        fields.name || "No Name"
      }" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${
                                  fields.name || "No Name"
                                }</h5>
                                <div class="fs-5">
                                    <span class=" text-decoration-line-through text-danger">${oldPrice} </span>
                                    ${fields.price || "N/A"} DH
                                </div>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto" href="product-detils.html?name=${encodeURIComponent(
                                  fields.name || ""
                                )}&image=${encodeURIComponent(
        imageUrl
      )}&price=${fields.price || ""}&oldPrice=${
        fields.oldPrice || ""
      }&category=${fields.category || ""}&description=${encodeURIComponent(
        fields.description || ""
      )}">
                                       شراء المنتج
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      relatedContainer.innerHTML += productCard;
    });

    // ✅ عرض رسالة إذا لم يكن هناك منتجات ذات صلة
    if (relatedProducts.length === 0) {
      relatedContainer.innerHTML =
        '<p class="text-center">No related products found.</p>';
    }
  })
  .catch((error) => console.error("Error fetching related products:", error));

document.addEventListener("DOMContentLoaded", function () {
  let addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      let productImage =
        document.getElementById("productImage")?.src ||
        "https://via.placeholder.com/150";
      let product = {
        name:
          document.getElementById("productName").innerText || "Unknown Product",
        price:
          document.getElementById("productPrice").innerText.replace("$", "") ||
          "0",
        oldPrice:
          document.getElementById("oldPrice").innerText.replace("$", "") || "0",
        category:
          document.getElementById("productCategory").innerText ||
          "Uncategorized",
        image: productImage,
        quantity: parseInt(document.getElementById("inputQuantity").value) || 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let existingProduct = cart.find((item) => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        title: "إضافة ناجحة!",
        text: "هل ترغب بزيارة العربة؟",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "نعم، انتقل إلى العربة",
        cancelButtonText: "متابعة التسوق",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "cart.html";
        }
      });
    });
  } else {
    console.error("❌ Error: زر إضافة إلى العربة غير موجود!");
  }
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

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount(); // تحديث عدد المنتجات عند تحميل الصفحة
});
