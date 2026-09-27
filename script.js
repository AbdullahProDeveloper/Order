/* ═══════════════════════════════════════════════════════════════
   ECOSHOP PRO MAX — ULTIMATE ENTERPRISE APP.JS
   Complete SPA with Firebase RTDB + ImgBB + Phosphor Icons
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   1. FIREBASE SDK IMPORTS
   ═══════════════════════════════════════════════════════════════ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  remove,
  onValue,
  query,
  limitToLast
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ═══════════════════════════════════════════════════════════════
   2. FIREBASE CONFIG
   ═══════════════════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyBiBGWukd3PNjxK6-gv_4qiCHmwAfO3GzQ",
  authDomain: "hesab-khata.firebaseapp.com",
  databaseURL: "https://hesab-khata-default-rtdb.firebaseio.com",
  projectId: "hesab-khata",
  storageBucket: "hesab-khata.firebasestorage.app",
  messagingSenderId: "138943764760",
  appId: "1:138943764760:web:908c5abacc6122a55d266d",
  measurementId: "G-0HG3FJSS4X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

/* ═══════════════════════════════════════════════════════════════
   3. IMGBB IMAGE UPLOAD SERVICE
   ═══════════════════════════════════════════════════════════════ */
const IMGBB_API_KEY = "811434d9b77765dbedbb9662b98a0f74";
const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

async function uploadToImgBB(file) {
  console.log("📤 uploadToImgBB:", file?.name, file?.size, "bytes");

  if (!file) throw new Error("কোনো ফাইল পাওয়া যায়নি");
  if (!file.type.startsWith("image/")) throw new Error("শুধুমাত্র ইমেজ ফাইল");
  if (file.size > 32 * 1024 * 1024) throw new Error("ফাইল ৩২MB এর চেয়ে ছোট হতে হবে");

  // Base64 এ কনভার্ট
  let base64;
  try {
    base64 = await fileToBase64(file);
    console.log("✅ Base64 length:", base64.length);
  } catch (e) {
    console.error("❌ fileToBase64 failed:", e);
    throw new Error("ফাইল পড়তে সমস্যা: " + e.message);
  }

  const base64Data = base64.split(",")[1];
  if (!base64Data) throw new Error("Base64 ডেটা পাওয়া যায়নি");

  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64Data);
  formData.append("name", file.name.replace(/\.[^.]+$/, "") || "product");

  console.log("🚀 POST to ImgBB...");

  let res;
  try {
    res = await fetch(IMGBB_ENDPOINT, { method: "POST", body: formData });
  } catch (netErr) {
    console.error("❌ Network error:", netErr);
    // CORS fallback
    return await uploadViaDirectPost(base64Data, file.name);
  }

  console.log("📥 Response:", res.status);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ImgBB HTTP ${res.status}: ${text.slice(0, 100)}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error("ImgBB: " + (data?.error?.message || "Unknown"));
  }

  const url = data.data.display_url || data.data.url || data.data.image?.url;
  if (!url) throw new Error("ImgBB URL পাওয়া যায়নি");
  console.log("✅ Upload success:", url);
  return url;
}

async function uploadViaDirectPost(base64Data, filename) {
  console.log("🔄 Trying fallback: URL-encoded POST");
  const params = new URLSearchParams();
  params.append("key", IMGBB_API_KEY);
  params.append("image", base64Data);
  params.append("name", filename.replace(/\.[^.]+$/, ""));

  const res = await fetch(IMGBB_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const data = await res.json();
  if (!data.success) throw new Error("ImgBB: " + (data?.error?.message || "Upload failed"));

  const url = data.data.display_url || data.data.url || data.data.image?.url;
  console.log("✅ Fallback success:", url);
  return url;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("ফাইল নেই"));
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return reject(new Error("Reader invalid"));
      resolve(result);
    };
    reader.onerror = (e) => reject(new Error("FileReader: " + (e.target?.error?.message || "unknown")));
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. TRANSLATIONS (I18N)
   ═══════════════════════════════════════════════════════════════ */
const I18N = {
  bn: {
    home: "হোম", products: "পণ্য", orders: "অর্ডার", cart: "কার্ট",
    profile: "প্রোফাইল", dashboard: "ড্যাশবোর্ড", settings: "সেটিংস",
    wishlist: "উইশলিস্ট", login: "লগইন", signup: "সাইনআপ", logout: "লগআউট",
    email: "ইমেইল", password: "পাসওয়ার্ড", name: "পূর্ণ নাম", phone: "ফোন",
    address: "ঠিকানা", search: "পণ্য খুঁজুন...",
    add_to_cart: "কার্টে যোগ করুন", buy_now: "এখনই কিনুন",
    price: "দাম", total: "মোট", subtotal: "সাবটোটাল",
    checkout: "চেকআউট করুন", place_order: "অর্ডার কনফার্ম",
    notifications: "নোটিফিকেশন", no_notifications: "কোনো নোটিফিকেশন নেই",
    welcome: "স্বাগতম", my_orders: "আমার অর্ডার",
    add_product: "নতুন পণ্য", edit_product: "পণ্য এডিট",
    product_name: "পণ্যের নাম", product_desc: "পণ্যের বিবরণ",
    product_image: "পণ্যের ছবি", product_category: "ক্যাটাগরি",
    save: "সংরক্ষণ", cancel: "বাতিল", delete: "মুছুন", edit: "এডিট",
    status: "স্ট্যাটাস", pending: "অপেক্ষমাণ", confirmed: "কনফার্মড",
    shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল",
    quick_links: "দ্রুত লিংক", support: "সাপোর্ট", contact: "যোগাযোগ",
    rights: "সকল অধিকার সংরক্ষিত",
    no_products: "কোনো পণ্য নেই", loading: "লোড হচ্ছে...",
    cart_empty: "আপনার কার্ট খালি", wishlist_empty: "উইশলিস্ট খালি",
    order_success: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
    login_success: "লগইন সফল", signup_success: "অ্যাকাউন্ট তৈরি হয়েছে",
    invalid_credentials: "ভুল ইমেইল বা পাসওয়ার্ড",
    logged_out: "লগআউট সফল", error_occurred: "সমস্যা হয়েছে",
    profile_updated: "প্রোফাইল আপডেট হয়েছে", settings_saved: "সেটিংস সেভ হয়েছে",
    admin_dashboard: "এডমিন ড্যাশবোর্ড", user_dashboard: "ইউজার ড্যাশবোর্ড",
    total_products: "মোট পণ্য", total_orders: "মোট অর্ডার",
    total_users: "মোট ইউজার", revenue: "মোট আয়",
    recent_orders: "সাম্প্রতিক অর্ডার", customer: "গ্রাহক",
    voice_not_supported: "এই ব্রাউজারে ভয়েস সার্চ সমর্থিত নয়",
    login_required: "অনুগ্রহ করে লগইন করুন",
    category: "ক্যাটাগরি", all: "সব", sort: "সাজান",
    sort_new: "নতুন আগে", sort_price_low: "দাম: কম থেকে বেশি",
    sort_price_high: "দাম: বেশি থেকে কম", sort_popular: "জনপ্রিয়",
    min_price: "সর্বনিম্ন দাম", max_price: "সর্বোচ্চ দাম",
    hero_title: "আপনার প্রয়োজনীয় সবকিছু এক জায়গায়",
    hero_sub: "প্রফেশনাল, নিরাপদ এবং দ্রুত ই-কমার্স প্ল্যাটফর্ম।",
    shop_now: "কেনাকাটা শুরু করুন", explore: "এক্সপ্লোর করুন",
    products_count: "পণ্য", happy_customers: "সন্তুষ্ট গ্রাহক",
    orders_delivered: "ডেলিভারড অর্ডার", rating: "রেটিং",
    featured: "ফিচার্ড পণ্য", quick_view: "দ্রুত দেখুন",
    stock: "স্টক", out_of_stock: "স্টক নেই", in_stock: "স্টকে আছে",
    product_added: "পণ্য সফলভাবে যোগ হয়েছে",
    product_updated: "পণ্য আপডেট হয়েছে",
    product_deleted: "পণ্য মুছে ফেলা হয়েছে",
    confirm_delete: "আপনি কি নিশ্চিত মুছতে চান?",
    password_short: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর",
    uploading_image: "ছবি আপলোড হচ্ছে..."
  },
  en: {
    home: "Home", products: "Products", orders: "Orders", cart: "Cart",
    profile: "Profile", dashboard: "Dashboard", settings: "Settings",
    wishlist: "Wishlist", login: "Login", signup: "Sign Up", logout: "Logout",
    email: "Email", password: "Password", name: "Full Name", phone: "Phone",
    address: "Address", search: "Search products...",
    add_to_cart: "Add to Cart", buy_now: "Buy Now",
    price: "Price", total: "Total", subtotal: "Subtotal",
    checkout: "Checkout", place_order: "Place Order",
    notifications: "Notifications", no_notifications: "No notifications",
    welcome: "Welcome", my_orders: "My Orders",
    add_product: "Add Product", edit_product: "Edit Product",
    product_name: "Product Name", product_desc: "Description",
    product_image: "Image", product_category: "Category",
    save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit",
    status: "Status", pending: "Pending", confirmed: "Confirmed",
    shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
    quick_links: "Quick Links", support: "Support", contact: "Contact",
    rights: "All rights reserved",
    no_products: "No products available", loading: "Loading...",
    cart_empty: "Your cart is empty", wishlist_empty: "Wishlist is empty",
    order_success: "Order placed successfully!",
    login_success: "Login successful", signup_success: "Account created",
    invalid_credentials: "Invalid email or password",
    logged_out: "Logged out successfully", error_occurred: "An error occurred",
    profile_updated: "Profile updated", settings_saved: "Settings saved",
    admin_dashboard: "Admin Dashboard", user_dashboard: "User Dashboard",
    total_products: "Total Products", total_orders: "Total Orders",
    total_users: "Total Users", revenue: "Total Revenue",
    recent_orders: "Recent Orders", customer: "Customer",
    voice_not_supported: "Voice search not supported in this browser",
    login_required: "Please log in first",
    category: "Category", all: "All", sort: "Sort",
    sort_new: "Newest first", sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low", sort_popular: "Popular",
    min_price: "Min Price", max_price: "Max Price",
    hero_title: "Everything you need in one place",
    hero_sub: "Professional, secure, and fast e-commerce platform.",
    shop_now: "Start Shopping", explore: "Explore Now",
    products_count: "Products", happy_customers: "Happy Customers",
    orders_delivered: "Orders Delivered", rating: "Rating",
    featured: "Featured Products", quick_view: "Quick View",
    stock: "Stock", out_of_stock: "Out of Stock", in_stock: "In Stock",
    product_added: "Product added successfully",
    product_updated: "Product updated",
    product_deleted: "Product deleted",
    confirm_delete: "Are you sure you want to delete?",
    password_short: "Password must be at least 6 characters",
    uploading_image: "Uploading image..."
  }
};

/* ═══════════════════════════════════════════════════════════════
   5. GLOBAL STATE
   ═══════════════════════════════════════════════════════════════ */
const state = {
  lang: localStorage.getItem("lang") || "bn",
  themeMode: localStorage.getItem("themeMode") || "light", // light | dark | auto
  theme: "light",
  user: null,
  userProfile: null,
  isAdmin: false,
  authReady: false,
  products: [],
  users: [],
  orders: [],
  categories: [],
  coupons: [],
  banners: [],
  reviews: [],
  activityLogs: [],
  siteSettings: {},
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  notifications: [],
  notifFilter: "all",
  filters: { category: "all", sort: "new", minPrice: "", maxPrice: "", query: "" },
  adminPage: "overview",
  charts: {}
};

const DEFAULT_CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys", "Grocery"];

/* ═══════════════════════════════════════════════════════════════
   6. UTILITIES
   ═══════════════════════════════════════════════════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (k) => I18N[state.lang][k] || k;
const esc = (s) => s == null ? "" : String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const fmtPrice = (n) => "৳" + (Number(n) || 0).toLocaleString(state.lang === "bn" ? "bn-BD" : "en-US");
const fmtDate = (ts) => ts ? new Date(ts).toLocaleString(state.lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
const fmtDateShort = (ts) => ts ? new Date(ts).toLocaleDateString(state.lang === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" }) : "";
const debounce = (fn, ms = 300) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };

/* ─── Toast ─── */
function toast(msg, type = "info", dur = 3200) {
  const icons = {
    success: "ph-fill ph-check-circle",
    error: "ph-fill ph-x-circle",
    info: "ph-fill ph-info",
    warning: "ph-fill ph-warning"
  };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="${icons[type]}"></i><span>${esc(msg)}</span>`;
  const c = $("#toastContainer");
  if (c) c.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 500); }, dur);
}

/* ─── Progress ─── */
function progress(on) {
  const bar = $("#topProgress");
  if (!bar) return;
  if (on) { bar.style.opacity = "1"; bar.style.width = "30%"; setTimeout(() => bar.style.width = "65%", 150); }
  else { bar.style.width = "100%"; setTimeout(() => { bar.style.opacity = "0"; bar.style.width = "0"; }, 400); }
}

/* ─── Skeletons ─── */
function skeletons(n = 8) {
  return Array(n).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join("");
}

/* ─── Download ─── */
function downloadBlob(content, filename, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ─── Confirm Dialog ─── */
function confirmDialog(message, onConfirm) {
  modal.open(`
    <div style="padding:32px;text-align:center;">
      <div style="width:70px;height:70px;margin:0 auto 16px;border-radius:50%;background:rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:center;font-size:32px;color:var(--danger);">
        <i class="ph-fill ph-warning"></i>
      </div>
      <h3 style="font-size:20px;font-weight:800;margin-bottom:8px;font-family:var(--font-display);">${esc(message)}</h3>
      <div style="display:flex;gap:10px;margin-top:22px;">
        <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">${t("cancel")}</button>
        <button class="btn btn-danger" id="confirmYes" style="flex:1;"><i class="ph-bold ph-check"></i> ${t("delete")}</button>
      </div>
    </div>
  `, { size: "sm" });
  $("#confirmYes").onclick = () => { modal.close(); onConfirm(); };
}

/* ─── Confetti ─── */
function fireConfetti() {
  if (typeof confetti === "undefined") return;
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]
  });
}

/* ═══════════════════════════════════════════════════════════════
   7. THEME & LANGUAGE
   ═══════════════════════════════════════════════════════════════ */
function applyTheme() {
  let effectiveTheme = state.themeMode;
  if (state.themeMode === "auto") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  state.theme = effectiveTheme;
  document.documentElement.setAttribute("data-theme", effectiveTheme);

  const i = $("#themeToggle i");
  if (i) {
    i.className = effectiveTheme === "dark" ? "ph-bold ph-sun" : "ph-bold ph-moon";
  }

  $$("#pmThemeSeg button").forEach((b) => {
    b.classList.toggle("active", b.dataset.theme === state.themeMode);
  });
}

function toggleTheme() {
  const modes = ["light", "dark", "auto"];
  const idx = modes.indexOf(state.themeMode);
  state.themeMode = modes[(idx + 1) % modes.length];
  localStorage.setItem("themeMode", state.themeMode);
  applyTheme();
  const labels = { light: "☀️ Light", dark: "🌙 Dark", auto: "🔄 Auto" };
  toast(`থিম: ${labels[state.themeMode]}`, "success");
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.body.lang = state.lang;

  const cl = $("#currentLangLabel");
  if (cl) cl.textContent = state.lang === "bn" ? "বাং" : "EN";

  $$("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });

  const inp = $("#globalSearchInput");
  if (inp) inp.placeholder = t("search");

  $$("#pmLangSeg button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === state.lang);
  });
}

function toggleLang() {
  state.lang = state.lang === "bn" ? "en" : "bn";
  localStorage.setItem("lang", state.lang);
  applyLang();
  if (state.isAdmin && $("#adminLayout")?.style.display !== "none") adminPage.render();
  else router.render();
}

/* ═══════════════════════════════════════════════════════════════
   8. CART
   ═══════════════════════════════════════════════════════════════ */
const cart = {
  add(p, qty = 1) {
    const item = state.cart.find((c) => c.id === p.id);
    if (item) item.qty += qty;
    else state.cart.push({ id: p.id, name: p.name, nameEn: p.nameEn, price: p.price, image: p.image, qty });
    this.save();
    toast(t("add_to_cart") + " ✓", "success");
  },
  remove(id) { state.cart = state.cart.filter((c) => c.id !== id); this.save(); },
  updateQty(id, qty) {
    const i = state.cart.find((c) => c.id === id);
    if (i) i.qty = Math.max(1, qty);
    this.save();
  },
  clear() { state.cart = []; this.save(); },
  total() { return state.cart.reduce((s, c) => s + c.price * c.qty, 0); },
  count() { return state.cart.reduce((s, c) => s + c.qty, 0); },
  save() {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    this.updateBadge();
    this.renderDrawer();
  },
  updateBadge() {
    const c = this.count();
    const b = $("#cartBadge");
    const d = $("#cartDrawerCount");
    const subtitle = $("#cartSubtitle");

    if (b) { b.textContent = c; b.classList.toggle("show", c > 0); }
    if (d) d.textContent = c;
    if (subtitle) subtitle.textContent = `${c} টি পণ্য`;

    const bnC = document.getElementById("bnCartBadge");
    if (bnC) { bnC.textContent = c; bnC.classList.toggle("show", c > 0); }

    const pmCart = document.getElementById("pmCartCount");
    if (pmCart) pmCart.textContent = c;
  },
  renderDrawer() {
    const body = $("#cartDrawerBody");
    const foot = $("#cartDrawerFoot");
    if (!body) return;

    if (!state.cart.length) {
      body.innerHTML = `
        <div class="empty-state">
          <i class="ph-fill ph-shopping-cart-simple"></i>
          <h3>${t("cart_empty")}</h3>
          <p>${state.lang === "bn" ? "কেনাকাটা শুরু করুন" : "Start shopping now"}</p>
          <button class="btn btn-primary" onclick="closeCart();router.go('products')">
            <i class="ph-bold ph-shopping-bag"></i> ${t("shop_now")}
          </button>
        </div>`;
      if (foot) foot.innerHTML = "";
      return;
    }

    body.innerHTML = state.cart.map((item) => `
      <div class="cart-item-row">
        <img src="${esc(item.image || "https://via.placeholder.com/70")}" alt="${esc(item.name)}" />
        <div class="cart-item-info">
          <h4>${esc(state.lang === "bn" ? item.name : (item.nameEn || item.name))}</h4>
          <div class="price-tag">${fmtPrice(item.price)}</div>
          <div class="qty-control">
            <button onclick="cart.updateQty('${item.id}', ${item.qty - 1})"><i class="ph-bold ph-minus"></i></button>
            <span>${item.qty}</span>
            <button onclick="cart.updateQty('${item.id}', ${item.qty + 1})"><i class="ph-bold ph-plus"></i></button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="cart.remove('${item.id}')">
          <i class="ph-bold ph-trash"></i>
        </button>
      </div>
    `).join("");

    const sub = this.total();
    const ship = sub > 5000 ? 0 : 80;
    const tax = sub * 0.05;
    const grand = sub + ship + tax;

    if (foot) foot.innerHTML = `
      <div class="total-line"><span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span></div>
      <div class="total-line"><span>Shipping</span><span>${ship === 0 ? (state.lang === "bn" ? "ফ্রি" : "Free") : fmtPrice(ship)}</span></div>
      <div class="total-line"><span>VAT (5%)</span><span>${fmtPrice(tax)}</span></div>
      <div class="total-line grand"><span>${t("total")}</span><span>${fmtPrice(grand)}</span></div>
      <button class="btn btn-primary btn-block btn-lg" onclick="checkout.open()">
        <i class="ph-bold ph-credit-card"></i> ${t("checkout")}
      </button>`;
  }
};

/* ═══════════════════════════════════════════════════════════════
   9. WISHLIST
   ═══════════════════════════════════════════════════════════════ */
const wishlist = {
  toggle(p) {
    const i = state.wishlist.findIndex((w) => w.id === p.id);
    if (i > -1) {
      state.wishlist.splice(i, 1);
      toast(state.lang === "bn" ? "উইশলিস্ট থেকে সরানো হয়েছে" : "Removed from wishlist", "info");
    } else {
      state.wishlist.push({ id: p.id, name: p.name, nameEn: p.nameEn, price: p.price, image: p.image });
      toast(state.lang === "bn" ? "উইশলিস্টে যোগ হয়েছে ❤️" : "Added to wishlist ❤️", "success");
    }
    this.save();
  },
  has(id) { return state.wishlist.some((w) => w.id === id); },
  save() {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    const b = $("#wishlistBadge");
    if (b) { b.textContent = state.wishlist.length; b.classList.toggle("show", state.wishlist.length > 0); }

    const bnW = document.getElementById("bnWishlistBadge");
    if (bnW) { bnW.textContent = state.wishlist.length; bnW.classList.toggle("show", state.wishlist.length > 0); }

    const pmW = document.getElementById("pmWishBadge");
    if (pmW) pmW.textContent = state.wishlist.length;

    const pmWishCount = document.getElementById("pmWishCount");
    if (pmWishCount) pmWishCount.textContent = state.wishlist.length;
  }
};

/* ═══════════════════════════════════════════════════════════════
   10. FIREBASE API
   ═══════════════════════════════════════════════════════════════ */
const api = {
  /* ─── AUTH ─── */
  async signup({ name, email, password, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await set(ref(db, `users/${cred.user.uid}`), {
      uid: cred.user.uid,
      name, email, phone: phone || "",
      address: "", role: "user", banned: false,
      createdAt: Date.now()
    });
    return cred.user;
  },
  login(email, password) { return signInWithEmailAndPassword(auth, email, password); },
  logout() { return signOut(auth); },
  async isAdmin(uid) {
    try {
      const s = await get(ref(db, `admins/${uid}`));
      return s.exists() && s.val() === true;
    } catch (e) { return false; }
  },
  async getProfile(uid) {
    try {
      const s = await get(ref(db, `users/${uid}`));
      return s.exists() ? s.val() : null;
    } catch (e) { return null; }
  },
  async updateProfile(uid, data) { await update(ref(db, `users/${uid}`), data); },

  /* ─── PRODUCTS ─── */
  listenProducts(cb) {
    return onValue(ref(db, "products"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.products = arr;
      cb(arr);
    });
  },
  async addProduct(data, imageFile) {
    const pRef = push(ref(db, "products"));
    let imageUrl = "";
    if (imageFile) {
      toast(t("uploading_image"), "info", 2000);
      imageUrl = await uploadToImgBB(imageFile);
    }
    const payload = {
      name: data.name,
      nameEn: data.nameEn || data.name,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice) || 0,
      category: data.category || "Other",
      stock: Number(data.stock) || 0,
      description: data.description || "",
      descriptionEn: data.descriptionEn || data.description || "",
      rating: 4.5,
      reviews: 0,
      image: imageUrl,
      featured: !!data.featured,
      createdBy: auth.currentUser?.uid || "",
      createdAt: Date.now()
    };
    await set(pRef, payload);
    await api.logActivity("product.create", `Added: ${data.name}`);
    return pRef.key;
  },
  async updateProduct(id, data, imageFile) {
    let imageUrl = data.image;
    if (imageFile) {
      toast(t("uploading_image"), "info", 2000);
      imageUrl = await uploadToImgBB(imageFile);
    }
    const payload = { ...data };
    delete payload.image;
    if (imageUrl !== undefined) payload.image = imageUrl;
    await update(ref(db, `products/${id}`), payload);
    await api.logActivity("product.update", `Updated: ${data.name}`);
  },
  async deleteProduct(id) {
    const p = state.products.find((x) => x.id === id);
    await remove(ref(db, `products/${id}`));
    await api.logActivity("product.delete", `Deleted: ${p?.name || id}`);
  },
  async toggleFeatured(id, featured) {
    await update(ref(db, `products/${id}`), { featured });
  },

  /* ─── ORDERS ─── */
  async placeOrder(order) {
    const oRef = push(ref(db, "orders"));
    const orderId = oRef.key;
    const data = { ...order, orderId, status: "pending", createdAt: Date.now() };
    await set(oRef, data);
    await set(ref(db, `userOrders/${order.userId}/${orderId}`), data);
    await this.notify(order.userId, "✅ অর্ডার গৃহীত", `আপনার অর্ডার #${orderId.slice(-6)} সফল হয়েছে`);
    await api.logActivity("order.create", `Order #${orderId.slice(-6)} by ${order.userName}`);
    return orderId;
  },
  listenUserOrders(uid, cb) {
    return onValue(ref(db, `userOrders/${uid}`), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      cb(arr);
    });
  },
  listenAllOrders(cb) {
    return onValue(ref(db, "orders"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.orders = arr;
      cb(arr);
    });
  },
  async updateOrderStatus(orderId, status, userId) {
    await update(ref(db, `orders/${orderId}`), { status });
    await update(ref(db, `userOrders/${userId}/${orderId}`), { status });
    const msgs = {
      confirmed: "আপনার অর্ডার কনফার্ম হয়েছে",
      shipped: "আপনার অর্ডার পাঠানো হয়েছে",
      delivered: "অর্ডার ডেলিভার হয়েছে",
      cancelled: "অর্ডার বাতিল হয়েছে"
    };
    await this.notify(userId, "📦 অর্ডার আপডেট", msgs[status] || "আপনার অর্ডারের অবস্থা পরিবর্তিত হয়েছে");
    await api.logActivity("order.status", `#${orderId.slice(-6)} → ${status}`);
  },

  /* ─── USERS ─── */
  listenUsers(cb) {
    return onValue(ref(db, "users"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.users = arr;
      cb(arr);
    });
  },
  async toggleBan(uid, banned) {
    await update(ref(db, `users/${uid}`), { banned });
    await api.logActivity("user.ban", `${banned ? "Banned" : "Unbanned"}: ${uid}`);
  },

  /* ─── CATEGORIES ─── */
  listenCategories(cb) {
    return onValue(ref(db, "categories"), (snap) => {
      let arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      if (!arr.length) {
        arr = DEFAULT_CATEGORIES.map((n, i) => ({
          id: "default_" + i,
          name: n,
          slug: n.toLowerCase(),
          createdAt: Date.now()
        }));
      }
      state.categories = arr;
      cb(arr);
    });
  },
  async addCategory(name) {
    await push(ref(db, "categories"), { name, slug: name.toLowerCase().replace(/\s+/g, "-"), createdAt: Date.now() });
    await api.logActivity("category.create", name);
  },
  async deleteCategory(id) { await remove(ref(db, `categories/${id}`)); },

  /* ─── COUPONS ─── */
  listenCoupons(cb) {
    return onValue(ref(db, "coupons"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      state.coupons = arr;
      cb(arr);
    });
  },
  async addCoupon(c) {
    await push(ref(db, "coupons"), { ...c, createdAt: Date.now() });
    await api.logActivity("coupon.create", c.code);
  },
  async deleteCoupon(id) { await remove(ref(db, `coupons/${id}`)); },
  async validateCoupon(code) {
    return state.coupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.active !== false) || null;
  },

  /* ─── REVIEWS ─── */
  listenReviews(cb) {
    return onValue(ref(db, "reviews"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.reviews = arr;
      cb(arr);
    });
  },
  async addReview(r) {
    await push(ref(db, "reviews"), { ...r, status: "approved", createdAt: Date.now() });
  },
  async deleteReview(id) { await remove(ref(db, `reviews/${id}`)); },

  /* ─── BANNERS ─── */
  listenBanners(cb) {
    return onValue(ref(db, "banners"), (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      state.banners = arr;
      cb(arr);
    });
  },
  async addBanner(b, imgFile) {
    const bRef = push(ref(db, "banners"));
    let imageUrl = "";
    if (imgFile) {
      toast(t("uploading_image"), "info", 2000);
      imageUrl = await uploadToImgBB(imgFile);
    }
    await set(bRef, { ...b, image: imageUrl, createdAt: Date.now() });
  },
  async deleteBanner(id) { await remove(ref(db, `banners/${id}`)); },

  /* ─── NOTIFICATIONS ─── */
  async notify(uid, title, body) {
    if (!uid) return;
    try {
      await push(ref(db, `notifications/${uid}`), { title, body, read: false, createdAt: Date.now() });
    } catch (e) { /* silent */ }
  },
  async broadcast(title, body) {
    for (const u of state.users) await this.notify(u.id, title, body);
    await api.logActivity("notify.broadcast", title);
  },
  listenNotifications(uid, cb) {
    const q = query(ref(db, `notifications/${uid}`), limitToLast(40));
    return onValue(q, (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.notifications = arr;
      cb(arr);
    });
  },
  async markAllRead(uid, notifs) {
    if (!uid || !notifs?.length) return;
    const updates = {};
    notifs.forEach((n) => { if (!n.read) updates[`notifications/${uid}/${n.id}/read`] = true; });
    if (Object.keys(updates).length) await update(ref(db), updates);
    toast("সব নোটিফিকেশন পড়া হয়েছে", "success");
  },

  /* ─── ACTIVITY LOGS ─── */
  async logActivity(type, message) {
    try {
      await push(ref(db, "activityLogs"), {
        type, message,
        uid: auth.currentUser?.uid || "system",
        userEmail: auth.currentUser?.email || "system",
        createdAt: Date.now()
      });
    } catch (e) { /* silent */ }
  },
  listenActivityLogs(cb) {
    const q = query(ref(db, "activityLogs"), limitToLast(100));
    return onValue(q, (snap) => {
      const arr = [];
      snap.forEach((c) => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.activityLogs = arr;
      cb(arr);
    });
  },

  /* ─── SITE SETTINGS ─── */
  listenSiteSettings(cb) {
    return onValue(ref(db, "siteSettings"), (snap) => {
      state.siteSettings = snap.exists() ? snap.val() : {};
      cb(state.siteSettings);
    });
  },
  async saveSiteSettings(data) {
    await update(ref(db, "siteSettings"), data);
    await api.logActivity("settings.update", "Site settings updated");
  }
};

/* ═══════════════════════════════════════════════════════════════
   11. ROUTER
   ═══════════════════════════════════════════════════════════════ */
const router = {
  current: "home",

  go(page) {
    /* Admin route */
    if (page === "admin") {
      if (!state.isAdmin) { toast("Access denied", "error"); this.go("auth"); return; }
      this.showAdmin();
      return;
    }

    /* Auth-protected */
    const protectedPages = ["dashboard", "profile", "orders", "wishlist", "settings"];
    if (protectedPages.includes(page)) {
      if (!state.authReady) { setTimeout(() => this.go(page), 150); return; }
      if (!state.user) { toast(t("login_required"), "warning"); page = "auth"; }
    }

    /* If already logged in and going to auth → redirect */
    if (page === "auth" && state.user && state.authReady) {
      this.showAdminOrUserDash();
      return;
    }

    this.hideAdmin();
    this.current = page;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closePowerMenu();

    /* Active states */
    $$(".nav-menu a").forEach((a) => a.classList.toggle("active", a.dataset.page === page));
    $$(".bottom-nav a[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === page));
    $$(".pm-nav a[data-page]").forEach((a) => a.classList.toggle("active", a.dataset.page === page));
  },

  showAdminOrUserDash() {
    if (state.isAdmin) {
      this.showAdmin();
    } else {
      this.hideAdmin();
      this.current = "dashboard";
      this.render();
      $$(".nav-menu a").forEach((a) => a.classList.toggle("active", a.dataset.page === "dashboard"));
      $$(".bottom-nav a[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === "dashboard"));
    }
  },

  showAdmin() {
    const al = $("#adminLayout");
    const pn = $("#publicNavbar");
    const ap = $("#app");
    const pf = $("#publicFooter");
    const bn = $("#bottomNav");
    const fab = $("#fab");
    const chat = $("#chatBtn");

    if (al) al.style.display = "grid";
    if (pn) pn.style.display = "none";
    if (ap) ap.style.display = "none";
    if (pf) pf.style.display = "none";
    if (bn) bn.style.display = "none";
    if (fab) fab.style.display = "none";
    if (chat) chat.style.display = "none";

    this.current = "admin";
    adminPage.render();
  },

  hideAdmin() {
    const al = $("#adminLayout");
    const pn = $("#publicNavbar");
    const ap = $("#app");
    const pf = $("#publicFooter");

    if (al) al.style.display = "none";
    if (pn) pn.style.display = "";
    if (ap) ap.style.display = "";
    if (pf) pf.style.display = "";
  },

  render() {
    progress(true);
    const appEl = $("#app");
    if (!appEl) return;
    appEl.innerHTML = "";

    if (this.current === "admin") return;

    const routes = {
      home: Pages.home,
      products: Pages.products,
      auth: Pages.auth,
      dashboard: Pages.dashboard,
      profile: Pages.profile,
      orders: Pages.orders,
      wishlist: Pages.wishlist,
      settings: Pages.settings
    };

    try {
      const fn = routes[this.current] || Pages.home;
      fn(appEl);
    } catch (err) {
      console.error("Render error:", err);
      appEl.innerHTML = `<section class="page"><div class="empty-state">
        <i class="ph-fill ph-warning"></i>
        <h3>সমস্যা হয়েছে</h3>
        <p>${esc(err.message)}</p>
        <button class="btn btn-primary" onclick="router.go('home')">
          <i class="ph-bold ph-house"></i> হোমে যান
        </button>
      </div></section>`;
    }
    setTimeout(() => progress(false), 400);
  }
};
window.router = router;

/* ═══════════════════════════════════════════════════════════════
   12. MODAL
   ═══════════════════════════════════════════════════════════════ */
const modal = {
  open(html, { size = "" } = {}) {
    const root = $("#modalRoot");
    if (!root) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `<div class="modal-box ${size}">${html}</div>`;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) modal.close(); });
    root.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("active"));
    document.body.style.overflow = "hidden";
  },
  close() {
    const o = $("#modalRoot .modal-overlay");
    if (!o) return;
    o.classList.remove("active");
    setTimeout(() => o.remove(), 350);
    document.body.style.overflow = "";
  }
};
window.modal = modal;

/* ═══════════════════════════════════════════════════════════════
   13. CHECKOUT
   ═══════════════════════════════════════════════════════════════ */
const checkout = {
  async open() {
    if (!state.user) { toast(t("login_required"), "warning"); closeCart(); router.go("auth"); return; }
    if (!state.cart.length) { toast(t("cart_empty"), "warning"); return; }

    const p = (await api.getProfile(state.user.uid)) || {};
    closeCart();

    const sub = cart.total();
    const ship = sub > 5000 ? 0 : 80;
    const tax = sub * 0.05;
    let discount = 0;
    let appliedCoupon = null;

    const recalc = () => {
      const grand = sub + ship + tax - discount;
      const g = $("#coGrand");
      if (g) g.textContent = fmtPrice(grand);
      const d = $("#coDiscountRow");
      if (d) d.style.display = discount ? "flex" : "none";
      const dv = $("#coDiscountVal");
      if (dv) dv.textContent = "-" + fmtPrice(discount);
    };

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;font-family:var(--font-display);">
          <i class="ph-bold ph-credit-card" style="color:var(--brand-1)"></i> ${t("checkout")}
        </h2>
        <p style="color:var(--text-2);font-size:14px;margin-bottom:22px;">আপনার তথ্য নিশ্চিত করুন</p>

        <div class="form-group">
          <label>${t("name")}</label>
          <input id="coName" value="${esc(p.name || state.user.displayName || "")}" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>${t("phone")}</label>
            <input id="coPhone" value="${esc(p.phone || "")}" placeholder="01XXXXXXXXX" />
          </div>
          <div class="form-group">
            <label>পেমেন্ট</label>
            <select id="coPay">
              <option value="cod">ক্যাশ অন ডেলিভারি</option>
              <option value="bkash">bKash</option>
              <option value="card">কার্ড</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>${t("address")}</label>
          <textarea id="coAddress">${esc(p.address || "")}</textarea>
        </div>

        <div class="form-group">
          <label>কুপন কোড</label>
          <div style="display:flex;gap:8px;">
            <input id="coCoupon" placeholder="SAVE10" style="flex:1;" />
            <button class="btn btn-outline" id="applyCoupon">অ্যাপ্লাই</button>
          </div>
          <small id="couponMsg"></small>
        </div>

        <div style="background:var(--bg-soft);padding:16px;border-radius:12px;margin:18px 0;">
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>শিপিং</span><span>${ship === 0 ? "ফ্রি" : fmtPrice(ship)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>ভ্যাট (৫%)</span><span>${fmtPrice(tax)}</span>
          </div>
          <div id="coDiscountRow" style="display:none;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--success);font-weight:700;">
            <span>ডিসকাউন্ট</span><span id="coDiscountVal">-৳0</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900;padding-top:10px;border-top:2px dashed var(--border-2);">
            <span>${t("total")}</span>
            <span id="coGrand" style="background:var(--brand-grad);-webkit-background-clip:text;background-clip:text;color:transparent;">
              ${fmtPrice(sub + ship + tax)}
            </span>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="confirmOrder">
          <i class="ph-bold ph-check-circle"></i> ${t("place_order")}
        </button>
      </div>
    `, { size: "sm" });

    $("#applyCoupon").onclick = async () => {
      const code = $("#coCoupon").value.trim();
      if (!code) return;
      const c = await api.validateCoupon(code);
      const msg = $("#couponMsg");
      if (!c) { msg.textContent = "❌ Invalid coupon"; msg.style.color = "var(--danger)"; return; }
      if (c.minPurchase && sub < c.minPurchase) {
        msg.textContent = `Minimum purchase ${fmtPrice(c.minPurchase)}`;
        msg.style.color = "var(--warning)";
        return;
      }
      appliedCoupon = c;
      discount = c.type === "percent" ? sub * (c.value / 100) : Number(c.value);
      msg.textContent = `✅ ${c.code} applied`;
      msg.style.color = "var(--success)";
      recalc();
    };

    $("#confirmOrder").onclick = async () => {
      const name = $("#coName").value.trim();
      const phone = $("#coPhone").value.trim();
      const address = $("#coAddress").value.trim();
      if (!name || !phone || !address) { toast("সব তথ্য পূরণ করুন", "error"); return; }

      const btn = $("#confirmOrder");
      btn.disabled = true;
      btn.innerHTML = `<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i> প্রসেসিং...`;

      try {
        await api.placeOrder({
          userId: state.user.uid,
          userName: name,
          items: state.cart.map((i) => ({
            id: i.id, name: i.name, nameEn: i.nameEn, price: i.price, qty: i.qty, image: i.image
          })),
          subtotal: sub, shipping: ship, tax, discount,
          total: sub + ship + tax - discount,
          coupon: appliedCoupon?.code || null,
          address, phone,
          payment: $("#coPay").value
        });
        cart.clear();
        modal.close();
        fireConfetti();
        toast(t("order_success"), "success", 4000);
        setTimeout(() => router.go("dashboard"), 900);
      } catch (err) {
        console.error(err);
        toast(err.message || t("error_occurred"), "error");
        btn.disabled = false;
        btn.innerHTML = `<i class="ph-bold ph-check-circle"></i> ${t("place_order")}`;
      }
    };
  }
};
window.checkout = checkout;

/* ═══════════════════════════════════════════════════════════════
   14. SEARCH
   ═══════════════════════════════════════════════════════════════ */
const search = {
  suggest(q) {
    const box = $("#searchSuggest");
    if (!box) return;
    if (!q) { box.classList.remove("active"); return; }

    const lq = q.toLowerCase();
    const m = state.products.filter((p) =>
      (p.name || "").toLowerCase().includes(lq) ||
      (p.nameEn || "").toLowerCase().includes(lq) ||
      (p.category || "").toLowerCase().includes(lq) ||
      (p.description || "").toLowerCase().includes(lq)
    ).slice(0, 6);

    if (!m.length) {
      box.innerHTML = `<div class="suggest-empty">🔍 কোনো ফলাফল পাওয়া যায়নি</div>`;
    } else {
      box.innerHTML = m.map((p) => `
        <div class="suggest-item" onclick="search.select('${p.id}')">
          <img src="${esc(p.image || "https://via.placeholder.com/44")}" alt="" />
          <div class="suggest-item-info">
            <h5>${esc(state.lang === "bn" ? p.name : (p.nameEn || p.name))}</h5>
            <p>${fmtPrice(p.price)}</p>
          </div>
        </div>
      `).join("");
    }
    box.classList.add("active");
  },
  select(id) {
    $("#searchSuggest")?.classList.remove("active");
    productDetail.openById(id);
  },
  clear() { $("#searchSuggest")?.classList.remove("active"); },

  initVoice() {
    const btn = $("#voiceSearchBtn");
    if (!btn) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      btn.onclick = () => toast(t("voice_not_supported"), "warning");
      return;
    }
    const rec = new SR();
    rec.lang = state.lang === "bn" ? "bn-BD" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    btn.onclick = () => {
      btn.classList.add("listening");
      rec.start();
      toast("🎤 শুনছি...", "info", 1500);
    };
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      const inp = $("#globalSearchInput");
      if (inp) inp.value = txt;
      search.suggest(txt);
      router.go("products");
      setTimeout(() => Pages.applyFilters(), 200);
    };
    rec.onend = () => btn.classList.remove("listening");
    rec.onerror = () => btn.classList.remove("listening");
  },

  initImage() {
    const btn = $("#imageSearchBtn");
    const input = $("#imageSearchInput");
    if (!btn || !input) return;
    btn.onclick = () => input.click();
    input.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      toast("🖼️ ছবি বিশ্লেষণ হচ্ছে...", "info");
      const name = f.name.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
      const words = name.split(/\s+/).filter((w) => w.length > 2);
      let best = null, score = 0;
      state.products.forEach((p) => {
        const hay = `${p.name || ""} ${p.nameEn || ""} ${p.category || ""}`.toLowerCase();
        let s = 0;
        words.forEach((w) => { if (hay.includes(w)) s++; });
        if (s > score) { score = s; best = p; }
      });
      if (best && score > 0) {
        toast("✓ মিল পাওয়া গেছে", "success");
        productDetail.open(best);
      } else {
        router.go("products");
        toast("সব পণ্য দেখানো হচ্ছে", "info");
      }
      input.value = "";
    };
  }
};

/* ═══════════════════════════════════════════════════════════════
   15. PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════ */
const productDetail = {
  open(p) {
    const name = state.lang === "bn" ? p.name : (p.nameEn || p.name);
    const desc = state.lang === "bn" ? p.description : (p.descriptionEn || p.description);
    const stars = "★".repeat(Math.round(p.rating || 4.5)) + "☆".repeat(5 - Math.round(p.rating || 4.5));
    const inStock = (p.stock || 0) > 0;
    const isW = wishlist.has(p.id);

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div class="product-detail">
        <div class="product-detail-img">
          <img src="${esc(p.image || "https://via.placeholder.com/500")}" alt="" />
        </div>
        <div class="product-detail-info">
          <div class="product-cat">${esc(p.category || "Other")}</div>
          <h2>${esc(name)}</h2>
          <div class="product-rating" style="margin:8px 0;">
            <span class="stars">${stars}</span>
            <span class="count">(${p.reviews || 0} রিভিউ)</span>
          </div>
          <div class="product-detail-price">${fmtPrice(p.price)}</div>
          ${p.oldPrice ? `<div style="margin-bottom:12px;"><span style="text-decoration:line-through;color:var(--text-3);">${fmtPrice(p.oldPrice)}</span></div>` : ""}
          <div class="product-detail-desc">${esc(desc || "কোনো বিবরণ নেই।")}</div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
            <span class="status-pill ${inStock ? "status-delivered" : "status-cancelled"}">
              <i class="ph-bold ph-${inStock ? "check-circle" : "x-circle"}"></i>
              ${inStock ? t("in_stock") : t("out_of_stock")}
            </span>
            ${p.stock ? `<span class="status-pill status-confirmed"><i class="ph-bold ph-package"></i> স্টক: ${p.stock}</span>` : ""}
          </div>

          <div class="product-detail-actions">
            <button class="btn btn-outline" onclick="productDetail.toggleWish('${p.id}')" ${!inStock ? "disabled" : ""}>
              <i class="ph-${isW ? "fill" : "bold"} ph-heart"></i> ${t("wishlist")}
            </button>
            <button class="btn btn-primary" onclick="productDetail.addCart('${p.id}')" ${!inStock ? "disabled" : ""}>
              <i class="ph-bold ph-shopping-cart-simple"></i> ${t("add_to_cart")}
            </button>
          </div>
        </div>
      </div>
    `, { size: "lg" });
  },
  addCart(id) {
    const p = state.products.find((x) => x.id === id);
    if (p) { cart.add(p); modal.close(); }
  },
  toggleWish(id) {
    const p = state.products.find((x) => x.id === id);
    if (p) { wishlist.toggle(p); this.open(p); }
  },
  openById(id) {
    const p = state.products.find((x) => x.id === id);
    if (p) this.open(p);
  }
};
window.productDetail = productDetail;

/* ═══════════════════════════════════════════════════════════════
   16. PRODUCT CARD
   ═══════════════════════════════════════════════════════════════ */
function productCardHTML(p) {
  const name = state.lang === "bn" ? p.name : (p.nameEn || p.name);
  const stars = "★".repeat(Math.round(p.rating || 4.5)) + "☆".repeat(5 - Math.round(p.rating || 4.5));
  const isW = wishlist.has(p.id);
  const disc = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const isNew = p.createdAt && (Date.now() - p.createdAt) < 7 * 24 * 3600 * 1000;

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image-wrap">
        <img src="${esc(p.image || "https://via.placeholder.com/300")}" alt="${esc(name)}" loading="lazy" />
        <div class="product-badges">
          ${isNew ? `<span class="badge-tag badge-new">নতুন</span>` : ""}
          ${disc ? `<span class="badge-tag badge-sale">-${disc}%</span>` : ""}
        </div>
        <div class="product-actions-overlay">
          <button class="action-circle ${isW ? "active" : ""}" onclick="event.stopPropagation();productCard.toggleWish('${p.id}', this)">
            <i class="ph-${isW ? "fill" : "bold"} ph-heart"></i>
          </button>
          <button class="action-circle" onclick="event.stopPropagation();productDetail.openById('${p.id}')">
            <i class="ph-bold ph-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-body">
        <div class="product-cat">${esc(p.category || "Other")}</div>
        <h3 class="product-name">${esc(name)}</h3>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="count">(${p.reviews || 0})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="product-price-old">${fmtPrice(p.oldPrice)}</span>` : ""}
        </div>
      </div>
      <div class="product-footer">
        <button class="add-cart-btn" onclick="event.stopPropagation();productDetail.addCart('${p.id}')">
          <i class="ph-bold ph-shopping-cart-simple"></i> <span>${t("add_to_cart")}</span>
        </button>
      </div>
    </div>`;
}

const productCard = {
  toggleWish(id, btn) {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    wishlist.toggle(p);
    const isW = wishlist.has(id);
    btn.classList.toggle("active", isW);
    btn.querySelector("i").className = `ph-${isW ? "fill" : "bold"} ph-heart`;
  }
};
window.productCard = productCard;

/* ═══════════════════════════════════════════════════════════════
   17. PUBLIC PAGES
   ═══════════════════════════════════════════════════════════════ */
const Pages = {

  /* ─── HOME ─── */
  home(app) {
    app.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <div>
            <div class="hero-badge">
              <i class="ph-fill ph-lightning"></i>
              ফ্ল্যাশ সেল — ৫০% পর্যন্ত ছাড়!
            </div>
            <h1>${t("hero_title")}</h1>
            <p>${t("hero_sub")}</p>
            <div class="hero-actions">
              <button class="btn btn-white" onclick="router.go('products')">
                <i class="ph-bold ph-shopping-bag"></i> ${t("shop_now")}
              </button>
              <button class="btn btn-outline-white" onclick="router.go('products')">
                <i class="ph-bold ph-compass"></i> ${t("explore")}
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card hero-card-1">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" alt="" />
              <h5>হেডফোন</h5><p>৳2,499</p>
            </div>
            <div class="hero-card hero-card-2">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="" />
              <h5>স্নিকার্স</h5><p>৳3,299</p>
            </div>
            <div class="hero-card hero-card-3">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" alt="" />
              <h5>স্মার্ট ওয়াচ</h5><p>৳5,999</p>
            </div>
          </div>
        </div>
      </section>

      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-icon"><i class="ph-fill ph-package"></i></div>
          <div><h3 id="homeProductsCount">${state.products.length}+</h3><p>${t("products_count")}</p></div>
        </div>
        <div class="stat-item">
          <div class="stat-icon"><i class="ph-fill ph-smiley"></i></div>
          <div><h3>10K+</h3><p>${t("happy_customers")}</p></div>
        </div>
        <div class="stat-item">
          <div class="stat-icon"><i class="ph-fill ph-truck"></i></div>
          <div><h3>5K+</h3><p>${t("orders_delivered")}</p></div>
        </div>
        <div class="stat-item">
          <div class="stat-icon"><i class="ph-fill ph-star"></i></div>
          <div><h3>4.9</h3><p>${t("rating")}</p></div>
        </div>
      </div>

      <section class="page" style="padding-top:20px;">
        <h2 class="section-title"><i class="ph-fill ph-fire"></i> ${t("featured")}</h2>
        <div class="product-grid" id="featuredGrid">${skeletons(8)}</div>
      </section>
    `;

    api.listenProducts((products) => {
      const grid = $("#featuredGrid");
      if (!grid) return;
      const cEl = $("#homeProductsCount");
      if (cEl) cEl.textContent = products.length + "+";

      const feat = products.slice(0, 8);
      if (!feat.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
          <i class="ph-fill ph-package"></i>
          <h3>${t("no_products")}</h3>
        </div>`;
        return;
      }
      grid.innerHTML = feat.map(productCardHTML).join("");
      grid.querySelectorAll(".product-card").forEach((c) => {
        c.onclick = () => productDetail.openById(c.dataset.id);
      });
    });
  },

  /* ─── PRODUCTS ─── */
  products(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="ph-fill ph-shopping-bag"></i> ${t("products")}</h1>
        <p class="page-subtitle">${state.lang === "bn" ? "আপনার পছন্দের পণ্য খুঁজুন" : "Find your favorite products"}</p>

        <div class="category-row" id="catRow" style="margin-top:20px;"></div>

        <div class="filter-bar">
          <select id="sortSelect">
            <option value="new">${t("sort_new")}</option>
            <option value="price_low">${t("sort_price_low")}</option>
            <option value="price_high">${t("sort_price_high")}</option>
            <option value="popular">${t("sort_popular")}</option>
          </select>
          <input type="number" id="minPrice" placeholder="${t("min_price")}" />
          <input type="number" id="maxPrice" placeholder="${t("max_price")}" />
          <span class="filter-count" id="filterCount">0</span>
        </div>

        <div class="product-grid" id="productsGrid">${skeletons(12)}</div>
      </section>
    `;

    api.listenCategories((cats) => {
      const row = $("#catRow");
      if (!row) return;
      row.innerHTML = `
        <div class="cat-chip active" data-cat="all">
          <i class="ph-bold ph-squares-four"></i> ${t("all")}
        </div>
      ` + cats.map((c) => `
        <div class="cat-chip" data-cat="${esc(c.name)}">
          <i class="ph-bold ph-tag"></i> ${esc(c.name)}
        </div>
      `).join("");

      $$("#catRow .cat-chip").forEach((chip) => {
        chip.onclick = () => {
          $$("#catRow .cat-chip").forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          state.filters.category = chip.dataset.cat;
          this.applyFilters();
        };
      });
    });

    $("#sortSelect").onchange = (e) => { state.filters.sort = e.target.value; this.applyFilters(); };

    const deb = debounce(() => {
      state.filters.minPrice = $("#minPrice").value;
      state.filters.maxPrice = $("#maxPrice").value;
      this.applyFilters();
    }, 400);
    $("#minPrice").oninput = deb;
    $("#maxPrice").oninput = deb;

    api.listenProducts(() => this.applyFilters());
  },

  applyFilters() {
    const grid = $("#productsGrid");
    if (!grid) return;

    const { category, sort, minPrice, maxPrice } = state.filters;
    const q = ($("#globalSearchInput")?.value || state.filters.query || "").toLowerCase().trim();

    let list = state.products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (q) {
        const hay = `${p.name} ${p.nameEn} ${p.description} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorts = {
      new: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
      price_low: (a, b) => a.price - b.price,
      price_high: (a, b) => b.price - a.price,
      popular: (a, b) => (b.rating || 0) - (a.rating || 0)
    };
    list.sort(sorts[sort] || sorts.new);

    const fc = $("#filterCount");
    if (fc) fc.textContent = `${list.length} ${t("products_count")}`;

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <i class="ph-fill ph-magnifying-glass"></i>
        <h3>কোনো পণ্য পাওয়া যায়নি</h3>
        <p>অন্য ফিল্টার ব্যবহার করুন</p>
      </div>`;
      return;
    }
    grid.innerHTML = list.map(productCardHTML).join("");
    grid.querySelectorAll(".product-card").forEach((c) => {
      c.onclick = () => productDetail.openById(c.dataset.id);
    });
  },

  /* ─── AUTH ─── */
  auth(app) {
    let mode = "login";

    app.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-icon"><i class="ph-fill ph-storefront"></i></div>
            <h2 id="authTitle">${t("login")}</h2>
            <p id="authSub">EcoShop Pro MAX এ স্বাগতম</p>
          </div>

          <div class="auth-tabs">
            <button class="auth-tab active" data-mode="login">
              <i class="ph-bold ph-sign-in"></i> ${t("login")}
            </button>
            <button class="auth-tab" data-mode="signup">
              <i class="ph-bold ph-user-plus"></i> ${t("signup")}
            </button>
          </div>

          <form id="authForm"><div id="authFields"></div></form>
        </div>
      </div>
    `;

    const renderFields = () => {
      const el = $("#authFields");
      if (!el) return;
      if (mode === "login") {
        el.innerHTML = `
          <div class="form-group">
            <label>${t("email")}</label>
            <input type="email" id="aEmail" required placeholder="example@mail.com" />
          </div>
          <div class="form-group">
            <label>${t("password")}</label>
            <input type="password" id="aPassword" required placeholder="••••••••" />
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit">
            <i class="ph-bold ph-sign-in"></i> ${t("login")}
          </button>
        `;
      } else {
        el.innerHTML = `
          <div class="form-group">
            <label>${t("name")}</label>
            <input type="text" id="aName" required />
          </div>
          <div class="form-group">
            <label>${t("email")}</label>
            <input type="email" id="aEmail" required />
          </div>
          <div class="form-group">
            <label>${t("phone")}</label>
            <input type="tel" id="aPhone" placeholder="01XXXXXXXXX" />
          </div>
          <div class="form-group">
            <label>${t("password")}</label>
            <input type="password" id="aPassword" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit">
            <i class="ph-bold ph-user-plus"></i> ${t("signup")}
          </button>
        `;
      }
      const at = $("#authTitle");
      if (at) at.textContent = mode === "login" ? t("login") : t("signup");
      const as = $("#authSub");
      if (as) as.textContent = mode === "login" ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন";
    };

    $$(".auth-tab").forEach((tab) => {
      tab.onclick = () => {
        $$(".auth-tab").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.dataset.mode;
        renderFields();
      };
    });
    renderFields();

    $("#authForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = $("#authSubmit");
      btn.disabled = true;
      btn.innerHTML = `<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i>`;

      try {
        let loggedUser;
        if (mode === "login") {
          const cred = await api.login($("#aEmail").value.trim(), $("#aPassword").value);
          loggedUser = cred.user;
          toast(t("login_success"), "success");
        } else {
          const pw = $("#aPassword").value;
          if (pw.length < 6) {
            toast(t("password_short"), "error");
            btn.disabled = false;
            renderFields();
            return;
          }
          loggedUser = await api.signup({
            name: $("#aName").value.trim(),
            email: $("#aEmail").value.trim(),
            phone: $("#aPhone").value.trim(),
            password: pw
          });
          toast(t("signup_success"), "success");
        }

        if (loggedUser) {
          state.user = loggedUser;
          state.isAdmin = await api.isAdmin(loggedUser.uid);
          state.authReady = true;

          setTimeout(() => {
            if (state.isAdmin) router.showAdmin();
            else router.showAdminOrUserDash();

            authUI.updateAvatar();
            updateUserUI();
          }, 400);
        }
      } catch (err) {
        let m = err.message;
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") m = t("invalid_credentials");
        if (err.code === "auth/email-already-in-use") m = "এই ইমেইল দিয়ে অ্যাকাউন্ট আছে";
        if (err.code === "auth/network-request-failed") m = "নেটওয়ার্ক সমস্যা — ইন্টারনেট চেক করুন";
        if (err.code === "auth/invalid-email") m = "সঠিক ইমেইল দিন";
        toast(m, "error");
        btn.disabled = false;
        renderFields();
      }
    };
  },

  /* ─── USER DASHBOARD ─── */
  dashboard(app) {
    if (state.isAdmin) { router.showAdmin(); return; }
    const u = state.user;
    if (!u) { router.go("auth"); return; }

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || u.email)}&background=6366f1&color=fff&size=200`;

    app.innerHTML = `
      <section class="page">
        <div style="background:var(--brand-grad);color:#fff;padding:40px 32px;border-radius:var(--radius-xl);margin-bottom:28px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>
          <div style="position:absolute;bottom:-80px;left:-30px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
          <div style="position:relative;z-index:2;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <img src="${avatar}" style="width:80px;height:80px;border-radius:50%;border:3px solid rgba(255,255,255,0.4);" />
            <div style="flex:1;min-width:200px;">
              <div style="display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.2);border-radius:50px;font-size:12px;font-weight:700;margin-bottom:10px;backdrop-filter:blur(10px);">
                <i class="ph-fill ph-user"></i> ${t("user_dashboard")}
              </div>
              <h1 style="font-size:28px;font-weight:900;margin-bottom:4px;font-family:var(--font-display);">
                👋 স্বাগতম, ${esc(u.displayName || u.email.split("@")[0])}
              </h1>
              <p style="opacity:.95;font-size:14px;">আপনার অর্ডার এবং পরিসংখ্যান</p>
            </div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card g1">
            <div class="kpi-icon g1"><i class="ph-fill ph-receipt"></i></div>
            <div class="kpi-label">${t("my_orders")}</div>
            <div class="kpi-value" id="sOrders">0</div>
          </div>
          <div class="kpi-card g2">
            <div class="kpi-icon g2"><i class="ph-fill ph-shopping-cart-simple"></i></div>
            <div class="kpi-label">${t("cart")}</div>
            <div class="kpi-value" id="sCart">${cart.count()}</div>
          </div>
          <div class="kpi-card g3">
            <div class="kpi-icon g3"><i class="ph-fill ph-heart"></i></div>
            <div class="kpi-label">${t("wishlist")}</div>
            <div class="kpi-value" id="sWish">${state.wishlist.length}</div>
          </div>
          <div class="kpi-card g4">
            <div class="kpi-icon g4"><i class="ph-fill ph-currency-circle-dollar"></i></div>
            <div class="kpi-label">মোট খরচ</div>
            <div class="kpi-value" id="sSpent">৳0</div>
          </div>
        </div>

        <h2 class="section-title"><i class="ph-fill ph-clock-counter-clockwise"></i> ${t("recent_orders")}</h2>
        <div id="userOrderList">
          <div class="empty-state"><i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i></div>
        </div>
      </section>
    `;

    api.listenUserOrders(u.uid, (orders) => {
      const el = $("#userOrderList");
      if (!el) return;

      const so = $("#sOrders");
      if (so) so.textContent = orders.length;

      const spent = orders.reduce((s, o) => s + (o.total || 0), 0);
      const ss = $("#sSpent");
      if (ss) ss.textContent = fmtPrice(spent);

      const pmOrder = document.getElementById("pmOrderCount");
      if (pmOrder) pmOrder.textContent = orders.length;

      if (!orders.length) {
        el.innerHTML = `
          <div class="empty-state">
            <i class="ph-fill ph-package"></i>
            <h3>এখনো কোনো অর্ডার নেই</h3>
            <p>প্রথম অর্ডার করুন এবং আনন্দ উপভোগ করুন</p>
            <button class="btn btn-primary" onclick="router.go('products')">
              <i class="ph-bold ph-shopping-bag"></i> ${t("shop_now")}
            </button>
          </div>`;
        return;
      }
      el.innerHTML = orders.map((o) => this.orderCardHTML(o, false)).join("");
    });
  },

  orderCardHTML(o, admin) {
    const items = (o.items || []).map((i) =>
      `<span style="padding:6px 12px;background:var(--bg-soft);border-radius:50px;font-size:13px;font-weight:600;">
        ${esc(state.lang === "bn" ? i.name : (i.nameEn || i.name))} × ${i.qty}
      </span>`
    ).join("");

    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
          <div>
            <div style="font-family:monospace;font-weight:900;color:var(--brand-1);font-size:15px;">
              #${(o.orderId || o.id).slice(-8).toUpperCase()}
            </div>
            <div style="font-size:12.5px;color:var(--text-3);margin-top:3px;font-weight:500;">
              <i class="ph-bold ph-clock"></i> ${fmtDate(o.createdAt)}
            </div>
          </div>
          <span class="status-pill status-${o.status}">${t(o.status)}</span>
        </div>

        ${admin ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13.5px;color:var(--text-2);margin-bottom:12px;background:var(--bg-soft);padding:12px;border-radius:10px;">
            <div><i class="ph-bold ph-user"></i> ${esc(o.userName || "—")}</div>
            <div><i class="ph-bold ph-phone"></i> ${esc(o.phone || "—")}</div>
            <div style="grid-column:1/-1;"><i class="ph-bold ph-map-pin"></i> ${esc(o.address || "—")}</div>
          </div>
        ` : ""}

        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px dashed var(--border);">
          ${items}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:20px;font-weight:900;background:var(--brand-grad);-webkit-background-clip:text;background-clip:text;color:transparent;font-family:var(--font-display);">
            ${fmtPrice(o.total)}
          </div>
          ${admin ? `
            <select class="status-select" data-oid="${o.id}" data-uid="${o.userId}" style="padding:7px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg-elev);color:var(--text);cursor:pointer;font-weight:700;font-size:13px;">
              ${["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) =>
                `<option value="${s}" ${o.status === s ? "selected" : ""}>${t(s)}</option>`
              ).join("")}
            </select>
          ` : ""}
        </div>
      </div>
    `;
  },

  /* ─── ORDERS ─── */
  orders(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="ph-fill ph-receipt"></i> ${t("my_orders")}</h1>
        <div id="ordersWrap" style="margin-top:24px;">
          <div class="empty-state"><i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i></div>
        </div>
      </section>
    `;

    api.listenUserOrders(state.user.uid, (orders) => {
      const w = $("#ordersWrap");
      if (!w) return;
      if (!orders.length) {
        w.innerHTML = `
          <div class="empty-state">
            <i class="ph-fill ph-package"></i>
            <h3>এখনো কোনো অর্ডার নেই</h3>
            <button class="btn btn-primary" onclick="router.go('products')">
              <i class="ph-bold ph-shopping-bag"></i> ${t("shop_now")}
            </button>
          </div>`;
        return;
      }
      w.innerHTML = orders.map((o) => this.orderCardHTML(o, false)).join("");
    });
  },

  /* ─── WISHLIST ─── */
  wishlist(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="ph-fill ph-heart" style="color:#ec4899;"></i> ${t("wishlist")}</h1>
        <div class="product-grid" id="wishGrid" style="margin-top:24px;"></div>
      </section>
    `;

    const grid = $("#wishGrid");
    if (!state.wishlist.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <i class="ph-fill ph-heart-break"></i>
          <h3>${t("wishlist_empty")}</h3>
          <p>পছন্দের পণ্য সংরক্ষণ করুন</p>
          <button class="btn btn-primary" onclick="router.go('products')">
            <i class="ph-bold ph-shopping-bag"></i> ${t("shop_now")}
          </button>
        </div>`;
      return;
    }

    const items = state.wishlist.map((w) => state.products.find((x) => x.id === w.id) || w);
    grid.innerHTML = items.map(productCardHTML).join("");
    grid.querySelectorAll(".product-card").forEach((c) => {
      c.onclick = () => productDetail.openById(c.dataset.id);
    });
  },

  /* ─── PROFILE ─── */
  async profile(app) {
    app.innerHTML = `<section class="page"><div class="empty-state"><i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i></div></section>`;
    const p = (await api.getProfile(state.user.uid)) || {};

    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="ph-fill ph-user-circle"></i> ${t("profile")}</h1>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:24px;margin-top:24px;max-width:1000px;" class="profile-grid">
          <div class="card" style="text-align:center;padding:32px;">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || "U")}&background=6366f1&color=fff&size=200"
              style="width:120px;height:120px;border-radius:50%;margin:0 auto 16px;border:4px solid var(--brand-1);" />
            <h3 style="font-size:20px;font-weight:800;font-family:var(--font-display);">${esc(p.name || "User")}</h3>
            <p style="color:var(--text-2);font-size:14px;margin-top:4px;">${esc(p.email || "")}</p>
            <div class="status-pill ${state.isAdmin ? "status-shipped" : "status-delivered"}" style="margin-top:14px;">
              <i class="ph-fill ph-${state.isAdmin ? "shield-check" : "user"}"></i>
              ${state.isAdmin ? "ADMIN" : "USER"}
            </div>
          </div>

          <div class="card" style="padding:28px;">
            <h3 style="font-size:18px;margin-bottom:20px;font-family:var(--font-display);">
              <i class="ph-bold ph-pencil-simple"></i> তথ্য সম্পাদনা
            </h3>
            <div class="form-group">
              <label>${t("name")}</label>
              <input id="pfName" value="${esc(p.name || "")}" />
            </div>
            <div class="form-group">
              <label>${t("email")}</label>
              <input value="${esc(p.email || "")}" disabled />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>${t("phone")}</label>
                <input id="pfPhone" value="${esc(p.phone || "")}" />
              </div>
              <div class="form-group">
                <label>যোগদান</label>
                <input value="${p.createdAt ? fmtDateShort(p.createdAt) : "—"}" disabled />
              </div>
            </div>
            <div class="form-group">
              <label>${t("address")}</label>
              <textarea id="pfAddress">${esc(p.address || "")}</textarea>
            </div>
            <button class="btn btn-primary btn-block" id="saveProfileBtn">
              <i class="ph-bold ph-floppy-disk"></i> ${t("save")}
            </button>
          </div>
        </div>
      </section>
    `;

    $("#saveProfileBtn").onclick = async () => {
      try {
        await api.updateProfile(state.user.uid, {
          name: $("#pfName").value.trim(),
          phone: $("#pfPhone").value.trim(),
          address: $("#pfAddress").value.trim()
        });
        toast(t("profile_updated"), "success");
      } catch (e) {
        toast(e.message, "error");
      }
    };
  },

  /* ─── SETTINGS ─── */
  settings(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="ph-fill ph-gear"></i> ${t("settings")}</h1>
        <div class="card" style="max-width:640px;margin-top:24px;padding:28px;">
          <div class="form-group">
            <label>ভাষা</label>
            <select id="setLang">
              <option value="bn" ${state.lang === "bn" ? "selected" : ""}>বাংলা</option>
              <option value="en" ${state.lang === "en" ? "selected" : ""}>English</option>
            </select>
          </div>
          <div class="form-group">
            <label>থিম</label>
            <select id="setTheme">
              <option value="light" ${state.themeMode === "light" ? "selected" : ""}>Light</option>
              <option value="dark" ${state.themeMode === "dark" ? "selected" : ""}>Dark</option>
              <option value="auto" ${state.themeMode === "auto" ? "selected" : ""}>Auto (System)</option>
            </select>
          </div>
          <button class="btn btn-primary btn-block" id="saveSettingsBtn">
            <i class="ph-bold ph-floppy-disk"></i> ${t("save")}
          </button>

          <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--border);">
            <h4 style="margin-bottom:12px;font-size:15px;font-weight:800;">অ্যাকাউন্ট</h4>
            <button class="btn btn-danger btn-block" onclick="authUI.doLogout()">
              <i class="ph-bold ph-sign-out"></i> ${t("logout")}
            </button>
          </div>
        </div>
      </section>
    `;

    $("#saveSettingsBtn").onclick = () => {
      const nl = $("#setLang").value;
      const nt = $("#setTheme").value;

      state.themeMode = nt;
      localStorage.setItem("themeMode", nt);
      applyTheme();

      if (nl !== state.lang) {
        state.lang = nl;
        localStorage.setItem("lang", nl);
        applyLang();
      }

      toast(t("settings_saved"), "success");
      setTimeout(() => router.render(), 400);
    };
  }
};
window.Pages = Pages;

/* ═══════════════════════════════════════════════════════════════
   18. ADMIN PANEL
   ═══════════════════════════════════════════════════════════════ */
const adminPage = {
  current: "overview",

  render() {
    if (!state.isAdmin) return;

    const pages = {
      overview: () => this.overview(),
      analytics: () => this.analytics(),
      orders: () => this.orders(),
      products: () => this.products(),
      categories: () => this.categories(),
      coupons: () => this.coupons(),
      reviews: () => this.reviews(),
      users: () => this.users(),
      notifications: () => this.pushNotifications(),
      banners: () => this.banners(),
      settings: () => this.settings(),
      activity: () => this.activity(),
      export: () => this.exportData()
    };

    const titles = {
      overview: ["ওভারভিউ", "সকল তথ্য এক নজরে"],
      analytics: ["অ্যানালিটিক্স", "গভীর পরিসংখ্যান ও রিপোর্ট"],
      orders: ["অর্ডার ম্যানেজমেন্ট", "সকল অর্ডার পরিচালনা করুন"],
      products: ["পণ্য ম্যানেজমেন্ট", "পণ্য যোগ, এডিট বা মুছুন"],
      categories: ["ক্যাটাগরি ম্যানেজমেন্ট", "ক্যাটাগরি সংগঠিত করুন"],
      coupons: ["কুপন ম্যানেজমেন্ট", "ডিসকাউন্ট কোড তৈরি করুন"],
      reviews: ["রিভিউ ম্যানেজমেন্ট", "কাস্টমার রিভিউ মডারেট করুন"],
      users: ["ইউজার ম্যানেজমেন্ট", "সকল ইউজার পরিচালনা করুন"],
      notifications: ["পুশ নোটিফিকেশন", "সকল ইউজারকে জানান"],
      banners: ["ব্যানার ম্যানেজমেন্ট", "হোমপেজ ব্যানার"],
      settings: ["সাইট সেটিংস", "স্টোর কনফিগার করুন"],
      activity: ["অ্যাক্টিভিটি লগ", "সাম্প্রতিক কার্যক্রম"],
      export: ["এক্সপোর্ট ডেটা", "আপনার ডেটা ডাউনলোড করুন"]
    };

    const [title, sub] = titles[this.current] || ["ড্যাশবোর্ড", ""];
    const el1 = $("#adminPageTitle");
    const el2 = $("#adminPageSubtitle");
    if (el1) el1.textContent = title;
    if (el2) el2.textContent = sub;

    $$(".admin-nav a").forEach((a) => a.classList.toggle("active", a.dataset.admin === this.current));

    const content = $("#adminContent");
    if (!content) return;
    content.innerHTML = "";

    try {
      (pages[this.current] || pages.overview)();
    } catch (e) {
      console.error(e);
      content.innerHTML = `<div class="empty-state"><i class="ph-fill ph-warning"></i><h3>সমস্যা: ${esc(e.message)}</h3></div>`;
    }
    if (window.innerWidth <= 1100) $("#adminSidebar")?.classList.remove("open");
  },

  go(page) { this.current = page; this.render(); },

  /* ─── OVERVIEW ─── */
  overview() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card g1">
          <div class="kpi-icon g1"><i class="ph-fill ph-package"></i></div>
          <div class="kpi-label">মোট পণ্য</div>
          <div class="kpi-value" id="kProduct">0</div>
          <div class="kpi-trend up"><i class="ph-bold ph-trend-up"></i> Live</div>
        </div>
        <div class="kpi-card g2">
          <div class="kpi-icon g2"><i class="ph-fill ph-receipt"></i></div>
          <div class="kpi-label">মোট অর্ডার</div>
          <div class="kpi-value" id="kOrder">0</div>
          <div class="kpi-trend up"><i class="ph-bold ph-trend-up"></i> Live</div>
        </div>
        <div class="kpi-card g3">
          <div class="kpi-icon g3"><i class="ph-fill ph-users-three"></i></div>
          <div class="kpi-label">মোট ইউজার</div>
          <div class="kpi-value" id="kUser">0</div>
          <div class="kpi-trend up"><i class="ph-bold ph-trend-up"></i> Live</div>
        </div>
        <div class="kpi-card g4">
          <div class="kpi-icon g4"><i class="ph-fill ph-currency-circle-dollar"></i></div>
          <div class="kpi-label">মোট আয়</div>
          <div class="kpi-value" id="kRevenue">৳0</div>
          <div class="kpi-trend up"><i class="ph-bold ph-trend-up"></i> Delivered</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3><i class="ph-bold ph-chart-line-up"></i> সাপ্তাহিক বিক্রয়</h3></div>
          <div class="chart-container"><canvas id="salesChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="ph-bold ph-chart-pie-slice"></i> অর্ডার স্ট্যাটাস</h3></div>
          <div class="chart-container"><canvas id="statusChart"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-clock-counter-clockwise"></i> সাম্প্রতিক অর্ডার</h3>
          <button class="btn btn-outline btn-sm" onclick="adminPage.go('orders')">
            সব দেখুন <i class="ph-bold ph-arrow-right"></i>
          </button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>অর্ডার ID</th><th>গ্রাহক</th><th>মোট</th><th>স্ট্যাটাস</th><th>তারিখ</th></tr></thead>
          <tbody id="recentOrdersBody">
            <tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-3);">
              <i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;font-size:20px;"></i>
            </td></tr>
          </tbody>
        </table></div></div>
      </div>
    `;

    api.listenProducts((p) => {
      const el = $("#kProduct");
      if (el) el.textContent = p.length;
      const n = $("#navProductCount");
      if (n) n.textContent = p.length;
    });

    api.listenUsers((u) => {
      const el = $("#kUser");
      if (el) el.textContent = u.length;
    });

    api.listenAllOrders((orders) => {
      const ko = $("#kOrder");
      if (ko) ko.textContent = orders.length;
      const nav = $("#navOrderCount");
      if (nav) nav.textContent = orders.length;

      const rev = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + (o.total || 0), 0);
      const kr = $("#kRevenue");
      if (kr) kr.textContent = fmtPrice(rev);

      const tb = $("#recentOrdersBody");
      if (tb) {
        const recent = orders.slice(0, 5);
        if (!recent.length) {
          tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-3);">কোনো অর্ডার নেই</td></tr>`;
        } else {
          tb.innerHTML = recent.map((o) => `
            <tr>
              <td><strong style="color:var(--brand-1);font-family:monospace;">#${(o.orderId || o.id).slice(-6).toUpperCase()}</strong></td>
              <td>${esc(o.userName || "—")}</td>
              <td><strong>${fmtPrice(o.total)}</strong></td>
              <td><span class="status-pill status-${o.status}">${t(o.status)}</span></td>
              <td style="color:var(--text-3);font-size:13px;">${fmtDateShort(o.createdAt)}</td>
            </tr>
          `).join("");
        }
      }

      this.renderSalesChart(orders);
      this.renderStatusChart(orders);
    });
  },

  renderSalesChart(orders) {
    const ctx = document.getElementById("salesChart");
    if (!ctx || typeof Chart === "undefined") return;

    const labels = [], data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      labels.push(d.toLocaleDateString(state.lang === "bn" ? "bn-BD" : "en-US", { weekday: "short", day: "numeric" }));
      data.push(orders.filter((o) => new Date(o.createdAt).toDateString() === ds).reduce((s, o) => s + (o.total || 0), 0));
    }

    if (state.charts.sales) state.charts.sales.destroy();
    state.charts.sales = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Sales",
          data,
          borderColor: "#6366f1",
          backgroundColor: (c) => {
            const g = c.chart.ctx.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, "rgba(99,102,241,0.35)");
            g.addColorStop(1, "rgba(99,102,241,0)");
            return g;
          },
          fill: true, tension: 0.4, borderWidth: 3,
          pointRadius: 5, pointBackgroundColor: "#6366f1",
          pointBorderColor: "#fff", pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.15)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
        }
      }
    });
  },

  renderStatusChart(orders) {
    const ctx = document.getElementById("statusChart");
    if (!ctx || typeof Chart === "undefined") return;

    const counts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++; });

    if (state.charts.status) state.charts.status.destroy();
    state.charts.status = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["অপেক্ষমাণ", "কনফার্মড", "শিপড", "ডেলিভারড", "বাতিল"],
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"],
          borderWidth: 0, hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: { legend: { position: "bottom", labels: { color: "#94a3b8", padding: 14, font: { size: 12 } } } }
      }
    });
  },

  /* ─── ANALYTICS ─── */
  analytics() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card g1">
          <div class="kpi-icon g1"><i class="ph-fill ph-chart-bar"></i></div>
          <div class="kpi-label">গড় অর্ডার মূল্য</div>
          <div class="kpi-value" id="aAOV">৳0</div>
        </div>
        <div class="kpi-card g2">
          <div class="kpi-icon g2"><i class="ph-fill ph-percent"></i></div>
          <div class="kpi-label">রূপান্তর হার</div>
          <div class="kpi-value">3.8%</div>
        </div>
        <div class="kpi-card g3">
          <div class="kpi-icon g3"><i class="ph-fill ph-package"></i></div>
          <div class="kpi-label">কম স্টক আইটেম</div>
          <div class="kpi-value" id="aLowStock">0</div>
        </div>
        <div class="kpi-card g4">
          <div class="kpi-icon g4"><i class="ph-fill ph-star"></i></div>
          <div class="kpi-label">গড় রেটিং</div>
          <div class="kpi-value">4.7</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="ph-bold ph-fire"></i> জনপ্রিয় পণ্য</h3></div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>পণ্য</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>স্ট্যাটাস</th></tr></thead>
          <tbody id="topProductsBody"></tbody>
        </table></div></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3><i class="ph-bold ph-chart-area-line"></i> মাসিক বিক্রয়</h3></div>
          <div class="chart-container"><canvas id="monthlyChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="ph-bold ph-tag"></i> ক্যাটাগরি বিতরণ</h3></div>
          <div class="chart-container"><canvas id="catChart"></canvas></div>
        </div>
      </div>
    `;

    api.listenAllOrders((orders) => {
      const aov = orders.length ? orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length : 0;
      const el = $("#aAOV");
      if (el) el.textContent = fmtPrice(aov);
      this.renderMonthlyChart(orders);
    });

    api.listenProducts((products) => {
      const low = products.filter((p) => (p.stock || 0) < 10).length;
      const el = $("#aLowStock");
      if (el) el.textContent = low;

      const tb = $("#topProductsBody");
      if (tb) {
        const top = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
        tb.innerHTML = top.length ? top.map((p) => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:10px;">
              <img src="${esc(p.image || "https://via.placeholder.com/40")}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />
              <strong>${esc(p.name)}</strong>
            </div></td>
            <td>${esc(p.category || "—")}</td>
            <td><strong>${fmtPrice(p.price)}</strong></td>
            <td>${p.stock || 0}</td>
            <td><span class="status-pill ${(p.stock || 0) > 0 ? "status-active" : "status-banned"}">${(p.stock || 0) > 0 ? "স্টকে" : "শেষ"}</span></td>
          </tr>
        `).join("") : `<tr><td colspan="5" style="text-align:center;padding:30px;">কোনো পণ্য নেই</td></tr>`;
      }
      this.renderCatChart(products);
    });
  },

  renderMonthlyChart(orders) {
    const ctx = document.getElementById("monthlyChart");
    if (!ctx || typeof Chart === "undefined") return;

    const months = [], data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleDateString("en-US", { month: "short" }));
      data.push(orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      }).reduce((s, o) => s + (o.total || 0), 0));
    }

    if (state.charts.monthly) state.charts.monthly.destroy();
    state.charts.monthly = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [{
          label: "Revenue", data,
          backgroundColor: "rgba(99,102,241,0.7)",
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.15)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
        }
      }
    });
  },

  renderCatChart(products) {
    const ctx = document.getElementById("catChart");
    if (!ctx || typeof Chart === "undefined") return;

    const counts = {};
    products.forEach((p) => { counts[p.category || "Other"] = (counts[p.category || "Other"] || 0) + 1; });

    if (state.charts.cat) state.charts.cat.destroy();
    state.charts.cat = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: [
            "rgba(99,102,241,0.7)", "rgba(236,72,153,0.7)", "rgba(16,185,129,0.7)",
            "rgba(245,158,11,0.7)", "rgba(139,92,246,0.7)", "rgba(59,130,246,0.7)", "rgba(239,68,68,0.7)"
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { color: "#94a3b8", padding: 10 } } },
        scales: { r: { grid: { color: "rgba(148,163,184,0.15)" }, ticks: { color: "#94a3b8" } } }
      }
    });
  },

  /* ─── ORDERS ─── */
  orders() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-receipt"></i> সকল অর্ডার</h3>
          <select id="orderFilter" style="padding:8px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-weight:700;">
            <option value="all">সব স্ট্যাটাস</option>
            <option value="pending">${t("pending")}</option>
            <option value="confirmed">${t("confirmed")}</option>
            <option value="shipped">${t("shipped")}</option>
            <option value="delivered">${t("delivered")}</option>
            <option value="cancelled">${t("cancelled")}</option>
          </select>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>ID</th><th>গ্রাহক</th><th>আইটেম</th><th>মোট</th><th>স্ট্যাটাস</th><th>তারিখ</th><th>কার্যক্রম</th></tr></thead>
          <tbody id="ordersTbody"></tbody>
        </table></div></div>
      </div>
    `;

    const render = (orders) => {
      const tb = $("#ordersTbody");
      if (!tb) return;
      if (!orders.length) {
        tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">কোনো অর্ডার নেই</td></tr>`;
        return;
      }
      tb.innerHTML = orders.map((o) => `
        <tr>
          <td><strong style="font-family:monospace;color:var(--brand-1);">#${(o.orderId || o.id).slice(-6).toUpperCase()}</strong></td>
          <td>
            <div style="font-weight:600;">${esc(o.userName || "—")}</div>
            <div style="font-size:12px;color:var(--text-3);">${esc(o.phone || "")}</div>
          </td>
          <td>${(o.items || []).length}</td>
          <td><strong>${fmtPrice(o.total)}</strong></td>
          <td>
            <select class="status-select" data-oid="${o.id}" data-uid="${o.userId}" style="padding:5px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev);color:var(--text);font-weight:700;font-size:12px;cursor:pointer;">
              ${["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) =>
                `<option value="${s}" ${o.status === s ? "selected" : ""}>${t(s)}</option>`
              ).join("")}
            </select>
          </td>
          <td style="font-size:13px;color:var(--text-3);">${fmtDateShort(o.createdAt)}</td>
          <td>
            <div class="table-actions">
              <button class="act-view" onclick="adminPage.viewOrder('${o.id}')" title="দেখুন"><i class="ph-bold ph-eye"></i></button>
              <button class="act-del" onclick="adminPage.deleteOrder('${o.id}', '${o.userId}')" title="মুছুন"><i class="ph-bold ph-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");

      tb.querySelectorAll(".status-select").forEach((sel) => {
        sel.onchange = async () => {
          await api.updateOrderStatus(sel.dataset.oid, sel.value, sel.dataset.uid);
          toast("✓ স্ট্যাটাস আপডেট হয়েছে", "success");
        };
      });
    };

    api.listenAllOrders((orders) => render(orders));
    $("#orderFilter").onchange = () => {
      const filter = $("#orderFilter").value;
      const orders = filter === "all" ? state.orders : state.orders.filter((o) => o.status === filter);
      render(orders);
    };
  },

  viewOrder(id) {
    const o = state.orders.find((x) => x.id === id);
    if (!o) return;

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div style="padding:32px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;font-family:var(--font-display);">
          <i class="ph-bold ph-receipt" style="color:var(--brand-1)"></i>
          অর্ডার #${(o.orderId || o.id).slice(-8).toUpperCase()}
        </h2>
        <p style="color:var(--text-3);margin-bottom:22px;">${fmtDate(o.createdAt)}</p>

        <div class="grid-2" style="margin-bottom:20px;background:var(--bg-soft);padding:14px;border-radius:12px;">
          <div><strong>গ্রাহক:</strong> ${esc(o.userName)}</div>
          <div><strong>ফোন:</strong> ${esc(o.phone)}</div>
          <div style="grid-column:1/-1;"><strong>ঠিকানা:</strong> ${esc(o.address)}</div>
        </div>

        <div class="table-wrap" style="margin-bottom:20px;">
          <table class="data-table">
            <thead><tr><th>আইটেম</th><th>দাম</th><th>পরিমাণ</th><th>মোট</th></tr></thead>
            <tbody>
              ${(o.items || []).map((i) => `
                <tr>
                  <td>${esc(i.name)}</td>
                  <td>${fmtPrice(i.price)}</td>
                  <td>${i.qty}</td>
                  <td><strong>${fmtPrice(i.price * i.qty)}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div style="text-align:right;">
          <div style="font-size:14px;color:var(--text-2);">সাবটোটাল: ${fmtPrice(o.subtotal || 0)}</div>
          <div style="font-size:14px;color:var(--text-2);">শিপিং: ${fmtPrice(o.shipping || 0)}</div>
          <div style="font-size:20px;font-weight:900;margin-top:8px;">মোট: ${fmtPrice(o.total)}</div>
        </div>

        <div style="display:flex;gap:10px;margin-top:22px;">
          <button class="btn btn-outline btn-block" onclick="window.print()">
            <i class="ph-bold ph-printer"></i> প্রিন্ট
          </button>
        </div>
      </div>
    `, { size: "lg" });
  },

  deleteOrder(id, uid) {
    confirmDialog("অর্ডার মুছে ফেলবেন?", async () => {
      await remove(ref(db, `orders/${id}`));
      if (uid) await remove(ref(db, `userOrders/${uid}/${id}`));
      toast("অর্ডার মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── PRODUCTS ─── */
  products() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-package"></i> সকল পণ্য (<span id="prodCount">0</span>)</h3>
          <button class="btn btn-primary" id="addProductBtn">
            <i class="ph-bold ph-plus"></i> ${t("add_product")}
          </button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>ছবি</th><th>নাম</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>ফিচার্ড</th><th>কার্যক্রম</th></tr></thead>
          <tbody id="productsTbody"></tbody>
        </table></div></div>
      </div>
    `;

    $("#addProductBtn").onclick = () => this.productForm();

    api.listenProducts((products) => {
      const el = $("#prodCount");
      if (el) el.textContent = products.length;

      const tb = $("#productsTbody");
      if (!tb) return;

      if (!products.length) {
        tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">কোনো পণ্য নেই। একটি যোগ করুন!</td></tr>`;
        return;
      }

      tb.innerHTML = products.map((p) => `
        <tr>
          <td><img src="${esc(p.image || "https://via.placeholder.com/50")}" style="width:50px;height:50px;border-radius:10px;object-fit:cover;" /></td>
          <td>
            <strong>${esc(p.name)}</strong>
            <div style="font-size:12px;color:var(--text-3);">${esc(p.nameEn || "")}</div>
          </td>
          <td><span style="padding:3px 10px;background:var(--bg-soft);border-radius:50px;font-size:12px;font-weight:600;">${esc(p.category || "Other")}</span></td>
          <td><strong>${fmtPrice(p.price)}</strong></td>
          <td><span class="status-pill ${(p.stock || 0) > 0 ? "status-active" : "status-banned"}">${p.stock || 0}</span></td>
          <td>
            <label class="switch">
              <input type="checkbox" ${p.featured ? "checked" : ""} onchange="adminPage.toggleFeatured('${p.id}', this.checked)" />
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <div class="table-actions">
              <button class="act-edit" onclick="adminPage.editProduct('${p.id}')" title="এডিট"><i class="ph-bold ph-pencil-simple"></i></button>
              <button class="act-del" onclick="adminPage.deleteProduct('${p.id}')" title="মুছুন"><i class="ph-bold ph-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
    });
  },

  async toggleFeatured(id, featured) {
    await api.toggleFeatured(id, featured);
    toast(featured ? "⭐ ফিচার্ড যোগ হয়েছে" : "ফিচার্ড থেকে সরানো হয়েছে", "success");
  },

  productForm(product = null) {
    const isEdit = !!product;
    const cats = state.categories;

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;font-family:var(--font-display);">
          <i class="ph-bold ph-${isEdit ? "pencil-simple" : "plus-circle"}" style="color:var(--brand-1)"></i>
          ${isEdit ? t("edit_product") : t("add_product")}
        </h2>
        <p style="color:var(--text-2);font-size:14px;margin-bottom:22px;">পণ্যের তথ্য পূরণ করুন</p>

        <div class="form-row">
          <div class="form-group">
            <label>নাম (বাংলা) *</label>
            <input id="pName" value="${esc(product?.name || "")}" required />
          </div>
          <div class="form-group">
            <label>Name (English)</label>
            <input id="pNameEn" value="${esc(product?.nameEn || "")}" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>${t("price")} *</label>
            <input type="number" id="pPrice" value="${product?.price || ""}" required min="0" />
          </div>
          <div class="form-group">
            <label>পুরানো দাম</label>
            <input type="number" id="pOldPrice" value="${product?.oldPrice || ""}" min="0" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>${t("product_category")}</label>
            <select id="pCategory">
              ${cats.map((c) => `<option value="${esc(c.name)}" ${product?.category === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
              <option value="Other" ${product?.category === "Other" ? "selected" : ""}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>${t("stock")}</label>
            <input type="number" id="pStock" value="${product?.stock || 0}" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>${t("product_desc")} (বাংলা)</label>
          <textarea id="pDesc">${esc(product?.description || "")}</textarea>
        </div>

        <div class="form-group">
          <label>Description (English)</label>
          <textarea id="pDescEn">${esc(product?.descriptionEn || "")}</textarea>
        </div>

        <div class="form-group">
          <label>${t("product_image")}</label>
          <input type="file" id="pImage" accept="image/*" />
          <small>ImgBB তে আপলোড হবে — সর্বোচ্চ ৩২MB</small>
        </div>

        <div class="form-group" style="display:flex;align-items:center;gap:12px;">
          <label class="switch">
            <input type="checkbox" id="pFeatured" ${product?.featured ? "checked" : ""} />
            <span class="slider"></span>
          </label>
          <span style="font-weight:600;">ফিচার্ড পণ্য</span>
        </div>

        <div id="uploadProgressWrap" style="display:none;margin-bottom:16px;">
          <div style="height:6px;background:var(--bg-soft);border-radius:3px;overflow:hidden;">
            <div id="uploadProgressBar" style="height:100%;width:0%;background:var(--brand-grad);transition:width 0.3s ease;"></div>
          </div>
          <p style="font-size:12px;color:var(--text-3);margin-top:6px;" id="uploadProgressText">${t("uploading_image")}</p>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;">
          <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">${t("cancel")}</button>
          <button class="btn btn-primary" id="saveProductBtn" style="flex:2;">
            <i class="ph-bold ph-floppy-disk"></i> ${t("save")}
          </button>
        </div>
      </div>
    `, { size: "lg" });

    $("#saveProductBtn").onclick = async () => {
      const name = $("#pName").value.trim();
      const price = Number($("#pPrice").value);
      if (!name || !price) { toast("নাম এবং দাম আবশ্যক", "error"); return; }

      const btn = $("#saveProductBtn");
      btn.disabled = true;
      btn.innerHTML = `<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i> সংরক্ষণ...`;

      const data = {
        name,
        nameEn: $("#pNameEn").value.trim() || name,
        price,
        oldPrice: Number($("#pOldPrice").value) || 0,
        category: $("#pCategory").value,
        stock: Number($("#pStock").value) || 0,
        description: $("#pDesc").value.trim(),
        descriptionEn: $("#pDescEn").value.trim() || $("#pDesc").value.trim(),
        featured: $("#pFeatured").checked,
        image: product?.image || ""
      };

      const file = $("#pImage").files[0];

      const progressWrap = $("#uploadProgressWrap");
      const progressBar = $("#uploadProgressBar");
      const progressText = $("#uploadProgressText");

      try {
        if (file) {
          if (progressWrap) progressWrap.style.display = "block";
          if (progressBar) progressBar.style.width = "30%";
          if (progressText) progressText.textContent = "ImgBB তে আপলোড হচ্ছে...";
        }

        if (isEdit) {
          await api.updateProduct(product.id, data, file);
          toast(t("product_updated"), "success");
        } else {
          await api.addProduct(data, file);
          toast(t("product_added"), "success");
        }

        if (progressBar) progressBar.style.width = "100%";
        if (progressText) progressText.textContent = "✓ সম্পন্ন!";

        setTimeout(() => modal.close(), 400);
      } catch (e) {
        console.error(e);
        toast(e.message || t("error_occurred"), "error", 5000);
        btn.disabled = false;
        btn.innerHTML = `<i class="ph-bold ph-floppy-disk"></i> ${t("save")}`;
        if (progressWrap) progressWrap.style.display = "none";
      }
    };
  },

  editProduct(id) {
    const p = state.products.find((x) => x.id === id);
    if (p) this.productForm(p);
  },

  deleteProduct(id) {
    confirmDialog("এই পণ্য মুছে ফেলবেন?", async () => {
      await api.deleteProduct(id);
      toast(t("product_deleted"), "success");
    });
  },

  /* ─── CATEGORIES ─── */
  categories() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-tag"></i> ক্যাটাগরি (<span id="catCount">0</span>)</h3>
          <button class="btn btn-primary" id="addCatBtn">
            <i class="ph-bold ph-plus"></i> নতুন ক্যাটাগরি
          </button>
        </div>
        <div class="grid-3" id="catGrid"></div>
      </div>
    `;

    $("#addCatBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;font-family:var(--font-display);">
            <i class="ph-bold ph-tag"></i> নতুন ক্যাটাগরি
          </h2>
          <div class="form-group">
            <label>ক্যাটাগরি নাম</label>
            <input id="newCatName" placeholder="যেমন: Accessories" />
          </div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">বাতিল</button>
            <button class="btn btn-primary" id="saveCatBtn" style="flex:1;">সংরক্ষণ</button>
          </div>
        </div>
      `, { size: "sm" });

      $("#saveCatBtn").onclick = async () => {
        const n = $("#newCatName").value.trim();
        if (!n) { toast("নাম আবশ্যক", "error"); return; }
        await api.addCategory(n);
        toast("ক্যাটাগরি যোগ হয়েছে", "success");
        modal.close();
      };
    };

    api.listenCategories((cats) => {
      const el = $("#catCount");
      if (el) el.textContent = cats.length;

      const grid = $("#catGrid");
      if (!grid) return;

      grid.innerHTML = cats.map((cat) => {
        const count = state.products.filter((p) => p.category === cat.name).length;
        return `
          <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:44px;height:44px;border-radius:12px;background:var(--brand-grad-soft);display:flex;align-items:center;justify-content:center;color:var(--brand-1);font-size:20px;">
                <i class="ph-fill ph-tag"></i>
              </div>
              <div>
                <div style="font-weight:800;font-family:var(--font-display);">${esc(cat.name)}</div>
                <div style="font-size:12px;color:var(--text-3);">${count} টি পণ্য</div>
              </div>
            </div>
            <button style="width:36px;height:36px;border-radius:10px;background:rgba(239,68,68,0.1);color:var(--danger);display:flex;align-items:center;justify-content:center;" onclick="adminPage.deleteCat('${cat.id}')">
              <i class="ph-bold ph-trash"></i>
            </button>
          </div>
        `;
      }).join("");
    });
  },

  deleteCat(id) {
    confirmDialog("ক্যাটাগরি মুছবেন?", async () => {
      await api.deleteCategory(id);
      toast("ক্যাটাগরি মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── COUPONS ─── */
  coupons() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-ticket"></i> কুপন (<span id="couponCount">0</span>)</h3>
          <button class="btn btn-primary" id="addCouponBtn">
            <i class="ph-bold ph-plus"></i> নতুন কুপন
          </button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>কোড</th><th>ধরন</th><th>মান</th><th>সর্বনিম্ন ক্রয়</th><th>স্ট্যাটাস</th><th>কার্যক্রম</th></tr></thead>
          <tbody id="couponTbody"></tbody>
        </table></div></div>
      </div>
    `;

    $("#addCouponBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;font-family:var(--font-display);">
            <i class="ph-bold ph-ticket"></i> নতুন কুপন
          </h2>
          <div class="form-group">
            <label>কোড</label>
            <input id="cpCode" placeholder="SAVE10" style="text-transform:uppercase;" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>ধরন</label>
              <select id="cpType">
                <option value="percent">শতকরা (%)</option>
                <option value="fixed">নির্দিষ্ট (৳)</option>
              </select>
            </div>
            <div class="form-group">
              <label>মান</label>
              <input type="number" id="cpValue" placeholder="10" />
            </div>
          </div>
          <div class="form-group">
            <label>সর্বনিম্ন ক্রয় (ঐচ্ছিক)</label>
            <input type="number" id="cpMin" placeholder="0" />
          </div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">বাতিল</button>
            <button class="btn btn-primary" id="saveCouponBtn" style="flex:1;">তৈরি করুন</button>
          </div>
        </div>
      `, { size: "sm" });

      $("#saveCouponBtn").onclick = async () => {
        const code = $("#cpCode").value.trim().toUpperCase();
        const value = Number($("#cpValue").value);
        if (!code || !value) { toast("কোড এবং মান আবশ্যক", "error"); return; }
        await api.addCoupon({
          code, type: $("#cpType").value,
          value, minPurchase: Number($("#cpMin").value) || 0,
          active: true
        });
        toast("কুপন তৈরি হয়েছে", "success");
        modal.close();
      };
    };

    api.listenCoupons((coupons) => {
      const el = $("#couponCount");
      if (el) el.textContent = coupons.length;

      const tb = $("#couponTbody");
      if (!tb) return;

      if (!coupons.length) {
        tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-3);">কোনো কুপন নেই</td></tr>`;
        return;
      }

      tb.innerHTML = coupons.map((c) => `
        <tr>
          <td><strong style="font-family:monospace;background:var(--brand-grad-soft);color:var(--brand-1);padding:4px 10px;border-radius:6px;">${esc(c.code)}</strong></td>
          <td>${c.type === "percent" ? "শতকরা" : "নির্দিষ্ট"}</td>
          <td><strong>${c.type === "percent" ? c.value + "%" : fmtPrice(c.value)}</strong></td>
          <td>${c.minPurchase ? fmtPrice(c.minPurchase) : "—"}</td>
          <td><span class="status-pill status-active">সক্রিয়</span></td>
          <td><div class="table-actions">
            <button class="act-del" onclick="adminPage.deleteCoupon('${c.id}')"><i class="ph-bold ph-trash"></i></button>
          </div></td>
        </tr>
      `).join("");
    });
  },

  deleteCoupon(id) {
    confirmDialog("কুপন মুছবেন?", async () => {
      await api.deleteCoupon(id);
      toast("কুপন মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── REVIEWS ─── */
  reviews() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-star"></i> রিভিউ (<span id="revCount">0</span>)</h3>
        </div>
        <div id="revList"></div>
      </div>
    `;

    api.listenReviews((reviews) => {
      const el = $("#revCount");
      if (el) el.textContent = reviews.length;

      const list = $("#revList");
      if (!reviews.length) {
        list.innerHTML = `<div class="empty-state"><i class="ph-fill ph-chat-circle"></i><h3>এখনো কোনো রিভিউ নেই</h3></div>`;
        return;
      }

      list.innerHTML = reviews.map((r) => `
        <div class="card" style="margin:0 0 12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div>
              <div style="font-weight:800;font-family:var(--font-display);">${esc(r.userName || "User")}</div>
              <div style="color:#fbbf24;font-size:15px;">${"★".repeat(r.rating || 5)}</div>
              <p style="margin-top:8px;color:var(--text-2);">${esc(r.comment || "")}</p>
              <small style="color:var(--text-3);">${fmtDate(r.createdAt)}</small>
            </div>
            <button style="width:36px;height:36px;border-radius:10px;background:rgba(239,68,68,0.1);color:var(--danger);display:flex;align-items:center;justify-content:center;" onclick="adminPage.deleteReview('${r.id}')">
              <i class="ph-bold ph-trash"></i>
            </button>
          </div>
        </div>
      `).join("");
    });
  },

  deleteReview(id) {
    confirmDialog("রিভিউ মুছবেন?", async () => {
      await api.deleteReview(id);
      toast("রিভিউ মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── USERS ─── */
  users() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-users-three"></i> সকল ইউজার (<span id="userCount">0</span>)</h3>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>ইউজার</th><th>ইমেইল</th><th>ফোন</th><th>রোল</th><th>স্ট্যাটাস</th><th>যোগদান</th><th>কার্যক্রম</th></tr></thead>
          <tbody id="usersTbody"></tbody>
        </table></div></div>
      </div>
    `;

    api.listenUsers((users) => {
      const el = $("#userCount");
      if (el) el.textContent = users.length;

      const tb = $("#usersTbody");
      if (!tb) return;

      if (!users.length) {
        tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">কোনো ইউজার নেই</td></tr>`;
        return;
      }

      tb.innerHTML = users.map((u) => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=6366f1&color=fff&size=40" style="width:38px;height:38px;border-radius:50%;" />
              <strong>${esc(u.name || "User")}</strong>
            </div>
          </td>
          <td>${esc(u.email || "")}</td>
          <td>${esc(u.phone || "—")}</td>
          <td><span class="status-pill ${u.role === "admin" ? "status-shipped" : "status-confirmed"}">${u.role || "user"}</span></td>
          <td><span class="status-pill ${u.banned ? "status-banned" : "status-active"}">${u.banned ? "ব্যানড" : "সক্রিয়"}</span></td>
          <td style="font-size:13px;color:var(--text-3);">${fmtDateShort(u.createdAt)}</td>
          <td>
            <div class="table-actions">
              <button class="act-edit" onclick="adminPage.toggleBan('${u.id}', ${!u.banned})" title="${u.banned ? "আনব্যান" : "ব্যান"}">
                <i class="ph-bold ph-${u.banned ? "check" : "prohibit"}"></i>
              </button>
              <button class="act-del" onclick="adminPage.deleteUser('${u.id}')" title="মুছুন"><i class="ph-bold ph-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
    });
  },

  async toggleBan(uid, banned) {
    await api.toggleBan(uid, banned);
    toast(banned ? "ইউজার ব্যান করা হয়েছে" : "ইউজার আনব্যান করা হয়েছে", "success");
  },

  deleteUser(uid) {
    confirmDialog("ইউজার মুছবেন?", async () => {
      await remove(ref(db, `users/${uid}`));
      await remove(ref(db, `admins/${uid}`));
      toast("ইউজার মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── PUSH NOTIFICATIONS ─── */
  pushNotifications() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3><i class="ph-bold ph-megaphone"></i> ব্রডকাস্ট নোটিফিকেশন</h3>
          </div>
          <div class="form-group">
            <label>শিরোনাম</label>
            <input id="bcTitle" placeholder="ফ্ল্যাশ সেল!" />
          </div>
          <div class="form-group">
            <label>বার্তা</label>
            <textarea id="bcBody" placeholder="আজ ৫০% ছাড়!"></textarea>
          </div>
          <button class="btn btn-primary btn-block" id="sendBcBtn">
            <i class="ph-bold ph-paper-plane-tilt"></i> সব ইউজারকে পাঠান
          </button>
          <p style="font-size:12px;color:var(--text-3);margin-top:10px;">মোট ইউজার: <strong id="bcUserCount">0</strong></p>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="ph-bold ph-info"></i> তথ্য</h3></div>
          <p style="color:var(--text-2);line-height:1.8;">
            পুশ নোটিফিকেশন প্রতিটি ইউজারের নেভিগেশন বেল আইকনে দেখা যাবে।
            সেল, নতুন পণ্য বা গুরুত্বপূর্ণ আপডেট ঘোষণা করতে ব্যবহার করুন।
          </p>
        </div>
      </div>
    `;

    api.listenUsers((u) => {
      const el = $("#bcUserCount");
      if (el) el.textContent = u.length;
    });

    $("#sendBcBtn").onclick = async () => {
      const title = $("#bcTitle").value.trim();
      const body = $("#bcBody").value.trim();
      if (!title || !body) { toast("শিরোনাম এবং বার্তা আবশ্যক", "error"); return; }

      const btn = $("#sendBcBtn");
      btn.disabled = true;
      btn.innerHTML = `<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i> পাঠানো হচ্ছে...`;

      try {
        await api.broadcast(title, body);
        toast(`✓ ${state.users.length} জনকে পাঠানো হয়েছে`, "success");
        $("#bcTitle").value = "";
        $("#bcBody").value = "";
      } catch (e) {
        toast(e.message, "error");
      }

      btn.disabled = false;
      btn.innerHTML = `<i class="ph-bold ph-paper-plane-tilt"></i> সব ইউজারকে পাঠান`;
    };
  },

  /* ─── BANNERS ─── */
  banners() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="ph-bold ph-images"></i> হোমপেজ ব্যানার</h3>
          <button class="btn btn-primary" id="addBannerBtn">
            <i class="ph-bold ph-plus"></i> নতুন ব্যানার
          </button>
        </div>
        <div class="grid-3" id="bannerGrid"></div>
      </div>
    `;

    $("#addBannerBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;font-family:var(--font-display);">
            <i class="ph-bold ph-image"></i> নতুন ব্যানার
          </h2>
          <div class="form-group"><label>শিরোনাম</label><input id="bnTitle" /></div>
          <div class="form-group"><label>সাবটাইটেল</label><input id="bnSub" /></div>
          <div class="form-group"><label>লিংক</label><input id="bnLink" placeholder="/products" /></div>
          <div class="form-group"><label>ছবি</label><input type="file" id="bnImage" accept="image/*" /></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">বাতিল</button>
            <button class="btn btn-primary" id="saveBannerBtn" style="flex:1;">সংরক্ষণ</button>
          </div>
        </div>
      `, { size: "sm" });

      $("#saveBannerBtn").onclick = async () => {
        const title = $("#bnTitle").value.trim();
        if (!title) { toast("শিরোনাম আবশ্যক", "error"); return; }

        const btn = $("#saveBannerBtn");
        btn.disabled = true;
        btn.innerHTML = `<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite;"></i>`;

        try {
          await api.addBanner({
            title,
            subtitle: $("#bnSub").value.trim(),
            link: $("#bnLink").value.trim() || "/products",
            active: true
          }, $("#bnImage").files[0]);
          toast("ব্যানার যোগ হয়েছে", "success");
          modal.close();
        } catch (e) {
          toast(e.message, "error");
          btn.disabled = false;
          btn.textContent = "সংরক্ষণ";
        }
      };
    };

    api.listenBanners((banners) => {
      const grid = $("#bannerGrid");
      if (!grid) return;

      if (!banners.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="ph-fill ph-image"></i><h3>কোনো ব্যানার নেই</h3></div>`;
        return;
      }

      grid.innerHTML = banners.map((b) => `
        <div class="card" style="margin:0;padding:0;overflow:hidden;">
          <img src="${esc(b.image || "https://via.placeholder.com/300x150")}" style="width:100%;height:140px;object-fit:cover;" />
          <div style="padding:14px;">
            <h4 style="font-weight:800;font-size:14px;font-family:var(--font-display);">${esc(b.title)}</h4>
            <p style="font-size:12px;color:var(--text-3);margin-top:4px;">${esc(b.subtitle || "")}</p>
            <button class="btn btn-danger btn-sm" style="margin-top:10px;width:100%;" onclick="adminPage.deleteBanner('${b.id}')">
              <i class="ph-bold ph-trash"></i> মুছুন
            </button>
          </div>
        </div>
      `).join("");
    });
  },

  deleteBanner(id) {
    confirmDialog("ব্যানার মুছবেন?", async () => {
      await api.deleteBanner(id);
      toast("ব্যানার মুছে ফেলা হয়েছে", "success");
    });
  },

  /* ─── SETTINGS ─── */
  settings() {
    const s = state.siteSettings;
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="ph-bold ph-sliders-horizontal"></i> স্টোর তথ্য</h3></div>
        <div class="form-row">
          <div class="form-group"><label>সাইট নাম</label><input id="setName" value="${esc(s.siteName || "EcoShop")}" /></div>
          <div class="form-group"><label>ট্যাগলাইন</label><input id="setTagline" value="${esc(s.tagline || "Professional E-Commerce")}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>ইমেইল</label><input id="setEmail" value="${esc(s.email || "support@ecoshop.com")}" /></div>
          <div class="form-group"><label>ফোন</label><input id="setPhone" value="${esc(s.phone || "+880 1234-567890")}" /></div>
        </div>
        <div class="form-group"><label>ঠিকানা</label><input id="setAddress" value="${esc(s.address || "ঢাকা, বাংলাদেশ")}" /></div>
        <div class="form-group"><label>ফুটার টেক্সট</label><textarea id="setFooter">${esc(s.footerText || "© 2025 EcoShop Pro MAX. All rights reserved.")}</textarea></div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="ph-bold ph-truck"></i> শিপিং এবং ট্যাক্স</h3></div>
        <div class="form-row-3">
          <div class="form-group"><label>ফ্রি শিপিং উপরে</label><input type="number" id="setFreeShip" value="${s.freeShippingAbove || 5000}" /></div>
          <div class="form-group"><label>শিপিং ফি</label><input type="number" id="setShipFee" value="${s.shippingFee || 80}" /></div>
          <div class="form-group"><label>VAT %</label><input type="number" id="setVAT" value="${s.vat || 5}" /></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="ph-bold ph-megaphone"></i> ঘোষণা</h3></div>
        <div class="form-group">
          <label>ঘোষণা বার টেক্সট</label>
          <input id="setAnnouncement" value="${esc(s.announcement || "")}" placeholder="ফাঁকা রাখলে হাইড হবে" />
        </div>
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="saveSiteSettings">
        <i class="ph-bold ph-floppy-disk"></i> সব সেটিংস সংরক্ষণ
      </button>
    `;

    $("#saveSiteSettings").onclick = async () => {
      const data = {
        siteName: $("#setName").value.trim(),
        tagline: $("#setTagline").value.trim(),
        email: $("#setEmail").value.trim(),
        phone: $("#setPhone").value.trim(),
        address: $("#setAddress").value.trim(),
        footerText: $("#setFooter").value.trim(),
        freeShippingAbove: Number($("#setFreeShip").value) || 0,
        shippingFee: Number($("#setShipFee").value) || 0,
        vat: Number($("#setVAT").value) || 0,
        announcement: $("#setAnnouncement").value.trim()
      };
      await api.saveSiteSettings(data);
      toast(t("settings_saved"), "success");
    };
  },

  /* ─── ACTIVITY ─── */
  activity() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="ph-bold ph-clock-counter-clockwise"></i> সাম্প্রতিক কার্যক্রম</h3></div>
        <div id="activityList"></div>
      </div>
    `;

    api.listenActivityLogs((logs) => {
      const list = $("#activityList");
      if (!logs.length) {
        list.innerHTML = `<div class="empty-state"><i class="ph-fill ph-clock"></i><h3>এখনো কোনো কার্যক্রম নেই</h3></div>`;
        return;
      }
      list.innerHTML = logs.map((l) => {
        let icon = "ph-fill ph-clock-counter-clockwise";
        if (l.type?.startsWith("order")) icon = "ph-fill ph-receipt";
        else if (l.type?.startsWith("product")) icon = "ph-fill ph-package";
        else if (l.type?.startsWith("user")) icon = "ph-fill ph-user";
        else if (l.type?.startsWith("notify")) icon = "ph-fill ph-megaphone";

        return `
          <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);">
            <div style="width:40px;height:40px;border-radius:12px;background:var(--brand-grad-soft);color:var(--brand-1);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">
              <i class="${icon}"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;">${esc(l.message || "")}</div>
              <small style="color:var(--text-3);">${esc(l.userEmail || "")} • ${fmtDate(l.createdAt)}</small>
            </div>
          </div>
        `;
      }).join("");
    });
  },

  /* ─── EXPORT ─── */
  exportData() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="grid-3">
        <div class="card" style="text-align:center;">
          <i class="ph-fill ph-package" style="font-size:48px;color:var(--brand-1);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;font-family:var(--font-display);">পণ্য</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">CSV হিসেবে ডাউনলোড করুন</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportProducts()">
            <i class="ph-bold ph-download-simple"></i> এক্সপোর্ট
          </button>
        </div>
        <div class="card" style="text-align:center;">
          <i class="ph-fill ph-receipt" style="font-size:48px;color:var(--success);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;font-family:var(--font-display);">অর্ডার</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">CSV হিসেবে ডাউনলোড করুন</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportOrders()">
            <i class="ph-bold ph-download-simple"></i> এক্সপোর্ট
          </button>
        </div>
        <div class="card" style="text-align:center;">
          <i class="ph-fill ph-users-three" style="font-size:48px;color:var(--warning);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;font-family:var(--font-display);">ইউজার</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">CSV হিসেবে ডাউনলোড করুন</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportUsers()">
            <i class="ph-bold ph-download-simple"></i> এক্সপোর্ট
          </button>
        </div>
      </div>
    `;
  },

  exportProducts() {
    const rows = [["ID", "Name", "Name(EN)", "Price", "Old Price", "Category", "Stock", "Featured", "Created"]];
    state.products.forEach((p) => rows.push([
      p.id, p.name, p.nameEn, p.price, p.oldPrice, p.category, p.stock,
      p.featured ? "Yes" : "No", new Date(p.createdAt).toISOString()
    ]));
    downloadBlob(rows.map((r) => r.map((x) => `"${x || ""}"`).join(",")).join("\n"), "products.csv");
    toast("পণ্য এক্সপোর্ট হয়েছে", "success");
  },
  exportOrders() {
    const rows = [["Order ID", "Customer", "Phone", "Total", "Status", "Payment", "Date"]];
    state.orders.forEach((o) => rows.push([
      o.orderId || o.id, o.userName, o.phone, o.total, o.status, o.payment,
      new Date(o.createdAt).toISOString()
    ]));
    downloadBlob(rows.map((r) => r.map((x) => `"${x || ""}"`).join(",")).join("\n"), "orders.csv");
    toast("অর্ডার এক্সপোর্ট হয়েছে", "success");
  },
  exportUsers() {
    const rows = [["UID", "Name", "Email", "Phone", "Role", "Status", "Joined"]];
    state.users.forEach((u) => rows.push([
      u.uid, u.name, u.email, u.phone, u.role,
      u.banned ? "Banned" : "Active", new Date(u.createdAt).toISOString()
    ]));
    downloadBlob(rows.map((r) => r.map((x) => `"${x || ""}"`).join(",")).join("\n"), "users.csv");
    toast("ইউজার এক্সপোর্ট হয়েছে", "success");
  }
};
window.adminPage = adminPage;

/* ═══════════════════════════════════════════════════════════════
   19. AUTH UI
   ═══════════════════════════════════════════════════════════════ */
const authUI = {
  doLogout: async () => {
    await api.logout();
    state.user = null;
    state.isAdmin = false;
    state.userProfile = null;
    state.notifications = [];

    router.hideAdmin();
    updateUserUI();
    renderNotifications([]);

    toast(t("logged_out"), "success");
    setTimeout(() => router.go("auth"), 400);
  },
  updateAvatar() {
    const u = state.user;
    if (!u) return;
    const name = u.displayName || u.email || "User";
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
    const a1 = $("#userAvatar");
    const a2 = $("#adminAvatar");
    const a3 = $("#pmAvatar");
    if (a1) a1.src = url;
    if (a2) a2.src = url;
    if (a3) a3.src = url;

    const dh = $("#dropdownUserHeader");
    if (dh) {
      dh.innerHTML = `
        <h4>${esc(u.displayName || u.email?.split("@")[0] || "User")}</h4>
        <p>${esc(u.email || "")}</p>
      `;
    }

    const pmName = $("#pmName");
    const pmEmail = $("#pmEmail");
    const pmRole = $("#pmRoleBadge");
    if (pmName) pmName.textContent = u.displayName || u.email?.split("@")[0] || "User";
    if (pmEmail) pmEmail.textContent = u.email || "";
    if (pmRole) pmRole.textContent = state.isAdmin ? "ADMIN" : "USER";
  }
};
window.authUI = authUI;

/* ─── Update User UI ─── */
function updateUserUI() {
  const loggedIn = !!state.user;
  const userMenu = $("#userMenu");
  const loginBtn = $("#loginBtn");
  const ordersNavLink = $("#ordersNavLink");
  const pmLoginBtn = $("#pmLoginBtn");
  const pmLogoutBtn = $("#pmLogoutBtn");
  const pmAdminBtn = $("#pmAdminBtn");

  if (loggedIn) {
    userMenu?.classList.add("show");
    if (loginBtn) loginBtn.style.display = "none";
    if (ordersNavLink) ordersNavLink.style.display = "flex";
    if (pmLoginBtn) pmLoginBtn.style.display = "none";
    if (pmLogoutBtn) pmLogoutBtn.style.display = "flex";
    if (pmAdminBtn) pmAdminBtn.style.display = state.isAdmin ? "flex" : "none";
  } else {
    userMenu?.classList.remove("show");
    if (loginBtn) loginBtn.style.display = "flex";
    if (ordersNavLink) ordersNavLink.style.display = "none";
    if (pmLoginBtn) pmLoginBtn.style.display = "flex";
    if (pmLogoutBtn) pmLogoutBtn.style.display = "none";
    if (pmAdminBtn) pmAdminBtn.style.display = "none";

    const pmName = $("#pmName");
    const pmEmail = $("#pmEmail");
    const pmRole = $("#pmRoleBadge");
    const pmAvatar = $("#pmAvatar");
    if (pmName) pmName.textContent = "Guest User";
    if (pmEmail) pmEmail.textContent = "লগইন করুন অথবা সাইনআপ করুন";
    if (pmRole) pmRole.textContent = "GUEST";
    if (pmAvatar) pmAvatar.src = "https://ui-avatars.com/api/?name=G&background=6366f1&color=fff&size=120";
  }
}

/* ═══════════════════════════════════════════════════════════════
   20. NOTIFICATIONS UI
   ═══════════════════════════════════════════════════════════════ */
function renderNotifications(list) {
  const el = $("#notifList");
  if (!el) return;

  let filtered = list;
  if (state.notifFilter === "unread") filtered = list.filter((n) => !n.read);
  else if (state.notifFilter === "order") filtered = list.filter((n) =>
    (n.title || "").toLowerCase().includes("order") || (n.title || "").includes("অর্ডার")
  );

  const unreadCount = list.filter((n) => !n.read).length;
  const uc = $("#unreadCount");
  if (uc) uc.textContent = unreadCount;

  if (!filtered.length) {
    el.innerHTML = `
      <div class="empty-state">
        <i class="ph-fill ph-bell-slash"></i>
        <h3>কোনো নোটিফিকেশন নেই</h3>
        <p>সকল আপডেট এখানে দেখতে পাবেন</p>
      </div>`;
    return;
  }

  el.innerHTML = filtered.map((n) => {
    let iconClass = "ph-fill ph-bell-ringing";
    const titleLower = (n.title || "").toLowerCase();
    if (titleLower.includes("order") || (n.title || "").includes("অর্ডার")) iconClass = "ph-fill ph-package";
    else if (titleLower.includes("sale") || (n.title || "").includes("সেল")) iconClass = "ph-fill ph-tag";
    else if (titleLower.includes("user") || (n.title || "").includes("ইউজার")) iconClass = "ph-fill ph-user";

    return `
      <div class="notif-item ${n.read ? "" : "unread"}">
        <div class="notif-icon"><i class="${iconClass}"></i></div>
        <div>
          <h5>${esc(n.title || "")}</h5>
          <p>${esc(n.body || "")}</p>
          <small><i class="ph-bold ph-clock"></i> ${fmtDate(n.createdAt)}</small>
        </div>
      </div>
    `;
  }).join("");
}

/* ═══════════════════════════════════════════════════════════════
   21. COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════ */
const cmdPalette = {
  commands: [
    { icon: "ph-bold ph-house", label: "Go to Home", action: () => router.go("home"), group: "Navigation" },
    { icon: "ph-bold ph-shopping-bag", label: "Browse Products", action: () => router.go("products"), group: "Navigation" },
    { icon: "ph-bold ph-receipt", label: "My Orders", action: () => router.go("orders"), group: "Navigation" },
    { icon: "ph-bold ph-heart", label: "Wishlist", action: () => router.go("wishlist"), group: "Navigation" },
    { icon: "ph-bold ph-user", label: "My Profile", action: () => router.go("profile"), group: "Navigation" },
    { icon: "ph-bold ph-gear", label: "Settings", action: () => router.go("settings"), group: "Navigation" },
    { icon: "ph-bold ph-moon", label: "Toggle Dark Mode", action: () => toggleTheme(), group: "Actions" },
    { icon: "ph-bold ph-globe", label: "Switch Language", action: () => toggleLang(), group: "Actions" },
    {
      icon: "ph-bold ph-shopping-cart-simple",
      label: "Open Cart",
      action: () => { cart.renderDrawer(); $("#cartDrawer")?.classList.add("active"); },
      group: "Actions"
    }
  ],
  adminCommands: [
    {
      icon: "ph-bold ph-chart-line-up",
      label: "Admin Overview",
      action: () => { router.go("admin"); adminPage.go("overview"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-package",
      label: "Manage Products",
      action: () => { router.go("admin"); adminPage.go("products"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-receipt",
      label: "Manage Orders",
      action: () => { router.go("admin"); adminPage.go("orders"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-users-three",
      label: "Manage Users",
      action: () => { router.go("admin"); adminPage.go("users"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-ticket",
      label: "Manage Coupons",
      action: () => { router.go("admin"); adminPage.go("coupons"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-megaphone",
      label: "Push Notifications",
      action: () => { router.go("admin"); adminPage.go("notifications"); },
      group: "Admin"
    },
    {
      icon: "ph-bold ph-sliders-horizontal",
      label: "Site Settings",
      action: () => { router.go("admin"); adminPage.go("settings"); },
      group: "Admin"
    }
  ],
  open() {
    const o = $("#cmdOverlay");
    if (!o) return;
    o.classList.add("active");
    setTimeout(() => $("#cmdInput")?.focus(), 100);
    this.render("");
  },
  close() {
    $("#cmdOverlay")?.classList.remove("active");
    const i = $("#cmdInput");
    if (i) i.value = "";
  },
  render(filter) {
    const all = state.isAdmin ? [...this.commands, ...this.adminCommands] : this.commands;
    const f = filter.toLowerCase().trim();
    const list = f ? all.filter((c) => c.label.toLowerCase().includes(f)) : all;

    const groups = {};
    list.forEach((c) => { (groups[c.group] = groups[c.group] || []).push(c); });

    const results = $("#cmdResults");
    if (!results) return;

    if (!list.length) {
      results.innerHTML = `<div class="empty-state" style="padding:30px;"><p>কোনো কমান্ড পাওয়া যায়নি</p></div>`;
      return;
    }

    results.innerHTML = Object.entries(groups).map(([g, cmds]) => `
      <div class="cmd-group-title">${g}</div>
      ${cmds.map((c) => `
        <div class="cmd-item" onclick="cmdPalette.run('${c.label.replace(/'/g, "\\'")}')">
          <i class="${c.icon}"></i>
          <span>${c.label}</span>
        </div>
      `).join("")}
    `).join("");
  },
  run(label) {
    const all = state.isAdmin ? [...this.commands, ...this.adminCommands] : this.commands;
    const c = all.find((x) => x.label === label);
    if (c) { c.action(); this.close(); }
  }
};
window.cmdPalette = cmdPalette;

/* ═══════════════════════════════════════════════════════════════
   22. UI HELPERS
   ═══════════════════════════════════════════════════════════════ */
function closePowerMenu() {
  $("#powerMenu")?.classList.remove("active");
  $("#backdrop")?.classList.remove("active");
  document.body.style.overflow = "";
}
window.closePowerMenu = closePowerMenu;

function openPowerMenu() {
  $("#powerMenu")?.classList.add("active");
  $("#backdrop")?.classList.add("active");
  document.body.style.overflow = "hidden";
}
window.openPowerMenu = openPowerMenu;

function closeCart() {
  $("#cartDrawer")?.classList.remove("active");
}
window.closeCart = closeCart;

/* ═══════════════════════════════════════════════════════════════
   23. GLOBAL CLICK LISTENERS (RIPPLE EFFECT)
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  btn.style.setProperty("--x", x + "%");
  btn.style.setProperty("--y", y + "%");
});

/* ═══════════════════════════════════════════════════════════════
   24. EVENT BINDINGS (DOMContentLoaded)
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  /* ─── Initial setup ─── */
  applyTheme();
  applyLang();
  cart.updateBadge();
  wishlist.updateBadge();

  /* ─── Splash progress ─── */
  const splashBar = $("#splashBar");
  const splashStatus = $("#splashStatus");
  const splashSteps = [
    "ইনিশিয়ালাইজ হচ্ছে...",
    "Firebase এ কানেক্ট হচ্ছে...",
    "পণ্য লোড হচ্ছে...",
    "প্রায় প্রস্তুত..."
  ];
  let splashStep = 0;
  const splashInterval = setInterval(() => {
    splashStep++;
    if (splashBar) splashBar.style.width = Math.min(100, splashStep * 25) + "%";
    if (splashStatus) splashStatus.textContent = splashSteps[Math.min(splashStep - 1, splashSteps.length - 1)];
  }, 250);

  const hideSplash = () => {
    clearInterval(splashInterval);
    if (splashBar) splashBar.style.width = "100%";
    if (splashStatus) splashStatus.textContent = "প্রস্তুত!";
    setTimeout(() => {
      const sp = $("#splash");
      if (sp) sp.classList.add("hidden");
    }, 300);
  };

  setTimeout(hideSplash, 2500);

  /* ─── Theme & Lang toggles ─── */
  $("#themeToggle")?.addEventListener("click", toggleTheme);
  $("#langToggle")?.addEventListener("click", toggleLang);

  /* ─── Command palette ─── */
  $("#cmdBtn")?.addEventListener("click", () => cmdPalette.open());
  $("#cmdInput")?.addEventListener("input", (e) => cmdPalette.render(e.target.value));
  $("#cmdOverlay")?.addEventListener("click", (e) => {
    if (e.target === $("#cmdOverlay")) cmdPalette.close();
  });

  /* ─── Power Menu ─── */
  $("#menuToggle")?.addEventListener("click", openPowerMenu);
  $("#pmClose")?.addEventListener("click", closePowerMenu);
  $("#backdrop")?.addEventListener("click", closePowerMenu);

  /* Power menu theme segment */
  $$("#pmThemeSeg button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.themeMode = btn.dataset.theme;
      localStorage.setItem("themeMode", state.themeMode);
      applyTheme();
      toast("থিম পরিবর্তন হয়েছে", "success");
    });
  });

  /* Power menu language segment */
  $$("#pmLangSeg button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.lang === btn.dataset.lang) return;
      state.lang = btn.dataset.lang;
      localStorage.setItem("lang", state.lang);
      applyLang();
      if (state.isAdmin && $("#adminLayout")?.style.display !== "none") adminPage.render();
      else router.render();
    });
  });

  /* Power menu notif switch */
  $("#pmNotifSwitch")?.addEventListener("change", (e) => {
    toast(e.target.checked ? "নোটিফিকেশন চালু" : "নোটিফিকেশন বন্ধ", "info");
  });

  /* ─── User menu ─── */
  $("#userMenuBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("#userDropdown")?.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!$("#userMenu")?.contains(e.target)) $("#userDropdown")?.classList.remove("active");
    if (!$("#navSearchWrap")?.contains(e.target)) search.clear();
  });

  $("#logoutBtn")?.addEventListener("click", authUI.doLogout);

  /* ─── Cart & Notifications ─── */
  $("#cartBtn")?.addEventListener("click", () => {
    cart.renderDrawer();
    $("#cartDrawer")?.classList.add("active");
  });
  $("#closeCart")?.addEventListener("click", closeCart);

  $("#notifBtn")?.addEventListener("click", async () => {
    $("#notifPanel")?.classList.add("active");
    if (state.user && state.notifications.length) {
      await api.markAllRead(state.user.uid, state.notifications);
    }
  });
  $("#closeNotif")?.addEventListener("click", () => $("#notifPanel")?.classList.remove("active"));

  /* Notification tabs */
  $$("#notifTabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#notifTabs button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.notifFilter = btn.dataset.filter;
      renderNotifications(state.notifications);
    });
  });

  /* ─── Search ─── */
  const si = $("#globalSearchInput");
  if (si) {
    si.addEventListener("input", debounce((e) => search.suggest(e.target.value.trim()), 200));
    si.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        state.filters.query = e.target.value.trim().toLowerCase();
        search.clear();
        if (router.current !== "products") router.go("products");
        else Pages.applyFilters();
      }
    });
  }
  search.initVoice();
  search.initImage();

  /* ─── Back to top ─── */
  const btt = $("#backToTop");
  window.addEventListener("scroll", () => {
    btt?.classList.toggle("show", window.scrollY > 400);
    $("#publicNavbar")?.classList.toggle("scrolled", window.scrollY > 10);
  });
  btt?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ─── Escape key ─── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.close();
      closeCart();
      closePowerMenu();
      $("#notifPanel")?.classList.remove("active");
      cmdPalette.close();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdPalette.open();
    }
  });

  /* ─── Admin sidebar toggle ─── */
  $("#adminSidebarToggle")?.addEventListener("click", () => {
    $("#adminSidebar")?.classList.toggle("open");
  });

  $$(".admin-nav a").forEach((a) => {
    a.addEventListener("click", () => adminPage.go(a.dataset.admin));
  });

  /* ─── FAB & Chat ─── */
  $("#fab")?.addEventListener("click", () => {
    if (state.isAdmin) {
      router.go("admin");
      adminPage.go("products");
    } else {
      router.go("products");
    }
  });

  $("#chatBtn")?.addEventListener("click", () => {
    toast("লাইভ চ্যাট শীঘ্রই আসছে!", "info");
  });

  /* ─── Auto theme detection ─── */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.themeMode === "auto") applyTheme();
  });

  /* ─── Site settings listener ─── */
  api.listenSiteSettings((s) => {
    if (s.siteName) document.title = s.siteName + " — Premium E-Commerce";
  });

  /* ─── Categories preload ─── */
  api.listenCategories(() => {});

  /* ═══ AUTH STATE LISTENER ═══ */
  onAuthStateChanged(auth, async (user) => {
    try {
      state.user = user;
      if (user) {
        state.isAdmin = await api.isAdmin(user.uid);
        state.userProfile = await api.getProfile(user.uid);
        state.authReady = true;

        authUI.updateAvatar();
        updateUserUI();

        /* Auto-redirect if on auth page */
        if (router.current === "auth") {
          if (state.isAdmin) router.showAdmin();
          else router.showAdminOrUserDash();
        }
        /* If admin logged in and on home */
        else if (state.isAdmin && router.current === "home") {
          setTimeout(() => router.showAdmin(), 150);
        }

        /* Listen notifications */
        api.listenNotifications(user.uid, (list) => {
          renderNotifications(list);
          const unread = list.filter((n) => !n.read).length;
          const badge = $("#notifBadge");
          if (badge) {
            badge.textContent = unread;
            badge.classList.toggle("show", unread > 0);
          }
        });
      } else {
        state.isAdmin = false;
        state.userProfile = null;
        state.authReady = true;
        state.notifications = [];

        router.hideAdmin();
        updateUserUI();
        renderNotifications([]);

        const badge = $("#notifBadge");
        if (badge) badge.classList.remove("show");
      }
    } catch (err) {
      console.error("Auth listener error:", err);
      state.authReady = true;
    }
  }, (error) => {
    console.error("Auth error:", error);
    state.authReady = true;
    const sp = document.getElementById("splash");
    if (sp) sp.classList.add("hidden");
  });

  /* ─── Products global load ─── */
  api.listenProducts(() => {
    if (router.current === "products") Pages.applyFilters();
  });

  /* ═══ INITIAL ROUTE ═══ */
  const initialBoot = () => {
    if (state.user && state.authReady) {
      if (state.isAdmin) router.showAdmin();
      else {
        router.current = "dashboard";
        router.render();
      }
    } else {
      router.go("auth");
    }
  };

  setTimeout(initialBoot, 900);
});

/* ═══════════════════════════════════════════════════════════════
   25. GLOBAL SAFETY NET
   ═══════════════════════════════════════════════════════════════ */
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  const sp = document.getElementById("splash");
  if (sp) sp.classList.add("hidden");
});

setTimeout(() => {
  const sp = document.getElementById("splash");
  if (sp && !sp.classList.contains("hidden")) {
    sp.classList.add("hidden");
    const appEl = document.getElementById("app");
    if (appEl && !appEl.innerHTML.trim()) {
      if (window.router) window.router.go("auth");
    }
  }
}, 5000);

/* ═══════════════════════════════════════════════════════════════
   26. EXPOSE TO WINDOW
   ═══════════════════════════════════════════════════════════════ */
window.cart = cart;
window.wishlist = wishlist;
window.search = search;
window.api = api;
window.state = state;
window.toast = toast;
window.openPowerMenu = openPowerMenu;
window.closePowerMenu = closePowerMenu;

/* ═══════════════════════════════════════════════════════════════
   27. SPIN KEYFRAME (inject if not in CSS)
   ═══════════════════════════════════════════════════════════════ */
if (!document.getElementById("spin-anim")) {
  const style = document.createElement("style");
  style.id = "spin-anim";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════════
   🎉 LOG
   ═══════════════════════════════════════════════════════════════ */
console.log(
  "%c🛒 EcoShop Pro MAX",
  "font-size:28px;font-weight:900;background:linear-gradient(90deg,#6366f1,#ec4899);-webkit-background-clip:text;color:transparent;"
);
console.log(
  "%c✨ Ultimate Enterprise Edition | Phosphor Icons | Premium UI | Firebase + ImgBB",
  "color:#10b981;font-weight:700;font-size:12px;"
);
