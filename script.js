/* ===========================================================
   NexGen Gadgets - Shared JavaScript
   Author: Md. Asiquzzaman (ID: 2220772)
   =========================================================== */

var CART_KEY = "nexgenCartCount";
var currentCategory = "all";

function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
        toast.classList.remove("show");
    }, 2600);
}

function goToProducts() {
    window.location.href = "products.html";
}

function showDeal() {
    var deals = [
        "Deal of the day: NexGen Studio ANC at 15% off!",
        "Flash offer: free shipping on all orders above 2,000 BDT.",
        "Student special: extra 5% off on laptops with valid ID.",
        "Weekend drop: NexGen Fit Watch 3 now BDT 11,499 only!"
    ];
    var pick = deals[Math.floor(Math.random() * deals.length)];
    showToast(pick);
}

function getCartCount() {
    var saved = window.localStorage.getItem(CART_KEY);
    var count = parseInt(saved, 10);
    return isNaN(count) ? 0 : count;
}

function updateCartBadge() {
    var badge = document.getElementById("cartCount");
    if (badge) {
        badge.textContent = getCartCount();
    }
}

function addToCart(productName, price) {
    var count = getCartCount() + 1;
    window.localStorage.setItem(CART_KEY, String(count));
    updateCartBadge();
    showToast(productName + " added to cart (BDT " + price.toLocaleString() + ").");
}

function clearCart() {
    window.localStorage.removeItem(CART_KEY);
    updateCartBadge();
    showToast("Your cart is now empty.");
}

function sendMessage() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");

    if (!name.value.trim()) {
        showToast("Please enter your name.");
        name.focus();
        return;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        showToast("Please enter a valid email address.");
        email.focus();
        return;
    }

    if (!message.value.trim()) {
        showToast("Please write a short message.");
        message.focus();
        return;
    }

    var form = name.form;
    var sender = name.value.trim();
    var button = form.querySelector("button[onclick='sendMessage()']");
    button.disabled = true;
    showToast("Sending your message...");
    submitNetlifyForm(form).then(function () {
        form.reset();
        showToast("Thanks " + sender + "! Your message was sent successfully.");
    }).catch(function () {
        showToast("Could not send your message. Please try again on the live site.");
    }).finally(function () {
        button.disabled = false;
    });
}

function resetForm() {
    var form = document.querySelector("form[name='contact']");
    if (form) {
        form.reset();
    }
    showToast("Form cleared.");
}

function submitNetlifyForm(form) {
    var data = new URLSearchParams(new FormData(form));
    return fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString()
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Submission failed");
        }
    });
}

function setCategory(category, button) {
    currentCategory = category;
    var chips = document.querySelectorAll("#filterButtons .chip");
    for (var i = 0; i < chips.length; i++) {
        chips[i].classList.remove("active");
    }
    if (button) {
        button.classList.add("active");
    }
    filterProducts();
}

function filterProducts() {
    var input = document.getElementById("productSearch");
    var query = input ? input.value.trim().toLowerCase() : "";
    var cards = document.querySelectorAll(".product-card");
    var visible = 0;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var tag = card.querySelector(".tag");
        var tagText = tag ? tag.textContent.trim().toLowerCase() : "";
        var matchesCategory =
            currentCategory === "all" || tagText === currentCategory;
        var matchesQuery = card.textContent.toLowerCase().indexOf(query) !== -1;

        if (matchesCategory && matchesQuery) {
            card.removeAttribute("hidden");
            visible++;
        } else {
            card.setAttribute("hidden", "");
        }
    }

    var empty = document.getElementById("noResults");
    if (empty) {
        if (visible === 0) {
            empty.removeAttribute("hidden");
        } else {
            empty.setAttribute("hidden", "");
        }
    }
}

function subscribeNewsletter() {
    var input = document.getElementById("newsletterEmail");
    if (!input) {
        return false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value.trim())) {
        showToast("Please enter a valid email address.");
        input.focus();
        return false;
    }
    var form = input.form;
    var button = form.querySelector("button[onclick='subscribeNewsletter()']");
    button.disabled = true;
    showToast("Subscribing...");
    submitNetlifyForm(form).then(function () {
        input.value = "";
        showToast("You're subscribed! Welcome to the NexGen family.");
    }).catch(function () {
        showToast("Could not subscribe. Please try again on the live site.");
    }).finally(function () {
        button.disabled = false;
    });
    return false;
}

function setupRetailHeader() {
    var header = document.querySelector(".site-header");
    if (!header) {
        return;
    }
    var inner = header.querySelector(".header-inner");
    var search = document.createElement("form");
    search.className = "site-search";
    search.setAttribute("role", "search");
    search.setAttribute("onsubmit", "return searchSite(event)");
    search.innerHTML = '<label class="sr-only" for="headerSearch">Search the store</label>' +
        '<input id="headerSearch" type="search" placeholder="Search phones, laptops, accessories..." autocomplete="off">' +
        '<button type="submit" aria-label="Search products">Search</button>';
    inner.insertBefore(search, inner.querySelector(".navbar"));

    var nav = document.createElement("nav");
    nav.className = "category-nav";
    nav.setAttribute("aria-label", "Shop by category");
    nav.innerHTML = '<div class="container categories-inner">' +
        '<a href="products.html?category=smartphone">Phones <span>⌄</span></a>' +
        '<a href="products.html?category=tablet">Tablets &amp; Accessories <span>⌄</span></a>' +
        '<a href="products.html?category=laptop">Laptops <span>⌄</span></a>' +
        '<a href="products.html?category=audio">Audio <span>⌄</span></a>' +
        '<div class="mega">' +
            '<button type="button" class="mega-toggle" aria-expanded="false" aria-controls="categoryMenu" onclick="toggleMega(this)">Gadgets &amp; Accessories <span>⌄</span></button>' +
            '<div class="mega-panel" id="categoryMenu">' +
                '<div class="container mega-grid" id="megaGrid"></div>' +
                '<div class="container mega-foot"><span>Explore all products under <strong>Gadgets &amp; Accessories</strong></span>' +
                    '<a href="products.html">View All Gadgets &amp; Accessories &rarr;</a></div>' +
            '</div>' +
        '</div>' +
        '<a href="products.html?category=wearable">Wearables <span>⌄</span></a>' +
        '<a href="products.html?category=camera">Camera &amp; Networking <span>⌄</span></a>' +
        '<a href="contact.html">Contact Us</a>' +
        '</div>';
    header.appendChild(nav);

    var groups = [
        ["Phones", ["Smartphones", "Phone Cover", "Screen Protector", "Wireless Chargers", "Power Bank", "Smart Gadgets"]],
        ["Audio", ["Wireless Headphones", "Earbuds", "Speakers", "Bluetooth Speakers", "Smart Speakers", "Over-Ear Headphones"]],
        ["Accessories", ["Phone Cases", "AirPods Case", "MacBook Cover", "Chargers", "Wireless Chargers", "Cables"]],
        ["Connectivity", ["Type-C Cable", "USB Hub", "Converter", "Lightning Cable", "Camera Accessories", "Adapters"]],
        ["Computing", ["Laptops", "Tablets", "Desktop Accessories", "MacBook", "Camera", "Smartwatch"]],
        ["More to explore", ["Power Banks", "Wearables", "Audio Gear", "Phone Accessories", "Photography", "View All Products"]]
    ];
    var categoryByItem = {
        "Smartphones": "smartphone", "Laptops": "laptop", "MacBook": "laptop",
        "Tablets": "tablet", "Smartwatch": "wearable", "Wearables": "wearable",
        "Camera": "camera", "Photography": "camera", "Camera Accessories": "camera",
        "Audio": "audio", "Audio Gear": "audio", "Earbuds": "audio",
        "Speakers": "audio", "Bluetooth Speakers": "audio", "Smart Speakers": "audio",
        "Wireless Headphones": "audio", "Over-Ear Headphones": "audio"
    };
    var grid = nav.querySelector("#megaGrid");
    groups.forEach(function (group) {
        var col = document.createElement("div");
        col.className = "mega-col";
        var title = document.createElement("h3");
        title.textContent = group[0];
        col.appendChild(title);
        group[1].forEach(function (item) {
            var link = document.createElement("a");
            link.textContent = item;
            link.href = item === "View All Products" ? "products.html" :
                "products.html?category=" + (categoryByItem[item] || "accessory");
            col.appendChild(link);
        });
        grid.appendChild(col);
    });
}

function toggleMega(button) {
    var menu = button.closest(".mega");
    var isOpen = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
}

function searchSite(event) {
    event.preventDefault();
    var query = document.getElementById("headerSearch").value.trim();
    if (!query) {
        return false;
    }
    var localSearch = document.getElementById("productSearch");
    if (localSearch) {
        localSearch.value = query;
        filterProducts();
        localSearch.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        window.location.href = "products.html?q=" + encodeURIComponent(query);
    }
    return false;
}

function applyCatalogQuery() {
    var input = document.getElementById("productSearch");
    if (!input) {
        return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    var category = params.get("category");
    if (query) {
        input.value = query;
    }
    if (category) {
        var chips = document.querySelectorAll("#filterButtons .chip");
        for (var i = 0; i < chips.length; i++) {
            if (chips[i].getAttribute("onclick") === "setCategory('" + category + "', this)") {
                setCategory(category, chips[i]);
                return;
            }
        }
    }
    filterProducts();
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    setupRetailHeader();
    applyCatalogQuery();
});
