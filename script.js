/* ===========================================================
   NexGen Gadgets - Shared JavaScript
   Author: Md. Asiquzzaman (ID: 2220772)
   =========================================================== */

var CART_KEY = "nexgenCartCount";

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

    showToast("Thanks " + name.value.trim() + "! Your message was sent successfully.");
    resetForm();
}

function resetForm() {
    var form = document.querySelector("form");
    if (form) {
        form.reset();
    }
    showToast("Form cleared.");
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
    showToast("You're subscribed! Welcome to the NexGen family.");
    input.value = "";
    return false;
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
