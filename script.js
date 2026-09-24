/* ═══════════════════════════════════════════════════════════════
   ECOSHOP PRO — PROFESSIONAL ENTERPRISE APP
   ═══════════════════════════════════════════════════════════════ */

/* ─── FIREBASE SDK ─── */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, update, push, remove, onValue, query, orderByChild, limitToLast, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

/* ═══════════════════════════════════════════════════════════════
   I18N
   ═══════════════════════════════════════════════════════════════ */
const I18N = {
  bn: {
    home:"হোম", products:"পণ্য", orders:"অর্ডার", cart:"কার্ট",
    profile:"প্রোফাইল", dashboard:"ড্যাশবোর্ড", settings:"সেটিংস",
    wishlist:"উইশলিস্ট", login:"লগইন", signup:"সাইনআপ", logout:"লগআউট",
    email:"ইমেইল", password:"পাসওয়ার্ড", name:"পূর্ণ নাম", phone:"ফোন",
    address:"ঠিকানা", search:"পণ্য খুঁজুন...",
    add_to_cart:"কার্টে যোগ করুন", buy_now:"এখনই কিনুন",
    price:"দাম", total:"মোট", subtotal:"সাবটোটাল",
    checkout:"চেকআউট করুন", place_order:"অর্ডার কনফার্ম করুন",
    notifications:"নোটিফিকেশন", no_notifications:"কোনো নোটিফিকেশন নেই",
    welcome:"স্বাগতম", my_orders:"আমার অর্ডার",
    manage_products:"পণ্য ম্যানেজমেন্ট", manage_orders:"অর্ডার ম্যানেজমেন্ট",
    add_product:"নতুন পণ্য", edit_product:"পণ্য এডিট",
    product_name:"পণ্যের নাম", product_desc:"পণ্যের বিবরণ",
    product_image:"পণ্যের ছবি", product_category:"ক্যাটাগরি",
    save:"সংরক্ষণ", cancel:"বাতিল", delete:"মুছুন", edit:"এডিট",
    status:"স্ট্যাটাস", pending:"অপেক্ষমাণ", confirmed:"কনফার্মড",
    shipped:"শিপড", delivered:"ডেলিভারড", cancelled:"বাতিল",
    quick_links:"দ্রুত লিংক", support:"সাপোর্ট", contact:"যোগাযোগ",
    rights:"সকল অধিকার সংরক্ষিত",
    no_products:"কোনো পণ্য নেই", loading:"লোড হচ্ছে...",
    cart_empty:"আপনার কার্ট খালি", wishlist_empty:"উইশলিস্ট খালি",
    order_success:"অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
    login_success:"লগইন সফল", signup_success:"অ্যাকাউন্ট তৈরি হয়েছে",
    invalid_credentials:"ভুল ইমেইল বা পাসওয়ার্ড",
    logged_out:"লগআউট সফল", error_occurred:"সমস্যা হয়েছে",
    profile_updated:"প্রোফাইল আপডেট হয়েছে", settings_saved:"সেটিংস সেভ হয়েছে",
    admin_dashboard:"এডমিন ড্যাশবোর্ড", user_dashboard:"ইউজার ড্যাশবোর্ড",
    total_products:"মোট পণ্য", total_orders:"মোট অর্ডার",
    total_users:"মোট ইউজার", revenue:"মোট আয়",
    recent_orders:"সাম্প্রতিক অর্ডার", customer:"গ্রাহক",
    voice_not_supported:"এই ব্রাউজারে ভয়েস সার্চ সমর্থিত নয়",
    login_required:"অনুগ্রহ করে লগইন করুন",
    category:"ক্যাটাগরি", all:"সব", sort:"সাজান",
    sort_new:"নতুন আগে", sort_price_low:"দাম: কম থেকে বেশি",
    sort_price_high:"দাম: বেশি থেকে কম", sort_popular:"জনপ্রিয়",
    min_price:"সর্বনিম্ন দাম", max_price:"সর্বোচ্চ দাম",
    hero_title:"আপনার প্রয়োজনীয় সবকিছু এক জায়গায়",
    hero_sub:"প্রফেশনাল, নিরাপদ এবং দ্রুত ই-কমার্স প্ল্যাটফর্ম। সেরা দামে সেরা পণ্য পান।",
    shop_now:"কেনাকাটা শুরু করুন", explore:"এক্সপ্লোর করুন",
    products_count:"পণ্য", happy_customers:"সন্তুষ্ট গ্রাহক",
    orders_delivered:"ডেলিভারড অর্ডার", rating:"রেটিং",
    featured:"ফিচার্ড পণ্য", new_arrivals:"নতুন পণ্য",
    quick_view:"দ্রুত দেখুন", description:"বিবরণ",
    stock:"স্টক", out_of_stock:"স্টক নেই", in_stock:"স্টকে আছে",
    product_added:"পণ্য সফলভাবে যোগ হয়েছে",
    product_updated:"পণ্য আপডেট হয়েছে",
    product_deleted:"পণ্য মুছে ফেলা হয়েছে",
    confirm_delete:"আপনি কি নিশ্চিত মুছতে চান?",
    password_short:"পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"
  },
  en: {
    home:"Home", products:"Products", orders:"Orders", cart:"Cart",
    profile:"Profile", dashboard:"Dashboard", settings:"Settings",
    wishlist:"Wishlist", login:"Login", signup:"Sign Up", logout:"Logout",
    email:"Email", password:"Password", name:"Full Name", phone:"Phone",
    address:"Address", search:"Search products...",
    add_to_cart:"Add to Cart", buy_now:"Buy Now",
    price:"Price", total:"Total", subtotal:"Subtotal",
    checkout:"Checkout", place_order:"Place Order",
    notifications:"Notifications", no_notifications:"No notifications",
    welcome:"Welcome", my_orders:"My Orders",
    manage_products:"Product Management", manage_orders:"Order Management",
    add_product:"Add Product", edit_product:"Edit Product",
    product_name:"Product Name", product_desc:"Description",
    product_image:"Image", product_category:"Category",
    save:"Save", cancel:"Cancel", delete:"Delete", edit:"Edit",
    status:"Status", pending:"Pending", confirmed:"Confirmed",
    shipped:"Shipped", delivered:"Delivered", cancelled:"Cancelled",
    quick_links:"Quick Links", support:"Support", contact:"Contact",
    rights:"All rights reserved",
    no_products:"No products available", loading:"Loading...",
    cart_empty:"Your cart is empty", wishlist_empty:"Wishlist is empty",
    order_success:"Order placed successfully!",
    login_success:"Login successful", signup_success:"Account created",
    invalid_credentials:"Invalid email or password",
    logged_out:"Logged out successfully", error_occurred:"An error occurred",
    profile_updated:"Profile updated", settings_saved:"Settings saved",
    admin_dashboard:"Admin Dashboard", user_dashboard:"User Dashboard",
    total_products:"Total Products", total_orders:"Total Orders",
    total_users:"Total Users", revenue:"Total Revenue",
    recent_orders:"Recent Orders", customer:"Customer",
    voice_not_supported:"Voice search not supported in this browser",
    login_required:"Please log in first",
    category:"Category", all:"All", sort:"Sort",
    sort_new:"Newest first", sort_price_low:"Price: Low to High",
    sort_price_high:"Price: High to Low", sort_popular:"Popular",
    min_price:"Min Price", max_price:"Max Price",
    hero_title:"Everything you need in one place",
    hero_sub:"Professional, secure, and fast e-commerce platform. Get the best products at the best price.",
    shop_now:"Start Shopping", explore:"Explore Now",
    products_count:"Products", happy_customers:"Happy Customers",
    orders_delivered:"Orders Delivered", rating:"Rating",
    featured:"Featured Products", new_arrivals:"New Arrivals",
    quick_view:"Quick View", description:"Description",
    stock:"Stock", out_of_stock:"Out of Stock", in_stock:"In Stock",
    product_added:"Product added successfully",
    product_updated:"Product updated",
    product_deleted:"Product deleted",
    confirm_delete:"Are you sure you want to delete?",
    password_short:"Password must be at least 6 characters"
  }
};

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const state = {
  lang: localStorage.getItem("lang") || "bn",
  theme: localStorage.getItem("theme") || "light",
  user: null,
  userProfile: null,
  isAdmin: false,
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
  filters: { category: "all", sort: "new", minPrice: "", maxPrice: "", query: "" },
  adminPage: "overview",
  charts: {}
};

const DEFAULT_CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys", "Grocery"];

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = k => I18N[state.lang][k] || k;
const esc = s => s == null ? "" : String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
const fmtPrice = n => "৳" + (Number(n) || 0).toLocaleString(state.lang === "bn" ? "bn-BD" : "en-US");
const fmtDate = ts => ts ? new Date(ts).toLocaleString(state.lang === "bn" ? "bn-BD" : "en-US", { year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit" }) : "";
const fmtDateShort = ts => ts ? new Date(ts).toLocaleDateString(state.lang === "bn" ? "bn-BD" : "en-US", { year:"numeric",month:"short",day:"numeric" }) : "";
const debounce = (fn, ms = 300) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function toast(msg, type = "info", dur = 3200) {
  const icons = { success:"fa-circle-check", error:"fa-circle-exclamation", info:"fa-circle-info", warning:"fa-triangle-exclamation" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type]} toast-icon"></i><span>${esc(msg)}</span>`;
  $("#toastContainer").appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 400); }, dur);
}

function progress(on) {
  const bar = $("#topProgress");
  if (on) { bar.style.opacity = "1"; bar.style.width = "30%"; setTimeout(() => bar.style.width = "65%", 150); }
  else { bar.style.width = "100%"; setTimeout(() => { bar.style.opacity = "0"; bar.style.width = "0"; }, 400); }
}

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

function downloadBlob(content, filename, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function confirmDialog(message, onConfirm) {
  modal.open(`
    <div style="padding:32px;text-align:center;">
      <div style="width:70px;height:70px;margin:0 auto 16px;border-radius:50%;background:rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--danger);">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 style="font-size:20px;font-weight:800;margin-bottom:8px;">${esc(message)}</h3>
      <div style="display:flex;gap:10px;margin-top:22px;">
        <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">${t("cancel")}</button>
        <button class="btn btn-danger" id="confirmYes" style="flex:1;"><i class="fa-solid fa-check"></i> ${t("delete")}</button>
      </div>
    </div>
  `, { size: "sm" });
  $("#confirmYes").onclick = () => { modal.close(); onConfirm(); };
}

/* ═══════════════════════════════════════════════════════════════
   THEME & LANG
   ═══════════════════════════════════════════════════════════════ */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const i = $("#themeToggle i");
  if (i) i.className = state.theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}
function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.theme);
  applyTheme();
  toast(state.lang === "bn" ? "থিম পরিবর্তিত" : "Theme changed", "success");
}
function applyLang() {
  document.documentElement.lang = state.lang;
  document.body.lang = state.lang;
  $("#currentLangLabel").textContent = state.lang === "bn" ? "বাং" : "EN";
  $$("[data-i18n]").forEach(el => el.textContent = t(el.getAttribute("data-i18n")));
  const inp = $("#globalSearchInput"); if (inp) inp.placeholder = t("search");
}
function toggleLang() {
  state.lang = state.lang === "bn" ? "en" : "bn";
  localStorage.setItem("lang", state.lang);
  applyLang();
  if (state.isAdmin && $("#adminLayout").style.display !== "none") adminPage.render();
  else router.render();
}

/* ═══════════════════════════════════════════════════════════════
   CART & WISHLIST
   ═══════════════════════════════════════════════════════════════ */
const cart = {
  add(p, qty = 1) {
    const item = state.cart.find(c => c.id === p.id);
    if (item) item.qty += qty;
    else state.cart.push({ id:p.id, name:p.name, nameEn:p.nameEn, price:p.price, image:p.image, qty });
    this.save();
    toast(t("add_to_cart") + " ✓", "success");
  },
  remove(id) { state.cart = state.cart.filter(c => c.id !== id); this.save(); },
  updateQty(id, qty) { const i = state.cart.find(c => c.id === id); if (i) i.qty = Math.max(1, qty); this.save(); },
  clear() { state.cart = []; this.save(); },
  total() { return state.cart.reduce((s, c) => s + c.price * c.qty, 0); },
  count() { return state.cart.reduce((s, c) => s + c.qty, 0); },
  save() { localStorage.setItem("cart", JSON.stringify(state.cart)); this.updateBadge(); this.renderDrawer(); },
  updateBadge() {
    const c = this.count();
    const b = $("#cartBadge"), d = $("#cartDrawerCount");
    if (b) { b.textContent = c; b.classList.toggle("show", c > 0); }
    if (d) d.textContent = c;
  },
  renderDrawer() {
    const body = $("#cartDrawerBody"), foot = $("#cartDrawerFoot");
    if (!body) return;
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty-state">
        <i class="fa-solid fa-cart-shopping"></i>
        <h3>${t("cart_empty")}</h3>
        <button class="btn btn-primary" onclick="closeCart();router.go('products')">
          <i class="fa-solid fa-bag-shopping"></i> ${t("shop_now")}
        </button>
      </div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img src="${esc(item.image || 'https://via.placeholder.com/70')}" />
        <div class="cart-item-info">
          <h4>${esc(state.lang === "bn" ? item.name : (item.nameEn || item.name))}</h4>
          <div class="price-tag">${fmtPrice(item.price)}</div>
          <div class="qty-control">
            <button onclick="cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="cart.remove('${item.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join("");
    const sub = this.total();
    const ship = sub > 5000 ? 0 : 80;
    const tax = sub * 0.05;
    const grand = sub + ship + tax;
    foot.innerHTML = `
      <div class="total-line"><span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span></div>
      <div class="total-line"><span>Shipping</span><span>${ship === 0 ? "Free" : fmtPrice(ship)}</span></div>
      <div class="total-line"><span>VAT (5%)</span><span>${fmtPrice(tax)}</span></div>
      <div class="total-line grand"><span>${t("total")}</span><span>${fmtPrice(grand)}</span></div>
      <button class="btn btn-primary btn-block btn-lg" onclick="checkout.open()">
        <i class="fa-solid fa-credit-card"></i> ${t("checkout")}
      </button>`;
  }
};

const wishlist = {
  toggle(p) {
    const i = state.wishlist.findIndex(w => w.id === p.id);
    if (i > -1) { state.wishlist.splice(i, 1); toast(state.lang === "bn" ? "সরানো হয়েছে" : "Removed", "info"); }
    else { state.wishlist.push({ id:p.id, name:p.name, nameEn:p.nameEn, price:p.price, image:p.image }); toast("❤️", "success"); }
    this.save();
  },
  has(id) { return state.wishlist.some(w => w.id === id); },
  save() {
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    const b = $("#wishlistBadge");
    if (b) { b.textContent = state.wishlist.length; b.classList.toggle("show", state.wishlist.length > 0); }
  }
};

/* ═══════════════════════════════════════════════════════════════
   FIREBASE API
   ═══════════════════════════════════════════════════════════════ */
const api = {
  /* ─── AUTH ─── */
  async signup({ name, email, password, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await set(ref(db, `users/${cred.user.uid}`), {
      uid: cred.user.uid, name, email, phone: phone || "",
      address: "", role: "user", banned: false,
      createdAt: Date.now()
    });
    return cred.user;
  },
  login(email, password) { return signInWithEmailAndPassword(auth, email, password); },
  logout() { return signOut(auth); },
  async isAdmin(uid) { const s = await get(ref(db, `admins/${uid}`)); return s.exists() && s.val() === true; },
  async getProfile(uid) { const s = await get(ref(db, `users/${uid}`)); return s.exists() ? s.val() : null; },
  async updateProfile(uid, data) { await update(ref(db, `users/${uid}`), data); },

  /* ─── PRODUCTS ─── */
  listenProducts(cb) {
    return onValue(ref(db, "products"), snap => {
      const arr = [];
      snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.products = arr;
      cb(arr);
    });
  },
  async addProduct(data, imageFile) {
    const pRef = push(ref(db, "products"));
    let imageUrl = "";
    if (imageFile) {
      const s = sRef(storage, `products/${pRef.key}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(s, imageFile);
      imageUrl = await getDownloadURL(s);
    }
    const payload = {
      name: data.name, nameEn: data.nameEn || data.name,
      price: Number(data.price), oldPrice: Number(data.oldPrice) || 0,
      category: data.category || "Other",
      stock: Number(data.stock) || 0,
      description: data.description || "", descriptionEn: data.descriptionEn || data.description || "",
      rating: 4.5, reviews: 0,
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
      const s = sRef(storage, `products/${id}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(s, imageFile);
      imageUrl = await getDownloadURL(s);
    }
    const payload = { ...data }; delete payload.image;
    if (imageUrl !== undefined) payload.image = imageUrl;
    await update(ref(db, `products/${id}`), payload);
    await api.logActivity("product.update", `Updated: ${data.name}`);
  },
  async deleteProduct(id) {
    const p = state.products.find(x => x.id === id);
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
    await this.notify(order.userId, "✅ Order Placed", `#${orderId.slice(-6)} confirmed`);
    await api.logActivity("order.create", `Order #${orderId.slice(-6)} by ${order.userName}`);
    return orderId;
  },
  listenUserOrders(uid, cb) {
    return onValue(ref(db, `userOrders/${uid}`), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt); cb(arr);
    });
  },
  listenAllOrders(cb) {
    return onValue(ref(db, "orders"), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.orders = arr; cb(arr);
    });
  },
  async updateOrderStatus(orderId, status, userId) {
    await update(ref(db, `orders/${orderId}`), { status });
    await update(ref(db, `userOrders/${userId}/${orderId}`), { status });
    const msgs = {
      confirmed:"Your order is confirmed", shipped:"Your order has shipped",
      delivered:"Order delivered", cancelled:"Order cancelled"
    };
    await this.notify(userId, "📦 Order Update", msgs[status] || "Status updated");
    await api.logActivity("order.status", `#${orderId.slice(-6)} → ${status}`);
  },

  /* ─── USERS ─── */
  listenUsers(cb) {
    return onValue(ref(db, "users"), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.users = arr; cb(arr);
    });
  },
  async toggleBan(uid, banned) {
    await update(ref(db, `users/${uid}`), { banned });
    await api.logActivity("user.ban", `${banned ? "Banned" : "Unbanned"}: ${uid}`);
  },
  async makeAdmin(uid, isAdmin) {
    if (isAdmin) await set(ref(db, `admins/${uid}`), true);
    else await remove(ref(db, `admins/${uid}`));
    await api.logActivity("user.role", `${isAdmin ? "Promoted" : "Demoted"}: ${uid}`);
  },

  /* ─── CATEGORIES ─── */
  listenCategories(cb) {
    return onValue(ref(db, "categories"), snap => {
      let arr = [];
      snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      if (!arr.length) arr = DEFAULT_CATEGORIES.map((n, i) => ({ id: "default_" + i, name: n, slug: n.toLowerCase(), createdAt: Date.now() }));
      state.categories = arr; cb(arr);
    });
  },
  async addCategory(name) {
    await push(ref(db, "categories"), { name, slug: name.toLowerCase().replace(/\s+/g, "-"), createdAt: Date.now() });
    await api.logActivity("category.create", name);
  },
  async deleteCategory(id) {
    await remove(ref(db, `categories/${id}`));
  },

  /* ─── COUPONS ─── */
  listenCoupons(cb) {
    return onValue(ref(db, "coupons"), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      state.coupons = arr; cb(arr);
    });
  },
  async addCoupon(c) {
    await push(ref(db, "coupons"), { ...c, createdAt: Date.now() });
    await api.logActivity("coupon.create", c.code);
  },
  async deleteCoupon(id) { await remove(ref(db, `coupons/${id}`)); },
  async validateCoupon(code) {
    const found = state.coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.active !== false);
    return found || null;
  },

  /* ─── REVIEWS ─── */
  listenReviews(cb) {
    return onValue(ref(db, "reviews"), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      state.reviews = arr; cb(arr);
    });
  },
  async addReview(r) {
    await push(ref(db, "reviews"), { ...r, status: "approved", createdAt: Date.now() });
  },
  async deleteReview(id) { await remove(ref(db, `reviews/${id}`)); },
  async approveReview(id) { await update(ref(db, `reviews/${id}`), { status: "approved" }); },

  /* ─── BANNERS ─── */
  listenBanners(cb) {
    return onValue(ref(db, "banners"), snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      state.banners = arr; cb(arr);
    });
  },
  async addBanner(b, imgFile) {
    const bRef = push(ref(db, "banners"));
    let imageUrl = "";
    if (imgFile) {
      const s = sRef(storage, `banners/${bRef.key}/${Date.now()}_${imgFile.name}`);
      await uploadBytes(s, imgFile);
      imageUrl = await getDownloadURL(s);
    }
    await set(bRef, { ...b, image: imageUrl, createdAt: Date.now() });
  },
  async deleteBanner(id) { await remove(ref(db, `banners/${id}`)); },

  /* ─── NOTIFICATIONS ─── */
  async notify(uid, title, body) {
    if (!uid) return;
    await push(ref(db, `notifications/${uid}`), { title, body, read: false, createdAt: Date.now() });
  },
  async broadcast(title, body) {
    for (const u of state.users) {
      await this.notify(u.id, title, body);
    }
    await api.logActivity("notify.broadcast", title);
  },
  listenNotifications(uid, cb) {
    const q = query(ref(db, `notifications/${uid}`), limitToLast(40));
    return onValue(q, snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.notifications = arr; cb(arr);
    });
  },
  async markAllRead(uid, notifs) {
    const updates = {};
    notifs.forEach(n => { if (!n.read) updates[`notifications/${uid}/${n.id}/read`] = true; });
    if (Object.keys(updates).length) await update(ref(db), updates);
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
    return onValue(q, snap => {
      const arr = []; snap.forEach(c => arr.push({ id: c.key, ...c.val() }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      state.activityLogs = arr; cb(arr);
    });
  },

  /* ─── SITE SETTINGS ─── */
  listenSiteSettings(cb) {
    return onValue(ref(db, "siteSettings"), snap => {
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
   ROUTER
   ═══════════════════════════════════════════════════════════════ */
const router = {
  current: "home",
  go(page) {
    // Admin routing
    if (page === "admin") {
      if (!state.isAdmin) { toast("Access denied", "error"); return; }
      this.showAdmin();
      return;
    }
    this.hideAdmin();
    this.current = page;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSideMenu();
    $$(".nav-menu a").forEach(a => a.classList.toggle("active", a.dataset.page === page));
  },
  showAdmin() {
    $("#adminLayout").style.display = "grid";
    $("#publicNavbar").style.display = "none";
    $("#app").style.display = "none";
    $("#publicFooter").style.display = "none";
    adminPage.render();
  },
  hideAdmin() {
    $("#adminLayout").style.display = "none";
    $("#publicNavbar").style.display = "";
    $("#app").style.display = "";
    $("#publicFooter").style.display = "";
  },
  render() {
    progress(true);
    const app = $("#app");
    app.innerHTML = "";
    const protected_ = ["dashboard", "profile", "orders", "wishlist", "settings"];
    if (protected_.includes(this.current) && !state.user) {
      toast(t("login_required"), "warning");
      this.go("auth");
      return;
    }
    const routes = {
      home: Pages.home, products: Pages.products, auth: Pages.auth,
      dashboard: Pages.dashboard, profile: Pages.profile, orders: Pages.orders,
      wishlist: Pages.wishlist, settings: Pages.settings
    };
    (routes[this.current] || Pages.home)(app);
    setTimeout(() => progress(false), 400);
  }
};
window.router = router;

/* ═══════════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════════ */
const modal = {
  open(html, { size = "" } = {}) {
    const root = $("#modalRoot");
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `<div class="modal-box ${size}">${html}</div>`;
    overlay.addEventListener("click", e => { if (e.target === overlay) modal.close(); });
    root.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("active"));
    document.body.style.overflow = "hidden";
  },
  close() {
    const o = $("#modalRoot .modal-overlay");
    if (!o) return;
    o.classList.remove("active");
    setTimeout(() => o.remove(), 300);
    document.body.style.overflow = "";
  }
};
window.modal = modal;

/* ═══════════════════════════════════════════════════════════════
   CHECKOUT
   ═══════════════════════════════════════════════════════════════ */
const checkout = {
  async open() {
    if (!state.user) { toast(t("login_required"), "warning"); closeCart(); router.go("auth"); return; }
    if (!state.cart.length) { toast(t("cart_empty"), "warning"); return; }
    const p = await api.getProfile(state.user.uid) || {};
    closeCart();

    const sub = cart.total();
    let ship = sub > 5000 ? 0 : 80;
    let tax = sub * 0.05;
    let discount = 0;
    let appliedCoupon = null;

    const recalc = () => {
      const grand = sub + ship + tax - discount;
      const g = $("#coGrand"); if (g) g.textContent = fmtPrice(grand);
      const d = $("#coDiscountRow"); if (d) d.style.display = discount ? "flex" : "none";
      const dv = $("#coDiscountVal"); if (dv) dv.textContent = "-" + fmtPrice(discount);
    };

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;">
          <i class="fa-solid fa-credit-card" style="color:var(--brand-1)"></i> ${t("checkout")}
        </h2>
        <p style="color:var(--text-2);font-size:14px;margin-bottom:22px;">${state.lang === "bn" ? "আপনার তথ্য নিশ্চিত করুন" : "Confirm your details"}</p>

        <div class="form-group"><label>${t("name")}</label>
          <input id="coName" value="${esc(p.name || state.user.displayName || "")}" /></div>
        <div class="form-row">
          <div class="form-group"><label>${t("phone")}</label>
            <input id="coPhone" value="${esc(p.phone || "")}" placeholder="01XXXXXXXXX" /></div>
          <div class="form-group"><label>Payment</label>
            <select id="coPay"><option value="cod">Cash on Delivery</option><option value="bkash">bKash</option><option value="card">Card</option></select></div>
        </div>
        <div class="form-group"><label>${t("address")}</label>
          <textarea id="coAddress">${esc(p.address || "")}</textarea></div>

        <div class="form-group">
          <label>Coupon Code</label>
          <div style="display:flex;gap:8px;">
            <input id="coCoupon" placeholder="SAVE10" style="flex:1;" />
            <button class="btn btn-outline" id="applyCoupon">Apply</button>
          </div>
          <small id="couponMsg"></small>
        </div>

        <div style="background:var(--bg-soft);padding:16px;border-radius:12px;margin:18px 0;">
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>Shipping</span><span>${ship === 0 ? "Free" : fmtPrice(ship)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--text-2);">
            <span>VAT</span><span>${fmtPrice(tax)}</span></div>
          <div id="coDiscountRow" style="display:none;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--success);font-weight:700;">
            <span>Discount</span><span id="coDiscountVal">-৳0</span></div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900;padding-top:10px;border-top:2px dashed var(--border-2);">
            <span>${t("total")}</span>
            <span id="coGrand" style="background:var(--brand-grad);-webkit-background-clip:text;background-clip:text;color:transparent;">${fmtPrice(sub + ship + tax)}</span>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="confirmOrder">
          <i class="fa-solid fa-check"></i> ${t("place_order")}
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
        msg.textContent = `Minimum purchase ৳${c.minPurchase}`;
        msg.style.color = "var(--warning)"; return;
      }
      appliedCoupon = c;
      discount = c.type === "percent" ? sub * (c.value / 100) : Number(c.value);
      msg.textContent = `✅ ${c.code} applied — ${c.type === "percent" ? c.value + "%" : "৳" + c.value} off`;
      msg.style.color = "var(--success)";
      recalc();
    };

    $("#confirmOrder").onclick = async () => {
      const name = $("#coName").value.trim();
      const phone = $("#coPhone").value.trim();
      const address = $("#coAddress").value.trim();
      if (!name || !phone || !address) { toast("Fill all fields", "error"); return; }
      const btn = $("#confirmOrder");
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
      try {
        await api.placeOrder({
          userId: state.user.uid, userName: name,
          items: state.cart.map(i => ({ id:i.id, name:i.name, nameEn:i.nameEn, price:i.price, qty:i.qty, image:i.image })),
          subtotal: sub, shipping: ship, tax, discount, total: sub + ship + tax - discount,
          coupon: appliedCoupon?.code || null,
          address, phone, payment: $("#coPay").value
        });
        cart.clear();
        modal.close();
        toast(t("order_success"), "success", 4000);
        setTimeout(() => router.go("dashboard"), 900);
      } catch (err) {
        toast(err.message, "error");
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t("place_order")}`;
      }
    };
  }
};
window.checkout = checkout;

/* ═══════════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════════ */
const search = {
  suggest(q) {
    const box = $("#searchSuggest");
    if (!q) { box.classList.remove("active"); return; }
    const lq = q.toLowerCase();
    const m = state.products.filter(p =>
      (p.name || "").toLowerCase().includes(lq) ||
      (p.nameEn || "").toLowerCase().includes(lq) ||
      (p.description || "").toLowerCase().includes(lq) ||
      (p.category || "").toLowerCase().includes(lq)
    ).slice(0, 6);
    if (!m.length) {
      box.innerHTML = `<div class="suggest-empty">🔍 No results</div>`;
    } else {
      box.innerHTML = m.map(p => `
        <div class="suggest-item" onclick="search.select('${p.id}')">
          <img src="${esc(p.image || 'https://via.placeholder.com/44')}" />
          <div class="suggest-item-info">
            <h5>${esc(state.lang === "bn" ? p.name : (p.nameEn || p.name))}</h5>
            <p>${fmtPrice(p.price)}</p>
          </div>
        </div>`).join("");
    }
    box.classList.add("active");
  },
  select(id) { $("#searchSuggest").classList.remove("active"); productDetail.openById(id); },
  clear() { $("#searchSuggest")?.classList.remove("active"); },
  initVoice() {
    const btn = $("#voiceSearchBtn");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { btn.onclick = () => toast(t("voice_not_supported"), "warning"); return; }
    const rec = new SR();
    rec.lang = state.lang === "bn" ? "bn-BD" : "en-US";
    btn.onclick = () => { btn.classList.add("listening"); rec.start(); toast("🎤 Listening...", "info", 1500); };
    rec.onresult = e => {
      const txt = e.results[0][0].transcript;
      $("#globalSearchInput").value = txt;
      search.suggest(txt);
      router.go("products");
      setTimeout(() => Pages.applyFilters(), 200);
    };
    rec.onend = () => btn.classList.remove("listening");
  },
  initImage() {
    const btn = $("#imageSearchBtn"), input = $("#imageSearchInput");
    btn.onclick = () => input.click();
    input.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      toast("🖼️ Analyzing...", "info");
      const name = f.name.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
      const words = name.split(/\s+/).filter(w => w.length > 2);
      let best = null, score = 0;
      state.products.forEach(p => {
        const hay = `${p.name || ""} ${p.nameEn || ""} ${p.category || ""}`.toLowerCase();
        let s = 0; words.forEach(w => { if (hay.includes(w)) s++; });
        if (s > score) { score = s; best = p; }
      });
      if (best && score > 0) { toast("✓ Match found", "success"); productDetail.open(best); }
      else { router.go("products"); toast("Showing all products", "info"); }
      input.value = "";
    };
  }
};

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════ */
const productDetail = {
  open(p) {
    const name = state.lang === "bn" ? p.name : (p.nameEn || p.name);
    const desc = state.lang === "bn" ? p.description : (p.descriptionEn || p.description);
    const stars = "★".repeat(Math.round(p.rating || 4.5)) + "☆".repeat(5 - Math.round(p.rating || 4.5));
    const inStock = (p.stock || 0) > 0;
    const isW = wishlist.has(p.id);

    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="product-detail">
        <div class="product-detail-img">
          <img src="${esc(p.image || 'https://via.placeholder.com/500')}" />
        </div>
        <div class="product-detail-info">
          <div class="product-cat">${esc(p.category || "Other")}</div>
          <h2>${esc(name)}</h2>
          <div class="product-rating" style="margin:8px 0;">
            <span class="stars">${stars}</span>
            <span class="count">(${p.reviews || 0})</span>
          </div>
          <div class="product-detail-price">${fmtPrice(p.price)}</div>
          ${p.oldPrice ? `<div style="margin-bottom:12px;"><span style="text-decoration:line-through;color:var(--text-3);">${fmtPrice(p.oldPrice)}</span></div>` : ""}
          <div class="product-detail-desc">${esc(desc || "No description.")}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
            <span class="status-pill ${inStock ? "status-delivered" : "status-cancelled"}">
              ${inStock ? `<i class="fa-solid fa-check"></i> ${t("in_stock")}` : `${t("out_of_stock")}`}
            </span>
            ${p.stock ? `<span class="status-pill status-confirmed">${t("stock")}: ${p.stock}</span>` : ""}
          </div>
          <div class="product-detail-actions">
            <button class="btn btn-outline" onclick="productDetail.toggleWish('${p.id}')" ${!inStock ? "disabled" : ""}>
              <i class="fa-${isW ? "solid" : "regular"} fa-heart"></i> ${t("wishlist")}
            </button>
            <button class="btn btn-primary" onclick="productDetail.addCart('${p.id}')" ${!inStock ? "disabled" : ""}>
              <i class="fa-solid fa-cart-plus"></i> ${t("add_to_cart")}
            </button>
          </div>
        </div>
      </div>
    `, { size: "lg" });
  },
  addCart(id) { const p = state.products.find(x => x.id === id); if (p) { cart.add(p); modal.close(); } },
  toggleWish(id) { const p = state.products.find(x => x.id === id); if (p) { wishlist.toggle(p); this.open(p); } },
  openById(id) { const p = state.products.find(x => x.id === id); if (p) this.open(p); }
};
window.productDetail = productDetail;

/* ═══════════════════════════════════════════════════════════════
   PRODUCT CARD
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
        <img src="${esc(p.image || 'https://via.placeholder.com/300')}" loading="lazy" />
        <div class="product-badges">
          ${isNew ? `<span class="badge-tag badge-new">NEW</span>` : ""}
          ${disc ? `<span class="badge-tag badge-sale">-${disc}%</span>` : ""}
        </div>
        <div class="product-actions-overlay">
          <button class="action-circle ${isW ? "active" : ""}" onclick="event.stopPropagation();productCard.toggleWish('${p.id}', this)">
            <i class="fa-${isW ? "solid" : "regular"} fa-heart"></i>
          </button>
          <button class="action-circle" onclick="event.stopPropagation();productDetail.openById('${p.id}')">
            <i class="fa-solid fa-eye"></i>
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
          <i class="fa-solid fa-cart-plus"></i> ${t("add_to_cart")}
        </button>
      </div>
    </div>`;
}
const productCard = {
  toggleWish(id, btn) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    wishlist.toggle(p);
    const isW = wishlist.has(id);
    btn.classList.toggle("active", isW);
    btn.querySelector("i").className = `fa-${isW ? "solid" : "regular"} fa-heart`;
  }
};
window.productCard = productCard;

/* ═══════════════════════════════════════════════════════════════
   PUBLIC PAGES
   ═══════════════════════════════════════════════════════════════ */
const Pages = {
  home(app) {
    app.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <div>
            <div class="hero-badge"><i class="fa-solid fa-bolt"></i> Flash Sale — Up to 50% Off!</div>
            <h1>${t("hero_title")}</h1>
            <p>${t("hero_sub")}</p>
            <div class="hero-actions">
              <button class="btn btn-white" onclick="router.go('products')"><i class="fa-solid fa-bag-shopping"></i> ${t("shop_now")}</button>
              <button class="btn btn-outline-white" onclick="router.go('products')"><i class="fa-solid fa-compass"></i> ${t("explore")}</button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card hero-card-1">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" />
              <h5>Headphones</h5><p>৳2,499</p>
            </div>
            <div class="hero-card hero-card-2">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" />
              <h5>Sneakers</h5><p>৳3,299</p>
            </div>
            <div class="hero-card hero-card-3">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" />
              <h5>Smart Watch</h5><p>৳5,999</p>
            </div>
          </div>
        </div>
      </section>

      <div class="stats-bar">
        <div class="stat-item"><div class="stat-icon"><i class="fa-solid fa-box"></i></div>
          <div><h3 id="homeProductsCount">${state.products.length}+</h3><p>${t("products_count")}</p></div></div>
        <div class="stat-item"><div class="stat-icon"><i class="fa-solid fa-smile"></i></div>
          <div><h3>10K+</h3><p>${t("happy_customers")}</p></div></div>
        <div class="stat-item"><div class="stat-icon"><i class="fa-solid fa-truck-fast"></i></div>
          <div><h3>5K+</h3><p>${t("orders_delivered")}</p></div></div>
        <div class="stat-item"><div class="stat-icon"><i class="fa-solid fa-star"></i></div>
          <div><h3>4.9</h3><p>${t("rating")}</p></div></div>
      </div>

      <section class="page" style="padding-top:20px;">
        <h2 class="section-title"><i class="fa-solid fa-fire"></i> ${t("featured")}</h2>
        <div class="product-grid" id="featuredGrid">${skeletons(8)}</div>
      </section>
    `;
    api.listenProducts(products => {
      const grid = $("#featuredGrid"); if (!grid) return;
      const countEl = $("#homeProductsCount");
      if (countEl) countEl.textContent = products.length + "+";
      const feat = products.slice(0, 8);
      if (!feat.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-box-open"></i><h3>${t("no_products")}</h3></div>`; return; }
      grid.innerHTML = feat.map(productCardHTML).join("");
      grid.querySelectorAll(".product-card").forEach(c => c.onclick = () => productDetail.openById(c.dataset.id));
    });
  },

  products(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="fa-solid fa-bag-shopping"></i> ${t("products")}</h1>
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
    api.listenCategories(cats => {
      const row = $("#catRow"); if (!row) return;
      row.innerHTML = `<div class="cat-chip active" data-cat="all"><i class="fa-solid fa-border-all"></i> ${t("all")}</div>` +
        cats.map(c => `<div class="cat-chip" data-cat="${esc(c.name)}"><i class="fa-solid fa-tag"></i> ${esc(c.name)}</div>`).join("");
      $$("#catRow .cat-chip").forEach(chip => {
        chip.onclick = () => {
          $$("#catRow .cat-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          state.filters.category = chip.dataset.cat;
          this.applyFilters();
        };
      });
    });
    $("#sortSelect").onchange = e => { state.filters.sort = e.target.value; this.applyFilters(); };
    const deb = debounce(() => {
      state.filters.minPrice = $("#minPrice").value;
      state.filters.maxPrice = $("#maxPrice").value;
      this.applyFilters();
    }, 400);
    $("#minPrice").oninput = deb; $("#maxPrice").oninput = deb;
    api.listenProducts(() => this.applyFilters());
  },

  applyFilters() {
    const grid = $("#productsGrid"); if (!grid) return;
    const { category, sort, minPrice, maxPrice } = state.filters;
    const q = ($("#globalSearchInput")?.value || state.filters.query || "").toLowerCase().trim();
    let list = state.products.filter(p => {
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
      new: (a,b) => (b.createdAt||0)-(a.createdAt||0),
      price_low: (a,b) => a.price - b.price,
      price_high: (a,b) => b.price - a.price,
      popular: (a,b) => (b.rating||0)-(a.rating||0)
    };
    list.sort(sorts[sort] || sorts.new);
    const fc = $("#filterCount"); if (fc) fc.textContent = `${list.length} ${t("products_count")}`;
    if (!list.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-magnifying-glass"></i><h3>No products found</h3></div>`; return; }
    grid.innerHTML = list.map(productCardHTML).join("");
    grid.querySelectorAll(".product-card").forEach(c => c.onclick = () => productDetail.openById(c.dataset.id));
  },

  auth(app) {
    let mode = "login";
    app.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo-icon" style="margin:0 auto 14px;width:56px;height:56px;font-size:26px;"><i class="fa-solid fa-store"></i></div>
            <h2 id="authTitle">${t("login")}</h2>
            <p id="authSub">Welcome to EcoShop Pro</p>
          </div>
          <div class="auth-tabs">
            <button class="auth-tab active" data-mode="login">${t("login")}</button>
            <button class="auth-tab" data-mode="signup">${t("signup")}</button>
          </div>
          <form id="authForm"><div id="authFields"></div></form>
        </div>
      </div>
    `;
    const renderFields = () => {
      const el = $("#authFields");
      if (mode === "login") {
        el.innerHTML = `
          <div class="form-group"><label>${t("email")}</label><input type="email" id="aEmail" required /></div>
          <div class="form-group"><label>${t("password")}</label><input type="password" id="aPassword" required /></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit">
            <i class="fa-solid fa-right-to-bracket"></i> ${t("login")}</button>`;
      } else {
        el.innerHTML = `
          <div class="form-group"><label>${t("name")}</label><input type="text" id="aName" required /></div>
          <div class="form-group"><label>${t("email")}</label><input type="email" id="aEmail" required /></div>
          <div class="form-group"><label>${t("phone")}</label><input type="tel" id="aPhone" /></div>
          <div class="form-group"><label>${t("password")}</label><input type="password" id="aPassword" required minlength="6" /></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit">
            <i class="fa-solid fa-user-plus"></i> ${t("signup")}</button>`;
      }
      $("#authTitle").textContent = mode === "login" ? t("login") : t("signup");
    };
    $$(".auth-tab").forEach(tab => {
      tab.onclick = () => {
        $$(".auth-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        mode = tab.dataset.mode; renderFields();
      };
    });
    renderFields();
    $("#authForm").onsubmit = async e => {
      e.preventDefault();
      const btn = $("#authSubmit"); btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      try {
        if (mode === "login") {
          await api.login($("#aEmail").value.trim(), $("#aPassword").value);
          toast(t("login_success"), "success");
        } else {
          const pw = $("#aPassword").value;
          if (pw.length < 6) { toast(t("password_short"), "error"); btn.disabled = false; renderFields(); return; }
          await api.signup({
            name: $("#aName").value.trim(),
            email: $("#aEmail").value.trim(),
            phone: $("#aPhone").value.trim(),
            password: pw
          });
          toast(t("signup_success"), "success");
        }
        setTimeout(() => router.go(state.isAdmin ? "admin" : "dashboard"), 500);
      } catch (err) {
        let m = err.message;
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") m = t("invalid_credentials");
        if (err.code === "auth/email-already-in-use") m = "Email already registered";
        toast(m, "error");
        btn.disabled = false; renderFields();
      }
    };
  },

  dashboard(app) {
    if (state.isAdmin) { router.go("admin"); return; }
    const u = state.user;
    app.innerHTML = `
      <section class="page">
        <div style="background:var(--brand-grad);color:#fff;padding:40px 32px;border-radius:var(--radius-xl);margin-bottom:28px;position:relative;overflow:hidden;">
          <div style="position:relative;z-index:2;">
            <div style="display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.2);border-radius:50px;font-size:12px;font-weight:700;margin-bottom:12px;">
              <i class="fa-solid fa-user"></i> ${t("user_dashboard")}
            </div>
            <h1 style="font-size:32px;font-weight:900;margin-bottom:6px;">👋 ${t("welcome")}, ${esc(u.displayName || u.email.split("@")[0])}</h1>
            <p style="opacity:.95;">Your orders and stats</p>
          </div>
        </div>
        <div class="kpi-grid">
          <div class="kpi-card g1"><div class="kpi-icon g1"><i class="fa-solid fa-receipt"></i></div>
            <div class="kpi-label">${t("my_orders")}</div><div class="kpi-value" id="sOrders">0</div></div>
          <div class="kpi-card g2"><div class="kpi-icon g2"><i class="fa-solid fa-cart-shopping"></i></div>
            <div class="kpi-label">${t("cart")}</div><div class="kpi-value" id="sCart">${cart.count()}</div></div>
          <div class="kpi-card g3"><div class="kpi-icon g3"><i class="fa-solid fa-heart"></i></div>
            <div class="kpi-label">${t("wishlist")}</div><div class="kpi-value" id="sWish">${state.wishlist.length}</div></div>
          <div class="kpi-card g4"><div class="kpi-icon g4"><i class="fa-solid fa-money-bill-wave"></i></div>
            <div class="kpi-label">Total Spent</div><div class="kpi-value" id="sSpent">৳0</div></div>
        </div>
        <h2 class="section-title"><i class="fa-solid fa-clock-rotate-left"></i> ${t("recent_orders")}</h2>
        <div id="userOrderList"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i></div></div>
      </section>
    `;
    api.listenUserOrders(u.uid, orders => {
      const el = $("#userOrderList"); if (!el) return;
      $("#sOrders").textContent = orders.length;
      const spent = orders.reduce((s, o) => s + (o.total || 0), 0);
      $("#sSpent").textContent = fmtPrice(spent);
      if (!orders.length) {
        el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>No orders yet</h3>
          <button class="btn btn-primary" onclick="router.go('products')"><i class="fa-solid fa-bag-shopping"></i> ${t("shop_now")}</button></div>`;
        return;
      }
      el.innerHTML = orders.map(o => this.orderCardHTML(o, false)).join("");
    });
  },

  orderCardHTML(o, admin) {
    const items = (o.items || []).map(i =>
      `<span style="padding:6px 12px;background:var(--bg-soft);border-radius:50px;font-size:13px;">${esc(state.lang === "bn" ? i.name : (i.nameEn || i.name))} × ${i.qty}</span>`
    ).join("");
    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
          <div>
            <div style="font-family:monospace;font-weight:800;color:var(--brand-1);font-size:15px;">#${(o.orderId || o.id).slice(-8).toUpperCase()}</div>
            <div style="font-size:12.5px;color:var(--text-3);margin-top:2px;"><i class="fa-regular fa-clock"></i> ${fmtDate(o.createdAt)}</div>
          </div>
          <span class="status-pill status-${o.status}">${t(o.status)}</span>
        </div>
        ${admin ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;color:var(--text-2);margin-bottom:12px;">
          <div><i class="fa-solid fa-user"></i> ${esc(o.userName || "—")}</div>
          <div><i class="fa-solid fa-phone"></i> ${esc(o.phone || "—")}</div>
          <div style="grid-column:1/-1;"><i class="fa-solid fa-location-dot"></i> ${esc(o.address || "—")}</div>
        </div>` : ""}
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px dashed var(--border);">${items}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:20px;font-weight:900;background:var(--brand-grad);-webkit-background-clip:text;background-clip:text;color:transparent;">${fmtPrice(o.total)}</div>
          ${admin ? `<select class="status-select" data-oid="${o.id}" data-uid="${o.userId}" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev);color:var(--text);cursor:pointer;font-weight:600;">
            ${["pending","confirmed","shipped","delivered","cancelled"].map(s => `<option value="${s}" ${o.status === s ? "selected" : ""}>${t(s)}</option>`).join("")}
          </select>` : ""}
        </div>
      </div>`;
  },

  orders(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="fa-solid fa-receipt"></i> ${t("my_orders")}</h1>
        <div id="ordersWrap" style="margin-top:24px;"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i></div></div>
      </section>`;
    api.listenUserOrders(state.user.uid, orders => {
      const w = $("#ordersWrap"); if (!w) return;
      if (!orders.length) {
        w.innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>No orders yet</h3>
          <button class="btn btn-primary" onclick="router.go('products')"><i class="fa-solid fa-bag-shopping"></i> ${t("shop_now")}</button></div>`;
        return;
      }
      w.innerHTML = orders.map(o => this.orderCardHTML(o, false)).join("");
    });
  },

  wishlist(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="fa-solid fa-heart" style="color:#ec4899"></i> ${t("wishlist")}</h1>
        <div class="product-grid" id="wishGrid" style="margin-top:24px;"></div>
      </section>`;
    const grid = $("#wishGrid");
    if (!state.wishlist.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-heart-crack"></i>
        <h3>${t("wishlist_empty")}</h3>
        <button class="btn btn-primary" onclick="router.go('products')">${t("shop_now")}</button></div>`;
      return;
    }
    const items = state.wishlist.map(w => state.products.find(x => x.id === w.id) || w);
    grid.innerHTML = items.map(productCardHTML).join("");
    grid.querySelectorAll(".product-card").forEach(c => c.onclick = () => productDetail.openById(c.dataset.id));
  },

  async profile(app) {
    app.innerHTML = `<section class="page"><div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i></div></section>`;
    const p = await api.getProfile(state.user.uid) || {};
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="fa-solid fa-user"></i> ${t("profile")}</h1>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:24px;margin-top:24px;max-width:1000px;" class="profile-grid">
          <div class="card" style="text-align:center;padding:32px;">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || "U")}&background=6366f1&color=fff&size=200"
              style="width:120px;height:120px;border-radius:50%;margin:0 auto 16px;border:4px solid var(--brand-1);" />
            <h3 style="font-size:20px;">${esc(p.name || "User")}</h3>
            <p style="color:var(--text-2);font-size:14px;margin-top:4px;">${esc(p.email || "")}</p>
            <div class="status-pill status-delivered" style="margin-top:14px;">
              <i class="fa-solid fa-${state.isAdmin ? "shield-halved" : "user"}"></i> ${state.isAdmin ? "ADMIN" : "USER"}
            </div>
          </div>
          <div class="card" style="padding:28px;">
            <h3 style="font-size:18px;margin-bottom:20px;"><i class="fa-solid fa-pen"></i> Edit Info</h3>
            <div class="form-group"><label>${t("name")}</label><input id="pfName" value="${esc(p.name || "")}" /></div>
            <div class="form-group"><label>${t("email")}</label><input value="${esc(p.email || "")}" disabled /></div>
            <div class="form-row">
              <div class="form-group"><label>${t("phone")}</label><input id="pfPhone" value="${esc(p.phone || "")}" /></div>
              <div class="form-group"><label>Joined</label><input value="${p.createdAt ? fmtDateShort(p.createdAt) : "—"}" disabled /></div>
            </div>
            <div class="form-group"><label>${t("address")}</label><textarea id="pfAddress">${esc(p.address || "")}</textarea></div>
            <button class="btn btn-primary btn-block" id="saveProfileBtn"><i class="fa-solid fa-save"></i> ${t("save")}</button>
          </div>
        </div>
      </section>`;
    $("#saveProfileBtn").onclick = async () => {
      try {
        await api.updateProfile(state.user.uid, {
          name: $("#pfName").value.trim(),
          phone: $("#pfPhone").value.trim(),
          address: $("#pfAddress").value.trim()
        });
        toast(t("profile_updated"), "success");
      } catch (e) { toast(e.message, "error"); }
    };
  },

  settings(app) {
    app.innerHTML = `
      <section class="page">
        <h1 class="page-title"><i class="fa-solid fa-gear"></i> ${t("settings")}</h1>
        <div class="card" style="max-width:640px;margin-top:24px;padding:28px;">
          <div class="form-group"><label>Language</label>
            <select id="setLang"><option value="bn" ${state.lang === "bn" ? "selected" : ""}>বাংলা</option><option value="en" ${state.lang === "en" ? "selected" : ""}>English</option></select></div>
          <div class="form-group"><label>Theme</label>
            <select id="setTheme"><option value="light" ${state.theme === "light" ? "selected" : ""}>Light</option><option value="dark" ${state.theme === "dark" ? "selected" : ""}>Dark</option></select></div>
          <button class="btn btn-primary btn-block" id="saveSettingsBtn"><i class="fa-solid fa-save"></i> ${t("save")}</button>
          <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--border);">
            <h4 style="margin-bottom:12px;font-size:15px;">Account</h4>
            <button class="btn btn-danger btn-block" onclick="authUI.doLogout()"><i class="fa-solid fa-right-from-bracket"></i> ${t("logout")}</button>
          </div>
        </div>
      </section>`;
    $("#saveSettingsBtn").onclick = () => {
      const nl = $("#setLang").value, nt = $("#setTheme").value;
      state.theme = nt; localStorage.setItem("theme", nt); applyTheme();
      if (nl !== state.lang) { state.lang = nl; localStorage.setItem("lang", nl); applyLang(); }
      toast(t("settings_saved"), "success");
      setTimeout(() => router.render(), 400);
    };
  }
};
window.Pages = Pages;

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
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
      overview:["Dashboard Overview","Welcome back, Admin"],
      analytics:["Analytics & Reports","Deep insights into your store"],
      orders:["Order Management","Manage all customer orders"],
      products:["Product Management","Add, edit, or remove products"],
      categories:["Category Management","Organize your product categories"],
      coupons:["Coupon Management","Create discount codes"],
      reviews:["Review Management","Moderate customer reviews"],
      users:["User Management","Manage all registered users"],
      notifications:["Push Notifications","Send notifications to users"],
      banners:["Banner Management","Manage homepage banners"],
      settings:["Site Settings","Configure your store settings"],
      activity:["Activity Logs","Recent admin activities"],
      export:["Export Data","Download your data"]
    };
    const [title, sub] = titles[this.current] || ["Dashboard", ""];
    $("#adminPageTitle").textContent = title;
    $("#adminPageSubtitle").textContent = sub;
    $$(".admin-nav a").forEach(a => a.classList.toggle("active", a.dataset.admin === this.current));
    const content = $("#adminContent");
    content.innerHTML = "";
    (pages[this.current] || pages.overview)();
    if (window.innerWidth <= 1100) $("#adminSidebar").classList.remove("open");
  },

  go(page) { this.current = page; this.render(); },

  /* ─── OVERVIEW ─── */
  overview() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card g1">
          <div class="kpi-icon g1"><i class="fa-solid fa-box"></i></div>
          <div class="kpi-label">Total Products</div>
          <div class="kpi-value" id="kProduct">0</div>
          <div class="kpi-trend up"><i class="fa-solid fa-arrow-up"></i> Live</div>
        </div>
        <div class="kpi-card g2">
          <div class="kpi-icon g2"><i class="fa-solid fa-receipt"></i></div>
          <div class="kpi-label">Total Orders</div>
          <div class="kpi-value" id="kOrder">0</div>
          <div class="kpi-trend up"><i class="fa-solid fa-arrow-up"></i> Live</div>
        </div>
        <div class="kpi-card g3">
          <div class="kpi-icon g3"><i class="fa-solid fa-users"></i></div>
          <div class="kpi-label">Total Users</div>
          <div class="kpi-value" id="kUser">0</div>
          <div class="kpi-trend up"><i class="fa-solid fa-arrow-up"></i> Live</div>
        </div>
        <div class="kpi-card g4">
          <div class="kpi-icon g4"><i class="fa-solid fa-money-bill-wave"></i></div>
          <div class="kpi-label">Total Revenue</div>
          <div class="kpi-value" id="kRevenue">৳0</div>
          <div class="kpi-trend up"><i class="fa-solid fa-arrow-up"></i> Delivered</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-chart-line"></i> Sales Overview (7 days)</h3></div>
          <div class="chart-container"><canvas id="salesChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-chart-pie"></i> Order Status</h3></div>
          <div class="chart-container"><canvas id="statusChart"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-clock-rotate-left"></i> Recent Orders</h3>
          <button class="btn btn-outline btn-sm" onclick="adminPage.go('orders')">View All</button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody id="recentOrdersBody"><tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-3);"><i class="fa-solid fa-spinner fa-spin"></i></td></tr></tbody>
        </table></div></div>
      </div>
    `;

    // Listen everything
    api.listenProducts(p => { const el = $("#kProduct"); if (el) el.textContent = p.length; const n = $("#navProductCount"); if (n) n.textContent = p.length; });
    api.listenUsers(u => { const el = $("#kUser"); if (el) el.textContent = u.length; });
    api.listenAllOrders(orders => {
      const ko = $("#kOrder"); if (ko) ko.textContent = orders.length;
      const nav = $("#navOrderCount"); if (nav) nav.textContent = orders.length;
      const rev = orders.filter(o => o.status === "delivered").reduce((s, o) => s + (o.total || 0), 0);
      const kr = $("#kRevenue"); if (kr) kr.textContent = fmtPrice(rev);

      // Recent orders table
      const tb = $("#recentOrdersBody");
      if (tb) {
        const recent = orders.slice(0, 5);
        if (!recent.length) tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--text-3);">No orders yet</td></tr>`;
        else tb.innerHTML = recent.map(o => `
          <tr>
            <td><strong style="color:var(--brand-1);font-family:monospace;">#${(o.orderId||o.id).slice(-6).toUpperCase()}</strong></td>
            <td>${esc(o.userName || "—")}</td>
            <td><strong>${fmtPrice(o.total)}</strong></td>
            <td><span class="status-pill status-${o.status}">${t(o.status)}</span></td>
            <td style="color:var(--text-3);font-size:13px;">${fmtDateShort(o.createdAt)}</td>
          </tr>`).join("");
      }

      // Charts
      this.renderSalesChart(orders);
      this.renderStatusChart(orders);
    });
  },

  renderSalesChart(orders) {
    const ctx = document.getElementById("salesChart");
    if (!ctx) return;
    const days = 7;
    const labels = [];
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      labels.push(d.toLocaleDateString(state.lang === "bn" ? "bn-BD" : "en-US", { weekday: "short", day: "numeric" }));
      const total = orders.filter(o => new Date(o.createdAt).toDateString() === ds).reduce((s, o) => s + (o.total || 0), 0);
      data.push(total);
    }
    if (state.charts.sales) state.charts.sales.destroy();
    state.charts.sales = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Sales (৳)",
          data,
          borderColor: "#6366f1",
          backgroundColor: (c) => {
            const g = c.chart.ctx.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, "rgba(99,102,241,0.35)");
            g.addColorStop(1, "rgba(99,102,241,0)");
            return g;
          },
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#fff",
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.15)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } }
        }
      }
    });
  },

  renderStatusChart(orders) {
    const ctx = document.getElementById("statusChart");
    if (!ctx) return;
    const counts = { pending:0, confirmed:0, shipped:0, delivered:0, cancelled:0 };
    orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });
    if (state.charts.status) state.charts.status.destroy();
    state.charts.status = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pending","Confirmed","Shipped","Delivered","Cancelled"],
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ["#f59e0b","#3b82f6","#8b5cf6","#10b981","#ef4444"],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#94a3b8", padding: 14, font: { size: 12 } } }
        }
      }
    });
  },

  /* ─── ANALYTICS ─── */
  analytics() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card g1"><div class="kpi-icon g1"><i class="fa-solid fa-chart-bar"></i></div>
          <div class="kpi-label">Avg Order Value</div><div class="kpi-value" id="aAOV">৳0</div></div>
        <div class="kpi-card g2"><div class="kpi-icon g2"><i class="fa-solid fa-percent"></i></div>
          <div class="kpi-label">Conversion Rate</div><div class="kpi-value">3.8%</div></div>
        <div class="kpi-card g3"><div class="kpi-icon g3"><i class="fa-solid fa-box-open"></i></div>
          <div class="kpi-label">Low Stock Items</div><div class="kpi-value" id="aLowStock">0</div></div>
        <div class="kpi-card g4"><div class="kpi-icon g4"><i class="fa-solid fa-star"></i></div>
          <div class="kpi-label">Avg Rating</div><div class="kpi-value">4.7</div></div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-fire"></i> Top Selling Products</h3></div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
          <tbody id="topProductsBody"></tbody>
        </table></div></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-chart-area"></i> Monthly Sales</h3></div>
          <div class="chart-container"><canvas id="monthlyChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-tags"></i> Category Distribution</h3></div>
          <div class="chart-container"><canvas id="catChart"></canvas></div>
        </div>
      </div>
    `;

    api.listenAllOrders(orders => {
      const aov = orders.length ? orders.reduce((s,o)=>s+(o.total||0),0) / orders.length : 0;
      const el = $("#aAOV"); if (el) el.textContent = fmtPrice(aov);
      this.renderMonthlyChart(orders);
    });
    api.listenProducts(products => {
      const low = products.filter(p => (p.stock || 0) < 10).length;
      const el = $("#aLowStock"); if (el) el.textContent = low;
      const tb = $("#topProductsBody");
      if (tb) {
        const top = [...products].sort((a,b) => (b.rating||0) - (a.rating||0)).slice(0, 5);
        tb.innerHTML = top.length ? top.map(p => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:10px;">
              <img src="${esc(p.image||'https://via.placeholder.com/40')}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />
              <div><strong>${esc(p.name)}</strong></div>
            </div></td>
            <td>${esc(p.category||"—")}</td>
            <td><strong>${fmtPrice(p.price)}</strong></td>
            <td>${p.stock || 0}</td>
            <td><span class="status-pill ${(p.stock||0) > 0 ? "status-active" : "status-banned"}">${(p.stock||0) > 0 ? "In Stock" : "Out"}</span></td>
          </tr>`).join("") : `<tr><td colspan="5" style="text-align:center;padding:30px;">No products</td></tr>`;
      }
      this.renderCatChart(products);
    });
  },

  renderMonthlyChart(orders) {
    const ctx = document.getElementById("monthlyChart"); if (!ctx) return;
    const months = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleDateString("en-US", { month: "short" }));
      const total = orders.filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      }).reduce((s,o) => s + (o.total||0), 0);
      data.push(total);
    }
    if (state.charts.monthly) state.charts.monthly.destroy();
    state.charts.monthly = new Chart(ctx, {
      type: "bar",
      data: { labels: months, datasets: [{
        label: "Revenue",
        data,
        backgroundColor: "rgba(99,102,241,0.7)",
        borderRadius: 8,
        borderSkipped: false
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.15)" }, ticks: { color: "#94a3b8" } },
                  x: { grid: { display: false }, ticks: { color: "#94a3b8" } } }
      }
    });
  },

  renderCatChart(products) {
    const ctx = document.getElementById("catChart"); if (!ctx) return;
    const counts = {};
    products.forEach(p => { counts[p.category||"Other"] = (counts[p.category||"Other"]||0) + 1; });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    if (state.charts.cat) state.charts.cat.destroy();
    state.charts.cat = new Chart(ctx, {
      type: "polarArea",
      data: { labels, datasets: [{
        data,
        backgroundColor: ["rgba(99,102,241,0.7)","rgba(236,72,153,0.7)","rgba(16,185,129,0.7)","rgba(245,158,11,0.7)","rgba(139,92,246,0.7)","rgba(59,130,246,0.7)","rgba(239,68,68,0.7)"],
        borderWidth: 0
      }]},
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
          <h3><i class="fa-solid fa-receipt"></i> All Orders</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <select id="orderFilter" style="padding:8px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);">
              <option value="all">All Status</option>
              <option value="pending">${t("pending")}</option>
              <option value="confirmed">${t("confirmed")}</option>
              <option value="shipped">${t("shipped")}</option>
              <option value="delivered">${t("delivered")}</option>
              <option value="cancelled">${t("cancelled")}</option>
            </select>
          </div>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody id="ordersTbody"></tbody>
        </table></div></div>
      </div>
    `;
    const render = (orders) => {
      const tb = $("#ordersTbody"); if (!tb) return;
      if (!orders.length) { tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">No orders</td></tr>`; return; }
      tb.innerHTML = orders.map(o => `
        <tr>
          <td><strong style="font-family:monospace;color:var(--brand-1);">#${(o.orderId||o.id).slice(-6).toUpperCase()}</strong></td>
          <td>
            <div style="font-weight:600;">${esc(o.userName || "—")}</div>
            <div style="font-size:12px;color:var(--text-3);">${esc(o.phone || "")}</div>
          </td>
          <td>${(o.items || []).length} item${(o.items||[]).length > 1 ? "s" : ""}</td>
          <td><strong>${fmtPrice(o.total)}</strong></td>
          <td>
            <select class="status-select" data-oid="${o.id}" data-uid="${o.userId}" style="padding:5px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev);color:var(--text);font-weight:700;font-size:12px;cursor:pointer;">
              ${["pending","confirmed","shipped","delivered","cancelled"].map(s => `<option value="${s}" ${o.status===s?"selected":""}>${t(s)}</option>`).join("")}
            </select>
          </td>
          <td style="font-size:13px;color:var(--text-3);">${fmtDateShort(o.createdAt)}</td>
          <td>
            <div class="table-actions">
              <button class="act-view" onclick="adminPage.viewOrder('${o.id}')" title="View"><i class="fa-solid fa-eye"></i></button>
              <button class="act-del" onclick="adminPage.deleteOrder('${o.id}','${o.userId}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join("");
      tb.querySelectorAll(".status-select").forEach(sel => {
        sel.onchange = async () => {
          await api.updateOrderStatus(sel.dataset.oid, sel.value, sel.dataset.uid);
          toast("✓ Status updated", "success");
        };
      });
    };
    api.listenAllOrders(orders => {
      const filter = $("#orderFilter")?.value || "all";
      const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
      render(filtered);
    });
    $("#orderFilter").onchange = () => {
      const filter = $("#orderFilter").value;
      const orders = filter === "all" ? state.orders : state.orders.filter(o => o.status === filter);
      render(orders);
    };
  },

  viewOrder(id) {
    const o = state.orders.find(x => x.id === id);
    if (!o) return;
    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div style="padding:32px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;">
          <i class="fa-solid fa-receipt" style="color:var(--brand-1)"></i> Order #${(o.orderId||o.id).slice(-8).toUpperCase()}
        </h2>
        <p style="color:var(--text-3);margin-bottom:22px;">${fmtDate(o.createdAt)}</p>

        <div class="grid-2" style="margin-bottom:20px;">
          <div><strong>Customer:</strong> ${esc(o.userName)}</div>
          <div><strong>Phone:</strong> ${esc(o.phone)}</div>
          <div style="grid-column:1/-1;"><strong>Address:</strong> ${esc(o.address)}</div>
        </div>

        <div class="table-wrap" style="margin-bottom:20px;">
          <table class="data-table">
            <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              ${(o.items||[]).map(i => `
                <tr>
                  <td>${esc(i.name)}</td>
                  <td>${fmtPrice(i.price)}</td>
                  <td>${i.qty}</td>
                  <td><strong>${fmtPrice(i.price * i.qty)}</strong></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div style="text-align:right;">
          <div style="font-size:14px;color:var(--text-2);">Subtotal: ${fmtPrice(o.subtotal || 0)}</div>
          <div style="font-size:14px;color:var(--text-2);">Shipping: ${fmtPrice(o.shipping || 0)}</div>
          <div style="font-size:20px;font-weight:900;margin-top:8px;">Total: ${fmtPrice(o.total)}</div>
        </div>

        <div style="display:flex;gap:10px;margin-top:22px;">
          <button class="btn btn-outline btn-block" onclick="window.print()"><i class="fa-solid fa-print"></i> Print</button>
        </div>
      </div>
    `, { size: "lg" });
  },

  deleteOrder(id, uid) {
    confirmDialog("Delete this order?", async () => {
      await remove(ref(db, `orders/${id}`));
      if (uid) await remove(ref(db, `userOrders/${uid}/${id}`));
      toast("Order deleted", "success");
    });
  },

  /* ─── PRODUCTS ─── */
  products() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-box"></i> All Products (<span id="prodCount">0</span>)</h3>
          <button class="btn btn-primary" id="addProductBtn"><i class="fa-solid fa-plus"></i> ${t("add_product")}</button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody id="productsTbody"></tbody>
        </table></div></div>
      </div>
    `;
    $("#addProductBtn").onclick = () => this.productForm();
    api.listenProducts(products => {
      const el = $("#prodCount"); if (el) el.textContent = products.length;
      const tb = $("#productsTbody"); if (!tb) return;
      if (!products.length) { tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">No products. Add one!</td></tr>`; return; }
      tb.innerHTML = products.map(p => `
        <tr>
          <td><img src="${esc(p.image||'https://via.placeholder.com/50')}" style="width:50px;height:50px;border-radius:10px;object-fit:cover;" /></td>
          <td><strong>${esc(p.name)}</strong><div style="font-size:12px;color:var(--text-3);">${esc(p.nameEn || "")}</div></td>
          <td><span style="padding:3px 10px;background:var(--bg-soft);border-radius:50px;font-size:12px;font-weight:600;">${esc(p.category||"Other")}</span></td>
          <td><strong>${fmtPrice(p.price)}</strong></td>
          <td><span class="status-pill ${(p.stock||0) > 0 ? "status-active" : "status-banned"}">${p.stock || 0}</span></td>
          <td>
            <label class="switch">
              <input type="checkbox" ${p.featured ? "checked" : ""} onchange="adminPage.toggleFeatured('${p.id}', this.checked)" />
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <div class="table-actions">
              <button class="act-edit" onclick="adminPage.editProduct('${p.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
              <button class="act-del" onclick="adminPage.deleteProduct('${p.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`).join("");
    });
  },

  async toggleFeatured(id, featured) {
    await api.toggleFeatured(id, featured);
    toast(featured ? "⭐ Featured" : "Removed from featured", "success");
  },

  productForm(product = null) {
    const isEdit = !!product;
    const cats = state.categories;
    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:6px;">
          <i class="fa-solid ${isEdit ? "fa-pen" : "fa-plus"}" style="color:var(--brand-1)"></i>
          ${isEdit ? t("edit_product") : t("add_product")}
        </h2>
        <p style="color:var(--text-2);font-size:14px;margin-bottom:22px;">Fill in the details</p>

        <div class="form-row">
          <div class="form-group"><label>Name (বাংলা) *</label><input id="pName" value="${esc(product?.name || "")}" required /></div>
          <div class="form-group"><label>Name (English)</label><input id="pNameEn" value="${esc(product?.nameEn || "")}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t("price")} *</label><input type="number" id="pPrice" value="${product?.price || ""}" required min="0" /></div>
          <div class="form-group"><label>Old Price</label><input type="number" id="pOldPrice" value="${product?.oldPrice || ""}" min="0" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t("product_category")}</label>
            <select id="pCategory">${cats.map(c => `<option value="${esc(c.name)}" ${product?.category === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}<option value="Other" ${product?.category === "Other" ? "selected" : ""}>Other</option></select></div>
          <div class="form-group"><label>${t("stock")}</label><input type="number" id="pStock" value="${product?.stock || 0}" min="0" /></div>
        </div>
        <div class="form-group"><label>${t("product_desc")} (বাংলা)</label><textarea id="pDesc">${esc(product?.description || "")}</textarea></div>
        <div class="form-group"><label>${t("product_desc")} (English)</label><textarea id="pDescEn">${esc(product?.descriptionEn || "")}</textarea></div>
        <div class="form-group"><label>${t("product_image")}</label><input type="file" id="pImage" accept="image/*" /></div>
        <div class="form-group" style="display:flex;align-items:center;gap:12px;">
          <label class="switch"><input type="checkbox" id="pFeatured" ${product?.featured ? "checked" : ""} /><span class="slider"></span></label>
          <span style="font-weight:600;">Featured Product</span>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;">
          <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">${t("cancel")}</button>
          <button class="btn btn-primary" id="saveProductBtn" style="flex:2;"><i class="fa-solid fa-save"></i> ${t("save")}</button>
        </div>
      </div>
    `, { size: "lg" });

    $("#saveProductBtn").onclick = async () => {
      const name = $("#pName").value.trim();
      const price = Number($("#pPrice").value);
      if (!name || !price) { toast("Name and price required", "error"); return; }
      const btn = $("#saveProductBtn"); btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      const data = {
        name, nameEn: $("#pNameEn").value.trim() || name,
        price, oldPrice: Number($("#pOldPrice").value) || 0,
        category: $("#pCategory").value,
        stock: Number($("#pStock").value) || 0,
        description: $("#pDesc").value.trim(),
        descriptionEn: $("#pDescEn").value.trim() || $("#pDesc").value.trim(),
        featured: $("#pFeatured").checked,
        image: product?.image || ""
      };
      const file = $("#pImage").files[0];
      try {
        if (isEdit) { await api.updateProduct(product.id, data, file); toast(t("product_updated"), "success"); }
        else { await api.addProduct(data, file); toast(t("product_added"), "success"); }
        modal.close();
      } catch (e) {
        toast(e.message, "error");
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-save"></i> ${t("save")}`;
      }
    };
  },

  editProduct(id) { const p = state.products.find(x => x.id === id); if (p) this.productForm(p); },

  deleteProduct(id) {
    confirmDialog("Delete this product?", async () => {
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
          <h3><i class="fa-solid fa-tags"></i> Categories (<span id="catCount">0</span>)</h3>
          <button class="btn btn-primary" id="addCatBtn"><i class="fa-solid fa-plus"></i> New Category</button>
        </div>
        <div class="grid-3" id="catGrid"></div>
      </div>
    `;
    $("#addCatBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;"><i class="fa-solid fa-tag"></i> New Category</h2>
          <div class="form-group"><label>Category Name</label><input id="newCatName" placeholder="e.g., Accessories" /></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">Cancel</button>
            <button class="btn btn-primary" id="saveCatBtn" style="flex:1;">Save</button>
          </div>
        </div>
      `, { size: "sm" });
      $("#saveCatBtn").onclick = async () => {
        const n = $("#newCatName").value.trim();
        if (!n) { toast("Name required", "error"); return; }
        await api.addCategory(n);
        toast("Category added", "success");
        modal.close();
      };
    };
    api.listenCategories(cats => {
      const el = $("#catCount"); if (el) el.textContent = cats.length;
      const grid = $("#catGrid"); if (!grid) return;
      grid.innerHTML = cats.map(cat => {
        const count = state.products.filter(p => p.category === cat.name).length;
        return `<div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:44px;height:44px;border-radius:12px;background:var(--brand-grad-soft);display:flex;align-items:center;justify-content:center;color:var(--brand-1);font-size:18px;">
              <i class="fa-solid fa-tag"></i>
            </div>
            <div><div style="font-weight:700;">${esc(cat.name)}</div>
            <div style="font-size:12px;color:var(--text-3);">${count} products</div></div>
          </div>
          <button class="table-actions act-del" style="width:34px;height:34px;border-radius:8px;background:rgba(239,68,68,0.1);color:var(--danger);" onclick="adminPage.deleteCat('${cat.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>`;
      }).join("");
    });
  },

  deleteCat(id) {
    confirmDialog("Delete this category?", async () => {
      await api.deleteCategory(id);
      toast("Category deleted", "success");
    });
  },

  /* ─── COUPONS ─── */
  coupons() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-ticket"></i> Coupons (<span id="couponCount">0</span>)</h3>
          <button class="btn btn-primary" id="addCouponBtn"><i class="fa-solid fa-plus"></i> New Coupon</button>
        </div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Purchase</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="couponTbody"></tbody>
        </table></div></div>
      </div>
    `;
    $("#addCouponBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;"><i class="fa-solid fa-ticket"></i> New Coupon</h2>
          <div class="form-group"><label>Code</label><input id="cpCode" placeholder="SAVE10" style="text-transform:uppercase;" /></div>
          <div class="form-row">
            <div class="form-group"><label>Type</label>
              <select id="cpType"><option value="percent">Percent (%)</option><option value="fixed">Fixed (৳)</option></select></div>
            <div class="form-group"><label>Value</label><input type="number" id="cpValue" placeholder="10" /></div>
          </div>
          <div class="form-group"><label>Min Purchase (optional)</label><input type="number" id="cpMin" placeholder="0" /></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">Cancel</button>
            <button class="btn btn-primary" id="saveCouponBtn" style="flex:1;">Create</button>
          </div>
        </div>
      `, { size: "sm" });
      $("#saveCouponBtn").onclick = async () => {
        const code = $("#cpCode").value.trim().toUpperCase();
        const value = Number($("#cpValue").value);
        if (!code || !value) { toast("Code and value required", "error"); return; }
        await api.addCoupon({
          code, type: $("#cpType").value,
          value, minPurchase: Number($("#cpMin").value) || 0,
          active: true
        });
        toast("Coupon created", "success");
        modal.close();
      };
    };
    api.listenCoupons(coupons => {
      const el = $("#couponCount"); if (el) el.textContent = coupons.length;
      const tb = $("#couponTbody"); if (!tb) return;
      if (!coupons.length) { tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-3);">No coupons yet</td></tr>`; return; }
      tb.innerHTML = coupons.map(c => `
        <tr>
          <td><strong style="font-family:monospace;background:var(--brand-grad-soft);color:var(--brand-1);padding:4px 10px;border-radius:6px;">${esc(c.code)}</strong></td>
          <td>${c.type === "percent" ? "Percent" : "Fixed"}</td>
          <td><strong>${c.type === "percent" ? c.value + "%" : fmtPrice(c.value)}</strong></td>
          <td>${c.minPurchase ? fmtPrice(c.minPurchase) : "—"}</td>
          <td><span class="status-pill status-active">Active</span></td>
          <td><div class="table-actions">
            <button class="act-del" onclick="adminPage.deleteCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </div></td>
        </tr>`).join("");
    });
  },

  deleteCoupon(id) {
    confirmDialog("Delete this coupon?", async () => {
      await api.deleteCoupon(id);
      toast("Coupon deleted", "success");
    });
  },

  /* ─── REVIEWS ─── */
  reviews() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-star"></i> Reviews (<span id="revCount">0</span>)</h3></div>
        <div id="revList"></div>
      </div>
    `;
    api.listenReviews(reviews => {
      const el = $("#revCount"); if (el) el.textContent = reviews.length;
      const list = $("#revList");
      if (!reviews.length) { list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-comments"></i><h3>No reviews yet</h3></div>`; return; }
      list.innerHTML = reviews.map(r => `
        <div class="card" style="margin:0 0 12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div>
              <div style="font-weight:700;">${esc(r.userName || "User")}</div>
              <div style="color:#fbbf24;font-size:14px;">${"★".repeat(r.rating||5)}</div>
              <p style="margin-top:8px;color:var(--text-2);">${esc(r.comment || "")}</p>
              <small style="color:var(--text-3);">${fmtDate(r.createdAt)}</small>
            </div>
            <button class="table-actions act-del" style="width:34px;height:34px;border-radius:8px;background:rgba(239,68,68,0.1);color:var(--danger);" onclick="adminPage.deleteReview('${r.id}')">
              <i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`).join("");
    });
  },

  deleteReview(id) {
    confirmDialog("Delete this review?", async () => {
      await api.deleteReview(id);
      toast("Review deleted", "success");
    });
  },

  /* ─── USERS ─── */
  users() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-users"></i> All Users (<span id="userCount">0</span>)</h3></div>
        <div class="table-wrap"><div class="table-scroll"><table class="data-table">
          <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody id="usersTbody"></tbody>
        </table></div></div>
      </div>
    `;
    api.listenUsers(users => {
      const el = $("#userCount"); if (el) el.textContent = users.length;
      const tb = $("#usersTbody"); if (!tb) return;
      if (!users.length) { tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-3);">No users</td></tr>`; return; }
      tb.innerHTML = users.map(u => `
        <tr>
          <td><div style="display:flex;align-items:center;gap:10px;">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||"U")}&background=6366f1&color=fff&size=40" style="width:36px;height:36px;border-radius:50%;" />
            <strong>${esc(u.name || "User")}</strong>
          </div></td>
          <td>${esc(u.email || "")}</td>
          <td>${esc(u.phone || "—")}</td>
          <td><span class="status-pill ${u.role === "admin" ? "status-shipped" : "status-confirmed"}">${u.role || "user"}</span></td>
          <td><span class="status-pill ${u.banned ? "status-banned" : "status-active"}">${u.banned ? "Banned" : "Active"}</span></td>
          <td style="font-size:13px;color:var(--text-3);">${fmtDateShort(u.createdAt)}</td>
          <td><div class="table-actions">
            <button class="act-edit" title="${u.banned ? "Unban" : "Ban"}" onclick="adminPage.toggleBan('${u.id}', ${!u.banned})">
              <i class="fa-solid fa-${u.banned ? "check" : "ban"}"></i>
            </button>
            <button class="act-del" title="Delete" onclick="adminPage.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>
          </div></td>
        </tr>`).join("");
    });
  },

  async toggleBan(uid, banned) {
    await api.toggleBan(uid, banned);
    toast(banned ? "User banned" : "User unbanned", "success");
  },

  deleteUser(uid) {
    confirmDialog("Delete this user?", async () => {
      await remove(ref(db, `users/${uid}`));
      await remove(ref(db, `admins/${uid}`));
      toast("User deleted", "success");
    });
  },

  /* ─── PUSH NOTIFICATIONS ─── */
  pushNotifications() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-bullhorn"></i> Broadcast Notification</h3></div>
          <div class="form-group"><label>Title</label><input id="bcTitle" placeholder="Flash Sale!" /></div>
          <div class="form-group"><label>Message</label><textarea id="bcBody" placeholder="Get 50% off today..."></textarea></div>
          <button class="btn btn-primary btn-block" id="sendBcBtn"><i class="fa-solid fa-paper-plane"></i> Send to All Users</button>
          <p style="font-size:12px;color:var(--text-3);margin-top:10px;">Total users: <strong id="bcUserCount">0</strong></p>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="fa-solid fa-info-circle"></i> Info</h3></div>
          <p style="color:var(--text-2);line-height:1.8;">
            Push notifications appear in the bell icon of every user's navbar.
            Use this to announce sales, new products, or important updates.
          </p>
        </div>
      </div>
    `;
    api.listenUsers(u => { const el = $("#bcUserCount"); if (el) el.textContent = u.length; });
    $("#sendBcBtn").onclick = async () => {
      const title = $("#bcTitle").value.trim();
      const body = $("#bcBody").value.trim();
      if (!title || !body) { toast("Title and message required", "error"); return; }
      const btn = $("#sendBcBtn"); btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
      try {
        await api.broadcast(title, body);
        toast(`✓ Sent to ${state.users.length} users`, "success");
        $("#bcTitle").value = ""; $("#bcBody").value = "";
      } catch (e) { toast(e.message, "error"); }
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send to All Users`;
    };
  },

  /* ─── BANNERS ─── */
  banners() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-images"></i> Homepage Banners</h3>
          <button class="btn btn-primary" id="addBannerBtn"><i class="fa-solid fa-plus"></i> New Banner</button>
        </div>
        <div class="grid-3" id="bannerGrid"></div>
      </div>
    `;
    $("#addBannerBtn").onclick = () => {
      modal.open(`
        <div style="padding:28px;">
          <h2 style="font-size:20px;font-weight:900;margin-bottom:20px;"><i class="fa-solid fa-image"></i> New Banner</h2>
          <div class="form-group"><label>Title</label><input id="bnTitle" /></div>
          <div class="form-group"><label>Subtitle</label><input id="bnSub" /></div>
          <div class="form-group"><label>Link</label><input id="bnLink" placeholder="/products" /></div>
          <div class="form-group"><label>Image</label><input type="file" id="bnImage" accept="image/*" /></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-outline" onclick="modal.close()" style="flex:1;">Cancel</button>
            <button class="btn btn-primary" id="saveBannerBtn" style="flex:1;">Save</button>
          </div>
        </div>
      `, { size: "sm" });
      $("#saveBannerBtn").onclick = async () => {
        const title = $("#bnTitle").value.trim();
        if (!title) { toast("Title required", "error"); return; }
        await api.addBanner({
          title, subtitle: $("#bnSub").value.trim(),
          link: $("#bnLink").value.trim() || "/products",
          active: true
        }, $("#bnImage").files[0]);
        toast("Banner added", "success");
        modal.close();
      };
    };
    api.listenBanners(banners => {
      const grid = $("#bannerGrid"); if (!grid) return;
      if (!banners.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-image"></i><h3>No banners</h3></div>`; return; }
      grid.innerHTML = banners.map(b => `
        <div class="card" style="margin:0;padding:0;overflow:hidden;">
          <img src="${esc(b.image || 'https://via.placeholder.com/300x150')}" style="width:100%;height:140px;object-fit:cover;" />
          <div style="padding:14px;">
            <h4 style="font-weight:800;font-size:14px;">${esc(b.title)}</h4>
            <p style="font-size:12px;color:var(--text-3);margin-top:4px;">${esc(b.subtitle || "")}</p>
            <button class="btn btn-danger btn-sm" style="margin-top:10px;width:100%;" onclick="adminPage.deleteBanner('${b.id}')">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>`).join("");
    });
  },

  deleteBanner(id) {
    confirmDialog("Delete banner?", async () => {
      await api.deleteBanner(id);
      toast("Banner deleted", "success");
    });
  },

  /* ─── SETTINGS ─── */
  settings() {
    const s = state.siteSettings;
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-sliders"></i> Store Information</h3></div>
        <div class="form-row">
          <div class="form-group"><label>Site Name</label><input id="setName" value="${esc(s.siteName || "EcoShop")}" /></div>
          <div class="form-group"><label>Tagline</label><input id="setTagline" value="${esc(s.tagline || "Professional E-Commerce")}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Contact Email</label><input id="setEmail" value="${esc(s.email || "support@ecoshop.com")}" /></div>
          <div class="form-group"><label>Contact Phone</label><input id="setPhone" value="${esc(s.phone || "+880 1234-567890")}" /></div>
        </div>
        <div class="form-group"><label>Address</label><input id="setAddress" value="${esc(s.address || "ঢাকা, বাংলাদেশ")}" /></div>
        <div class="form-group"><label>Footer Text</label><textarea id="setFooter">${esc(s.footerText || "© 2025 EcoShop Pro. All rights reserved.")}</textarea></div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-truck-fast"></i> Shipping & Tax</h3></div>
        <div class="form-row-3">
          <div class="form-group"><label>Free Shipping Above</label><input type="number" id="setFreeShip" value="${s.freeShippingAbove || 5000}" /></div>
          <div class="form-group"><label>Shipping Fee</label><input type="number" id="setShipFee" value="${s.shippingFee || 80}" /></div>
          <div class="form-group"><label>VAT %</label><input type="number" id="setVAT" value="${s.vat || 5}" /></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-bullhorn"></i> Announcement</h3></div>
        <div class="form-group"><label>Announcement Bar Text</label><input id="setAnnouncement" value="${esc(s.announcement || "")}" placeholder="Leave empty to hide" /></div>
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="saveSiteSettings"><i class="fa-solid fa-save"></i> Save All Settings</button>
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

  /* ─── ACTIVITY LOGS ─── */
  activity() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="card">
        <div class="card-header"><h3><i class="fa-solid fa-clock-rotate-left"></i> Recent Activity</h3></div>
        <div id="activityList"></div>
      </div>
    `;
    api.listenActivityLogs(logs => {
      const list = $("#activityList");
      if (!logs.length) { list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock"></i><h3>No activity yet</h3></div>`; return; }
      list.innerHTML = logs.map(l => `
        <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);">
          <div style="width:38px;height:38px;border-radius:10px;background:var(--brand-grad-soft);color:var(--brand-1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fa-solid ${l.type?.startsWith("order") ? "fa-receipt" : l.type?.startsWith("product") ? "fa-box" : l.type?.startsWith("user") ? "fa-user" : "fa-history"}"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;">${esc(l.message || "")}</div>
            <small style="color:var(--text-3);">${esc(l.userEmail || "")} • ${fmtDate(l.createdAt)}</small>
          </div>
        </div>`).join("");
    });
  },

  /* ─── EXPORT ─── */
  exportData() {
    const c = $("#adminContent");
    c.innerHTML = `
      <div class="grid-3">
        <div class="card" style="text-align:center;">
          <i class="fa-solid fa-box" style="font-size:42px;color:var(--brand-1);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;">Products</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">Download all products as CSV</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportProducts()"><i class="fa-solid fa-download"></i> Export</button>
        </div>
        <div class="card" style="text-align:center;">
          <i class="fa-solid fa-receipt" style="font-size:42px;color:var(--success);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;">Orders</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">Download all orders as CSV</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportOrders()"><i class="fa-solid fa-download"></i> Export</button>
        </div>
        <div class="card" style="text-align:center;">
          <i class="fa-solid fa-users" style="font-size:42px;color:var(--warning);margin-bottom:14px;"></i>
          <h3 style="font-size:16px;font-weight:800;margin-bottom:8px;">Users</h3>
          <p style="color:var(--text-3);font-size:13px;margin-bottom:16px;">Download all users as CSV</p>
          <button class="btn btn-primary btn-block" onclick="adminPage.exportUsers()"><i class="fa-solid fa-download"></i> Export</button>
        </div>
      </div>
    `;
  },

  exportProducts() {
    const rows = [["ID","Name","Name(EN)","Price","Old Price","Category","Stock","Featured","Created"]];
    state.products.forEach(p => rows.push([
      p.id, p.name, p.nameEn, p.price, p.oldPrice, p.category, p.stock,
      p.featured ? "Yes" : "No", new Date(p.createdAt).toISOString()
    ]));
    downloadBlob(rows.map(r => r.map(x => `"${x || ""}"`).join(",")).join("\n"), "products.csv");
    toast("Products exported", "success");
  },
  exportOrders() {
    const rows = [["Order ID","Customer","Phone","Total","Status","Payment","Date"]];
    state.orders.forEach(o => rows.push([
      o.orderId || o.id, o.userName, o.phone, o.total, o.status, o.payment,
      new Date(o.createdAt).toISOString()
    ]));
    downloadBlob(rows.map(r => r.map(x => `"${x || ""}"`).join(",")).join("\n"), "orders.csv");
    toast("Orders exported", "success");
  },
  exportUsers() {
    const rows = [["UID","Name","Email","Phone","Role","Status","Joined"]];
    state.users.forEach(u => rows.push([
      u.uid, u.name, u.email, u.phone, u.role,
      u.banned ? "Banned" : "Active", new Date(u.createdAt).toISOString()
    ]));
    downloadBlob(rows.map(r => r.map(x => `"${x || ""}"`).join(",")).join("\n"), "users.csv");
    toast("Users exported", "success");
  }
};
window.adminPage = adminPage;

/* ═══════════════════════════════════════════════════════════════
   AUTH UI + NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════ */
const authUI = {
  doLogout: async () => {
    await api.logout();
    toast(t("logged_out"), "success");
    setTimeout(() => router.go("home"), 600);
  },
  updateAvatar() {
    const u = state.user; if (!u) return;
    const name = u.displayName || u.email || "User";
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
    $("#userAvatar").src = url;
    $("#adminAvatar").src = url;
    $("#dropdownUserHeader").innerHTML = `
      <h4>${esc(u.displayName || u.email?.split("@")[0] || "User")}</h4>
      <p>${esc(u.email || "")}</p>`;
  }
};
window.authUI = authUI;

function renderNotifications(list) {
  const el = $("#notifList"); if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>${t("no_notifications")}</h3></div>`;
    return;
  }
  el.innerHTML = list.map(n => `
    <div class="notif-item ${n.read ? "" : "unread"}">
      <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
      <div>
        <h5>${esc(n.title || "")}</h5>
        <p>${esc(n.body || "")}</p>
        <small>${fmtDate(n.createdAt)}</small>
      </div>
    </div>`).join("");
}

/* ═══════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════ */
const cmdPalette = {
  commands: [
    { icon:"fa-house", label:"Go to Home", action:() => router.go("home"), group:"Navigation" },
    { icon:"fa-bag-shopping", label:"Browse Products", action:() => router.go("products"), group:"Navigation" },
    { icon:"fa-receipt", label:"My Orders", action:() => router.go("orders"), group:"Navigation" },
    { icon:"fa-heart", label:"Wishlist", action:() => router.go("wishlist"), group:"Navigation" },
    { icon:"fa-user", label:"My Profile", action:() => router.go("profile"), group:"Navigation" },
    { icon:"fa-gear", label:"Settings", action:() => router.go("settings"), group:"Navigation" },
    { icon:"fa-gauge-high", label:"Dashboard", action:() => router.go("dashboard"), group:"Navigation" },
    { icon:"fa-moon", label:"Toggle Dark Mode", action:() => toggleTheme(), group:"Actions" },
    { icon:"fa-globe", label:"Switch Language", action:() => toggleLang(), group:"Actions" },
    { icon:"fa-cart-shopping", label:"Open Cart", action:() => { cart.renderDrawer(); $("#cartDrawer").classList.add("active"); }, group:"Actions" },
  ],
  adminCommands: [
    { icon:"fa-chart-line", label:"Admin Overview", action:() => { router.go("admin"); adminPage.go("overview"); }, group:"Admin" },
    { icon:"fa-box", label:"Manage Products", action:() => { router.go("admin"); adminPage.go("products"); }, group:"Admin" },
    { icon:"fa-receipt", label:"Manage Orders", action:() => { router.go("admin"); adminPage.go("orders"); }, group:"Admin" },
    { icon:"fa-users", label:"Manage Users", action:() => { router.go("admin"); adminPage.go("users"); }, group:"Admin" },
    { icon:"fa-ticket", label:"Manage Coupons", action:() => { router.go("admin"); adminPage.go("coupons"); }, group:"Admin" },
    { icon:"fa-bullhorn", label:"Push Notifications", action:() => { router.go("admin"); adminPage.go("notifications"); }, group:"Admin" },
    { icon:"fa-sliders", label:"Site Settings", action:() => { router.go("admin"); adminPage.go("settings"); }, group:"Admin" },
  ],
  open() {
    $("#cmdOverlay").classList.add("active");
    setTimeout(() => $("#cmdInput").focus(), 100);
    this.render("");
  },
  close() { $("#cmdOverlay").classList.remove("active"); $("#cmdInput").value = ""; },
  render(filter) {
    const all = state.isAdmin ? [...this.commands, ...this.adminCommands] : this.commands;
    const f = filter.toLowerCase().trim();
    const list = f ? all.filter(c => c.label.toLowerCase().includes(f)) : all;
    const groups = {};
    list.forEach(c => { (groups[c.group] = groups[c.group] || []).push(c); });
    const results = $("#cmdResults");
    if (!list.length) { results.innerHTML = `<div class="empty-state" style="padding:30px;"><p>No commands found</p></div>`; return; }
    results.innerHTML = Object.entries(groups).map(([g, cmds]) => `
      <div class="cmd-group-title">${g}</div>
      ${cmds.map((c, i) => `
        <div class="cmd-item" data-idx="${i}" onclick="cmdPalette.run('${c.label}')">
          <i class="fa-solid ${c.icon}"></i>
          <span>${c.label}</span>
        </div>`).join("")}
    `).join("");
  },
  run(label) {
    const all = state.isAdmin ? [...this.commands, ...this.adminCommands] : this.commands;
    const c = all.find(x => x.label === label);
    if (c) { c.action(); this.close(); }
  }
};
window.cmdPalette = cmdPalette;

/* ═══════════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════════ */
function closeSideMenu() {
  $("#sideMenu")?.classList.remove("active");
  $("#overlay")?.classList.remove("active");
}
window.closeSideMenu = closeSideMenu;
function closeCart() { $("#cartDrawer")?.classList.remove("active"); }
window.closeCart = closeCart;

/* ═══════════════════════════════════════════════════════════════
   EVENT BINDINGS
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(); applyLang(); cart.updateBadge(); wishlist.updateBadge();

  // Boot progress
  const bootBar = $(".boot-bar span");
  const bootText = $("#bootText");
  const bootSteps = ["Initializing...", "Connecting to Firebase...", "Loading products...", "Almost ready..."];
  let step = 0;
  const bootInterval = setInterval(() => {
    step++;
    if (bootBar) bootBar.style.width = Math.min(100, step * 25) + "%";
    if (bootText) bootText.textContent = bootSteps[Math.min(step - 1, bootSteps.length - 1)];
  }, 250);

  // Theme & Lang
  $("#themeToggle").onclick = toggleTheme;
  $("#langToggle").onclick = toggleLang;

  // Command palette
  $("#cmdBtn").onclick = () => cmdPalette.open();
  $("#cmdInput").oninput = e => cmdPalette.render(e.target.value);
  $("#cmdOverlay").onclick = e => { if (e.target === $("#cmdOverlay")) cmdPalette.close(); };

  // Side menu
  $("#hamburger").onclick = () => {
    $("#sideMenu").classList.add("active");
    $("#overlay").classList.add("active");
  };
  $("#closeSideMenu").onclick = closeSideMenu;
  $("#overlay").onclick = closeSideMenu;

  // User menu
  $("#userMenuBtn").onclick = e => { e.stopPropagation(); $("#userDropdown").classList.toggle("active"); };
  document.addEventListener("click", e => {
    if (!$("#userMenu")?.contains(e.target)) $("#userDropdown")?.classList.remove("active");
    if (!$("#navSearchWrap")?.contains(e.target)) search.clear();
  });
  $("#logoutBtn").onclick = authUI.doLogout;

  // Cart & notif
  $("#cartBtn").onclick = () => { cart.renderDrawer(); $("#cartDrawer").classList.add("active"); };
  $("#closeCart").onclick = closeCart;
  $("#notifBtn").onclick = async () => {
    $("#notifPanel").classList.add("active");
    if (state.user && state.notifications.length) await api.markAllRead(state.user.uid, state.notifications);
  };
  $("#closeNotif").onclick = () => $("#notifPanel").classList.remove("active");

  // Search
  const si = $("#globalSearchInput");
  si.addEventListener("input", debounce(e => search.suggest(e.target.value.trim()), 200));
  si.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      state.filters.query = e.target.value.trim().toLowerCase();
      search.clear();
      if (router.current !== "products") router.go("products");
      else Pages.applyFilters();
    }
  });
  search.initVoice();
  search.initImage();

  // Back to top
  const btt = $("#backToTop");
  window.addEventListener("scroll", () => {
    btt.classList.toggle("show", window.scrollY > 400);
    $("#navbar")?.classList.toggle("scrolled", window.scrollY > 10);
  });
  btt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { modal.close(); closeCart(); closeSideMenu(); $("#notifPanel")?.classList.remove("active"); cmdPalette.close(); }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); cmdPalette.open(); }
  });

  // Admin sidebar toggle
  $("#adminSidebarToggle").onclick = () => $("#adminSidebar").classList.toggle("open");
  $$(".admin-nav a").forEach(a => {
    a.onclick = () => adminPage.go(a.dataset.admin);
  });

  // Listen site settings
  api.listenSiteSettings(s => {
    if (s.siteName) document.title = s.siteName + " — Professional E-Commerce";
  });

  // Listen categories for filters
  api.listenCategories(() => {});

  /* ─── AUTH LISTENER ─── */
  onAuthStateChanged(auth, async user => {
    state.user = user;
    if (user) {
      state.isAdmin = await api.isAdmin(user.uid);
      state.userProfile = await api.getProfile(user.uid);
      authUI.updateAvatar();
      $("#userMenu").classList.add("show");
      $("#loginBtn").style.display = "none";
      $("#ordersNavLink").style.display = "flex";

      // Admin auto-redirect
      if (state.isAdmin && (router.current === "dashboard" || router.current === "home")) {
        setTimeout(() => router.go("admin"), 100);
      }

      api.listenNotifications(user.uid, list => {
        renderNotifications(list);
        const unread = list.filter(n => !n.read).length;
        const badge = $("#notifBadge");
        badge.textContent = unread;
        badge.classList.toggle("show", unread > 0);
      });
    } else {
      state.isAdmin = false;
      state.userProfile = null;
      router.hideAdmin();
      $("#userMenu").classList.remove("show");
      $("#loginBtn").style.display = "flex";
      $("#ordersNavLink").style.display = "none";
      $("#notifBadge").classList.remove("show");
      renderNotifications([]);
    }
  });

  // Load products globally
  api.listenProducts(() => {
    if (router.current === "products") Pages.applyFilters();
  });

  // Route
  router.go("home");

  // Hide boot
  setTimeout(() => {
    clearInterval(bootInterval);
    if (bootBar) bootBar.style.width = "100%";
    if (bootText) bootText.textContent = "Ready!";
    setTimeout(() => $("#bootLoader").classList.add("hidden"), 300);
  }, 1100);
});

/* ═══════════════════════════════════════════════════════════════
   GLOBAL EXPOSE
   ═══════════════════════════════════════════════════════════════ */
window.cart = cart;
window.wishlist = wishlist;
window.search = search;

console.log("%c🛒 EcoShop PRO", "font-size:26px;font-weight:900;background:linear-gradient(90deg,#6366f1,#ec4899);-webkit-background-clip:text;color:transparent;");
console.log("%cEnterprise E-Commerce Platform Ready ✅", "color:#6366f1;font-weight:700;");
