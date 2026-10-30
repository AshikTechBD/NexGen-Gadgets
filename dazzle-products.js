/* Render Dazzle's phone-category snapshot alongside the existing catalog. */
function renderDazzlePhones() {
    var grid = document.querySelector(".product-grid");
    if (!grid || typeof dazzlePhoneRows === "undefined") return;
    var previousCount = grid.querySelectorAll(".product-card").length;
    var fragment = document.createDocumentFragment();
    var fallbackPhoto = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=75";

    dazzlePhoneRows.forEach(function (row) {
        var name = row[0];
        var price = row[1];
        var brandName = row[3];
        var availability = row[4];
        var card = document.createElement("article");
        card.className = "product-card dazzle-card";
        card.setAttribute("data-brand", "dazzle");
        card.setAttribute("data-phone-brand", brandName);

        var thumb = document.createElement("div");
        thumb.className = "thumb";
        var image = document.createElement("img");
        image.src = row[2] || fallbackPhoto;
        image.alt = "Product photo of " + name;
        image.loading = "lazy";
        image.decoding = "async";
        image.onerror = function () {
            image.onerror = null;
            image.src = fallbackPhoto;
        };
        thumb.appendChild(image);
        card.appendChild(thumb);

        var body = document.createElement("div");
        body.className = "product-body";
        var source = document.createElement("span");
        source.className = "apple-badge";
        source.textContent = "Dazzle · " + brandName;
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = "Smartphone";
        var title = document.createElement("h3");
        title.textContent = name;
        var description = document.createElement("p");
        description.textContent = "Listed phone price from Dazzle's public catalog. Please confirm availability before ordering.";
        var priceRow = document.createElement("div");
        priceRow.className = "price-row";
        var priceText = document.createElement("span");
        priceText.className = "price";
        priceText.textContent = price === null ? "Price on request" : "BDT " + price.toLocaleString("en-US");
        priceRow.appendChild(priceText);

        var actions = document.createElement("div");
        actions.className = "product-actions";
        var buyButton = document.createElement("button");
        buyButton.type = "button";
        buyButton.className = "btn btn-buy";
        buyButton.textContent = price === null ? "Ask Price" :
            availability === "in" ? "Buy Now" : "Check Availability";
        buyButton.onclick = function () { buyNow(name, price); };
        actions.appendChild(buyButton);
        if (price !== null && availability === "in") {
            var cartButton = document.createElement("button");
            cartButton.type = "button";
            cartButton.className = "btn btn-cart";
            cartButton.textContent = "🛒";
            cartButton.setAttribute("aria-label", "Add " + name + " to cart");
            cartButton.onclick = function () { addToCart(name, price); };
            actions.appendChild(cartButton);
        }

        body.appendChild(source);
        body.appendChild(tag);
        body.appendChild(title);
        body.appendChild(description);
        if (availability !== "in") {
            var badge = document.createElement("span");
            badge.className = "availability-badge";
            badge.textContent = availability === "discontinued" ? "Discontinued" :
                availability === "out" ? "Out of stock" :
                availability === "preorder" ? "Pre-order" : "Price TBA";
            body.appendChild(badge);
        }
        body.appendChild(priceRow);
        body.appendChild(actions);
        card.appendChild(body);
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
    var count = document.getElementById("catalogCount");
    if (count) count.textContent = (previousCount + dazzlePhoneRows.length) + " gadgets in our collection";

    var brandFilter = document.getElementById("brandFilter");
    if (brandFilter) {
        var brands = [...new Set(dazzlePhoneRows.map(function (row) { return row[3]; }))].sort();
        brands.forEach(function (brand) {
            var option = document.createElement("option");
            option.value = brand;
            option.textContent = brand === "iqoo" ? "iQOO" :
                brand === "oppo" ? "OPPO" : brand.charAt(0).toUpperCase() + brand.slice(1);
            brandFilter.appendChild(option);
        });
    }
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", renderDazzlePhones);
}
