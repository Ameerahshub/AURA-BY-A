/* =========================================
   AURA BY A — Contact Page JavaScript
   ========================================= */

// -----------------------------------------
// Helpers
// -----------------------------------------
const $ = (id) => document.getElementById(id);


// -----------------------------------------
// Cart Count
// -----------------------------------------
function updateCartCount() {
    const badge = $('cartCount');
    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const total = cart.reduce((sum, item) => {
        return sum + (item.quantity || 1);
    }, 0);

    badge.textContent = total;
}


// -----------------------------------------
// Toast Notification
// -----------------------------------------
function showNotification(message, type = 'success') {

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} notification-toast shadow`;

    toast.innerHTML = `
        <strong>${message}</strong>
    `;

    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 9999;
        min-width: 260px;
        animation: slideInRight .35s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight .3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


// -----------------------------------------
// Validation
// -----------------------------------------
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    if (!phone) return true;
    return /^(\+234|0)[0-9]{10}$/.test(phone.replace(/\s/g, ''));
}

function setInvalid(el, state) {
    if (!el) return;
    el.classList.toggle('is-invalid', state);
}


// -----------------------------------------
// WhatsApp Send
// -----------------------------------------
function openWhatsApp(data) {

    const text = `
Hello Aura By A,

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Subject: ${data.subject}

${data.message}
`;

    const url = `https://wa.me/2348000000000?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}


// -----------------------------------------
// Form Submit
// -----------------------------------------
function handleFormSubmit(e) {
    e.preventDefault();

    const btn = $('submitBtn');
    const form = $('contactForm');

    const name = $('name').value.trim();
    const email = $('email').value.trim();
    const phone = $('phone').value.trim();
    const subject = $('subject').value;
    const message = $('message').value.trim();
    const newsletter = $('newsletter').checked;

    // ---------- Validation ----------
    if (!name || !email || !subject || !message) {
        showNotification('Please fill all required fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        setInvalid($('email'), true);
        showNotification('Invalid email address', 'danger');
        return;
    }

    if (!isValidPhone(phone)) {
        setInvalid($('phone'), true);
        showNotification('Invalid Nigerian phone number', 'warning');
        return;
    }

    // ---------- Loading state ----------
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Sending...';
    }

    const contactData = {
        name,
        email,
        phone,
        subject,
        message,
        newsletter,
        time: new Date().toISOString()
    };

    // Save locally
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push(contactData);
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Newsletter
    if (newsletter) {
        const subs = JSON.parse(localStorage.getItem('subscribers')) || [];
        if (!subs.includes(email)) {
            subs.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subs));
        }
    }

    // ---------- Email ----------
    const subjectText = encodeURIComponent(`Contact Form: ${subject}`);
    const bodyText = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
    );

    window.location.href = `mailto:info@aurabya.com?subject=${subjectText}&body=${bodyText}`;

    // ---------- WhatsApp ----------
    openWhatsApp(contactData);

    // ---------- UI ----------
    showNotification('Message sent successfully!', 'success');

    form.reset();

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Send Message';
    }
}


// -----------------------------------------
// Real-time validation
// -----------------------------------------
function enableLiveValidation() {

    const emailInput = $('email');
    const phoneInput = $('phone');

    if (emailInput) {
        emailInput.addEventListener('input', () =>
            setInvalid(emailInput, !isValidEmail(emailInput.value))
        );
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () =>
            setInvalid(phoneInput, !isValidPhone(phoneInput.value))
        );
    }
}


// -----------------------------------------
// Init
// -----------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    updateCartCount();
    enableLiveValidation();

    const form = $('contactForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
});


// -----------------------------------------
// Animations (Injected)
// -----------------------------------------
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity:0; }
    to   { transform: translateX(0); opacity:1; }
}
@keyframes slideOutRight {
    from { transform: translateX(0); opacity:1; }
    to   { transform: translateX(100%); opacity:0; }
}
`;
document.head.appendChild(style);
