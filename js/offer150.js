// API KEYS
const spaceId = 'r3bner2cqrh8';
const accessToken = 'o5u_OoaEVt3BfjO7f6ohokvbzWqTV7z53G-wbRJaq2U';
const environment = 'master';


// get offer api 
fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=offer`)
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