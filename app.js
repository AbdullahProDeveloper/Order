/* ═══ SEARCH ═══ */
const search = {
  handle(input) {
    const q = input.value.trim();
    if (!q) { router.go('products'); return; }
    state.filters.query = q;
    router.go('products');
  }
};

/* ═══ POWER MENU (FIXED) ═══ */
function openPowerMenu() {
  const pm = $("#powerMenu"), bd = $("#backdrop");
  if (!pm) return;
  pm.classList.add("active");
  if (bd) bd.classList.add("active");
  document.body.style.overflow = "hidden";
  updatePowerMenuUI();
}
function closePowerMenu() {
  const pm = $("#powerMenu"), bd = $("#backdrop");
  if (!pm) return;
  pm.classList.remove("active");
  if (bd) bd.classList.remove("active");
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
  } else {
    $("#pmName").textContent = state.user.displayName || "User";
    $("#pmEmail").textContent = state.user.email;
    $("#pmRoleBadge").textContent = state.isAdmin ? "ADMIN" : "USER";
    $("#pmAvatar").src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.displayName || "U")}&background=6366f1&color=fff`;
    $("#pmLoginBtn").style.display = "none";
    $("#pmLogoutBtn").style.display = "flex";
    $("#pmAdminBtn").style.display = state.isAdmin ? "flex" : "none";
  }
  const wc = $("#pmWishBadge"); if (wc) wc.textContent = state.wishlist.length;
}

/* ═══ PAGES ═══ */
const Pages = {
  home(el) {
    const featured = state.products.filter(p => p.featured).slice(0, 8);
    const list = featured.length ? featured : state.products.slice(0, 8);
    el.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <span class="hero-badge"><i class="ph-fill ph-lightning"></i> নতুন কলেকশন ২০২৫</span>
            <h1 class="hero-title">আপনার প্রয়োজনীয় সবকিছু <span class="grad">এক জায়গায়</span></h1>
            <p class="hero-sub">প্রফেশনাল, নিরাপদ এবং দ্রুত ই-কমার্স প্ল্যাটফর্ম।</p>
            <div class="hero-btns">
              <button class="btn btn-primary btn-lg" onclick="router.go('products')">
                <i class="ph-bold ph-shopping-bag"></i> কেনাকাটা শুরু করুন
              </button>
            </div>
          </div>
        </div>
      </section>
      <section class="page">
        <div class="section-head">
          <h2><i class="ph-fill ph-star"></i> ফিচার্ড পণ্য</h2>
          <button class="btn btn-outline btn-sm" onclick="router.go('products')">সব দেখুন</button>
        </div>
        <div class="product-grid" id="featuredGrid">
          ${list.length ? list.map(p => productCard(p)).join("") : emptyProducts()}
        </div>
      </section>
    `;
  },

  products(el) {
    el.innerHTML = `
      <section class="page">
        <div class="section-head">
          <h2><i class="ph-fill ph-shopping-bag"></i> সকল পণ্য</h2>
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
        <div class="product-grid" id="productsGrid">
          ${state.products.length ? state.products.map(p => productCard(p)).join("") : emptyProducts()}
        </div>
      </section>
    `;
    $("#filterCategory").onchange = (e) => filterProducts(e.target.value, $("#filterSort").value);
    $("#filterSort").onchange = (e) => filterProducts($("#filterCategory").value, e.target.value);
  },

  auth(el) {
    el.innerHTML = `
      <section class="auth-page">
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="active" data-tab="login">লগইন</button>
            <button data-tab="signup">সাইনআপ</button>
          </div>
          <form id="authForm" class="auth-form">
            <div class="form-group signup-only" style="display:none;">
              <label>পূর্ণ নাম</label>
              <input type="text" id="authName" placeholder="আপনার নাম" />
            </div>
            <div class="form-group signup-only" style="display:none;">
              <label>ফোন</label>
              <input type="tel" id="authPhone" placeholder="01XXXXXXXXX" />
            </div>
            <div class="form-group">
              <label>ইমেইল</label>
              <input type="email" id="authEmail" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label>পাসওয়ার্ড</label>
              <input type="password" id="authPassword" placeholder="••••••••" required minlength="6" />
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="authSubmit">
              <i class="ph-bold ph-sign-in"></i> লগইন
            </button>
          </form>
        </div>
      </section>
    `;
    let mode = "login";
    $$(".auth-tabs button").forEach(b => b.onclick = () => {
      mode = b.dataset.tab;
      $$(".auth-tabs button").forEach(x => x.classList.toggle("active", x === b));
      $$(".signup-only").forEach(x => x.style.display = mode === "signup" ? "block" : "none");
      $("#authSubmit").innerHTML = mode === "signup"
        ? '<i class="ph-bold ph-user-plus"></i> সাইনআপ'
        : '<i class="ph-bold ph-sign-in"></i> লগইন';
    });
    $("#authForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = $("#authSubmit");
      btn.disabled = true;
      try {
        const email = $("#authEmail").value.trim();
        const password = $("#authPassword").value;
        if (mode === "signup") {
          await api.signup({
            name: $("#authName").value.trim(),
            email, password,
            phone: $("#authPhone").value.trim()
          });
          toast("অ্যাকাউন্ট তৈরি হয়েছে!", "success");
        } else {
          await api.login(email, password);
          toast("লগইন সফল", "success");
        }
      } catch (err) {
        toast(err.message.replace("Firebase:", "").trim(), "error");
      } finally {
        btn.disabled = false;
      }
    };
  },

  dashboard(el) {
    if (!state.user) { router.go('auth'); return; }
    el.innerHTML = `
      <section class="page">
        <div class="section-head">
          <h2><i class="ph-fill ph-gauge"></i> ড্যাশবোর্ড</h2>
        </div>
        <div class="dash-grid">
          <div class="dash-card">
            <i class="ph-fill ph-user-circle"></i>
            <h3>${esc(state.user.displayName || "User")}</h3>
            <p>${esc(state.user.email)}</p>
          </div>
          <div class="dash-card clickable" onclick="router.go('orders')">
            <i class="ph-fill ph-receipt"></i>
            <h3>আমার অর্ডার</h3>
            <p>সকল অর্ডার দেখুন</p>
          </div>
          <div class="dash-card clickable" onclick="router.go('wishlist')">
            <i class="ph-fill ph-heart"></i>
            <h3>উইশলিস্ট</h3>
            <p>${state.wishlist.length} টি পণ্য</p>
          </div>
          ${state.isAdmin ? `<div class="dash-card clickable" onclick="router.go('admin')">
            <i class="ph-fill ph-shield-check"></i><h3>এডমিন প্যানেল</h3><p>ম্যানেজ করুন</p>
          </div>` : ""}
        </div>
        <div class="section-head"><h2>সাম্প্রতিক অর্ডার</h2></div>
        <div id="userOrdersList" class="orders-list"><p class="muted">লোড হচ্ছে...</p></div>
      </section>
    `;
    api.listenUserOrders(state.user.uid, (orders) => {
      const el = $("#userOrdersList");
      if (!el) return;
      if (!orders.length) { el.innerHTML = `<p class="muted">কোনো অর্ডার নেই</p>`; return; }
      el.innerHTML = orders.slice(0, 5).map(o => orderRow(o)).join("");
    });
  },

  profile(el) {
    if (!state.user) { router.go('auth'); return; }
    const p = state.userProfile || {};
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="ph-fill ph-user"></i> প্রোফাইল</h2></div>
        <div class="form-card">
          <div class="form-group"><label>নাম</label>
            <input id="pfName" value="${esc(p.name || state.user.displayName || "")}" /></div>
          <div class="form-group"><label>ইমেইল</label>
            <input id="pfEmail" value="${esc(state.user.email)}" disabled /></div>
          <div class="form-group"><label>ফোন</label>
            <input id="pfPhone" value="${esc(p.phone || "")}" placeholder="01XXXXXXXXX" /></div>
          <div class="form-group"><label>ঠিকানা</label>
            <textarea id="pfAddress">${esc(p.address || "")}</textarea></div>
          <button class="btn btn-primary" id="pfSave"><i class="ph-bold ph-check"></i> সেভ করুন</button>
        </div>
      </section>
    `;
    $("#pfSave").onclick = async () => {
      try {
        await api.updateProfile(state.user.uid, {
          name: $("#pfName").value.trim(),
          phone: $("#pfPhone").value.trim(),
          address: $("#pfAddress").value.trim()
        });
        state.userProfile = await api.getProfile(state.user.uid);
        toast("প্রোফাইল আপডেট হয়েছে", "success");
      } catch (e) { toast(e.message, "error"); }
    };
  },

  orders(el) {
    if (!state.user) { router.go('auth'); return; }
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="ph-fill ph-receipt"></i> আমার অর্ডার</h2></div>
        <div id="ordersList" class="orders-list"><p class="muted">লোড হচ্ছে...</p></div>
      </section>
    `;
    api.listenUserOrders(state.user.uid, (orders) => {
      const c = $("#ordersList");
      if (!c) return;
      if (!orders.length) { c.innerHTML = `<p class="muted">কোনো অর্ডার নেই</p>`; return; }
      c.innerHTML = orders.map(o => orderRow(o)).join("");
    });
  },

  wishlist(el) {
    if (!state.wishlist.length) {
      el.innerHTML = `<section class="page"><div class="empty-state">
        <i class="ph-fill ph-heart"></i><h3>উইশলিস্ট খালি</h3>
        <button class="btn btn-primary" onclick="router.go('products')">পণ্য দেখুন</button>
      </div></section>`;
      return;
    }
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="ph-fill ph-heart"></i> উইশলিস্ট</h2></div>
        <div class="product-grid">
          ${state.wishlist.map(p => productCard(p)).join("")}
        </div>
      </section>
    `;
  },

  settings(el) {
    el.innerHTML = `
      <section class="page">
        <div class="section-head"><h2><i class="ph-fill ph-gear"></i> সেটিংস</h2></div>
        <div class="form-card">
          <div class="pm-row">
            <div class="pm-row-label"><i class="ph-bold ph-translate"></i><span>ভাষা</span></div>
            <div class="pm-seg" id="setLang">
              <button data-lang="bn" class="${state.lang === 'bn' ? 'active' : ''}">বাংলা</button>
              <button data-lang="en" class="${state.lang === 'en' ? 'active' : ''}">English</button>
            </div>
          </div>
          <div class="pm-row">
            <div class="pm-row-label"><i class="ph-bold ph-moon-stars"></i><span>থিম</span></div>
            <div class="pm-seg" id="setTheme">
              <button data-theme="light" class="${state.themeMode === 'light' ? 'active' : ''}">☀️</button>
              <button data-theme="dark" class="${state.themeMode === 'dark' ? 'active' : ''}">🌙</button>
              <button data-theme="auto" class="${state.themeMode === 'auto' ? 'active' : ''}">A</button>
            </div>
          </div>
        </div>
      </section>
    `;
    $$("#setLang button").forEach(b => b.onclick = () => {
      state.lang = b.dataset.lang;
      localStorage.setItem("lang", state.lang);
      applyLang(); router.render();
    });
    $$("#setTheme button").forEach(b => b.onclick = () => {
      state.themeMode = b.dataset.theme;
      localStorage.setItem("themeMode", state.themeMode);
      applyTheme(); router.render();
    });
  }
};

function productCard(p) {
  const inWish = wishlist.has(p.id);
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${esc(p.image || 'https://via.placeholder.com/400')}" alt="${esc(p.name)}" loading="lazy" />
        ${p.featured ? '<span class="product-badge">ফিচার্ড</span>' : ''}
        <button class="wish-btn ${inWish ? 'active' : ''}" onclick="wishlist.toggle(${JSON.stringify(p).replace(/"/g,'&quot;')});router.render()">
          <i class="ph-${inWish ? 'fill' : 'bold'} ph-heart"></i>
        </button>
      </div>
      <div class="product-body">
        <span class="product-cat">${esc(p.category || 'Other')}</span>
        <h3 class="product-name">${esc(state.lang === 'bn' ? p.name : (p.nameEn || p.name))}</h3>
        <div class="product-price">
          <span class="price">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${fmtPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button class="btn btn-primary btn-block" onclick='cart.add(${JSON.stringify(p).replace(/"/g,'&quot;')})'>
          <i class="ph-bold ph-shopping-cart-simple"></i> ${t('add_to_cart')}
        </button>
      </div>
    </div>
  `;
}

function emptyProducts() {
  return `<div class="empty-state" style="grid-column:1/-1;">
    <i class="ph-fill ph-package"></i><h3>কোনো পণ্য নেই</h3>
    <p>এডমিন প্যানেল থেকে পণ্য যোগ করুন</p>
  </div>`;
}

function orderRow(o) {
  const statusMap = { pending:"অপেক্ষমাণ", confirmed:"কনফার্মড", shipped:"শিপড", delivered:"ডেলিভারড", cancelled:"বাতিল" };
  return `
    <div class="order-row">
      <div class="order-info">
        <h4>#${o.orderId?.slice(-6) || o.id?.slice(-6)}</h4>
        <p>${fmtDate(o.createdAt)} · ${o.items?.length || 0} টি পণ্য</p>
      </div>
      <div class="order-right">
        <span class="status-badge status-${o.status}">${statusMap[o.status] || o.status}</span>
        <strong>${fmtPrice(o.total)}</strong>
      </div>
    </div>
  `;
}

function filterProducts(cat, sort) {
  let list = [...state.products];
  if (cat !== "all") list = list.filter(p => p.category === cat);
  if (sort === "price_low") list.sort((a, b) => a.price - b.price);
  else if (sort === "price_high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  $("#productsGrid").innerHTML = list.length ? list.map(p => productCard(p)).join("") : emptyProducts();
}

/* ═══ ADMIN PAGE ═══ */
const adminPage = {
  render() {
    const title = $("#adminPageTitle"), sub = $("#adminPageSubtitle");
    const c = $("#adminContent");
    if (!c) return;
    $$(".admin-nav a").forEach(a => a.classList.toggle("active", a.dataset.admin === state.adminPage));

    const map = {
      overview:   { title: "ওভারভিউ",   sub: "সারসংক্ষেপ দেখুন", fn: this.overview.bind(this) },
      products:   { title: "পণ্য",       sub: "পণ্য ম্যানেজ করুন", fn: this.products.bind(this) },
      orders:     { title: "অর্ডার",     sub: "অর্ডার ম্যানেজ করুন", fn: this.orders.bind(this) },
      users:      { title: "ইউজার",      sub: "ইউজার দেখুন", fn: this.users.bind(this) },
      categories: { title: "ক্যাটাগরি",  sub: "ক্যাটাগরি ম্যানেজ", fn: this.categories.bind(this) },
      coupons:    { title: "কুপন",       sub: "ডিসকাউন্ট কোড", fn: this.coupons.bind(this) },
      settings:   { title: "সেটিংস",     sub: "সাইট কনফিগার", fn: this.settings.bind(this) }
    };
    const pg = map[state.adminPage] || map.overview;
    title.textContent = pg.title;
    sub.textContent = pg.sub;
    c.innerHTML = "";
    pg.fn(c);
  },

  overview(c) {
    const totalRev = state.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    c.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="ph-fill ph-package"></i></div>
          <div><p>মোট পণ্য</p><h3>${state.products.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="ph-fill ph-receipt"></i></div>
          <div><p>মোট অর্ডার</p><h3>${state.orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="ph-fill ph-users"></i></div>
          <div><p>মোট ইউজার</p><h3>${state.users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="ph-fill ph-currency-dollar"></i></div>
          <div><p>মোট আয়</p><h3>${fmtPrice(totalRev)}</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>সাম্প্রতিক অর্ডার</h3></div>
        <div class="orders-list">
          ${state.orders.slice(0, 8).map(o => orderRow(o)).join("") || '<p class="muted">কোনো অর্ডার নেই</p>'}
        </div>
      </div>
    `;
  },

  products(c) {
    c.innerHTML = `
      <div class="admin-toolbar">
        <button class="btn btn-primary" id="addProductBtn"><i class="ph-bold ph-plus"></i> নতুন পণ্য</button>
      </div>
      <div class="admin-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>ছবি</th><th>নাম</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>অ্যাকশন</th></tr></thead>
            <tbody>
              ${state.products.map(p => `
                <tr>
                  <td><img src="${esc(p.image || 'https://via.placeholder.com/50')}" class="thumb" /></td>
                  <td><strong>${esc(p.name)}</strong></td>
                  <td>${esc(p.category || '-')}</td>
                  <td>${fmtPrice(p.price)}</td>
                  <td>${p.stock || 0}</td>
                  <td class="actions">
                    <button class="icon-btn-sm" onclick="adminPage.editProduct('${p.id}')"><i class="ph-bold ph-pencil"></i></button>
                    <button class="icon-btn-sm danger" onclick="adminPage.confirmDelete('${p.id}')"><i class="ph-bold ph-trash"></i></button>
                  </td>
                </tr>`).join("") || '<tr><td colspan="6" class="muted">কোনো পণ্য নেই</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
    $("#addProductBtn").onclick = () => this.openProductForm();
  },

  openProductForm(product = null) {
    const isEdit = !!product;
    const p = product || {};
    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:22px;font-weight:800;margin-bottom:20px;">
          ${isEdit ? 'পণ্য এডিট' : 'নতুন পণ্য'}
        </h2>
        <form id="productForm">
          <div class="form-group"><label>পণ্যের নাম *</label>
            <input id="pName" value="${esc(p.name || '')}" required /></div>
          <div class="form-group"><label>নাম (English)</label>
            <input id="pNameEn" value="${esc(p.nameEn || '')}" /></div>
          <div class="form-row">
            <div class="form-group"><label>দাম *</label>
              <input type="number" id="pPrice" value="${p.price || ''}" required min="0" step="0.01" /></div>
            <div class="form-group"><label>আগের দাম</label>
              <input type="number" id="pOldPrice" value="${p.oldPrice || ''}" min="0" step="0.01" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>ক্যাটাগরি</label>
              <select id="pCategory">
                <option value="">-- নির্বাচন --</option>
                ${state.categories.map(c => `<option value="${esc(c.name)}" ${p.category === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join("")}
              </select></div>
            <div class="form-group"><label>স্টক</label>
              <input type="number" id="pStock" value="${p.stock || 0}" min="0" /></div>
          </div>
          <div class="form-group"><label>বিবরণ</label>
            <textarea id="pDesc" rows="3">${esc(p.description || '')}</textarea></div>
          <div class="form-group"><label>ছবি</label>
            <input type="file" id="pImage" accept="image/*" /></div>
          <div class="form-group"><label>
            <input type="checkbox" id="pFeatured" ${p.featured ? 'checked' : ''} /> ফিচার্ড পণ্য
          </label></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button type="button" class="btn btn-outline" onclick="modal.close()" style="flex:1;">বাতিল</button>
            <button type="submit" class="btn btn-primary" id="pSaveBtn" style="flex:1;">
              <i class="ph-bold ph-check"></i> ${isEdit ? 'আপডেট' : 'যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    `, { size: "md" });

    $("#productForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = $("#pSaveBtn");
      btn.disabled = true;
      btn.innerHTML = '<i class="ph-bold ph-circle-notch" style="animation:spin 1s linear infinite"></i> সেভ হচ্ছে...';
      try {
        const data = {
          name: $("#pName").value.trim(),
          nameEn: $("#pNameEn").value.trim() || $("#pName").value.trim(),
          price: Number($("#pPrice").value),
          oldPrice: Number($("#pOldPrice").value) || 0,
          category: $("#pCategory").value || "Other",
          stock: Number($("#pStock").value) || 0,
          description: $("#pDesc").value.trim(),
          featured: $("#pFeatured").checked
        };
        const file = $("#pImage").files[0];
        if (isEdit) {
          await api.updateProduct(product.id, data, file);
          toast("পণ্য আপডেট হয়েছে", "success");
        } else {
          await api.addProduct(data, file);
          toast("পণ্য যোগ হয়েছে", "success");
        }
        modal.close();
      } catch (err) {
        console.error(err);
        toast("সমস্যা: " + err.message, "error");
        btn.disabled = false;
        btn.innerHTML = `<i class="ph-bold ph-check"></i> ${isEdit ? 'আপডেট' : 'যোগ করুন'}`;
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
      try {
        await api.deleteProduct(id);
        toast("মুছে ফেলা হয়েছে", "success");
      } catch (e) { toast(e.message, "error"); }
    });
  },

  orders(c) {
    c.innerHTML = `
      <div class="admin-card">
        <div class="orders-list">
          ${state.orders.map(o => `
            <div class="order-row admin-order-row">
              <div class="order-info">
                <h4>#${o.orderId?.slice(-6) || o.id?.slice(-6)}</h4>
                <p>${esc(o.userName || 'User')} · ${fmtDate(o.createdAt)}</p>
                <p>${o.items?.length || 0} টি পণ্য · ${fmtPrice(o.total)}</p>
              </div>
              <div class="order-right">
                <select onchange="adminPage.changeStatus('${o.id}', this.value, '${o.userId}')">
                  ${['pending','confirmed','shipped','delivered','cancelled'].map(s =>
                    `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join("")}
                </select>
              </div>
            </div>`).join("") || '<p class="muted">কোনো অর্ডার নেই</p>'}
        </div>
      </div>
    `;
  },

  async changeStatus(orderId, status, userId) {
    try {
      await api.updateOrderStatus(orderId, status, userId);
      toast("স্ট্যাটাস আপডেট", "success");
    } catch (e) { toast(e.message, "error"); }
  },

  users(c) {
    c.innerHTML = `
      <div class="admin-card">
        <table class="admin-table">
          <thead><tr><th>নাম</th><th>ইমেইল</th><th>রোল</th><th>অ্যাকশন</th></tr></thead>
          <tbody>
            ${state.users.map(u => `
              <tr>
                <td>${esc(u.name || '-')}</td>
                <td>${esc(u.email || '-')}</td>
                <td><span class="chip">${esc(u.role || 'user')}</span></td>
                <td>
                  <button class="btn btn-sm ${u.banned ? 'btn-success' : 'btn-danger'}"
                    onclick="adminPage.toggleBan('${u.id}', ${!u.banned})">
                    ${u.banned ? 'আনব্যান' : 'ব্যান'}
                  </button>
                </td>
              </tr>`).join("") || '<tr><td colspan="4" class="muted">কোনো ইউজার নেই</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  },

  async toggleBan(uid, banned) {
    await api.toggleBan(uid, banned);
    toast(banned ? "ব্যান হয়েছে" : "আনব্যান হয়েছে", "success");
  },

  categories(c) {
    c.innerHTML = `
      <div class="admin-toolbar">
        <input id="newCatName" placeholder="ক্যাটাগরির নাম" />
        <button class="btn btn-primary" id="addCatBtn"><i class="ph-bold ph-plus"></i> যোগ করুন</button>
      </div>
      <div class="admin-card">
        <div class="chips-wrap">
          ${state.categories.map(cat => `
            <span class="chip-large">
              ${esc(cat.name)}
              <button onclick="adminPage.deleteCat('${cat.id}')"><i class="ph-bold ph-x"></i></button>
            </span>`).join("")}
        </div>
      </div>
    `;
    $("#addCatBtn").onclick = async () => {
      const name = $("#newCatName").value.trim();
      if (!name) return;
      await api.addCategory(name);
      $("#newCatName").value = "";
      toast("ক্যাটাগরি যোগ হয়েছে", "success");
    };
  },

  async deleteCat(id) {
    await api.deleteCategory(id);
    toast("মুছে ফেলা হয়েছে", "success");
  },

  coupons(c) {
    c.innerHTML = `
      <div class="admin-toolbar">
        <button class="btn btn-primary" id="addCouponBtn"><i class="ph-bold ph-plus"></i> নতুন কুপন</button>
      </div>
      <div class="admin-card">
        <table class="admin-table">
          <thead><tr><th>কোড</th><th>টাইপ</th><th>মান</th><th>অ্যাকশন</th></tr></thead>
          <tbody>
            ${state.coupons.map(cp => `
              <tr>
                <td><strong>${esc(cp.code)}</strong></td>
                <td>${esc(cp.type)}</td>
                <td>${cp.type === 'percent' ? cp.value + '%' : fmtPrice(cp.value)}</td>
                <td><button class="icon-btn-sm danger" onclick="adminPage.deleteCoupon('${cp.id}')">
                  <i class="ph-bold ph-trash"></i></button></td>
              </tr>`).join("") || '<tr><td colspan="4" class="muted">কোনো কুপন নেই</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
    $("#addCouponBtn").onclick = () => this.openCouponForm();
  },

  openCouponForm() {
    modal.open(`
      <button class="modal-close" onclick="modal.close()"><i class="ph-bold ph-x"></i></button>
      <div style="padding:28px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:20px;">নতুন কুপন</h2>
        <form id="couponForm">
          <div class="form-group"><label>কোড</label>
            <input id="cCode" required placeholder="SAVE10" style="text-transform:uppercase" /></div>
          <div class="form-row">
            <div class="form-group"><label>টাইপ</label>
              <select id="cType"><option value="percent">Percent (%)</option><option value="fixed">Fixed (৳)</option></select></div>
            <div class="form-group"><label>মান</label>
              <input type="number" id="cValue" required min="0" /></div>
          </div>
          <div class="form-group"><label>সর্বনিম্ন কেনাকাটা</label>
            <input type="number" id="cMin" value="0" min="0" /></div>
          <div style="display:flex;gap:10px;margin-top:20px;">
            <button type="button" class="btn btn-outline" onclick="modal.close()" style="flex:1;">বাতিল</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">যোগ করুন</button>
          </div>
        </form>
      </div>
    `, { size: "sm" });
    $("#couponForm").onsubmit = async (e) => {
      e.preventDefault();
      await api.addCoupon({
        code: $("#cCode").value.toUpperCase(),
        type: $("#cType").value,
        value: Number($("#cValue").value),
        minPurchase: Number($("#cMin").value) || 0,
        active: true
      });
      modal.close();
      toast("কুপন যোগ হয়েছে", "success");
    };
  },

  async deleteCoupon(id) {
    await api.deleteCoupon(id);
    toast("মুছে ফেলা হয়েছে", "success");
  },

  settings(c) {
    const s = state.siteSettings || {};
    c.innerHTML = `
      <div class="admin-card">
        <div class="form-group"><label>সাইট নাম</label>
          <input id="sName" value="${esc(s.siteName || 'EcoShop Pro MAX')}" /></div>
        <div class="form-group"><label>সাইট ট্যাগলাইন</label>
          <input id="sTagline" value="${esc(s.tagline || '')}" /></div>
        <div class="form-group"><label>যোগাযোগ ইমেইল</label>
          <input id="sEmail" value="${esc(s.email || '')}" /></div>
        <div class="form-group"><label>ফোন</label>
          <input id="sPhone" value="${esc(s.phone || '')}" /></div>
        <button class="btn btn-primary" id="sSave"><i class="ph-bold ph-check"></i> সেভ করুন</button>
      </div>
    `;
    $("#sSave").onclick = async () => {
      await api.saveSiteSettings({
        siteName: $("#sName").value.trim(),
        tagline: $("#sTagline").value.trim(),
        email: $("#sEmail").value.trim(),
        phone: $("#sPhone").value.trim()
      });
      toast("সেটিংস সেভ হয়েছে", "success");
    };
  }
};
window.adminPage = adminPage;

/* ═══ AUTH UI ═══ */
const authUI = {
  async doLogout() {
    try {
      await api.logout();
      toast("লগআউট সফল", "success");
      closePowerMenu();
      router.go('home');
    } catch (e) { toast(e.message, "error"); }
  },
  updateUI(user, profile, isAdmin) {
    const btnLogin = $("#loginBtn"), userMenu = $("#userMenu");
    if (user) {
      if (btnLogin) btnLogin.style.display = "none";
      if (userMenu) userMenu.classList.add("show");
      const av = $("#userAvatar"), adminAv = $("#adminAvatar");
      const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=6366f1&color=fff`;
      if (av) av.src = url;
      if (adminAv) adminAv.src = url;
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

/* ═══ INIT ═══ */
function bindGlobalEvents() {
  // Splash
  const sb = $("#splashBar"), ss = $("#splashStatus");
  let progress = 0;
  const steps = [
    [20, "ফায়ারবেস চালু হচ্ছে..."],
    [50, "ডেটা লোড হচ্ছে..."],
    [80, "সব প্রস্তুত..."],
    [100, "স্বাগতম!"]
  ];
  let i = 0;
  const iv = setInterval(() => {
    if (i >= steps.length) { clearInterval(iv); return; }
    progress = steps[i][0];
    if (sb) sb.style.width = progress + "%";
    if (ss) ss.textContent = steps[i][1];
    i++;
  }, 400);
  setTimeout(() => $("#splash")?.classList.add("hidden"), 1800);

  // Menu toggle
  const mt = $("#menuToggle");
  if (mt) mt.onclick = (e) => { e.stopPropagation(); openPowerMenu(); };

  // Close power menu
  const pc = $("#pmClose");
  if (pc) pc.onclick = closePowerMenu;
  const bd = $("#backdrop");
  if (bd) bd.onclick = closePowerMenu;

  // Theme & lang
  const tt = $("#themeToggle");
  if (tt) tt.onclick = toggleTheme;
  const lt = $("#langToggle");
  if (lt) lt.onclick = toggleLang;

  // Panels
  const cartBtn = $("#cartBtn");
  if (cartBtn) cartBtn.onclick = () => { $("#cartDrawer")?.classList.add("active"); if (bd) bd.classList.add("active"); };
  const closeCart = $("#closeCart");
  if (closeCart) closeCart.onclick = () => { $("#cartDrawer")?.classList.remove("active"); if (bd) bd.classList.remove("active"); };

  const notifBtn = $("#notifBtn");
  if (notifBtn) notifBtn.onclick = () => { $("#notifPanel")?.classList.add("active"); if (bd) bd.classList.add("active"); };
  const closeNotif = $("#closeNotif");
  if (closeNotif) closeNotif.onclick = () => { $("#notifPanel")?.classList.remove("active"); if (bd) bd.classList.remove("active"); };

  // User dropdown
  const umb = $("#userMenuBtn"), ud = $("#userDropdown");
  if (umb && ud) umb.onclick = (e) => { e.stopPropagation(); ud.classList.toggle("active"); };
  document.addEventListener("click", (e) => {
    if (ud && !ud.contains(e.target) && e.target !== umb) ud.classList.remove("active");
  });

  // Logout
  const lo = $("#logoutBtn");
  if (lo) lo.onclick = () => authUI.doLogout();

  // Search
  const si = $("#globalSearchInput");
  if (si) {
    si.onkeydown = (e) => {
      if (e.key === "Enter") {
        state.filters.query = si.value.trim();
        router.go('products');
      }
    };
  }

  // Language segments
  $$("#pmLangSeg button").forEach(b => b.onclick = () => {
    state.lang = b.dataset.lang;
    localStorage.setItem("lang", state.lang);
    applyLang();
    router.render();
  });
  $$("#pmThemeSeg button").forEach(b => b.onclick = () => {
    state.themeMode = b.dataset.theme;
    localStorage.setItem("themeMode", state.themeMode);
    applyTheme();
  });

  // Back to top
  const btt = $("#backToTop");
  if (btt) {
    window.addEventListener("scroll", () => btt.classList.toggle("show", window.scrollY > 300));
    btt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Navbar scroll
  window.addEventListener("scroll", () => $("#publicNavbar")?.classList.toggle("scrolled", window.scrollY > 10));

  // Admin nav
  $$(".admin-nav a[data-admin]").forEach(a => {
    a.onclick = () => {
      state.adminPage = a.dataset.admin;
      adminPage.render();
      // close sidebar on mobile
      $("#adminSidebar")?.classList.remove("active");
    };
  });
  const ast = $("#adminSidebarToggle");
  if (ast) ast.onclick = () => $("#adminSidebar")?.classList.toggle("active");

  // Escape close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePowerMenu();
      modal.close();
      $("#cartDrawer")?.classList.remove("active");
      $("#notifPanel")?.classList.remove("active");
    }
  });
}

function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    state.authReady = true;
    if (user) {
      state.user = user;
      state.isAdmin = await api.isAdmin(user.uid);
      state.userProfile = await api.getProfile(user.uid);
      authUI.updateUI(user, state.userProfile, state.isAdmin);
      api.listenNotifications(user.uid, (notifs) => {
        const unread = notifs.filter(n => !n.read).length;
        const b = $("#notifBadge");
        if (b) { b.textContent = unread; b.classList.toggle("show", unread > 0); }
        renderNotifications(notifs);
      });
    } else {
      state.user = null;
      state.isAdmin = false;
      state.userProfile = null;
      authUI.updateUI(null);
    }
    if (router.current === "auth") router.showAdminOrUserDash();
    else if (state.isAdmin && router.current === "admin") adminPage.render();
  });
}

function renderNotifications(notifs) {
  const c = $("#notifList");
  if (!c) return;
  if (!notifs.length) {
    c.innerHTML = `<div class="empty-state" style="padding:40px 20px;">
      <i class="ph-fill ph-bell-slash"></i><h3 style="font-size:16px;">কোনো নোটিফিকেশন নেই</h3>
    </div>`;
    return;
  }
  c.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-icon"><i class="ph-fill ph-bell"></i></div>
      <div>
        <h5>${esc(n.title)}</h5>
        <p>${esc(n.body)}</p>
        <small>${fmtDate(n.createdAt)}</small>
      </div>
    </div>
  `).join("");
}

/* ═══ BOOT ═══ */
function boot() {
  applyTheme();
  applyLang();
  cart.updateBadge();
  wishlist.save();
  bindGlobalEvents();
  initAuthListener();

  // Listen to data
  api.listenCategories(() => {
    if (router.current === "products" || router.current === "home") router.render();
    if (router.current === "admin" && state.adminPage === "categories") adminPage.render();
  });
  api.listenProducts(() => {
    if (router.current === "home" || router.current === "products") router.render();
    if (router.current === "admin") adminPage.render();
  });
  api.listenAllOrders(() => {
    if (router.current === "admin") adminPage.render();
  });
  api.listenUsers(() => {
    if (router.current === "admin" && state.adminPage === "users") adminPage.render();
  });
  api.listenCoupons(() => {
    if (router.current === "admin" && state.adminPage === "coupons") adminPage.render();
  });
  api.listenSiteSettings(() => {
    if (router.current === "admin" && state.adminPage === "settings") adminPage.render();
  });

  router.go("home");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
