/* ═══════════════════════════════════════════════════════════
   EcoShop Pro MAX v3.1 — Firebase Realtime + ImgBB (FIXED)
   ═══════════════════════════════════════════════════════════ */

/* ───────── Firebase Config ───────── */
const firebaseConfig = {
  apiKey: "AIzaSyAtxk-3sNl3RSIEcMrZVk4uZeJCOuVLQMk",
  authDomain: "my-fast-projets.firebaseapp.com",
  databaseURL: "https://my-fast-projets-default-rtdb.firebaseio.com",
  projectId: "my-fast-projets",
  storageBucket: "my-fast-projets.firebasestorage.app",
  messagingSenderId: "316176074899",
  appId: "1:316176074899:web:7a7f6c7961778844c02566",
  measurementId: "G-L4HEZ409HR"
};

const IMGBB_API_KEY = "811434d9b77765dbedbb9662b98a0f74";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/* ───────── Init Firebase (with error guard) ───────── */
let fbApp, db, fbReady = false, fbError = null;

try {
  fbApp = firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  try { firebase.analytics(); } catch(e){ console.warn('Analytics skip:', e.message); }
  fbReady = true;
  console.log('✅ Firebase initialized');
} catch (e) {
  fbError = e.message;
  console.error('❌ Firebase init failed:', e);
}

/* ───────── i18n ───────── */
const I18N = {
  bn: { home:'হোম', shop:'শপ', orders:'অর্ডার', profile:'প্রোফাইল', admin:'অ্যাডমিন',
        login:'লগইন', logout:'লগআউট', addToCart:'কার্টে যোগ', wishlist:'উইশলিস্ট',
        cart:'কার্ট', checkout:'চেকআউট', empty:'কোনো পণ্য নেই', allProducts:'সকল পণ্য',
        inStock:'স্টকে আছে', outOfStock:'স্টক নেই', save:'সেভ', cancel:'বাতিল',
        delete:'ডিলিট', yes:'হ্যাঁ', confirmDelete:'আপনি কি নিশ্চিত?',
        pending:'পেন্ডিং', confirmed:'কনফার্মড', shipped:'শিপড', delivered:'ডেলিভারড', cancelled:'বাতিল',
        loginRequired:'অনুগ্রহ করে লগইন করুন' },
  en: { home:'Home', shop:'Shop', orders:'Orders', profile:'Profile', admin:'Admin',
        login:'Login', logout:'Logout', addToCart:'Add to Cart', wishlist:'Wishlist',
        cart:'Cart', checkout:'Checkout', empty:'No products', allProducts:'All Products',
        inStock:'In Stock', outOfStock:'Out of Stock', save:'Save', cancel:'Cancel',
        delete:'Delete', yes:'Yes', confirmDelete:'Are you sure?',
        pending:'Pending', confirmed:'Confirmed', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled',
        loginRequired:'Please login first' }
};
let LANG = localStorage.getItem('eco_lang') || 'bn';
const t = k => (I18N[LANG] && I18N[LANG][k]) || k;

/* ───────── Storage helpers ───────── */
const Session = {
  get(){ try{ return JSON.parse(localStorage.getItem('eco_session')) || null; }catch(e){ return null; } },
  set(u){ localStorage.setItem('eco_session', JSON.stringify(u)); },
  clear(){ localStorage.removeItem('eco_session'); }
};
const CartStore = {
  get(){ try{ return JSON.parse(localStorage.getItem('eco_cart')) || []; }catch(e){ return []; } },
  set(v){ localStorage.setItem('eco_cart', JSON.stringify(v)); }
};
const WishStore = {
  get(){ try{ return JSON.parse(localStorage.getItem('eco_wish')) || []; }catch(e){ return []; } },
  set(v){ localStorage.setItem('eco_wish', JSON.stringify(v)); }
};

/* ═══════════════════════════════════════════════════════════
   DB LAYER (Realtime DB)
   ═══════════════════════════════════════════════════════════ */
const DB = {
  products: [],
  users: [],
  orders: [],
  categories: [],
  coupons: [],
  notifs: [],
  settings: {},
  catRaw: {},   // ← FIX: was missing
  ready: { products:false, users:false, orders:false, categories:false, coupons:false, notifs:false },
  seeded: false,
  error: null,

  init(){
    if(!fbReady){ this.error = fbError || 'Firebase not initialized'; return; }
    this.watch('products', data => { this.products = this._toArray(data); this._markReady('products'); });
    this.watch('users', data => { this.users = this._toArray(data); this._markReady('users'); });
    this.watch('orders', data => { this.orders = this._toArray(data).sort((a,b)=>(b.date||0)-(a.date||0)); this._markReady('orders'); });
    this.watch('categories', data => { this.catRaw = data || {}; this.categories = Object.values(this.catRaw).filter(v=>typeof v==='string'); this._markReady('categories'); });
    this.watch('coupons', data => { this.coupons = this._toArray(data); this._markReady('coupons'); });
    this.watch('notifications', data => { this.notifs = this._toArray(data).sort((a,b)=>(b.time||0)-(a.time||0)); this._markReady('notifs'); });
    this.watch('settings', data => { this.settings = data || {}; });

    // Safety timeout — splash কখনো infinite লক হবে না
    setTimeout(()=>{
      const allReady = this.ready.products && this.ready.users;
      if(!allReady){
        console.warn('⚠️ Firebase timeout — forcing ready');
        this.ready.products = true; this.ready.users = true; this.ready.orders = true;
        App.hideSplash();
      }
      this.trySeed();
    }, 4000);
  },

  watch(path, cb){
    try {
      db.ref(path).on('value',
        snap => { try{ cb(snap.val()); }catch(e){ console.error('Parse error', path, e); } },
        err => { this.error = err.message; console.error('DB error on', path, err.message); }
      );
    } catch(e){ console.error('Watch failed', path, e); }
  },

  _toArray(data){
    if(!data) return [];
    if(Array.isArray(data)) return data.filter(Boolean);
    return Object.entries(data).map(([k,v]) => {
      if(typeof v !== 'object' || v===null) return { id:k, value:v };
      return { ...v, id: v.id || k };
    });
  },

  _markReady(which){
    this.ready[which] = true;
    // সব critical ready হলে splash hide + rerender
    if(this.ready.products && this.ready.users && this.ready.orders){
      App.hideSplash();
      this.trySeed();
      App.rerenderIfVisible();
    }
  },

  async trySeed(){
    if(this.seeded) return;
    this.seeded = true;
    if(!this.ready.products) return;
    if(this.products.length > 0) return;
    console.log('🌱 Seeding initial data...');
    const products = {
      p1:{id:'p1',name:'প্রিমিয়াম ইকো-বোতল',nameEn:'Premium Eco Bottle',cat:'ইলেকট্রনিকস',catEn:'Electronics',price:850,oldPrice:1200,discount:29,stock:45,img:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',desc:'পরিবেশ বান্ধব বোতল',featured:true,createdAt:Date.now()},
      p2:{id:'p2',name:'ওয়্যারলেস হেডফোন',nameEn:'Wireless Headphone',cat:'ইলেকট্রনিকস',catEn:'Electronics',price:2500,oldPrice:3500,discount:29,stock:20,img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',desc:'নয়েজ ক্যানসেলিং',featured:true,createdAt:Date.now()+1},
      p3:{id:'p3',name:'স্মার্ট ওয়াচ',nameEn:'Smart Watch',cat:'গ্যাজেট',catEn:'Gadgets',price:3200,oldPrice:4500,discount:29,stock:15,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',desc:'ফিটনেস ট্র্যাকিং',featured:true,createdAt:Date.now()+2},
      p4:{id:'p4',name:'মিনিমালিস্ট ব্যাগ',nameEn:'Minimalist Bag',cat:'ফ্যাশন',catEn:'Fashion',price:1200,oldPrice:1800,discount:33,stock:30,img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',desc:'ওয়াটারপ্রুফ',featured:false,createdAt:Date.now()+3},
      p5:{id:'p5',name:'ক্যামেরা লেন্স',nameEn:'Camera Lens',cat:'ফটোগ্রাফি',catEn:'Photography',price:8500,oldPrice:10000,discount:15,stock:8,img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',desc:'প্রফেশনাল',featured:false,createdAt:Date.now()+4},
      p6:{id:'p6',name:'সানগ্লাস প্রিমিয়াম',nameEn:'Premium Sunglass',cat:'ফ্যাশন',catEn:'Fashion',price:950,oldPrice:1400,discount:32,stock:0,img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',desc:'UV প্রোটেকশন',featured:false,createdAt:Date.now()+5}
    };
    const users = {
      u_admin:{id:'u_admin',name:'Admin',email:'admin@eco.pro',password:'admin123',role:'admin',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'},
      u_rahim:{id:'u_rahim',name:'Rahim Uddin',email:'rahim@mail.com',password:'123456',role:'customer',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Rahim&background=10b981&color=fff'}
    };
    const cats = { c1:'ইলেকট্রনিকস', c2:'গ্যাজেট', c3:'ফ্যাশন', c4:'ফটোগ্রাফি' };
    const coupons = { cp1:{id:'cp1',code:'ECO10',type:'percent',value:10}, cp2:{id:'cp2',code:'FLAT100',type:'flat',value:100} };
    const notifs = { n1:{id:'n1',title:'স্বাগতম!',body:'EcoShop Pro MAX-এ আপনাকে স্বাগতম',time:Date.now(),read:false} };
    try {
      await Promise.all([
        db.ref('products').set(products),
        this.ready.users ? Promise.resolve() : db.ref('users').set(users),
        db.ref('categories').set(cats),
        db.ref('coupons').set(coupons),
        db.ref('notifications').set(notifs),
        db.ref('settings').set({siteName:'EcoShop Pro MAX', shipping:60, supportPhone:'+880 1700-000000'})
      ]);
      console.log('✅ Seed complete');
      Toast.show('প্রাথমিক ডেটা লোড হয়েছে','success');
    } catch(e){
      console.error('Seed failed:', e);
      Toast.show('ডেটা সেভ ব্যর্থ — Firebase Rules চেক করুন','error', 6000);
    }
  },

  /* ─── CRUD ─── */
  saveProduct(p){
    const id = p.id || 'p_'+Date.now();
    p.id = id; p.updatedAt = Date.now(); if(!p.createdAt) p.createdAt = Date.now();
    return db.ref('products/'+id).set(p);
  },
  deleteProduct(id){ return db.ref('products/'+id).remove(); },

  saveUser(u){
    const id = u.id || 'u_'+Date.now();
    u.id = id; if(!u.joined) u.joined = Date.now();
    return db.ref('users/'+id).set(u);
  },
  deleteUser(id){ return db.ref('users/'+id).remove(); },
  updateUser(id, patch){ return db.ref('users/'+id).update(patch); },

  saveOrder(o){
    const id = o.id || 'ORD-'+Date.now().toString().slice(-8);
    o.id = id;
    return db.ref('orders/'+id).set(o).then(()=>o);
  },
  updateOrder(id, patch){ return db.ref('orders/'+id).update(patch); },
  deleteOrder(id){ return db.ref('orders/'+id).remove(); },

  saveCategory(name){ return db.ref('categories/c_'+Date.now()).set(name); },
  deleteCategory(key){ return db.ref('categories/'+key).remove(); },

  saveCoupon(c){
    const id = c.id || 'cp_'+Date.now();
    c.id = id; return db.ref('coupons/'+id).set(c);
  },
  deleteCoupon(id){ return db.ref('coupons/'+id).remove(); },

  pushNotif(n){
    const id = 'n_'+Date.now(); n.id = id; n.time = Date.now(); n.read = false;
    return db.ref('notifications/'+id).set(n);
  },

  isReady(){ return this.ready.products && this.ready.users && this.ready.orders; }
};

/* ═══════════════════════════════════════════════════════════
   ImgBB Upload
   ═══════════════════════════════════════════════════════════ */
const ImageUpload = {
  async upload(file){
    if(!file) throw new Error('কোনো ফাইল নেই');
    if(file.size > 32*1024*1024) throw new Error('ফাইল ৩২MB এর কম হতে হবে');
    if(!file.type.startsWith('image/')) throw new Error('শুধু ইমেজ ফাইল');
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', file);
    const res = await fetch(IMGBB_UPLOAD_URL, { method:'POST', body: form });
    const json = await res.json();
    if(!json.success) throw new Error(json.error?.message || 'আপলোড ব্যর্থ');
    return { url: json.data.url, thumb: json.data.thumb?.url || json.data.url, id: json.data.id };
  }
};

/* ═══════════════════════════════════════════════════════════
   UI Helpers
   ═══════════════════════════════════════════════════════════ */
const Toast = {
  show(msg, type='info', ms=2600){
    const box = document.getElementById('toastContainer'); if(!box) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = {info:'fa-circle-info', success:'fa-circle-check', error:'fa-circle-exclamation', warning:'fa-triangle-exclamation'};
    el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i><span>${msg}</span>`;
    box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(40px)'; setTimeout(()=>el.remove(),250); }, ms);
  },
  progress(){ const p=document.getElementById('topProgress'); if(!p) return; p.style.width='70%'; setTimeout(()=>{p.style.width='100%';setTimeout(()=>p.style.width='0',300);},300); }
};

const Modal = {
  open(html, cls=''){
    document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)Modal.close()"><div class="modal-box ${cls}">${html}</div></div>`;
  },
  close(){ document.getElementById('modalRoot').innerHTML = ''; },
  confirm(msg, onYes){
    this.open(`<div class="confirm-box">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>${msg}</p>
      <div class="confirm-actions">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-danger btn-block" id="modalConfirmYes">${t('yes')}</button>
      </div>
    </div>`, 'sm');
    document.getElementById('modalConfirmYes').onclick = ()=>{ Modal.close(); onYes && onYes(); };
  }
};

/* ═══════════════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════════════ */
const Auth = {
  user(){ return Session.get(); },
  isAdmin(){ const u = this.user(); return u && u.role==='admin'; },
  async login(email, password){
    if(!DB.ready.users) return { ok:false, msg:'ডেটা লোড হচ্ছে, একটু অপেক্ষা করুন...' };
    const u = DB.users.find(x=>x.email===email && x.password===password);
    if(!u) return { ok:false, msg:'ভুল ইমেইল বা পাসওয়ার্ড' };
    if(u.blocked) return { ok:false, msg:'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে' };
    Session.set(u);
    return { ok:true, user:u };
  },
  async register(name, email, password){
    if(!DB.ready.users) return { ok:false, msg:'ডেটা লোড হচ্ছে, একটু অপেক্ষা করুন...' };
    if(DB.users.find(x=>x.email===email)) return { ok:false, msg:'এই ইমেইল ইতিমধ্যেই ব্যবহৃত' };
    const u = { id:'u_'+Date.now(), name, email, password, role:'customer', blocked:false, joined:Date.now(),
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` };
    try {
      await DB.saveUser(u);
      Session.set(u);
      return { ok:true, user:u };
    } catch(e){ return { ok:false, msg:'সেভ ব্যর্থ: '+e.message }; }
  },
  logout(){ Session.clear(); Toast.show('লগআউট সফল','success'); App.go('home'); }
};

/* ═══════════════════════════════════════════════════════════
   CART
   ═══════════════════════════════════════════════════════════ */
const Cart = {
  items(){ return CartStore.get(); },
  save(items){ CartStore.set(items); this.refresh(); },
  add(id, qty=1){
    const items = this.items();
    const found = items.find(i=>i.id===id);
    const p = DB.products.find(x=>x.id===id);
    if(!p) return;
    if(p.stock < qty) return Toast.show('স্টক যথেষ্ট নয়','error');
    if(found){ if(found.qty+qty > p.stock) return Toast.show('স্টক শেষ','error'); found.qty += qty; }
    else items.push({ id, qty });
    this.save(items);
    Toast.show('কার্টে যোগ হয়েছে','success');
  },
  remove(id){ this.save(this.items().filter(i=>i.id!==id)); },
  setQty(id, qty){
    const items = this.items();
    const it = items.find(i=>i.id===id); if(!it) return;
    const p = DB.products.find(x=>x.id===id);
    if(qty > p.stock) return Toast.show('স্টক শেষ','error');
    it.qty = Math.max(1, qty); this.save(items);
  },
  count(){ return this.items().reduce((s,i)=>s+i.qty,0); },
  subtotal(){ return this.items().reduce((s,i)=>{ const p=DB.products.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); },
  discountTotal(){ return this.items().reduce((s,i)=>{ const p=DB.products.find(x=>x.id===i.id); if(!p||!p.oldPrice) return s; return s+((p.oldPrice-p.price)*i.qty); },0); },
  refresh(){
    const c = this.count();
    const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = c>0 ? c : '';
    const cb = document.getElementById('cartCount'); if(cb) cb.textContent = `${c} items`;
    const st = document.getElementById('cartSubtotal'); if(st) st.textContent = '৳'+this.subtotal();
    const sh = document.getElementById('cartShipping'); if(sh) sh.textContent = '৳'+(c>0?60:0);
    const dc = document.getElementById('cartDiscount'); if(dc) dc.textContent = '-৳'+this.discountTotal();
    const tt = document.getElementById('cartTotal'); if(tt) tt.textContent = '৳'+(this.subtotal()+(c>0?60:0));
    this.renderDrawer();
  },
  renderDrawer(){
    const body = document.getElementById('cartBody'); if(!body) return;
    const items = this.items();
    if(!items.length){ body.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>কার্ট খালি</h3><p>পণ্য যোগ করে শুরু করুন</p></div>`; return; }
    body.innerHTML = items.map(i=>{
      const p = DB.products.find(x=>x.id===i.id); if(!p) return '';
      return `<div class="cart-item">
        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/60'">
        <div class="cart-item-info">
          <h5>${LANG==='bn'?p.name:p.nameEn||p.name}</h5>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="price" style="font-size:14px">৳${p.price}</span>
            <button class="icon-btn-sm danger" onclick="Cart.remove('${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
          <div class="qty-ctrl">
            <button onclick="Cart.setQty('${p.id}', ${i.qty-1})">−</button>
            <span>${i.qty}</span>
            <button onclick="Cart.setQty('${p.id}', ${i.qty+1})">+</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }
};

const Wish = {
  all(){ return WishStore.get(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all();
    const idx = list.indexOf(id);
    if(idx>-1){ list.splice(idx,1); Toast.show('উইশলিস্ট থেকে সরানো হয়েছে','info'); }
    else { list.push(id); Toast.show('উইশলিস্টে যোগ হয়েছে','success'); }
    WishStore.set(list);
    if(App.route==='wishlist' || App.route==='shop' || App.route==='home') App.render();
    else App.syncUI();
  }
};

const Orders = {
  all(){ return DB.orders; },
  mine(){ const u=Auth.user(); if(!u) return []; return DB.orders.filter(o=>o.userId===u.id); },
  async create(customer, items, total, coupon){
    const u = Auth.user();
    const order = {
      id:'ORD-'+Date.now().toString().slice(-8),
      userId: u?u.id:0, customer, items, total, coupon:coupon||null,
      status:'pending', date: Date.now()
    };
    const saved = await DB.saveOrder(order);
    // deduct stock (fire & forget)
    items.forEach(async i=>{
      const p = DB.products.find(x=>x.id===i.id);
      if(p) try { await db.ref('products/'+p.id+'/stock').set(Math.max(0, p.stock - i.qty)); } catch(e){ console.error(e); }
    });
    try { await DB.pushNotif({ title:'নতুন অর্ডার!', body:`${customer.name} — ৳${total}`, type:'order' }); } catch(e){}
    Cart.save([]);
    return saved;
  },
  updateStatus(id, status){ return DB.updateOrder(id, { status }); },
  remove(id){ return DB.deleteOrder(id); }
};

const Notifs = {
  all(){ return DB.notifs; },
  unread(){ return this.all().filter(n=>!n.read).length; },
  markAllRead(){
    this.all().forEach(n=>{ if(!n.read) db.ref('notifications/'+n.id+'/read').set(true).catch(()=>{}); });
  },
  refresh(){
    const b = document.getElementById('notifBadge'); if(b) b.textContent = this.unread() || '';
    const c = document.getElementById('notifCount'); if(c) c.textContent = `${this.unread()} unread`;
    const list = document.getElementById('notifList'); if(!list) return;
    const arr = this.all();
    list.innerHTML = arr.length ? arr.map(n=>`
      <div class="notif-item ${n.read?'':'unread'}">
        <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
        <div><h5>${n.title}</h5><p>${n.body}</p><small>${new Date(n.time).toLocaleString('bn-BD')}</small></div>
      </div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>কোনো নোটিফিকেশন নেই</h3></div>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   APP ROUTER (FIXED)
   ═══════════════════════════════════════════════════════════ */
const App = {
  route: 'home',
  _shopCat: 'all',
  _shopSort: 'default',
  _shopQ: '',
  _adminTab: 'dashboard',
  _pQuery: '',
  _uQuery: '',
  _oQuery: '',
  _selectedUsers: [],

  hideSplash(){
    const s = document.getElementById('splash');
    if(s && !s.classList.contains('hidden')){
      const bar = document.getElementById('splashBar');
      const st = document.getElementById('splashStatus');
      if(bar) bar.style.width = '100%';
      if(st) st.textContent = 'স্বাগতম!';
      setTimeout(()=>s.classList.add('hidden'), 400);
    }
  },

  rerenderIfVisible(){
    if(['home','shop','admin','orders','wishlist','profile','auth'].includes(this.route)) this.render();
    else { Cart.refresh(); Notifs.refresh(); this.syncUI(); }
  },

  go(route){
    console.log('→ Navigate:', route);
    // Admin guard
    if(route==='admin' && !Auth.isAdmin()){
      Toast.show('শুধুমাত্র অ্যাডমিন','warning');
      this.route = 'auth';
      this._authRedirect = 'admin';
    } else if(['orders','profile'].includes(route) && !Auth.user()){
      Toast.show(t('loginRequired'),'warning');
      this.route = 'auth';
      this._authRedirect = route;
    } else {
      this.route = route;
    }
    document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active', a.dataset.nav===this.route));
    this.render();
    window.scrollTo({ top:0, behavior:'smooth' });
  },

  render(){
    const el = document.getElementById('app');
    if(!el) return;
    Toast.progress();
    let html = '';
    try {
      switch(this.route){
        case 'home':     html = Pages.home(); break;
        case 'shop':     html = Pages.shop(); break;
        case 'orders':   html = Pages.orders(); break;
        case 'profile':  html = Pages.profile(); break;
        case 'wishlist': html = Pages.wishlist(); break;
        case 'admin':    html = Pages.admin(); break;
        case 'auth':     html = Pages.auth(); break;
        default:         html = Pages.home();
      }
    } catch(e){
      console.error('Render error:', e);
      html = `<div class="page"><div class="error-banner">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div><b>রেন্ডার সমস্যা</b>${e.message}</div>
      </div></div>`;
    }
    el.innerHTML = html;
    this.syncUI();
    Cart.refresh();
    Notifs.refresh();
  },

  syncUI(){
    const u = Auth.user();
    const loginBtn = document.getElementById('loginBtn');
    const avatarBtn = document.getElementById('userAvatarBtn');
    if(!loginBtn || !avatarBtn) return;
    if(u){
      loginBtn.style.display='none';
      avatarBtn.classList.add('show');
      document.getElementById('navAvatar').src = u.avatar;
      document.getElementById('ddName').textContent = u.name;
      document.getElementById('ddEmail').textContent = u.email;
      document.getElementById('ddAdmin').style.display = u.role==='admin' ? 'flex' : 'none';
      document.getElementById('pmName').textContent = u.name;
      document.getElementById('pmEmail').textContent = u.email;
      document.getElementById('pmAvatar').src = u.avatar;
      document.getElementById('pmRole').textContent = u.role.toUpperCase();
      document.getElementById('pmAdminSection').style.display = u.role==='admin' ? 'block' : 'none';
      document.getElementById('pmLoginBtn').style.display='none';
      document.getElementById('pmLogoutBtn').style.display='flex';
      document.getElementById('pmOrderCount').textContent = Orders.mine().length;
      document.getElementById('pmWishCount').textContent = Wish.all().length;
    } else {
      loginBtn.style.display='inline-flex';
      avatarBtn.classList.remove('show');
      document.getElementById('pmName').textContent = 'অতিথি';
      document.getElementById('pmEmail').textContent = 'লগইন করুন';
      document.getElementById('pmRole').textContent = 'GUEST';
      document.getElementById('pmAdminSection').style.display='none';
      document.getElementById('pmLoginBtn').style.display='flex';
      document.getElementById('pmLogoutBtn').style.display='none';
    }
  },

  openCart(){ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); }
};

/* ═══════════════════════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════════════════════ */
const Pages = {
  home(){
    if(!DB.isReady()) return loadingHTML('পণ্য লোড হচ্ছে...','Firebase থেকে ডেটা আসছে');
    const featured = DB.products.filter(p=>p.featured).slice(0,4);
    const newArr = [...DB.products].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
    return `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-badge"><i class="fa-solid fa-bolt"></i> ফায়ারবেস রিয়েলটাইম ২০২৬</div>
            <h1 class="hero-title">সেরা <span class="grad">প্রিমিয়াম</span> পণ্য<br>এখন আপনার হাতের মুঠোয়</h1>
            <p class="hero-sub">সারাদেশে দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট এবং ১০০% অরিজিনাল পণ্যের নিশ্চয়তা।</p>
            <div class="hero-btns">
              <button class="btn btn-primary btn-lg" onclick="App.go('shop')"><i class="fa-solid fa-store"></i> এখনই কিনুন</button>
              <button class="btn btn-outline btn-lg" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:#fff" onclick="App.go('orders')"><i class="fa-solid fa-box"></i> আমার অর্ডার</button>
            </div>
          </div>
        </div>
      </section>
      <div class="page">
        ${DB.error ? `<div class="error-banner"><i class="fa-solid fa-triangle-exclamation"></i><div><b>Firebase সংযোগ সমস্যা</b>${DB.error}<br>Rules চেক করুন: <code>".read": true, ".write": true</code></div></div>` : ''}
        <div class="section-head"><h2><i class="fa-solid fa-fire" style="color:var(--accent)"></i> ফিচার্ড পণ্য</h2><span class="count-chip">${featured.length} items</span></div>
        <div class="product-grid">${featured.map(Components.productCard).join('') || `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${t('empty')}</h3></div>`}</div>
        <div class="section-head" style="margin-top:40px"><h2><i class="fa-solid fa-star" style="color:var(--brand)"></i> নতুন পণ্য</h2><button class="btn btn-outline btn-sm" onclick="App.go('shop')">সব দেখুন <i class="fa-solid fa-arrow-right"></i></button></div>
        <div class="product-grid">${newArr.map(Components.productCard).join('')}</div>
      </div>`;
  },

  shop(){
    if(!DB.isReady()) return loadingHTML('পণ্য লোড হচ্ছে...','Firebase থেকে ডেটা আসছে');
    const cats = DB.categories;
    let list = DB.products.slice();
    if(App._shopCat && App._shopCat!=='all') list = list.filter(p=>p.cat===App._shopCat);
    if(App._shopQ){ const s=App._shopQ.toLowerCase(); list = list.filter(p=>(p.name+(p.nameEn||'')+(p.desc||'')).toLowerCase().includes(s)); }
    if(App._shopSort==='low') list.sort((a,b)=>a.price-b.price);
    else if(App._shopSort==='high') list.sort((a,b)=>b.price-a.price);
    else if(App._shopSort==='new') list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-store"></i> ${t('allProducts')}</h2><span class="count-chip">${list.length} items</span></div>
        <div class="filters-bar">
          <select onchange="App._shopCat=this.value;App.render()">
            <option value="all">সব ক্যাটাগরি</option>
            ${cats.map(c=>`<option value="${c}" ${App._shopCat===c?'selected':''}>${c}</option>`).join('')}
          </select>
          <select onchange="App._shopSort=this.value;App.render()">
            <option value="default" ${App._shopSort==='default'?'selected':''}>ডিফল্ট</option>
            <option value="new" ${App._shopSort==='new'?'selected':''}>নতুন</option>
            <option value="low" ${App._shopSort==='low'?'selected':''}>দাম: কম → বেশি</option>
            <option value="high" ${App._shopSort==='high'?'selected':''}>দাম: বেশি → কম</option>
          </select>
          <input placeholder="সার্চ..." value="${App._shopQ||''}" oninput="App._shopQ=this.value;clearTimeout(window._sq);window._sq=setTimeout(()=>App.render(),300)">
        </div>
        <div class="product-grid">${list.map(Components.productCard).join('') || `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('empty')}</h3></div>`}</div>
      </div>`;
  },

  orders(){
    if(!Auth.user()) return this.authPage('orders');
    const mine = Orders.mine();
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-box"></i> আমার অর্ডার</h2><span class="count-chip">${mine.length}</span></div>
        ${mine.length ? `<div class="orders-list">${mine.map(o=>`
          <div class="order-row">
            <div class="order-info">
              <h4>${o.id}</h4>
              <p>${new Date(o.date).toLocaleString('bn-BD')} • ${o.items.length} items</p>
            </div>
            <div class="order-right">
              <span class="price">৳${o.total}</span>
              <span class="status-badge status-${o.status}">${t(o.status)}</span>
            </div>
          </div>`).join('')}</div>` : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>কোনো অর্ডার নেই</h3><p>শপিং শুরু করুন</p></div>`}
      </div>`;
  },

  wishlist(){
    const ids = Wish.all();
    const list = DB.products.filter(p=>ids.includes(p.id));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-heart" style="color:var(--danger)"></i> উইশলিস্ট</h2><span class="count-chip">${list.length}</span></div>
        <div class="product-grid">${list.map(Components.productCard).join('') || `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>উইশলিস্ট খালি</h3></div>`}</div>
      </div>`;
  },

  profile(){
    const u = Auth.user();
    if(!u) return this.authPage('profile');
    return `
      <div class="page">
        <div class="profile-header">
          <img class="profile-avatar" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'">
          <div class="profile-info">
            <h2>${u.name}</h2>
            <p><i class="fa-solid fa-envelope"></i> ${u.email}</p>
            <p><i class="fa-solid fa-user-tag"></i> ${u.role==='admin'?'অ্যাডমিন':'কাস্টমার'} • <i class="fa-solid fa-calendar"></i> ${new Date(u.joined).toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
        <div class="dash-grid">
          <div class="dash-card clickable" onclick="App.go('orders')"><i class="fa-solid fa-box"></i><h3>${Orders.mine().length}</h3><p>মোট অর্ডার</p></div>
          <div class="dash-card clickable" onclick="App.go('wishlist')"><i class="fa-solid fa-heart"></i><h3>${Wish.all().length}</h3><p>উইশলিস্ট</p></div>
          <div class="dash-card clickable" onclick="App.openCart()"><i class="fa-solid fa-cart-shopping"></i><h3>${Cart.count()}</h3><p>কার্ট</p></div>
          <div class="dash-card"><i class="fa-solid fa-wallet"></i><h3>৳${Orders.mine().reduce((s,o)=>s+(o.status!=='cancelled'?o.total:0),0)}</h3><p>মোট খরচ</p></div>
        </div>
        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-pen"></i> প্রোফাইল আপডেট</h3></div>
          <div class="form-group"><label>নাম</label><input id="pfName" value="${u.name}"></div>
          <div class="form-group"><label>পাসওয়ার্ড</label><input id="pfPass" type="password" value="${u.password}"></div>
          <button class="btn btn-primary" onclick="Profile.save()"><i class="fa-solid fa-floppy-disk"></i> সেভ</button>
        </div>
      </div>`;
  },

  auth(){ return this.authPage(App._authRedirect || 'home'); },

  authPage(redirect){
    const tab = App._authTab || 'login';
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="logo-icon"><i class="fa-solid fa-leaf"></i></div>
            <h2>EcoShop<span style="color:var(--brand)">Pro</span></h2>
            <p>প্রিমিয়াম শপিং অভিজ্ঞতা</p>
          </div>
          <div class="auth-tabs">
            <button class="${tab==='login'?'active':''}" id="tabLogin" onclick="AuthUI.tab('login')">লগইন</button>
            <button class="${tab==='reg'?'active':''}" id="tabReg" onclick="AuthUI.tab('reg')">রেজিস্টার</button>
          </div>
          <div id="authForm">${tab==='login' ? AuthUI.loginForm(redirect) : AuthUI.regForm(redirect)}</div>
          <div class="info-banner" style="margin-top:16px;font-size:12px">
            <i class="fa-solid fa-circle-info"></i>
            <div>ডেমো অ্যাডমিন:<br><b>admin@eco.pro</b> / <b>admin123</b></div>
          </div>
        </div>
      </div>`;
  },

  admin(){
    if(!Auth.isAdmin()) return this.authPage('admin');
    if(!DB.isReady()) return loadingHTML('অ্যাডমিন প্যানেল লোড হচ্ছে...','ডেটা সিঙ্ক হচ্ছে');
    const tab = App._adminTab || 'dashboard';
    return `
      <div class="admin-layout">
        ${Components.adminSidebar(tab)}
        <div class="admin-main">
          <div class="admin-header">
            <button class="admin-sidebar-toggle" onclick="document.querySelector('.admin-sidebar').classList.toggle('active')"><i class="fa-solid fa-bars"></i></button>
            <div class="admin-header-title">
              <h1>${Admin.titles[tab]||'ড্যাশবোর্ড'}</h1>
              <p>EcoShop Pro MAX — Firebase Admin</p>
            </div>
            <div class="admin-header-actions">
              <button class="btn btn-outline btn-sm" onclick="App.go('home')"><i class="fa-solid fa-store"></i> স্টোর</button>
              <button class="btn btn-primary btn-sm" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> নতুন পণ্য</button>
            </div>
          </div>
          <div class="admin-content" id="adminContent">${Admin.render(tab)}</div>
        </div>
      </div>`;
  }
};

function loadingHTML(msg='লোড হচ্ছে...', sub=''){
  return `<div class="loading-state">
    <div class="spinner"></div>
    <p>${msg}</p>
    ${sub?`<small>${sub}</small>`:''}
  </div>`;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */
const Components = {
  productCard(p){
    const name = LANG==='bn' ? p.name : (p.nameEn||p.name);
    const stockCls = p.stock<=0 ? 'out' : (p.stock<10 ? 'low':'');
    const stockTxt = p.stock<=0 ? t('outOfStock') : (p.stock<10 ? `স্টক: ${p.stock}` : t('inStock'));
    return `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
          ${p.discount?`<span class="product-badge">-${p.discount}%</span>`:''}
          <span class="stock-badge ${stockCls}">${stockTxt}</span>
          <button class="wish-btn ${Wish.has(p.id)?'active':''}" onclick="event.stopPropagation();Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart"></i></button>
        </div>
        <div class="product-body">
          <span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span>
          <h3 class="product-name">${name}</h3>
          <div class="product-price">
            <span class="price">৳${p.price}</span>
            ${p.oldPrice?`<span class="old-price">৳${p.oldPrice}</span>`:''}
          </div>
          <button class="btn btn-primary btn-block btn-sm" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}')">
            <i class="fa-solid fa-cart-plus"></i> ${p.stock<=0?t('outOfStock'):t('addToCart')}
          </button>
        </div>
      </div>`;
  },

  adminSidebar(tab){
    const items = [
      {sec:'মেইন', list:[
        {id:'dashboard', icon:'fa-chart-line', label:'ড্যাশবোর্ড'},
        {id:'products', icon:'fa-box', label:'পণ্য ম্যানেজমেন্ট'},
        {id:'orders', icon:'fa-receipt', label:'অর্ডার ম্যানেজমেন্ট'},
        {id:'users', icon:'fa-users', label:'ইউজার ম্যানেজমেন্ট'},
      ]},
      {sec:'অতিরিক্ত', list:[
        {id:'categories', icon:'fa-tags', label:'ক্যাটাগরি'},
        {id:'coupons', icon:'fa-ticket', label:'কুপন'},
        {id:'settings', icon:'fa-gear', label:'সেটিংস'},
      ]}
    ];
    return `<aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="logo-icon" style="width:34px;height:34px;font-size:15px"><i class="fa-solid fa-leaf"></i></div>
        <span class="logo-text" style="font-size:15px">EcoShop<span style="color:var(--brand)">Pro</span></span>
        <span class="admin-pill">ADMIN</span>
      </div>
      <nav class="admin-nav">
        ${items.map(g=>`
          <div class="nav-section">
            <div class="nav-section-title">${g.sec}</div>
            ${g.list.map(i=>`<a class="${tab===i.id?'active':''}" onclick="Admin.switchTab('${i.id}')"><i class="fa-solid ${i.icon}"></i> ${i.label}</a>`).join('')}
          </div>`).join('')}
      </nav>
      <div class="admin-footer">
        <button class="admin-exit" onclick="App.go('home')"><i class="fa-solid fa-arrow-left"></i> স্টোরে ফিরুন</button>
      </div>
    </aside>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════════════ */
const Admin = {
  titles: { dashboard:'ড্যাশবোর্ড', products:'পণ্য ম্যানেজমেন্ট', orders:'অর্ডার ম্যানেজমেন্ট',
            users:'ইউজার ম্যানেজমেন্ট', categories:'ক্যাটাগরি', coupons:'কুপন', settings:'সেটিংস' },

  switchTab(tab){
    App._adminTab = tab;
    App.render();
  },

  render(tab){
    try {
      switch(tab){
        case 'dashboard': return this.dashboard();
        case 'products': return this.products();
        case 'orders': return this.orders();
        case 'users': return this.users();
        case 'categories': return this.categories();
        case 'coupons': return this.coupons();
        case 'settings': return this.settings();
        default: return this.dashboard();
      }
    } catch(e){ return `<div class="error-banner"><i class="fa-solid fa-triangle-exclamation"></i><div>${e.message}</div></div>`; }
  },

  dashboard(){
    const orders = DB.orders;
    const users = DB.users;
    const prods = DB.products;
    const totalSales = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0);
    const pending = orders.filter(o=>o.status==='pending').length;
    const lowStock = prods.filter(p=>p.stock<10).length;
    const recent = orders.slice(0,5);
    return `
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div><div><p>মোট বিক্রয়</p><h3>৳${totalSales.toLocaleString()}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-cart-shopping"></i></div><div><p>মোট অর্ডার</p><h3>${orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div><p>মোট ইউজার</p><h3>${users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-box"></i></div><div><p>মোট পণ্য</p><h3>${prods.length}</h3></div></div>
      </div>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div><p>পেন্ডিং অর্ডার</p><h3>${pending}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div><div><p>লো স্টক</p><h3>${lowStock}</h3></div></div>
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-user-check"></i></div><div><p>সক্রিয় ইউজার</p><h3>${users.filter(u=>!u.blocked).length}</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> সাম্প্রতিক অর্ডার</h3><button class="btn btn-outline btn-sm" onclick="Admin.switchTab('orders')">সব দেখুন</button></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>অর্ডার ID</th><th>কাস্টমার</th><th>মোট</th><th>স্ট্যাটাস</th><th>তারিখ</th></tr></thead>
            <tbody>${recent.length ? recent.map(o=>`<tr>
              <td><b>${o.id}</b></td>
              <td>${o.customer?.name||'—'}</td>
              <td>৳${o.total}</td>
              <td><span class="status-badge status-${o.status}">${t(o.status)}</span></td>
              <td>${new Date(o.date).toLocaleDateString('bn-BD')}</td>
            </tr>`).join('') : `<tr><td colspan="5" class="muted">কোনো অর্ডার নেই</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },

  products(){
    const q = App._pQuery || '';
    const list = DB.products.filter(p=> !q || (p.name+(p.nameEn||'')).toLowerCase().includes(q.toLowerCase()));
    return `
      <div class="admin-toolbar">
        <input placeholder="পণ্য সার্চ..." value="${q}" oninput="App._pQuery=this.value;clearTimeout(window._pq);window._pq=setTimeout(()=>Admin.refreshContent(),250)">
        <button class="btn btn-primary" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> নতুন পণ্য</button>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>মোট পণ্য (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>ছবি</th><th>নাম</th><th>ক্যাটাগরি</th><th>দাম</th><th>ডিসকাউন্ট</th><th>স্টক</th><th>অ্যাকশন</th></tr></thead>
            <tbody>${list.length ? list.map(p=>`<tr>
              <td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/60'"></td>
              <td><b>${p.name}</b><br><small style="color:var(--text-dim)">${p.nameEn||''}</small></td>
              <td><span class="chip">${p.cat}</span></td>
              <td>৳${p.price} ${p.oldPrice?`<br><small style="text-decoration:line-through;color:var(--text-dim)">৳${p.oldPrice}</small>`:''}</td>
              <td>${p.discount?`<span class="chip">-${p.discount}%</span>`:'—'}</td>
              <td>${p.stock<=0?`<span class="chip blocked">স্টক নেই</span>`:(p.stock<10?`<span class="chip" style="background:rgba(245,158,11,.15);color:#b45309">${p.stock}</span>`:`<span class="chip active-status">${p.stock}</span>`)}</td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn-sm danger" onclick="Admin.deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
              </div></td>
            </tr>`).join('') : `<tr><td colspan="7" class="muted">কোনো পণ্য নেই</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },

  openProductModal(id){
    const p = id ? DB.products.find(x=>x.id===id) : {name:'',nameEn:'',cat:'',catEn:'',price:'',oldPrice:'',discount:0,stock:'',img:'',desc:'',featured:false};
    const cats = DB.categories.length ? DB.categories : ['ইলেকট্রনিকস','গ্যাজেট','ফ্যাশন','ফটোগ্রাফি'];
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3>${id?'পণ্য এডিট':'নতুন পণ্য যোগ'}</h3></div>
      <div class="modal-body">
        <div class="form-group">
          <label>পণ্যের ছবি (ImgBB)</label>
          <div class="img-upload">
            <div class="img-preview" id="imgPreview">${p.img?`<img src="${p.img}">`:`<i class="fa-solid fa-image"></i>`}</div>
            <div class="upload-btn-wrap">
              <button type="button" class="upload-btn" id="uploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> ছবি আপলোড</button>
              <input type="file" id="imgFile" accept="image/*" style="display:none">
              <div class="upload-hint">JPG, PNG, WebP — সর্বোচ্চ 32MB</div>
              <div class="upload-progress" id="uploadProgress"><span></span></div>
            </div>
          </div>
          <input type="hidden" id="pImg" value="${p.img||''}">
        </div>
        <div class="form-row">
          <div class="form-group"><label>নাম (বাংলা)</label><input id="pName" value="${p.name}"></div>
          <div class="form-group"><label>Name (English)</label><input id="pNameEn" value="${p.nameEn||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>ক্যাটাগরি</label>
            <select id="pCat">${cats.map(c=>`<option ${p.cat===c?'selected':''}>${c}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Category (EN)</label><input id="pCatEn" value="${p.catEn||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>দাম (৳)</label><input id="pPrice" type="number" value="${p.price}"></div>
          <div class="form-group"><label>পুরাতন দাম (৳)</label><input id="pOld" type="number" value="${p.oldPrice||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>ডিসকাউন্ট (%)</label><input id="pDisc" type="number" value="${p.discount||0}"></div>
          <div class="form-group"><label>স্টক</label><input id="pStock" type="number" value="${p.stock}"></div>
        </div>
        <div class="form-group"><label>বিবরণ</label><textarea id="pDesc" rows="3">${p.desc||''}</textarea></div>
        <div class="form-group"><label><input type="checkbox" id="pFeatured" ${p.featured?'checked':''} style="width:auto;display:inline"> ফিচার্ড পণ্য</label></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" id="pSaveBtn" onclick="Admin.saveProduct('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `, 'md');
    this.bindUpload();
  },

  bindUpload(){
    const btn = document.getElementById('uploadBtn');
    const file = document.getElementById('imgFile');
    const prev = document.getElementById('imgPreview');
    const hidden = document.getElementById('pImg');
    const prog = document.getElementById('uploadProgress');
    if(!btn) return;
    btn.onclick = ()=> file.click();
    file.onchange = async ()=>{
      const f = file.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = e => prev.innerHTML = `<img src="${e.target.result}">`;
      reader.readAsDataURL(f);
      btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> আপলোড হচ্ছে...`;
      prog.style.display='block'; prog.firstElementChild.style.width='40%';
      try {
        const res = await ImageUpload.upload(f);
        hidden.value = res.url;
        prev.innerHTML = `<img src="${res.url}">`;
        prog.firstElementChild.style.width='100%';
        Toast.show('ছবি আপলোড সফল!','success');
      } catch(err){
        Toast.show('আপলোড ব্যর্থ: '+err.message,'error');
        prev.innerHTML = `<i class="fa-solid fa-image"></i>`;
      } finally {
        btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ছবি আপলোড`;
        setTimeout(()=>{ prog.style.display='none'; prog.firstElementChild.style.width='0'; }, 800);
      }
    };
  },

  async saveProduct(id){
    const data = {
      id: id || '',
      name: document.getElementById('pName').value.trim(),
      nameEn: document.getElementById('pNameEn').value.trim(),
      cat: document.getElementById('pCat').value,
      catEn: document.getElementById('pCatEn').value.trim(),
      price: +document.getElementById('pPrice').value || 0,
      oldPrice: +document.getElementById('pOld').value || 0,
      discount: +document.getElementById('pDisc').value || 0,
      stock: +document.getElementById('pStock').value || 0,
      img: document.getElementById('pImg').value.trim() || 'https://via.placeholder.com/300?text=No+Image',
      desc: document.getElementById('pDesc').value.trim(),
      featured: document.getElementById('pFeatured').checked
    };
    if(!data.name || !data.price){ Toast.show('নাম ও দাম আবশ্যক','error'); return; }
    const btn = document.getElementById('pSaveBtn'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> সেভ হচ্ছে...`;
    try {
      await DB.saveProduct(data);
      Modal.close(); Toast.show('পণ্য সেভ হয়েছে','success');
    } catch(e){ Toast.show('সেভ ব্যর্থ: '+e.message,'error'); btn.disabled=false; btn.innerHTML=`<i class="fa-solid fa-floppy-disk"></i> সেভ`; }
  },

  deleteProduct(id){
    Modal.confirm('পণ্যটি ডিলিট করতে চান?', async ()=>{
      try { await DB.deleteProduct(id); Toast.show('ডিলিট হয়েছে','success'); }
      catch(e){ Toast.show('ব্যর্থ: '+e.message,'error'); }
    });
  },

  orders(){
    const q = (App._oQuery||'').toLowerCase();
    const list = DB.orders.filter(o=> !q || o.id.toLowerCase().includes(q) || (o.customer?.name||'').toLowerCase().includes(q));
    return `
      <div class="admin-toolbar">
        <input placeholder="সার্চ..." value="${App._oQuery||''}" oninput="App._oQuery=this.value;clearTimeout(window._oq);window._oq=setTimeout(()=>Admin.refreshContent(),250)">
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>মোট অর্ডার (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>ID</th><th>কাস্টমার</th><th>ফোন</th><th>আইটেম</th><th>মোট</th><th>স্ট্যাটাস</th><th>ডিলিট</th></tr></thead>
            <tbody>${list.length ? list.map(o=>`<tr>
              <td><b>${o.id}</b><br><small style="color:var(--text-dim)">${new Date(o.date).toLocaleDateString('bn-BD')}</small></td>
              <td>${o.customer?.name||'—'}<br><small style="color:var(--text-dim)">${o.customer?.address||''}</small></td>
              <td>${o.customer?.phone||'—'}</td>
              <td>${o.items?.length||0}</td>
              <td><b>৳${o.total}</b></td>
              <td>
                <select onchange="Admin.changeOrderStatus('${o.id}', this.value)" style="padding:4px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:12.5px">
                  ${['pending','confirmed','shipped','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${t(s)}</option>`).join('')}
                </select>
              </td>
              <td><button class="icon-btn-sm danger" onclick="Admin.deleteOrder('${o.id}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`).join('') : `<tr><td colspan="7" class="muted">কোনো অর্ডার নেই</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },

  async changeOrderStatus(id, status){
    try { await Orders.updateStatus(id, status); Toast.show('স্ট্যাটাস আপডেট হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ','error'); }
  },

  deleteOrder(id){ Modal.confirm('অর্ডারটি ডিলিট?', async ()=>{ try { await Orders.remove(id); Toast.show('ডিলিট হয়েছে','success'); } catch(e){ Toast.show('ব্যর্থ','error'); } }); },

  users(){
    const q = (App._uQuery||'').toLowerCase();
    const list = DB.users.filter(u=> !q || (u.name+u.email).toLowerCase().includes(q));
    const selected = App._selectedUsers || [];
    return `
      <div class="admin-toolbar">
        <input placeholder="নাম / ইমেইল..." value="${App._uQuery||''}" oninput="App._uQuery=this.value;clearTimeout(window._uq);window._uq=setTimeout(()=>Admin.refreshContent(),250)">
        <button class="btn btn-primary" onclick="Admin.openUserModal()"><i class="fa-solid fa-user-plus"></i> নতুন ইউজার</button>
      </div>
      ${selected.length ? `<div class="bulk-bar">
        <span>${selected.length} নির্বাচিত</span>
        <button class="btn btn-sm btn-danger" onclick="Admin.bulkAction('delete')"><i class="fa-solid fa-trash"></i> ডিলিট</button>
        <button class="btn btn-sm btn-warning" onclick="Admin.bulkAction('block')"><i class="fa-solid fa-ban"></i> ব্লক</button>
        <button class="btn btn-sm btn-success" onclick="Admin.bulkAction('unblock')"><i class="fa-solid fa-check"></i> আনব্লক</button>
        <button class="btn btn-sm btn-outline" onclick="App._selectedUsers=[];Admin.refreshContent()">বাতিল</button>
      </div>` : ''}
      <div class="admin-card">
        <div class="admin-card-head"><h3>মোট ইউজার (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr>
              <th><input type="checkbox" onchange="Admin.toggleAllUsers(this.checked)"></th>
              <th>অ্যাভাটার</th><th>নাম</th><th>ইমেইল</th><th>রোল</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th>
            </tr></thead>
            <tbody>${list.length ? list.map(u=>`<tr>
              <td><input type="checkbox" ${selected.includes(u.id)?'checked':''} onchange="Admin.toggleUser('${u.id}', this.checked)"></td>
              <td><img class="thumb" style="border-radius:50%" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'"></td>
              <td><b>${u.name}</b></td>
              <td>${u.email}</td>
              <td><span class="chip ${u.role==='admin'?'active-status':''}">${u.role}</span></td>
              <td>${u.blocked?`<span class="chip blocked">ব্লকড</span>`:`<span class="chip active-status">সক্রিয়</span>`}</td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openUserModal('${u.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn-sm ${u.blocked?'success':''}" onclick="Admin.toggleBlock('${u.id}')"><i class="fa-solid ${u.blocked?'fa-unlock':'fa-ban'}"></i></button>
                ${u.role!=='admin'?`<button class="icon-btn-sm danger" onclick="Admin.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>`:''}
              </div></td>
            </tr>`).join('') : `<tr><td colspan="7" class="muted">কোনো ইউজার নেই</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },

  toggleUser(id, checked){
    const sel = App._selectedUsers || [];
    if(checked && !sel.includes(id)) sel.push(id);
    else if(!checked) sel.splice(sel.indexOf(id),1);
    App._selectedUsers = sel; this.refreshContent();
  },
  toggleAllUsers(checked){
    App._selectedUsers = checked ? DB.users.map(u=>u.id) : [];
    this.refreshContent();
  },
  bulkAction(type){
    const ids = App._selectedUsers || [];
    if(!ids.length) return;
    Modal.confirm(`${ids.length} জনের উপর ${type==='delete'?'ডিলিট':type==='block'?'ব্লক':'আনব্লক'}?`, async ()=>{
      for(const id of ids){
        const u = DB.users.find(x=>x.id===id);
        if(!u || u.role==='admin') continue;
        try {
          if(type==='delete') await DB.deleteUser(id);
          else await DB.updateUser(id, { blocked: type==='block' });
        } catch(e){ console.error(e); }
      }
      App._selectedUsers = [];
      Toast.show('সফল','success');
    });
  },

  openUserModal(id){
    const u = id ? DB.users.find(x=>x.id===id) : {name:'',email:'',password:'',role:'customer'};
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3>${id?'ইউজার এডিট':'নতুন ইউজার'}</h3></div>
      <div class="modal-body">
        <div class="form-group"><label>নাম</label><input id="uName" value="${u.name}"></div>
        <div class="form-group"><label>ইমেইল</label><input id="uEmail" type="email" value="${u.email}"></div>
        <div class="form-group"><label>পাসওয়ার্ড</label><input id="uPass" value="${u.password}"></div>
        <div class="form-group"><label>রোল</label>
          <select id="uRole">
            <option value="customer" ${u.role==='customer'?'selected':''}>Customer</option>
            <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
          </select>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" onclick="Admin.saveUser('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `);
  },

  async saveUser(id){
    const name = document.getElementById('uName').value.trim();
    const email = document.getElementById('uEmail').value.trim();
    const password = document.getElementById('uPass').value.trim();
    const role = document.getElementById('uRole').value;
    if(!name || !email || !password){ Toast.show('সব তথ্য দিন','error'); return; }
    if(!id && DB.users.find(x=>x.email===email)){ Toast.show('ইমেইল আগেই আছে','error'); return; }
    const existing = id ? DB.users.find(x=>x.id===id) : null;
    const data = { id, name, email, password, role,
      blocked: existing?.blocked || false,
      joined: existing?.joined || Date.now(),
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` };
    try { await DB.saveUser(data); Modal.close(); Toast.show('সেভ হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ: '+e.message,'error'); }
  },

  async toggleBlock(id){
    const u = DB.users.find(x=>x.id===id); if(!u || u.role==='admin') return;
    try { await DB.updateUser(id, { blocked: !u.blocked }); Toast.show(u.blocked?'আনব্লক হয়েছে':'ব্লক হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ','error'); }
  },

  deleteUser(id){
    Modal.confirm('ইউজারটি ডিলিট?', async ()=>{ try { await DB.deleteUser(id); Toast.show('ডিলিট হয়েছে','success'); } catch(e){ Toast.show('ব্যর্থ','error'); } });
  },

  categories(){
    const cats = DB.categories;
    const keys = Object.entries(DB.catRaw);
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3>ক্যাটাগরি ম্যানেজমেন্ট</h3></div>
        <div class="admin-toolbar">
          <input id="newCat" placeholder="নতুন ক্যাটাগরির নাম">
          <button class="btn btn-primary" onclick="Admin.addCat()"><i class="fa-solid fa-plus"></i> যোগ করুন</button>
        </div>
        <div class="chips-wrap">
          ${keys.length ? keys.map(([k,v])=>`<div class="chip-large">${v}<button onclick="Admin.delCat('${k}')"><i class="fa-solid fa-xmark"></i></button></div>`).join('') : '<p class="muted">কোনো ক্যাটাগরি নেই</p>'}
        </div>
      </div>`;
  },
  async addCat(){
    const v = document.getElementById('newCat').value.trim(); if(!v) return;
    if(DB.categories.includes(v)) return Toast.show('আগেই আছে','warning');
    try { await DB.saveCategory(v); Toast.show('যোগ হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ: '+e.message,'error'); }
  },
  delCat(key){
    Modal.confirm('ক্যাটাগরি ডিলিট?', async ()=>{
      try { await DB.deleteCategory(key); Toast.show('ডিলিট হয়েছে','success'); }
      catch(e){ Toast.show('ব্যর্থ','error'); }
    });
  },

  coupons(){
    const list = DB.coupons;
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3>কুপন কোড</h3></div>
        <div class="admin-toolbar">
          <input id="cCode" placeholder="কোড (ECO10)">
          <select id="cType"><option value="percent">শতাংশ (%)</option><option value="flat">ফ্ল্যাট (৳)</option></select>
          <input id="cVal" type="number" placeholder="মান">
          <button class="btn btn-primary" onclick="Admin.addCoupon()"><i class="fa-solid fa-plus"></i> যোগ</button>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>কোড</th><th>টাইপ</th><th>মান</th><th>অ্যাকশন</th></tr></thead>
            <tbody>${list.length ? list.map(c=>`<tr>
              <td><b>${c.code}</b></td>
              <td><span class="chip">${c.type}</span></td>
              <td>${c.type==='percent'?c.value+'%':'৳'+c.value}</td>
              <td><button class="icon-btn-sm danger" onclick="Admin.delCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`).join('') : `<tr><td colspan="4" class="muted">কোনো কুপন নেই</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },
  async addCoupon(){
    const code = document.getElementById('cCode').value.trim().toUpperCase();
    const type = document.getElementById('cType').value;
    const value = +document.getElementById('cVal').value;
    if(!code || !value) return Toast.show('সব তথ্য দিন','error');
    if(DB.coupons.find(c=>c.code===code)) return Toast.show('কোড আগেই আছে','warning');
    try { await DB.saveCoupon({ code, type, value }); Toast.show('যোগ হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ','error'); }
  },
  async delCoupon(id){ try { await DB.deleteCoupon(id); Toast.show('ডিলিট','success'); } catch(e){ Toast.show('ব্যর্থ','error'); } },

  settings(){
    const s = DB.settings || {};
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-gear"></i> সাইট সেটিংস</h3></div>
        <div class="form-group"><label>সাইটের নাম</label><input id="stName" value="${s.siteName||'EcoShop Pro MAX'}"></div>
        <div class="form-group"><label>ডেলিভারি চার্জ (৳)</label><input id="stShip" type="number" value="${s.shipping||60}"></div>
        <div class="form-group"><label>সাপোর্ট ফোন</label><input id="stPhone" value="${s.supportPhone||'+880 1700-000000'}"></div>
        <button class="btn btn-primary" onclick="Admin.saveSettings()"><i class="fa-solid fa-floppy-disk"></i> সেভ</button>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-database"></i> ডেটা</h3></div>
        <p style="color:var(--text-dim);font-size:13px;padding:0 0 12px">ডেটা Firebase-এ, ছবি ImgBB-তে সংরক্ষিত।</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-danger" onclick="Admin.resetAll()"><i class="fa-solid fa-trash"></i> সব রিসেট</button>
          <button class="btn btn-outline" onclick="Admin.exportData()"><i class="fa-solid fa-download"></i> এক্সপোর্ট JSON</button>
        </div>
      </div>`;
  },
  async saveSettings(){
    const settings = {
      siteName: document.getElementById('stName').value.trim(),
      shipping: +document.getElementById('stShip').value || 60,
      supportPhone: document.getElementById('stPhone').value.trim()
    };
    try { await db.ref('settings').set(settings); Toast.show('সেভ হয়েছে','success'); }
    catch(e){ Toast.show('ব্যর্থ','error'); }
  },
  resetAll(){
    Modal.confirm('সব ডেটা মুছে যাবে!', async ()=>{
      try { await db.ref().set({ settings:{siteName:'EcoShop Pro MAX', shipping:60} }); localStorage.clear(); location.reload(); }
      catch(e){ Toast.show('ব্যর্থ','error'); }
    });
  },
  exportData(){
    const data = { products:DB.products, users:DB.users, orders:DB.orders, categories:DB.categories, coupons:DB.coupons };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ecoshop-data.json'; a.click();
    Toast.show('এক্সপোর্ট সম্পন্ন','success');
  },

  refreshContent(){
    const el = document.getElementById('adminContent');
    if(el) el.innerHTML = this.render(App._adminTab||'dashboard');
  }
};

/* ═══════════════════════════════════════════════════════════
   AUTH UI
   ═══════════════════════════════════════════════════════════ */
const AuthUI = {
  tab(which){
    App._authTab = which;
    document.getElementById('tabLogin').classList.toggle('active', which==='login');
    document.getElementById('tabReg').classList.toggle('active', which==='reg');
    document.getElementById('authForm').innerHTML = which==='login' ? this.loginForm(App._authRedirect||'home') : this.regForm(App._authRedirect||'home');
  },
  loginForm(redirect='home'){
    return `<form onsubmit="AuthUI.doLogin(event, '${redirect}')">
      <div class="form-group"><label>ইমেইল</label><input type="email" id="authEmail" required placeholder="admin@eco.pro" autocomplete="email"></div>
      <div class="form-group"><label>পাসওয়ার্ড</label><input type="password" id="authPass" required placeholder="admin123" autocomplete="current-password"></div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmit">লগইন <i class="fa-solid fa-arrow-right"></i></button>
    </form>`;
  },
  regForm(redirect='home'){
    return `<form onsubmit="AuthUI.doReg(event, '${redirect}')">
      <div class="form-group"><label>নাম</label><input id="regName" required autocomplete="name"></div>
      <div class="form-group"><label>ইমেইল</label><input type="email" id="regEmail" required autocomplete="email"></div>
      <div class="form-group"><label>পাসওয়ার্ড</label><input type="password" id="regPass" required minlength="6" autocomplete="new-password"></div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="regSubmit">রেজিস্টার <i class="fa-solid fa-user-plus"></i></button>
    </form>`;
  },
  async doLogin(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('loginSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> লগইন হচ্ছে...`;
    const r = await Auth.login(document.getElementById('authEmail').value.trim(), document.getElementById('authPass').value);
    if(!r.ok){
      Toast.show(r.msg,'error');
      btn.disabled = false; btn.innerHTML = `লগইন <i class="fa-solid fa-arrow-right"></i>`;
      return;
    }
    Toast.show('স্বাগতম, '+r.user.name,'success');
    const target = r.user.role==='admin' ? 'admin' : (redirect && redirect!=='home' ? redirect : 'home');
    App._authRedirect = null;
    App.go(target);
  },
  async doReg(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('regSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> রেজিস্টার...`;
    const r = await Auth.register(
      document.getElementById('regName').value.trim(),
      document.getElementById('regEmail').value.trim(),
      document.getElementById('regPass').value
    );
    if(!r.ok){
      Toast.show(r.msg,'error');
      btn.disabled = false; btn.innerHTML = `রেজিস্টার <i class="fa-solid fa-user-plus"></i>`;
      return;
    }
    Toast.show('রেজিস্ট্রেশন সফল','success');
    App._authRedirect = null;
    App.go(redirect && redirect!=='home' ? redirect : 'home');
  }
};

/* ═══════════════════════════════════════════════════════════
   CHECKOUT
   ═══════════════════════════════════════════════════════════ */
const Checkout = {
  coupon: null,
  open(){
    const u = Auth.user();
    if(!u){ Toast.show(t('loginRequired'),'warning'); App._authRedirect='home'; App.go('auth'); return; }
    if(!Cart.items().length) return Toast.show('কার্ট খালি','warning');
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-credit-card"></i> চেকআউট</h3></div>
      <div class="modal-body">
        <div class="form-group"><label>নাম</label><input id="coName" value="${u.name}"></div>
        <div class="form-row">
          <div class="form-group"><label>ফোন</label><input id="coPhone" placeholder="017XXXXXXXX"></div>
          <div class="form-group"><label>শহর</label><input id="coCity" value="ঢাকা"></div>
        </div>
        <div class="form-group"><label>ঠিকানা</label><textarea id="coAddr" rows="2"></textarea></div>
        <div class="form-group"><label>কুপন (ঐচ্ছিক)</label>
          <div style="display:flex;gap:8px"><input id="coCoupon" placeholder="ECO10"><button class="btn btn-outline" onclick="Checkout.applyCoupon()">অ্যাপ্লাই</button></div>
        </div>
        <div style="background:var(--surface-2);padding:14px;border-radius:10px;margin-top:12px">
          <div class="cart-summary-row"><span>Subtotal</span><span>৳${Cart.subtotal()}</span></div>
          <div class="cart-summary-row"><span>Shipping</span><span>৳60</span></div>
          <div class="cart-summary-row"><span>Coupon</span><span id="coCouponShow">—</span></div>
          <div class="cart-summary-row total"><span>Total</span><span id="coTotal">৳${Cart.subtotal()+60}</span></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">বাতিল</button>
        <button class="btn btn-primary btn-block" id="coSubmit" onclick="Checkout.place()"><i class="fa-solid fa-check"></i> অর্ডার কনফার্ম</button>
      </div>
    `);
    this.coupon = null;
  },
  applyCoupon(){
    const code = document.getElementById('coCoupon').value.trim().toUpperCase();
    const c = DB.coupons.find(x=>x.code===code);
    if(!c){ Toast.show('কুপন সঠিক নয়','error'); return; }
    this.coupon = c;
    const sub = Cart.subtotal() + 60;
    const off = c.type==='percent' ? Math.round(sub * c.value/100) : c.value;
    document.getElementById('coCouponShow').textContent = `-৳${off} (${c.code})`;
    document.getElementById('coTotal').textContent = '৳' + Math.max(0, sub-off);
    Toast.show('কুপন অ্যাপ্লাই','success');
  },
  async place(){
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const address = document.getElementById('coAddr').value.trim();
    if(!name || !phone || !address){ Toast.show('সব তথ্য পূরণ করুন','error'); return; }
    const sub = Cart.subtotal() + 60;
    const off = this.coupon ? (this.coupon.type==='percent' ? Math.round(sub*this.coupon.value/100) : this.coupon.value) : 0;
    const total = Math.max(0, sub - off);
    const items = Cart.items().map(i=>{
      const p = DB.products.find(x=>x.id===i.id);
      return { id:i.id, name:p?.name||'—', price:p?.price||0, qty:i.qty };
    });
    const btn = document.getElementById('coSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> প্রসেসিং...`;
    try {
      const order = await Orders.create({ name, phone, city, address }, items, total, this.coupon?.code);
      Modal.close();
      Toast.show('অর্ডার সফল! ID: '+order.id,'success',4000);
      App.go('orders');
    } catch(e){
      console.error(e);
      Toast.show('অর্ডার ব্যর্থ: '+e.message,'error');
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-check"></i> অর্ডার কনফার্ম`;
    }
  }
};

const Profile = {
  async save(){
    const u = Auth.user(); if(!u) return;
    const name = document.getElementById('pfName').value.trim();
    const pass = document.getElementById('pfPass').value.trim();
    if(!name || !pass) return Toast.show('তথ্য পূরণ করুন','error');
    const patch = { name, password: pass, avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` };
    try {
      await DB.updateUser(u.id, patch);
      Session.set({ ...u, ...patch });
      Toast.show('প্রোফাইল আপডেট','success'); App.render();
    } catch(e){ Toast.show('ব্যর্থ','error'); }
  }
};

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('eco_theme', mode);
  document.querySelectorAll('[data-set-theme]').forEach(b=>b.classList.toggle('active', b.dataset.setTheme===mode));
  const tb = document.getElementById('themeBtn');
  if(tb) tb.innerHTML = `<i class="fa-solid fa-${mode==='dark'?'sun':'moon'}"></i>`;
}
function applyLang(lang){
  LANG = lang; localStorage.setItem('eco_lang', lang);
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = lang.toUpperCase();
  document.querySelectorAll('[data-set-lang]').forEach(b=>b.classList.toggle('active', b.dataset.setLang===lang));
  App.render();
}
function setFbStatus(ok, text){
  const el = document.getElementById('fbStatus');
  const txt = document.getElementById('fbStatusText');
  if(el) el.style.color = ok ? 'var(--success)' : 'var(--warning)';
  if(txt) txt.textContent = text;
}

document.addEventListener('DOMContentLoaded', ()=>{
  console.log('🚀 App starting...');
  applyTheme(localStorage.getItem('eco_theme') || 'light');
  LANG = localStorage.getItem('eco_lang') || 'bn';
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = LANG.toUpperCase();

  /* Splash animation */
  let p = 0;
  const statuses = ['Firebase-এ সংযুক্ত হচ্ছে...','ডেটা সিঙ্ক হচ্ছে...','প্রায় শেষ...','স্বাগতম!'];
  const splashTimer = setInterval(()=>{
    p += 25;
    const bar = document.getElementById('splashBar');
    const st = document.getElementById('splashStatus');
    if(bar) bar.style.width = p+'%';
    if(st) st.textContent = statuses[Math.min(3, Math.floor(p/25)-1)] || statuses[0];
    if(p>=100){
      clearInterval(splashTimer);
      // Splash hide হবে শুধু App.hideSplash() থেকে, কিন্তু 5s এ backup force hide
    }
  }, 350);

  /* Backup splash hide after 5s */
  setTimeout(()=>App.hideSplash(), 5000);

  /* Firebase connect status */
  if(fbReady){
    setFbStatus(false, 'Firebase: সংযোগ হচ্ছে...');
    db.ref('.info/connected').on('value', snap=>{
      setFbStatus(snap.val()===true, snap.val()===true ? 'Firebase: ✅ সংযুক্ত' : 'Firebase: ⚠️ অফলাইন');
    });
    DB.init();
  } else {
    setFbStatus(false, 'Firebase: ❌ ব্যর্থ');
    Toast.show('Firebase init failed: '+fbError, 'error', 8000);
    App.hideSplash();
  }

  /* Nav events */
  window.addEventListener('scroll', ()=>{
    const nb = document.getElementById('navbar'); if(nb) nb.classList.toggle('scrolled', window.scrollY>10);
    const btt = document.getElementById('backToTop'); if(btt) btt.classList.toggle('show', window.scrollY>400);
  });
  const btt = document.getElementById('backToTop'); if(btt) btt.onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});

  document.querySelectorAll('[data-nav]').forEach(a=>{
    a.onclick = ()=>{
      const r = a.dataset.nav;
      if(r==='cart'){ App.openCart(); return; }
      App.go(r);
    };
  });
  document.querySelectorAll('.nav-menu a').forEach(a=>{ a.onclick = ()=> App.go(a.dataset.nav); });

  const openPM = ()=>{ document.getElementById('powerMenu').classList.add('active'); document.getElementById('backdrop').classList.add('active'); };
  const closePM = ()=>{ document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); };
  const menuToggle = document.getElementById('menuToggle'); if(menuToggle) menuToggle.onclick = openPM;
  const pmClose = document.getElementById('pmClose'); if(pmClose) pmClose.onclick = closePM;

  const openCart = ()=>{ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); };
  const closeCart = ()=>{ document.getElementById('cartDrawer').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); };
  const cartBtn = document.getElementById('cartBtn'); if(cartBtn) cartBtn.onclick = openCart;
  const cartClose = document.getElementById('cartClose'); if(cartClose) cartClose.onclick = closeCart;
  const checkoutBtn = document.getElementById('checkoutBtn'); if(checkoutBtn) checkoutBtn.onclick = ()=>{ closeCart(); Checkout.open(); };

  const openNotif = ()=>{ document.getElementById('notifPanel').classList.add('active'); document.getElementById('backdrop').classList.add('active'); Notifs.markAllRead(); };
  const closeNotif = ()=>{ document.getElementById('notifPanel').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); };
  const notifBtn = document.getElementById('notifBtn'); if(notifBtn) notifBtn.onclick = openNotif;
  const notifClose = document.getElementById('notifClose'); if(notifClose) notifClose.onclick = closeNotif;

  const backdrop = document.getElementById('backdrop');
  if(backdrop) backdrop.onclick = ()=>{ closePM(); closeCart(); closeNotif(); document.querySelector('.admin-sidebar')?.classList.remove('active'); };

  const loginBtn = document.getElementById('loginBtn'); if(loginBtn) loginBtn.onclick = ()=>{ closePM(); App._authRedirect='home'; App.go('auth'); };
  const pmLoginBtn = document.getElementById('pmLoginBtn'); if(pmLoginBtn) pmLoginBtn.onclick = ()=>{ closePM(); App._authRedirect='home'; App.go('auth'); };
  const pmLogoutBtn = document.getElementById('pmLogoutBtn'); if(pmLogoutBtn) pmLogoutBtn.onclick = ()=>{ closePM(); Auth.logout(); };

  const av = document.getElementById('userAvatarBtn');
  const dd = document.getElementById('userDropdown');
  if(av && dd){
    av.onclick = (e)=>{ e.stopPropagation(); dd.classList.toggle('active'); };
    document.addEventListener('click', ()=> dd.classList.remove('active'));
  }

  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn) themeBtn.onclick = ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  const langBtn = document.getElementById('langBtn');
  if(langBtn) langBtn.onclick = ()=> applyLang(LANG==='bn'?'en':'bn');
  document.querySelectorAll('[data-set-theme]').forEach(b=> b.onclick = ()=> applyTheme(b.dataset.setTheme));
  document.querySelectorAll('[data-set-lang]').forEach(b=> b.onclick = ()=> applyLang(b.dataset.setLang));

  const gs = document.getElementById('globalSearch');
  if(gs) gs.oninput = (e)=>{
    App._shopQ = e.target.value; App._shopCat='all';
    if(App.route!=='shop') App.go('shop');
    else App.render();
  };

  /* Initial render */
  App.render();
  console.log('✅ App ready');
});
