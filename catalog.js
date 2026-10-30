/* Real product photography: DummyJSON product image CDN.
   The 94 catalog bundles below join six featured products for 100 items. */
var catalogModels = [
    ["iPhone 5s", "Smartphone", "smartphones/iphone-5s", 199.99],
    ["iPhone 6", "Smartphone", "smartphones/iphone-6", 299.99],
    ["iPhone 13 Pro", "Smartphone", "smartphones/iphone-13-pro", 1099.99],
    ["iPhone X", "Smartphone", "smartphones/iphone-x", 899.99],
    ["Oppo A57", "Smartphone", "smartphones/oppo-a57", 249.99],
    ["Oppo F19 Pro Plus", "Smartphone", "smartphones/oppo-f19-pro-plus", 399.99],
    ["Oppo K1", "Smartphone", "smartphones/oppo-k1", 299.99],
    ["Realme C35", "Smartphone", "smartphones/realme-c35", 149.99],
    ["Realme X", "Smartphone", "smartphones/realme-x", 299.99],
    ["Realme XT", "Smartphone", "smartphones/realme-xt", 349.99],
    ["Samsung Galaxy S7", "Smartphone", "smartphones/samsung-galaxy-s7", 299.99],
    ["Samsung Galaxy S8", "Smartphone", "smartphones/samsung-galaxy-s8", 499.99],
    ["Samsung Galaxy S10", "Smartphone", "smartphones/samsung-galaxy-s10", 699.99],
    ["Vivo S1", "Smartphone", "smartphones/vivo-s1", 249.99],
    ["Vivo V9", "Smartphone", "smartphones/vivo-v9", 299.99],
    ["Vivo X21", "Smartphone", "smartphones/vivo-x21", 499.99],
    ["Apple MacBook Pro 14 Inch Space Grey", "Laptop", "laptops/apple-macbook-pro-14-inch-space-grey", 1999.99],
    ["Asus Zenbook Pro Dual Screen Laptop", "Laptop", "laptops/asus-zenbook-pro-dual-screen-laptop", 1799.99],
    ["Huawei Matebook X Pro", "Laptop", "laptops/huawei-matebook-x-pro", 1399.99],
    ["Lenovo Yoga 920", "Laptop", "laptops/lenovo-yoga-920", 1099.99],
    ["Dell XPS 13 9300", "Laptop", "laptops/new-dell-xps-13-9300-laptop", 1499.99],
    ["Amazon Echo Plus", "Audio", "mobile-accessories/amazon-echo-plus", 99.99],
    ["Apple AirPods", "Audio", "mobile-accessories/apple-airpods", 129.99],
    ["Apple AirPods Max Silver", "Audio", "mobile-accessories/apple-airpods-max-silver", 549.99],
    ["Apple AirPower Wireless Charger", "Accessory", "mobile-accessories/apple-airpower-wireless-charger", 79.99],
    ["Apple HomePod Mini Cosmic Grey", "Audio", "mobile-accessories/apple-homepod-mini-cosmic-grey", 99.99],
    ["Apple iPhone Charger", "Accessory", "mobile-accessories/apple-iphone-charger", 19.99],
    ["Apple MagSafe Battery Pack", "Accessory", "mobile-accessories/apple-magsafe-battery-pack", 99.99],
    ["Apple Watch Series 4 Gold", "Wearable", "mobile-accessories/apple-watch-series-4-gold", 349.99],
    ["Beats Flex Wireless Earphones", "Audio", "mobile-accessories/beats-flex-wireless-earphones", 49.99],
    ["iPhone 12 Silicone Case MagSafe Plum", "Accessory", "mobile-accessories/iphone-12-silicone-case-with-magsafe-plum", 29.99],
    ["Monopod", "Camera", "mobile-accessories/monopod", 19.99],
    ["Selfie Lamp with iPhone", "Camera", "mobile-accessories/selfie-lamp-with-iphone", 14.99],
    ["Selfie Stick Monopod", "Camera", "mobile-accessories/selfie-stick-monopod", 12.99],
    ["TV Studio Camera Pedestal", "Camera", "mobile-accessories/tv-studio-camera-pedestal", 499.99],
    ["iPad Mini 2021 Starlight", "Tablet", "tablets/ipad-mini-2021-starlight", 499.99],
    ["Samsung Galaxy Tab S8 Plus Grey", "Tablet", "tablets/samsung-galaxy-tab-s8-plus-grey", 599.99],
    ["Samsung Galaxy Tab White", "Tablet", "tablets/samsung-galaxy-tab-white", 349.99]
];

function renderCatalog() {
    var grid = document.querySelector(".product-grid");
    if (!grid) {
        return;
    }

    var added = 0;
    var variants = ["Standard", "Gift Bundle", "Care Bundle"];
    for (var variant = 0; variant < variants.length && added < 94; variant++) {
        for (var i = 0; i < catalogModels.length && added < 94; i++) {
            var model = catalogModels[i];
            var title = model[0] + " - " + variants[variant];
            var price = Math.round(model[3] * 120 * (1 + variant * 0.08));
            var photo = "https://cdn.dummyjson.com/product-images/" + model[2] +
                (variant === 1 ? "/1.webp" : "/thumbnail.webp");
            var card = document.createElement("article");
            card.className = "product-card";

            var thumb = document.createElement("div");
            thumb.className = "thumb";
            var image = document.createElement("img");
            image.src = photo;
            image.alt = "Product photograph of " + model[0];
            image.loading = "lazy";
            image.decoding = "async";
            thumb.appendChild(image);
            card.appendChild(thumb);

            var body = document.createElement("div");
            body.className = "product-body";
            var tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = model[1];
            var heading = document.createElement("h3");
            heading.textContent = title;
            var description = document.createElement("p");
            description.textContent = variants[variant] + " edition of " + model[0] + ". Browse our collection and add it to your cart.";
            var priceRow = document.createElement("div");
            priceRow.className = "price-row";
            var priceLabel = document.createElement("span");
            priceLabel.className = "price";
            priceLabel.textContent = "BDT " + price.toLocaleString("en-US");
            priceRow.appendChild(priceLabel);
            var actions = document.createElement("div");
            actions.className = "product-actions";
            var buyButton = document.createElement("button");
            buyButton.type = "button";
            buyButton.className = "btn btn-buy";
            buyButton.textContent = "Buy Now";
            buyButton.onclick = (function (itemName, itemPrice) {
                return function () { buyNow(itemName, itemPrice); };
            })(title, price);
            var cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-cart";
            cartButton.textContent = "🛒";
            cartButton.setAttribute("aria-label", "Add " + title + " to cart");
            cartButton.onclick = (function (itemName, itemPrice) {
                return function () { addToCart(itemName, itemPrice); };
            })(title, price);
            actions.appendChild(buyButton);
            actions.appendChild(cartButton);
            body.appendChild(tag);
            body.appendChild(heading);
            body.appendChild(description);
            body.appendChild(priceRow);
            body.appendChild(actions);
            card.appendChild(body);
            grid.appendChild(card);
            added++;
        }
    }

    var count = document.getElementById("catalogCount");
    if (count) {
        count.textContent = grid.querySelectorAll(".product-card").length + " gadgets in our collection";
    }
}

document.addEventListener("DOMContentLoaded", renderCatalog);
