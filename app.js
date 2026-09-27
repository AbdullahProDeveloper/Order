/* ══════════════════════════════════════════════════════════
   EcoShop Pro MAX — app.js
   Firebase Authentication + Realtime Database ব্যবহার করে
   সম্পূর্ণ লাইভ, মাল্টি-ইউজার ই-কমার্স ব্যাকএন্ড।
   ছবি আপলোড হয় imgbb (https://api.imgbb.com) এর মাধ্যমে।
   ══════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getDatabase, ref, push, set, update, remove, onValue,
  get, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ═══ FIREBASE INIT ═══ */
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
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const rtdb = getDatabase(fbApp);

/* ═══ IMGBB (image hosting) ═══ */
const IMGBB_KEY = "811434d9b77765dbedbb9662b98a0f74";
async function uploadImage(file) {
  if (!file) return "";
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error("ছবি আপলোড ব্যর্থ হয়েছে");
  return data.data.display_url || data.data.url;
}

/* ═══ SHORTHAND HELPERS ═══ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const fmtPrice = (n) => "৳" + Number(n || 0).toLocaleString("en-US");
const fmtDate = (ts) => { if (!ts) return "-"; return new Date(ts).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" }); };
function objToArr(val) { if (!val) return []; return Object.keys(val).map(id => ({ id, ...val[id] })); }

function toast(msg, type = "info") {
  const c = $("#toastContainer"); if (!c) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  const icon = { success: "circle-check", error: "circle-exclamation", warning: "triangle-exclamation", info: "circle-info" }[type];
  el.innerHTML = `<i class="fa-solid fa-${icon}"></i><span>${esc(msg)}</span>`;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(40px)"; setTimeout(() => el.remove(), 250); }, 3200);
}

const modal = {
  open(html, opts = {}) {
    const root = $("#modalRoot");
    root.innerHTML = `<div class="modal-overlay" id="modalOverlay"><div class="modal-box ${opts.size || ""}">${html}</div></div>`;
    $("#modalOverlay").addEventListener("mousedown", (e) => { if (e.target.id === "modalOverlay") modal.close(); });
  },
  close() { $("#modalRoot").innerHTML = ""; }
};

function confirmDialog(msg, onYes) {
  modal.open(`
    <div class="confirm-box">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>${esc(msg)}</p>
      <div class="confirm-actions">
        <button class="btn btn-outline btn-block" id="cdNo">বাতিল</button>
        <button class="btn btn-danger btn-block" id="cdYes">নিশ্চিত</button>
      </div>
    </div>`, { size: "sm" });
  $("#cdNo").onclick = () => modal.close();
  $("#cdYes").onclick = () => { modal.close(); onYes(); };
}

/* ═══ APP STATE ═══ */
const state = {
  products: [], categories: [], orders: [], coupons: [], users: [],
  siteSettings: {}, notifications: [],
  user: null, userProfile: null, isAdmin: false, authReady: false,
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  lang: localStorage.getItem("lang") || "bn",
  themeMode: localStorage.getItem("themeMode") || "light",
  filters: { query: "", category: "all", sort: "new" },
  adminPage: "overview"
};

/* ═══ I18N / THEME ═══ */
const dict = { add_to_cart: { bn: "কার্টে যোগ করুন", en: "Add to Cart" } };
function t(key) { return (dict[key] && dict[key][state.lang]) || key; }
function applyLang() {
  document.documentElement.lang = state.lang;
  $("#currentLangLabel").textContent = state.lang === "bn" ? "বাং" : "EN";
}
function applyTheme() {
  let mode = state.themeMode;
  if (mode === "auto") mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", mode);
  const tt = $("#themeToggle");
  if (tt) tt.innerHTML = `<i class="fa-solid fa-${mode === "dark" ? "sun" : "moon"}"></i>`;
}
function toggleTheme() {
  const order = ["light", "dark", "auto"];
  state.themeMode = order[(order.indexOf(state.themeMode) + 1) % order.length];
  localStorage.setItem("themeMode", state.themeMode);
  applyTheme(); syncSettingsUI();
}
function toggleLang() {
  state.lang = state.lang === "bn" ? "en" : "bn";
  localStorage.setItem("lang", state.lang);
  applyLang(); router.render();
}
function syncSettingsUI() {
  $$("#pmLangSeg button").forEach(b => b.classList.toggle("active", b.dataset.lang === state.lang));
  $$("#pmThemeSeg button").forEach(b => b.classList.toggle("active", b.dataset.theme === state.themeMode));
}

/* ═══ API LAYER (Firebase Auth + Realtime Database) ═══ */
const api = {
  /* ---- auth ---- */
  async signup({ name, email, password, phone }) {
    email = (email || "").trim().toLowerCase();
    if (!email || !password) throw new Error("ইমেইল ও পাসওয়ার্ড আবশ্যক");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    // প্রথম যে ব্যবহারকারী সাইনআপ করবে সে স্বয়ংক্রিয়ভাবে এডমিন হবে
    const bootstrapSnap = await get(ref(rtdb, "meta/adminAssigned"));
    const role = bootstrapSnap.exists() ? "user" : "admin";
    if (!bootstrapSnap.exists()) await set(ref(rtdb, "meta/adminAssigned"), true);
    await set(ref(rtdb, `users/${cred.user.uid}`), {
      name: name || "User", email, phone: phone || "", role, banned: false, createdAt: Date.now()
    });
  },
  async login(email, password) {
    email = (email || "").trim().toLowerCase();
    await signInWithEmailAndPassword(auth, email, password);
  },
  async logout() { await signOut(auth); },
  async getProfile(uid) {
    const snap = await get(ref(rtdb, `users/${uid}`));
    return snap.exists() ? snap.val() : {};
  },
  async updateProfile(uid, data) { await update(ref(rtdb, `users/${uid}`), data); },

  /* ---- products ---- */
  async addProduct(data, file) {
    if (!data.name || !data.price) throw new Error("পণ্যের নাম ও দাম আবশ্যক");
    const image = file ? await uploadImage(file) : "";
    const newRef = push(ref(rtdb, "products"));
    await set(newRef, { ...data, image, createdAt: Date.now() });
  },
  async updateProduct(id, data, file) {
    if (file) data.image = await uploadImage(file);
    await update(ref(rtdb, `products/${id}`), data);
  },
  async deleteProduct(id) { await remove(ref(rtdb, `products/${id}`)); },
  listenProducts(cb) {
    onValue(ref(rtdb, "products"), (snap) => { state.products = objToArr(snap.val()); cb(state.products); });
  },

  /* ---- categories ---- */
  async addCategory(name) {
    const exists = state.categories.find(c => c.name === name);
    if (exists) throw new Error("এই ক্যাটাগরি আছে");
    await set(push(ref(rtdb, "categories")), { name });
  },
  async deleteCategory(id) { await remove(ref(rtdb, `categories/${id}`)); },
  listenCategories(cb) {
    onValue(ref(rtdb, "categories"), (snap) => { state.categories = objToArr(snap.val()); cb(state.categories); });
  },

  /* ---- coupons ---- */
  async addCoupon(c) { await set(push(ref(rtdb, "coupons")), c); },
  async deleteCoupon(id) { await remove(ref(rtdb, `coupons/${id}`)); },
  listenCoupons(cb) {
    onValue(ref(rtdb, "coupons"), (snap) => { state.coupons = objToArr(snap.val()); cb(state.coupons); });
  },

  /* ---- orders ---- */
  async placeOrder(order) {
    const newRef = push(ref(rtdb, "orders"));
    const o = { orderId: newRef.key, status: "pending", createdAt: Date.now(), ...order };
    await set(newRef, o);
    return { id: newRef.key, ...o };
  },
  async updateOrderStatus(orderId, status, userId) {
    await update(ref(rtdb, `orders/${orderId}`), { status });
    if (userId) {
      await set(push(ref(rtdb, "notifications")), {
        userId, title: "অর্ডার আপডেট", body: `আপনার অর্ডারের স্ট্যাটাস: ${status}`, read: false, createdAt: Date.now()
      });
    }
  },
  listenUserOrders(uid, cb) {
    const q = query(ref(rtdb, "orders"), orderByChild("userId"), equalTo(uid));
    onValue(q, (snap) => { cb(objToArr(snap.val()).sort((a, b) => b.createdAt - a.createdAt)); });
  },
  listenAllOrders(cb) {
    onValue(ref(rtdb, "orders"), (snap) => {
      state.orders = objToArr(snap.val()).sort((a, b) => b.createdAt - a.createdAt);
      cb(state.orders);
    });
  },

  /* ---- users ---- */
  listenUsers(cb) {
    onValue(ref(rtdb, "users"), (snap) => { state.users = objToArr(snap.val()); cb(state.users); });
  },
  async toggleBan(uid, banned) { await update(ref(rtdb, `users/${uid}`), { banned }); },

  /* ---- settings ---- */
  listenSiteSettings(cb) {
    onValue(ref(rtdb, "siteSettings"), (snap) => { state.siteSettings = snap.val() || {}; cb(state.siteSettings); });
  },
  async saveSiteSettings(data) { await update(ref(rtdb, "siteSettings"), data); },

  /* ---- notifications ---- */
  listenNotifications(uid, cb) {
    const q = query(ref(rtdb, "notifications"), orderByChild("userId"), equalTo(uid));
    onValue(q, (snap) => { cb(objToArr(snap.val()).sort((a, b) => b.createdAt - a.createdAt)); });
  }
};
window.api = api;

/* ═══ CART ═══ */
const cart = {
  add(p) {
    const existing = state.cart.find(c => c.id === p.id);
    if (existing) existing.qty += 1;
    else state.cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
    this.save(); this.updateBadge(); this.renderDrawer();
    toast(`"${p.name}" কার্টে যোগ হয়েছে`, "success");
  },
  remove(id) { state.cart = state.cart.filter(c => c.id !== id); this.save(); this.updateBadge(); this.renderDrawer(); },
  setQty(id, qty) {
    const c = state.cart.find(x => x.id === id); if (!c) return;
    c.qty = Math.max(1, qty);
    this.save(); this.updateBadge(); this.renderDrawer();
  },
  clear() { state.cart = []; this.save(); this.updateBadge(); this.renderDrawer(); },
  total() { return state.cart.reduce((s, c) => s + c.price * c.qty, 0); },
  save() { localStorage.setItem("cart", JSON.stringify(state.cart)); },
  updateBadge() {
    const n = state.cart.reduce((s, c) => s + c.qty, 0);
    const b = $("#cartBadge"); if (b) b.textContent = n;
  },
  renderDrawer() {
    const body = $("#cartDrawerBody"), foot = $("#cartDrawerFoot"), sub = $("#cartSubtitle");
    if (!body) return;
    if (sub) sub.textContent = `${state.cart.length} টি পণ্য`;
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>কার্ট খালি</h3></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = state.cart.map(c => `
      <div class="cart-item">
        <img src="${esc(c.image || 'https://placehold.co/100x100?text=%20')}" />
        <div class="cart-item-info">
          <h5>${esc(c.name)}</h5>
          <span class="price">${fmtPrice(c.price)}</span>
          <div class="qty-ctrl">
            <button data-qty-dec="${c.id}">−</button>
            <span>${c.qty}</span>
            <button data-qty-inc="${c.id}">+</button>
            <button data-cart-remove="${c.id}" style="margin-left:auto;color:var(--danger);border:none;background:none;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>`).join("");
    foot.innerHTML = `
      <div class="cart-summary-row total"><span>মোট</span><span>${fmtPrice(this.total())}</span></div>
      <button class="btn btn-primary btn-block btn-lg" id="checkoutBtn" style="margin-top:12px;"><i class="fa-solid fa-bag-shopping"></i> চেকআউট করুন</button>`;
    $("#checkoutBtn").onclick = () => { closeAllPanels(); router.go("checkout"); };
  }
};
window.cart = cart;

/* ═══ WISHLIST ═══ */
const wishlist = {
  has(id) { return state.wishlist.some(p => p.id === id); },
  toggle(p) {
    if (this.has(p.id)) state.wishlist = state.wishlist.filter(x => x.id !== p.id);
    else state.wishlist.push(p);
    this.save(); this.updateBadge();
  },
  save() { localStorage.setItem("wishlist", JSON.stringify(state.wishlist)); },
  updateBadge() {
    const n = state.wishlist.length;
    const a = $("#wishlistBadge"), b = $("#bnWishlistBadge"), c = $("#pmWishBadge");
    if (a) a.textContent = n; if (b) b.textContent = n; if (c) c.textContent = n;
  }
};
window.wishlist = wishlist;

/* ═══ POWER MENU ═══ */
function openPowerMenu() {
  $("#powerMenu")?.classList.add("active");
  $("#backdrop")?.classList.add("active");
  document.body.style.overflow = "hidden";
  updatePowerMenuUI();
}
function closePowerMenu() {
  $("#powerMenu")?.classList.remove("active");
  if (!isAnyPanelOpen()) { $("#backdrop")?.classList.remove("active"); document.body.style.overflow = ""; }
}
function isAnyPanelOpen() {
  return $("#cartDrawer")?.classList.contains("active") || $("#notifPanel")?.classList.contains("active") || $("#powerMenu")?.classList.contains("active") || $("#adminSidebar")?.classList.contains("active");
}
function closeAllPanels() {
  ["#powerMenu", "#cartDrawer", "#notifPanel"].forEach(sel => $(sel)?.classList.remove("active"));
  $("#backdrop")?.classList.remove("active");
  document.body.style.overflow = "";
}
window.openPowerMenu = openPowerMenu;
window.closePowerMenu = closePowerMenu;

function updatePowerMenuUI() {
  if (!state.user) {
    $("#pmName").textContent = "Guest User";
    $("#pmEmail").textContent = "লগইন করুন";
    $("#pmRoleBadge").textContent = "GUEST";
    $("#pmLoginBtn").style.display = "flex";
    $("#pmLogoutBtn").style.display = "none";
    $("#pmAdminBtn").style.display = "none";
    $("#pmAvatar").src = "https://ui-avatars.com/api/?name=G&background=6366f1&color=fff&size=120";
  } else {
    $("#pmName").textContent = state.user.displayName || "User";
    $("#pmEmail").textContent = state.user.email;
    $("#pmRoleBadge").textContent = state.isAdmin ? "ADMIN" : "USER";
    $("#pmAvatar").src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.displayName || "U")}&background=6366f1&color=fff&size=120`;
    $("#pmLoginBtn").style.display = "none";
    $("#pmLogoutBtn").style.display = "flex";
    $("#pmAdminBtn").style.display = state.isAdmin ? "flex" : "none";
  }
  const wc = $("#pmWishBadge"); if (wc) wc.textContent = state.wishlist.length;
}

/* ═══ ROUTER ═══ */
const router = {
  current: "home",
  go(page) {
    this.current = page;
    location.hash = page;
    this.render();
    window.scrollTo({ top: 0 });
  },
  showAdminOrUserDash() {
    if (this.current === "auth") this.go(state.isAdmin ? "admin" : "dashboard");
    else this.render();
  },
  render() {
    const isAdminPage = this.current === "admin" && state.isAdmin;
    $("#adminLayout").style.display = isAdminPage ? "flex" : "none";
    $("#app").style.display = isAdminPage ? "none" : "block";
    $("#publicNavbar").style.display = isAdminPage ? "none" : "";
    $("#bottomNav").style.display = isAdminPage ? "none" : "";
    $("#publicFooter").style.display = isAdminPage ? "none" : "";

    $$("[data-page]").forEach(a => a.classList.toggle("active", a.dataset.page === this.current));
    $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === this.current));

    if (isAdminPage) { adminPage.render(); return; }
    if (this.current === "admin" && !state.isAdmin) { toast("অ্যাক্সেস নেই", "error"); this.current = "home"; }

    const page = Pages[this.current] || Pages.home;
    page($("#app"));
  }
};
window.router = router;

/* ═══ PAGES ═══ */
const Pages = {
  home(el) {
    const featured = state.products.filter(p => p.featured).slice(0, 8);
    const list = featured.length ? featured : state.products.slice(0, 8);
    el.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <span class="hero-badge"><i class="fa-solid fa-bolt"></i> নতুন কালেকশন ২০২৬</span>
            <h1 class="hero-title">আপনার প্রয়োজনীয় সবকিছু <span class="grad">এক জায়গায়</span></h1>
            <p class="hero-sub">${esc(state.siteSettings.tagline || "প্রফেশনাল, নিরাপদ এবং দ্রুত ই-কমার্স প্ল্যাটফর্ম — সেরা দামে, নির্ভরযোগ্য সার্ভিসে।")}</p>
            <div class="hero-btns"><button class="btn btn-primary btn-lg" data-go="products"><i class="fa-solid fa-bag-shopping"></i> কেনাকাটা শুরু করুন</button></div>
          </div>
        </div>
      </section>
      <section class="page">
        <div class="section-head">
          <h2><i class="fa-solid fa-star"></i> ফিচার্ড পণ্য</h2>
          <button class="btn btn-outline btn-sm" data-go="products">সব দেখুন</button>
        </div>
        <div class="product-grid" id="featuredGrid">${list.length ? list.map(p => productCard(p)).join("") : emptyProducts()}</div>
      </section>`;
  },

  products(el) {
    el.innerHTML = `
      <section class="page">
        <div class="section-head">
          <h2><i class="fa-solid fa-bag-shopping"></i> সকল পণ্য</h2>
          <span class="count-chip">${state.products.length} টি</span>
        </div>
        <div class="filters-bar">
          <select id="filterCategory">
            <option value="all">সব ক্যাটাগরি</option>
            ${state.categories.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("")}
          </select>
          <select id="filterSort">
            <option value="new">নতুন আগে</option>
            <option value="price_low">দাম: কম → বেশি</option>
            <option value="price_high">দাম: বেশি → কম</option>
          </select>
        </div>
        <div class="product-grid" id="productsGrid"></div>
      </section>`;
    $("#filterCategory").value = state.filters.category;
    $("#filterSort").value = state.filters.sort;
    $("#filterCategory").onchange = (e) => { state.filters.category = e.target.value; filterProducts(); };
    $("#filterSort").onchange = (e) => { state.filters.sort = e.target.value; filterProducts(); };
    filterProducts();
  },

  auth(el) {
    if (state.user) { router.go("dashboard"); return; }
    el.innerHTML = `
      <section class="auth-page">
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="active" data-tab="login">লগইন</button>
            <button data-tab="signup">সাইনআপ</button>
          </div>
          <form id="authForm" class="auth-form">
            <div class="form-group signup-only" style="display:none;"><label>পূর্ণ নাম</label><input type="text" id="authName" placeholder="আপনার নাম" /></div>
            <div class="form-group signup-only" style="display:none;"><label>ফোন</label><input type="tel" id="authPhone" placeholder="01XXXXXXXXX" /></div>
            <div class="form-group"><label>ইমেইল</label><input type="email" id="authEmail" placeholder="you@example.com" required /></div>
            <div class="form-group"><label>পাসওয়ার্ড</label><input type="password" id="authPassword" placeholder="••••••••" required minlength="6" /></div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit"><i class="fa-solid fa-right-to-bracket"></i> লগইন</button>
          </form>
        </div>
      </section>`;
    let mode = "login";
    $$(".auth-tabs button").forEach(b => b.onclick = () => {
      mode = b.dataset.tab;
      $$(".auth-tabs button").forEach(x => x.classList.toggle("active", x === b));
      $$(".signup-only").forEach(x => x.style.display = mode === "signup" ? "block" : "none");
      $("#authSubmit").innerHTML = mode === "signup" ? '<i class="fa-solid fa-user-plus"></i> সাইনআপ' : '<i class="fa-solid fa-right-to-bracket"></i> লগইন';
    });
    $("#authForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = $("#authSubmit"); btn.disabled = true;
      try {
        const email = $("#authEmail").value.trim();
        const password = $("#authPassword").value;
        if (mode === "signup") {
          await api.signup({ name: $("#authName").value.trim(), email, password, phone: $("#authPhone").value.trim() });
          toast("অ্যাকাউন্ট তৈরি হয়েছে!", "success");
        } else {
          await api.login(email, password);
          toast("লগইন সফল", "success");
        }
      } catch (err) { toast(friendlyAuthError(err), "error"); }
      finally { btn.disabled = false; }
    };
  },

  dashboard(el) {
    if (!state.user) { router.go("auth"); return; }
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-gauge"></i> ড্যাশবোর্ড</h2></div>
        <div class="dash-grid">
          <div class="dash-card"><i class="fa-solid fa-circle-user"></i><h3>${esc(state.user.displayName || "User")}</h3><p>${esc(state.user.email)}</p></div>
          <div class="dash-card clickable" data-go="orders"><i class="fa-solid fa-receipt"></i><h3>আমার অর্ডার</h3><p>সকল অর্ডার দেখুন</p></div>
          <div class="dash-card clickable" data-go="wishlist"><i class="fa-solid fa-heart"></i><h3>উইশলিস্ট</h3><p>${state.wishlist.length} টি পণ্য</p></div>
          ${state.isAdmin ? `<div class="dash-card clickable" data-go="admin"><i class="fa-solid fa-shield-halved"></i><h3>এডমিন প্যানেল</h3><p>ম্যানেজ করুন</p></div>` : ""}
        </div>
        <div class="section-head"><h2>সাম্প্রতিক অর্ডার</h2></div>
        <div id="userOrdersList" class="orders-list"><p class="muted">লোড হচ্ছে...</p></div>
      </section>`;
    api.listenUserOrders(state.user.uid, (orders) => {
      const c = $("#userOrdersList"); if (!c) return;
      c.innerHTML = orders.length ? orders.slice(0, 5).map(o => orderRow(o)).join("") : `<p class="muted">কোনো অর্ডার নেই</p>`;
    });
  },

  profile(el) {
    if (!state.user) { router.go("auth"); return; }
    const p = state.userProfile || {};
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-user"></i> প্রোফাইল</h2></div>
        <div class="form-card">
          <div class="form-group"><label>নাম</label><input id="pfName" value="${esc(p.name || state.user.displayName || "")}" /></div>
          <div class="form-group"><label>ইমেইল</label><input id="pfEmail" value="${esc(state.user.email)}" disabled /></div>
          <div class="form-group"><label>ফোন</label><input id="pfPhone" value="${esc(p.phone || "")}" placeholder="01XXXXXXXXX" /></div>
          <div class="form-group"><label>ঠিকানা</label><textarea id="pfAddress" rows="3">${esc(p.address || "")}</textarea></div>
          <button class="btn btn-primary" id="pfSave"><i class="fa-solid fa-check"></i> সেভ করুন</button>
        </div>
      </section>`;
    $("#pfSave").onclick = async () => {
      try {
        await api.updateProfile(state.user.uid, { name: $("#pfName").value.trim(), phone: $("#pfPhone").value.trim(), address: $("#pfAddress").value.trim() });
        state.userProfile = await api.getProfile(state.user.uid);
        toast("প্রোফাইল আপডেট হয়েছে", "success");
      } catch (e) { toast(e.message, "error"); }
    };
  },

  orders(el) {
    if (!state.user) { router.go("auth"); return; }
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-receipt"></i> আমার অর্ডার</h2></div>
        <div id="ordersList" class="orders-list"><p class="muted">লোড হচ্ছে...</p></div>
      </section>`;
    api.listenUserOrders(state.user.uid, (orders) => {
      const c = $("#ordersList"); if (!c) return;
      c.innerHTML = orders.length ? orders.map(o => orderRow(o)).join("") : `<p class="muted">কোনো অর্ডার নেই</p>`;
    });
  },

  wishlist(el) {
    if (!state.wishlist.length) {
      el.innerHTML = `<section class="page"><div class="empty-state"><i class="fa-solid fa-heart"></i><h3>উইশলিস্ট খালি</h3><button class="btn btn-primary" data-go="products">পণ্য দেখুন</button></div></section>`;
      return;
    }
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-heart"></i> উইশলিস্ট</h2></div>
        <div class="product-grid">${state.wishlist.map(p => productCard(p)).join("")}</div>
      </section>`;
  },

  checkout(el) {
    if (!state.user) { router.go("auth"); return; }
    if (!state.cart.length) { el.innerHTML = `<section class="page"><div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>কার্ট খালি</h3><button class="btn btn-primary" data-go="products">কেনাকাটা করুন</button></div></section>`; return; }
    const p = state.userProfile || {};
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-bag-shopping"></i> চেকআউট</h2></div>
        <div class="form-card">
          <div class="form-group"><label>নাম</label><input id="coName" value="${esc(p.name || state.user.displayName || "")}" required /></div>
          <div class="form-group"><label>ফোন</label><input id="coPhone" value="${esc(p.phone || "")}" required /></div>
          <div class="form-group"><label>ঠিকানা</label><textarea id="coAddress" rows="3" required>${esc(p.address || "")}</textarea></div>
          <div class="cart-summary-row total"><span>সর্বমোট</span><span>${fmtPrice(cart.total())}</span></div>
          <button class="btn btn-primary btn-block btn-lg" id="placeOrderBtn" style="margin-top:14px;"><i class="fa-solid fa-check"></i> অর্ডার নিশ্চিত করুন</button>
        </div>
      </section>`;
    $("#placeOrderBtn").onclick = async () => {
      const name = $("#coName").value.trim(), phone = $("#coPhone").value.trim(), address = $("#coAddress").value.trim();
      if (!name || !phone || !address) { toast("সব তথ্য পূরণ করুন", "error"); return; }
      const btn = $("#placeOrderBtn"); btn.disabled = true;
      try {
        await api.placeOrder({ userId: state.user.uid, userName: name, phone, address, items: state.cart, total: cart.total() });
        cart.clear();
        toast("অর্ডার সম্পন্ন হয়েছে!", "success");
        router.go("orders");
      } catch (e) { toast(e.message, "error"); btn.disabled = false; }
    };
  },

  settings(el) {
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="fa-solid fa-gear"></i> সেটিংস</h2></div>
        <div class="form-card">
          <div class="pm-row">
            <div class="pm-row-label"><i class="fa-solid fa-language"></i><span>ভাষা</span></div>
            <div class="pm-seg" id="setLang">
              <button data-lang="bn" class="${state.lang === 'bn' ? 'active' : ''}">বাংলা</button>
              <button data-lang="en" class="${state.lang === 'en' ? 'active' : ''}">English</button>
            </div>
          </div>
          <div class="pm-row">
            <div class="pm-row-label"><i class="fa-solid fa-moon"></i><span>থিম</span></div>
            <div class="pm-seg" id="setTheme">
              <button data-theme="light" class="${state.themeMode === 'light' ? 'active' : ''}">☀️</button>
              <button data-theme="dark" class="${state.themeMode === 'dark' ? 'active' : ''}">🌙</button>
              <button data-theme="auto" class="${state.themeMode === 'auto' ? 'active' : ''}">A</button>
            </div>
          </div>
        </div>
      </section>`;
    $$("#setLang button").forEach(b => b.onclick = () => { state.lang = b.dataset.lang; localStorage.setItem("lang", state.lang); applyLang(); router.render(); });
    $$("#setTheme button").forEach(b => b.onclick = () => { state.themeMode = b.dataset.theme; localStorage.setItem("themeMode", state.themeMode); applyTheme(); router.render(); });
  }
};

function friendlyAuthError(err) {
  const code = err?.code || "";
  const map = {
    "auth/email-already-in-use": "এই ইমেইল দিয়ে অ্যাকাউন্ট আছে",
    "auth/invalid-email": "সঠিক ইমেইল দিন",
    "auth/weak-password": "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
    "auth/invalid-credential": "ইমেইল বা পাসওয়ার্ড ভুল",
    "auth/wrong-password": "ইমেইল বা পাসওয়ার্ড ভুল",
    "auth/user-not-found": "ইমেইল বা পাসওয়ার্ড ভুল",
    "auth/too-many-requests": "অনেকবার চেষ্টা করা হয়েছে, একটু পর আবার চেষ্টা করুন"
  };
  return map[code] || err.message.replace("Firebase:", "").trim();
}

function productCard(p) {
  const inWish = wishlist.has(p.id);
  const safe = esc(JSON.stringify(p));
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${esc(p.image || 'https://placehold.co/400x400?text=No+Image')}" alt="${esc(p.name)}" loading="lazy" />
        ${p.featured ? '<span class="product-badge">ফিচার্ড</span>' : ''}
        <button class="wish-btn ${inWish ? 'active' : ''}" data-wish='${safe}'><i class="fa-${inWish ? 'solid' : 'regular'} fa-heart"></i></button>
      </div>
      <div class="product-body">
        <span class="product-cat">${esc(p.category || 'Other')}</span>
        <h3 class="product-name">${esc(state.lang === 'bn' ? p.name : (p.nameEn || p.name))}</h3>
        <div class="product-price">
          <span class="price">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${fmtPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button class="btn btn-primary btn-block" data-cart-add='${safe}'><i class="fa-solid fa-cart-plus"></i> ${t('add_to_cart')}</button>
      </div>
    </div>`;
}
function emptyProducts() {
  return `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-box-open"></i><h3>কোনো পণ্য নেই</h3><p>এডমিন প্যানেল থেকে পণ্য যোগ করুন</p></div>`;
}
function orderRow(o) {
  const statusMap = { pending: "অপেক্ষমাণ", confirmed: "কনফার্মড", shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল" };
  return `
    <div class="order-row">
      <div class="order-info"><h4>#${(o.orderId || o.id).slice(-6)}</h4><p>${fmtDate(o.createdAt)} · ${o.items?.length || 0} টি পণ্য</p></div>
      <div class="order-right"><span class="status-badge status-${o.status}">${statusMap[o.status] || o.status}</span><strong>${fmtPrice(o.total)}</strong></div>
    </div>`;
}
function filterProducts() {
  let list = [...state.products];
  if (state.filters.category !== "all") list = list.filter(p => p.category === state.filters.category);
  if (state.filters.query) { const q = state.filters.query.toLowerCase(); list = list.filter(p => (p.name || "").toLowerCase().includes(q)); }
  if (state.filters.sort === "price_low") list.sort((a, b) => a.price - b.price);
  else if (state.filters.sort === "price_high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const grid = $("#productsGrid");
  if (grid) grid.innerHTML = list.length ? list.map(p => productCard(p)).join("") : emptyProducts();
}

/* ═══ ADMIN PAGE ═══ */
const adminPage = {
  render() {
    const title = $("#adminPageTitle"), sub = $("#adminPageSubtitle"), c = $("#adminContent");
    if (!c) return;
    $$(".admin-nav a[data-admin]").forEach(a => a.classList.toggle("active", a.dataset.admin === state.adminPage));
    const map = {
      overview: { title: "ওভারভিউ", sub: "সারসংক্ষেপ দেখুন", fn: this.overview.bind(this) },
      products: { title: "পণ্য", sub: "পণ্য ম্যানেজ করুন", fn: this.products.bind(this) },
      orders: { title: "অর্ডার", sub: "অর্ডার ম্যানেজ করুন", fn: this.orders.bind(this) },
      users: { title: "ইউজার", sub: "ইউজার দেখুন", fn: this.users.bind(this) },
      categories: { title: "ক্যাটাগরি", sub: "ক্যাটাগরি ম্যানেজ", fn: this.categories.bind(this) },
      coupons: { title: "কুপন", sub: "ডিসকাউন্ট কোড", fn: this.coupons.bind(this) },
      settings: { title: "সেটিংস", sub: "সাইট কনফিগার", fn: this.settings.bind(this) }
    };
    const pg = map[state.adminPage] || map.overview;
    title.textContent = pg.title; sub.textContent = pg.sub;
    c.innerHTML = ""; pg.fn(c);
  },

  overview(c) {
    const totalRev = state.orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);
    c.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-box"></i></div><div><p>মোট পণ্য</p><h3>${state.products.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-receipt"></i></div><div><p>মোট অর্ডার</p><h3>${state.orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div><p>মোট ইউজার</p><h3>${state.users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-sack-dollar"></i></div><div><p>মোট আয়</p><h3>${fmtPrice(totalRev)}</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>সাম্প্রতিক অর্ডার</h3></div>
        <div class="orders-list">${state.orders.slice(0, 8).map(o => orderRow(o)).join("") || '<p class="muted">কোনো অর্ডার নেই</p>'}</div>
      </div>`;
  },

  products(c) {
    c.innerHTML = `
      <div class="admin-toolbar"><button class="btn btn-primary" id="addProductBtn"><i class="fa-solid fa-plus"></i> নতুন পণ্য</button></div>
      <div class="admin-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>ছবি</th><th>নাম</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
              ${state.products.map(p => `
                <tr>
                  <td><img src="${esc(p.image || 'https://placehold.co/50x50?text=%20')}" class="thumb" /></td>
                  <td><strong>${esc(p.name)}</strong></td>
                  <td>${esc(p.category || '-')}</td>
                  <td>${fmtPrice(p.price)}</td>
                  <td>${p.stock || 0}</td>
                  <td class="actions">
                    <button class="icon-btn-sm" data-edit-product="${p.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn-sm danger" data-delete-product="${p.id}"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`).join("") || '<tr><td colspan="6" class="muted">কোনো পণ্য নেই</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
    $("#addProductBtn").onclick = () => this.openProductForm();
    $$("[data-edit-product]").forEach(b => b.onclick = () => this.editProduct(b.dataset.editProduct));
    $$("[data-delete-product]").forEach(b => b.onclick = () => this.confirmDelete(b.dataset.deleteProduct));
  },

  openProductForm(product = null) {
    const isEdit = !!product;
    const p = product || {};
    modal.open(`
      <button class="modal-close" id="pfClose"><i class="fa-solid fa-xmark"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:18px;">${isEdit ? 'পণ্য এডিট' : 'নতুন পণ্য'}</h2>
        <form id="productForm">
          <div class="form-group"><label>পণ্যের নাম *</label><input id="pName" value="${esc(p.name || '')}" required /></div>
          <div class="form-group"><label>নাম (English)</label><input id="pNameEn" value="${esc(p.nameEn || '')}" /></div>
          <div class="form-row">
            <div class="form-group"><label>দাম *</label><input type="number" id="pPrice" value="${p.price || ''}" required min="0" step="0.01" /></div>
            <div class="form-group"><label>আগের দাম</label><input type="number" id="pOldPrice" value="${p.oldPrice || ''}" min="0" step="0.01" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>ক্যাটাগরি</label>
              <select id="pCategory">
                <option value="">-- নির্বাচন --</option>
                ${state.categories.map(c => `<option value="${esc(c.name)}" ${p.category === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join("")}
              </select>
            </div>
            <div class="form-group"><label>স্টক</label><input type="number" id="pStock" value="${p.stock || 0}" min="0" /></div>
          </div>
          <div class="form-group"><label>বিবরণ</label><textarea id="pDesc" rows="3">${esc(p.description || '')}</textarea></div>
          <div class="form-group"><label>ছবি ${isEdit && p.image ? '(নতুন ছবি না দিলে আগেরটাই থাকবে)' : ''}</label><input type="file" id="pImage" accept="image/*" /></div>
          <div class="form-group"><label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="pFeatured" style="width:auto;" ${p.featured ? 'checked' : ''} /> ফিচার্ড পণ্য</label></div>
          <div style="display:flex;gap:10px;margin-top:18px;">
            <button type="button" class="btn btn-outline" id="pfCancel" style="flex:1;">বাতিল</button>
            <button type="submit" class="btn btn-primary" id="pSaveBtn" style="flex:1;"><i class="fa-solid fa-check"></i> ${isEdit ? 'আপডেট' : 'যোগ করুন'}</button>
          </div>
        </form>
      </div>`, { size: "md" });
    $("#pfClose").onclick = () => modal.close();
    $("#pfCancel").onclick = () => modal.close();
    $("#productForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = $("#pSaveBtn");
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> সেভ হচ্ছে...';
      try {
        const name = $("#pName").value.trim();
        const price = Number($("#pPrice").value);
        if (!name || !price) throw new Error("পণ্যের নাম ও দাম আবশ্যক");
        const data = {
          name, nameEn: $("#pNameEn").value.trim() || name,
          price, oldPrice: Number($("#pOldPrice").value) || 0,
          category: $("#pCategory").value || "Other",
          stock: Number($("#pStock").value) || 0,
          description: $("#pDesc").value.trim(),
          featured: $("#pFeatured").checked
        };
        const file = $("#pImage").files[0];
        if (isEdit) { await api.updateProduct(product.id, data, file); toast("পণ্য আপডেট হয়েছে", "success"); }
        else { await api.addProduct(data, file); toast("পণ্য যোগ হয়েছে", "success"); }
        modal.close();
      } catch (err) {
        toast("সমস্যা: " + err.message, "error");
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${isEdit ? 'আপডেট' : 'যোগ করুন'}`;
      }
    };
  },

  editProduct(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) { toast("পণ্য পাওয়া যায়নি", "error"); return; }
    this.openProductForm(p);
  },
  confirmDelete(id) {
    const p = state.products.find(x => x.id === id);
    confirmDialog(`"${p?.name}" মুছে ফেলবেন?`, async () => {
      try { await api.deleteProduct(id); toast("মুছে ফেলা হয়েছে", "success"); }
      catch (e) { toast(e.message, "error"); }
    });
  },

  orders(c) {
    c.innerHTML = `
      <div class="admin-card">
        <div class="orders-list">
          ${state.orders.map(o => `
            <div class="order-row admin-order-row">
              <div class="order-info"><h4>#${(o.orderId || o.id).slice(-6)}</h4><p>${esc(o.userName || 'User')} · ${fmtDate(o.createdAt)}</p><p>${o.items?.length || 0} টি পণ্য · ${fmtPrice(o.total)}</p></div>
              <div class="order-right">
                <select data-status-select="${o.id}" data-status-user="${o.userId || ''}">
                  ${['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join("")}
                </select>
              </div>
            </div>`).join("") || '<p class="muted">কোনো অর্ডার নেই</p>'}
        </div>
      </div>`;
    $$("[data-status-select]").forEach(sel => sel.onchange = () => this.changeStatus(sel.dataset.statusSelect, sel.value, sel.dataset.statusUser));
  },
  async changeStatus(orderId, status, userId) {
    try { await api.updateOrderStatus(orderId, status, userId); toast("স্ট্যাটাস আপডেট", "success"); }
    catch (e) { toast(e.message, "error"); }
  },

  users(c) {
    c.innerHTML = `
      <div class="admin-card">
        <table class="admin-table">
          <thead><tr><th>নাম</th><th>ইমেইল</th><th>রোল</th><th>অ্যাকশন</th></tr></thead>
          <tbody>
            ${state.users.map(u => `
              <tr>
                <td>${esc(u.name || '-')}</td><td>${esc(u.email || '-')}</td><td><span class="chip">${esc(u.role || 'user')}</span></td>
                <td><button class="btn btn-sm ${u.banned ? 'btn-success' : 'btn-danger'}" data-toggle-ban="${u.id}" data-banned="${!u.banned}">${u.banned ? 'আনব্যান' : 'ব্যান'}</button></td>
              </tr>`).join("") || '<tr><td colspan="4" class="muted">কোনো ইউজার নেই</td></tr>'}
          </tbody>
        </table>
      </div>`;
    $$("[data-toggle-ban]").forEach(b => b.onclick = () => this.toggleBan(b.dataset.toggleBan, b.dataset.banned === "true"));
  },
  async toggleBan(uid, banned) { await api.toggleBan(uid, banned); toast(banned ? "ব্যান হয়েছে" : "আনব্যান হয়েছে", "success"); },

  categories(c) {
    c.innerHTML = `
      <div class="admin-toolbar">
        <input id="newCatName" placeholder="ক্যাটাগরির নাম" />
        <button class="btn btn-primary" id="addCatBtn"><i class="fa-solid fa-plus"></i> যোগ করুন</button>
      </div>
      <div class="admin-card"><div class="chips-wrap">
        ${state.categories.map(cat => `<span class="chip-large">${esc(cat.name)}<button data-delete-cat="${cat.id}"><i class="fa-solid fa-xmark"></i></button></span>`).join("")}
      </div></div>`;
    $("#addCatBtn").onclick = async () => {
      const name = $("#newCatName").value.trim();
      if (!name) return;
      try { await api.addCategory(name); $("#newCatName").value = ""; toast("ক্যাটাগরি যোগ হয়েছে", "success"); }
      catch (e) { toast(e.message, "error"); }
    };
    $$("[data-delete-cat]").forEach(b => b.onclick = async () => { await api.deleteCategory(b.dataset.deleteCat); toast("মুছে ফেলা হয়েছে", "success"); });
  },

  coupons(c) {
    c.innerHTML = `
      <div class="admin-toolbar"><button class="btn btn-primary" id="addCouponBtn"><i class="fa-solid fa-plus"></i> নতুন কুপন</button></div>
      <div class="admin-card">
        <table class="admin-table">
          <thead><tr><th>কোড</th><th>টাইপ</th><th>মান</th><th>অ্যাকশন</th></tr></thead>
          <tbody>
            ${state.coupons.map(cp => `
              <tr><td><strong>${esc(cp.code)}</strong></td><td>${esc(cp.type)}</td><td>${cp.type === 'percent' ? cp.value + '%' : fmtPrice(cp.value)}</td>
              <td><button class="icon-btn-sm danger" data-delete-coupon="${cp.id}"><i class="fa-solid fa-trash"></i></button></td></tr>`).join("") || '<tr><td colspan="4" class="muted">কোনো কুপন নেই</td></tr>'}
          </tbody>
        </table>
      </div>`;
    $("#addCouponBtn").onclick = () => this.openCouponForm();
    $$("[data-delete-coupon]").forEach(b => b.onclick = async () => { await api.deleteCoupon(b.dataset.deleteCoupon); toast("মুছে ফেলা হয়েছে", "success"); });
  },
  openCouponForm() {
    modal.open(`
      <button class="modal-close" id="cfClose"><i class="fa-solid fa-xmark"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:18px;font-weight:800;margin-bottom:18px;">নতুন কুপন</h2>
        <form id="couponForm">
          <div class="form-group"><label>কোড</label><input id="cCode" required placeholder="SAVE10" style="text-transform:uppercase" /></div>
          <div class="form-row">
            <div class="form-group"><label>টাইপ</label><select id="cType"><option value="percent">Percent (%)</option><option value="fixed">Fixed (৳)</option></select></div>
            <div class="form-group"><label>মান</label><input type="number" id="cValue" required min="0" /></div>
          </div>
          <div class="form-group"><label>সর্বনিম্ন কেনাকাটা</label><input type="number" id="cMin" value="0" min="0" /></div>
          <div style="display:flex;gap:10px;margin-top:18px;">
            <button type="button" class="btn btn-outline" id="cfCancel" style="flex:1;">বাতিল</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">যোগ করুন</button>
          </div>
        </form>
      </div>`, { size: "sm" });
    $("#cfClose").onclick = () => modal.close();
    $("#cfCancel").onclick = () => modal.close();
    $("#couponForm").onsubmit = async (e) => {
      e.preventDefault();
      await api.addCoupon({ code: $("#cCode").value.toUpperCase(), type: $("#cType").value, value: Number($("#cValue").value), minPurchase: Number($("#cMin").value) || 0, active: true });
      modal.close(); toast("কুপন যোগ হয়েছে", "success");
    };
  },

  settings(c) {
    const s = state.siteSettings || {};
    c.innerHTML = `
      <div class="admin-card">
        <div class="form-group"><label>সাইট নাম</label><input id="sName" value="${esc(s.siteName || 'EcoShop Pro MAX')}" /></div>
        <div class="form-group"><label>সাইট ট্যাগলাইন</label><input id="sTagline" value="${esc(s.tagline || '')}" /></div>
        <div class="form-group"><label>যোগাযোগ ইমেইল</label><input id="sEmail" value="${esc(s.email || '')}" /></div>
        <div class="form-group"><label>ফোন</label><input id="sPhone" value="${esc(s.phone || '')}" /></div>
        <button class="btn btn-primary" id="sSave"><i class="fa-solid fa-check"></i> সেভ করুন</button>
      </div>`;
    $("#sSave").onclick = async () => {
      await api.saveSiteSettings({ siteName: $("#sName").value.trim(), tagline: $("#sTagline").value.trim(), email: $("#sEmail").value.trim(), phone: $("#sPhone").value.trim() });
      toast("সেটিংস সেভ হয়েছে", "success");
    };
  }
};
window.adminPage = adminPage;

/* ═══ AUTH UI ═══ */
const authUI = {
  async doLogout() {
    try { await api.logout(); toast("লগআউট সফল", "success"); closePowerMenu(); router.go("home"); }
    catch (e) { toast(e.message, "error"); }
  },
  updateUI(user) {
    const btnLogin = $("#loginBtn"), userMenu = $("#userMenu");
    if (user) {
      if (btnLogin) btnLogin.style.display = "none";
      if (userMenu) userMenu.classList.add("show");
      const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=6366f1&color=fff`;
      const av = $("#userAvatar"), adminAv = $("#adminAvatar");
      if (av) av.src = url; if (adminAv) adminAv.src = url;
      const h = $("#dropdownUserHeader");
      if (h) h.innerHTML = `<h4>${esc(user.displayName || "User")}</h4><p>${esc(user.email)}</p>`;
    } else {
      if (btnLogin) btnLogin.style.display = "flex";
      if (userMenu) userMenu.classList.remove("show");
    }
    updatePowerMenuUI();
  }
};
window.authUI = authUI;

/* ═══ GLOBAL EVENT DELEGATION ═══ */
function bindGlobalEvents() {
  const sb = $("#splashBar"), ss = $("#splashStatus");
  const steps = [[20, "ফায়ারবেস চালু হচ্ছে..."], [55, "ডেটা লোড হচ্ছে..."], [85, "প্রায় প্রস্তুত..."], [100, "স্বাগতম!"]];
  let i = 0;
  const iv = setInterval(() => {
    if (i >= steps.length) { clearInterval(iv); return; }
    if (sb) sb.style.width = steps[i][0] + "%";
    if (ss) ss.textContent = steps[i][1];
    i++;
  }, 350);
  setTimeout(() => $("#splash")?.classList.add("hidden"), 1600);

  $("#menuToggle")?.addEventListener("click", (e) => { e.stopPropagation(); openPowerMenu(); });
  $("#pmClose")?.addEventListener("click", closePowerMenu);
  $("#backdrop")?.addEventListener("click", closeAllPanels);
  $("#themeToggle")?.addEventListener("click", toggleTheme);
  $("#langToggle")?.addEventListener("click", toggleLang);

  $("#cartBtn")?.addEventListener("click", () => { $("#cartDrawer")?.classList.add("active"); $("#backdrop")?.classList.add("active"); cart.renderDrawer(); });
  $("#closeCart")?.addEventListener("click", () => { $("#cartDrawer")?.classList.remove("active"); if (!isAnyPanelOpen()) $("#backdrop")?.classList.remove("active"); });
  $("#notifBtn")?.addEventListener("click", () => { $("#notifPanel")?.classList.add("active"); $("#backdrop")?.classList.add("active"); });
  $("#closeNotif")?.addEventListener("click", () => { $("#notifPanel")?.classList.remove("active"); if (!isAnyPanelOpen()) $("#backdrop")?.classList.remove("active"); });

  const umb = $("#userMenuBtn"), ud = $("#userDropdown");
  umb?.addEventListener("click", (e) => { e.stopPropagation(); ud.classList.toggle("active"); });
  document.addEventListener("click", (e) => { if (ud && !ud.contains(e.target) && e.target !== umb) ud.classList.remove("active"); });

  $("#logoutBtn")?.addEventListener("click", () => authUI.doLogout());
  $("#pmLogoutBtn")?.addEventListener("click", () => authUI.doLogout());
  $("#adminLogoutBtn")?.addEventListener("click", () => authUI.doLogout());

  const si = $("#globalSearchInput");
  if (si) si.onkeydown = (e) => { if (e.key === "Enter") { state.filters.query = si.value.trim(); router.go("products"); } };

  $$("#pmLangSeg button").forEach(b => b.onclick = () => { state.lang = b.dataset.lang; localStorage.setItem("lang", state.lang); applyLang(); syncSettingsUI(); router.render(); });
  $$("#pmThemeSeg button").forEach(b => b.onclick = () => { state.themeMode = b.dataset.theme; localStorage.setItem("themeMode", state.themeMode); applyTheme(); syncSettingsUI(); });

  const btt = $("#backToTop");
  if (btt) {
    window.addEventListener("scroll", () => btt.classList.toggle("show", window.scrollY > 300));
    btt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.addEventListener("scroll", () => $("#publicNavbar")?.classList.toggle("scrolled", window.scrollY > 10));

  $$(".admin-nav a[data-admin]").forEach(a => a.addEventListener("click", () => {
    state.adminPage = a.dataset.admin;
    adminPage.render();
    $("#adminSidebar")?.classList.remove("active");
  }));
  $("#adminSidebarToggle")?.addEventListener("click", () => $("#adminSidebar")?.classList.toggle("active"));

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeAllPanels(); modal.close(); } });

  document.addEventListener("click", (e) => {
    const goEl = e.target.closest("[data-go]");
    if (goEl) {
      e.preventDefault();
      router.go(goEl.dataset.go);
      if (goEl.dataset.close || goEl.closest("#powerMenu")) closeAllPanels();
      return;
    }
    const addEl = e.target.closest("[data-cart-add]");
    if (addEl) { cart.add(JSON.parse(addEl.dataset.cartAdd)); return; }
    const wishEl = e.target.closest("[data-wish]");
    if (wishEl) { wishlist.toggle(JSON.parse(wishEl.dataset.wish)); router.render(); return; }
    const decEl = e.target.closest("[data-qty-dec]");
    if (decEl) { const c = state.cart.find(x => x.id === decEl.dataset.qtyDec); if (c) cart.setQty(c.id, c.qty - 1); return; }
    const incEl = e.target.closest("[data-qty-inc]");
    if (incEl) { const c = state.cart.find(x => x.id === incEl.dataset.qtyInc); if (c) cart.setQty(c.id, c.qty + 1); return; }
    const remEl = e.target.closest("[data-cart-remove]");
    if (remEl) { cart.remove(remEl.dataset.cartRemove); return; }
  });
}

/* ═══ AUTH STATE LISTENER ═══ */
function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    state.authReady = true;
    if (user) {
      state.user = { uid: user.uid, email: user.email, displayName: user.displayName };
      state.userProfile = await api.getProfile(user.uid);
      state.isAdmin = state.userProfile?.role === "admin";
      authUI.updateUI(state.user);
      api.listenNotifications(user.uid, (notifs) => {
        const unread = notifs.filter(n => !n.read).length;
        const b = $("#notifBadge");
        if (b) { b.textContent = unread; b.classList.toggle("show", unread > 0); }
        renderNotifications(notifs);
      });
    } else {
      state.user = null; state.isAdmin = false; state.userProfile = null;
      authUI.updateUI(null);
    }
    if (router.current === "auth") router.showAdminOrUserDash();
    else if (router.current === "admin") router.render();
    else if (["dashboard", "orders", "profile"].includes(router.current)) router.render();
  });
}
function renderNotifications(notifs) {
  const c = $("#notifList");
  if (!c) return;
  if (!notifs.length) { c.innerHTML = `<div class="empty-state" style="padding:40px 20px;"><i class="fa-solid fa-bell-slash"></i><h3 style="font-size:16px;">কোনো নোটিফিকেশন নেই</h3></div>`; return; }
  c.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
      <div><h5>${esc(n.title)}</h5><p>${esc(n.body)}</p><small>${fmtDate(n.createdAt)}</small></div>
    </div>`).join("");
}

/* ═══ BOOT ═══ */
function boot() {
  applyTheme();
  applyLang();
  cart.updateBadge();
  wishlist.updateBadge();
  bindGlobalEvents();
  initAuthListener();

  api.listenProducts(() => { if (["home", "products"].includes(router.current)) router.render(); if (router.current === "admin" && state.adminPage === "products") adminPage.render(); });
  api.listenCategories(() => { if (["home", "products"].includes(router.current)) router.render(); if (router.current === "admin" && state.adminPage === "categories") adminPage.render(); });
  api.listenAllOrders(() => { if (router.current === "admin") adminPage.render(); });
  api.listenUsers(() => { if (router.current === "admin" && state.adminPage === "users") adminPage.render(); });
  api.listenCoupons(() => { if (router.current === "admin" && state.adminPage === "coupons") adminPage.render(); });
  api.listenSiteSettings(() => { if (router.current === "admin" && state.adminPage === "settings") adminPage.render(); });

  const initial = (location.hash || "#home").replace("#", "");
  router.go(initial || "home");
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
