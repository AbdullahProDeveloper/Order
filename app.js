/* ═══════════════════════════════════════════════════════════════════════
   EcoShop Pro MAX v7.0 — Enterprise + EmailJS OTP Registration
   ═══════════════════════════════════════════════════════════════════════ */

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

/* ───────── EmailJS Config ───────── */
const EmailJSConfig = {
  publicKey: 'zuPQJsWL-br59MV3t',
  serviceId: 'service_Abdullah_200',
  templateId: 'template_edu2aen',
  initialized: false
};

let fbApp, db, fbReady = false, fbError = null;
try {
  fbApp = firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  try { firebase.analytics(); } catch(e){}
  fbReady = true;
  console.log('✅ Firebase initialized');
} catch(e){ fbError = e.message; console.error('❌ Firebase init:', e); }

const DEFAULT_SETTINGS = {
  siteName:'EcoShop Pro MAX',
  shippingInsideDhaka: 100,
  shippingOutsideDhaka: 120,
  supportPhone: '+880 1700-000000',
  supportEmail: 'support@ecoshop.pro',
  bkashNumber: '01700000000',
  nagadNumber: '01700000000',
  rocketNumber: '01700000000',
  enableCOD: true,
  enableBkash: true,
  enableNagad: true,
  enableRocket: true,
  requireEmailOTP: true
};

/* ═══════════════════════════════════════════════════════════
   i18n
   ═══════════════════════════════════════════════════════════ */
const I18N = {
  bn: {
    home:'হোম', shop:'শপ', orders:'অর্ডার', profile:'প্রোফাইল', admin:'অ্যাডমিন',
    dashboard:'ড্যাশবোর্ড', myOrders:'আমার অর্ডার', wishlist:'উইশলিস্ট', cart:'কার্ট',
    login:'লগইন', logout:'লগআউট', register:'রেজিস্টার', loginRegister:'লগইন / রেজিস্টার',
    adminPanel:'অ্যাডমিন প্যানেল', notifications:'নোটিফিকেশন', navigation:'নেভিগেশন',
    management:'ম্যানেজমেন্ট', settings:'সেটিংস', theme:'থিম', language:'ভাষা',
    light:'লাইট', dark:'ডার্ক', searchPlaceholder:'পণ্য খুঁজুন...',
    splashTagline:'প্রিমিয়াম ই-কমার্স অভিজ্ঞতা',
    footerDesc:'বাংলাদেশের সেরা প্রিমিয়াম অনলাইন শপিং প্ল্যাটফর্ম। Firebase Realtime Database দ্বারা পরিচালিত।',
    quickLinks:'দ্রুত লিংক', support:'সাপোর্ট', allRights:'সর্বস্বত্ব সংরক্ষিত',
    subtotal:'সাবটোটাল', shipping:'ডেলিভারি', discount:'ডিসকাউন্ট', total:'সর্বমোট', checkout:'চেকআউট',
    addToCart:'কার্টে যোগ করুন', buyNow:'এখনই কিনুন', outOfStock:'স্টক নেই', inStock:'স্টকে আছে',
    empty:'কোনো পণ্য নেই', allProducts:'সকল পণ্য', featured:'ফিচার্ড পণ্য', newArrivals:'নতুন পণ্য',
    price:'দাম', stock:'স্টক', category:'ক্যাটাগরি', save:'সেভ', cancel:'বাতিল', delete:'ডিলিট',
    edit:'এডিট', yes:'হ্যাঁ', no:'না', close:'বন্ধ', confirmDelete:'আপনি কি নিশ্চিত?',
    pending:'পেন্ডিং', confirmed:'কনফার্মড', shipped:'শিপড', delivered:'ডেলিভারড', cancelled:'বাতিল',
    loginRequired:'অনুগ্রহ করে লগইন করুন', adminRequired:'শুধুমাত্র অ্যাডমিন',
    fullName:'পূর্ণ নাম', email:'ইমেইল', password:'পাসওয়ার্ড', confirmPassword:'পাসওয়ার্ড নিশ্চিত',
    phone:'ফোন নম্বর', address:'ঠিকানা', city:'শহর',
    agreeTerms:'আমি শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত',
    yourProfile:'আপনার প্রোফাইল', editProfile:'প্রোফাইল এডিট',
    newPassword:'নতুন পাসওয়ার্ড (খালি রাখলে পরিবর্তন হবে না)',
    orderId:'অর্ডার ID', orderDate:'অর্ডারের তারিখ', orderStatus:'অর্ডার স্ট্যাটাস', orderTotal:'সর্বমোট',
    productName:'পণ্যের নাম', productNameEn:'Product Name (English)',
    description:'বিবরণ', descriptionEn:'Description (English)', images:'ছবি',
    oldPrice:'পুরাতন দাম', discountPercent:'ডিসকাউন্ট (%)', tags:'ট্যাগ', featured_product:'ফিচার্ড পণ্য',
    reviews:'রিভিউ', writeReview:'রিভিউ লিখুন', submitReview:'রিভিউ জমা দিন', yourRating:'আপনার রেটিং',
    relatedProducts:'সম্পর্কিত পণ্য',
    minPrice:'সর্বনিম্ন দাম', maxPrice:'সর্বোচ্চ দাম', applyFilter:'ফিল্টার প্রয়োগ',
    clearFilters:'ফিল্টার মুছুন', defaultSort:'ডিফল্ট',
    priceLowHigh:'দাম: কম থেকে বেশি', priceHighLow:'দাম: বেশি থেকে কম', newest:'নতুন আগে',
    popular:'জনপ্রিয়', searchResults:'সার্চ ফলাফল',
    profileUpdated:'প্রোফাইল আপডেট হয়েছে', loginSuccess:'লগইন সফল', registerSuccess:'রেজিস্ট্রেশন সফল',
    logoutSuccess:'লগআউট সফল', saveSuccess:'সেভ হয়েছে', deleteSuccess:'ডিলিট হয়েছে',
    adminOnly:'শুধুমাত্র অ্যাডমিন',
    invalidCredentials:'ভুল ইমেইল বা পাসওয়ার্ড', accountBlocked:'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে',
    emailExists:'এই ইমেইল ইতিমধ্যেই ব্যবহৃত', passwordMismatch:'পাসওয়ার্ড মিলছে না',
    weakPassword:'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
    fillAllFields:'সব তথ্য পূরণ করুন', orderPlaced:'অর্ডার সফল হয়েছে', orderFailed:'অর্ডার ব্যর্থ',
    couponApplied:'কুপন প্রয়োগ হয়েছে', invalidCoupon:'কুপন কোড সঠিক নয়',
    emptyCart:'আপনার কার্ট খালি', cartItems:'আইটেম', imageUploadSuccess:'ছবি আপলোড সফল',
    imageUploadFailed:'আপলোড ব্যর্থ', processing:'প্রসেসিং...', loadingData:'ডেটা লোড হচ্ছে...',
    totalProducts:'মোট পণ্য', totalOrders:'মোট অর্ডার', totalUsers:'মোট ইউজার', totalSales:'মোট বিক্রয়',
    pendingOrders:'পেন্ডিং অর্ডার', lowStock:'কম স্টক', activeUsers:'সক্রিয় ইউজার',
    recentOrders:'সাম্প্রতিক অর্ডার', products:'পণ্য', users:'ইউজার', ordersTab:'অর্ডার',
    coupons:'কুপন', categories:'ক্যাটাগরি',
    addProduct:'নতুন পণ্য যোগ', editProduct:'পণ্য এডিট করুন', productSearch:'পণ্য সার্চ...',
    addUser:'নতুন ইউজার', editUser:'ইউজার এডিট', userSearch:'নাম / ইমেইল সার্চ...',
    orderSearch:'অর্ডার সার্চ...', role:'রোল', customer:'কাস্টমার', adminRole:'অ্যাডমিন',
    blocked:'ব্লকড', active:'সক্রিয়', block:'ব্লক', unblock:'আনব্লক',
    selected:'নির্বাচিত', deleteConfirm:'ডিলিট করতে চান?', categoryName:'ক্যাটাগরির নাম', addCategory:'ক্যাটাগরি যোগ',
    couponCode:'কুপন কোড', percentOff:'শতাংশ (%)', flatOff:'ফ্ল্যাট (৳)', addCoupon:'কুপন যোগ',
    siteName:'সাইটের নাম', supportPhone:'সাপোর্ট ফোন',
    exportData:'এক্সপোর্ট JSON', resetAll:'সব ডেটা রিসেট', resetConfirm:'সমস্ত ডেটা মুছে যাবে!',
    noData:'কোনো ডেটা নেই', items:'আইটেম',
    quickView:'দ্রুত দেখুন', printInvoice:'ইনভয়েস প্রিন্ট',
    installApp:'অ্যাপ ইনস্টল করুন', installHint:'হোম স্ক্রিনে যোগ করে দ্রুত অ্যাক্সেস করুন', install:'ইনস্টল',
    offlineMode:'অফলাইন — কিছু ফিচার সীমিত',
    pushNotif:'পুশ নোটিফিকেশন', enable:'চালু', pushEnabled:'পুশ চালু হয়েছে',
    paymentMethod:'পেমেন্ট পদ্ধতি', selectPayment:'পেমেন্ট পদ্ধতি নির্বাচন করুন',
    cod:'ক্যাশ অন ডেলিভারি', codDesc:'পণ্য হাতে পেয়ে পেমেন্ট',
    bkash:'বিকাশ', nagad:'নগদ', rocket:'রকেট', mobilePayment:'মোবাইল পেমেন্ট',
    paymentNumber:'পেমেন্ট নাম্বার', copy:'কপি', copied:'কপি হয়েছে',
    sendMoneySteps:'সেন্ড মানি করার ধাপ', useDialCode:'ডায়াল কোড দিয়ে সেন্ড মানি',
    txnId:'ট্রানজেকশন আইডি', txnIdPlaceholder:'যেমন: 8AB1C2D3E4',
    screenshot:'স্ক্রিনশট', screenshotOptional:'(ঐচ্ছিক)', uploadScreenshot:'স্ক্রিনশট আপলোড',
    confirmOrder:'অর্ডার কনফার্ম করুন',
    orderSuccessCOD:'অর্ডার সফল! ক্যাশ অন ডেলিভারিতে পেমেন্ট হবে',
    orderSuccessPaid:'অর্ডার সফল! পেমেন্ট ভেরিফিকেশনের অপেক্ষায়',
    deliveryZone:'ডেলিভারি এলাকা', insideDhaka:'ঢাকার ভিতরে', outsideDhaka:'ঢাকার বাইরে',
    deliveryCharge:'ডেলিভারি চার্জ', deliveryChargeEdit:'ডেলিভারি চার্জ পরিবর্তন',
    adminComment:'অ্যাডমিন কমেন্ট', adminCommentOptional:'(ঐচ্ছিক)', commentPlaceholder:'কমেন্ট লিখুন...',
    paymentInfo:'পেমেন্ট তথ্য', paymentNumberConfig:'পেমেন্ট নাম্বার সেটআপ', settingsSaved:'সেটিংস সেভ হয়েছে',
    numberCopied:'নাম্বার কপি হয়েছে', dialCodeCopied:'ডায়াল কোড কপি হয়েছে',
    invalidTxnId:'সঠিক ট্রানজেকশন আইডি দিন (কমপক্ষে ৬ অক্ষর)',
    // OTP
    sendOTP:'OTP পাঠান', verifyOTP:'যাচাই করুন', resendOTP:'আবার পাঠান', resendIn:'আবার পাঠান',
    verifyEmail:'ইমেইল যাচাই করুন', weSentCode:'আমরা ৬-ডিজিটের কোড পাঠিয়েছি',
    otpValidTime:'১০ মিনিট পর্যন্ত বৈধ', changeInfo:'তথ্য পরিবর্তন',
    otpSent:'✅ OTP পাঠানো হয়েছে, ইমেইল চেক করুন', otpSending:'পাঠানো হচ্ছে...',
    otpVerifying:'যাচাই হচ্ছে...', emailAvailable:'✓ ইমেইল ব্যবহারযোগ্য',
    emailTaken:'❌ এই ইমেইল আগেই রেজিস্ট্রেশন করা হয়েছে',
    invalidEmail:'সঠিক ইমেইল দিন', agreeToTerms:'শর্তাবলীতে সম্মতি দিন',
    enterFullCode:'৬-ডিজিটের সম্পূর্ণ কোড দিন', registrationSuccess:'🎉 রেজিস্ট্রেশন সফল!',
    otpFailed:'ইমেইল পাঠানো যায়নি'
  },
  en: {
    home:'Home', shop:'Shop', orders:'Orders', profile:'Profile', admin:'Admin',
    dashboard:'Dashboard', myOrders:'My Orders', wishlist:'Wishlist', cart:'Cart',
    login:'Login', logout:'Logout', register:'Register', loginRegister:'Login / Register',
    adminPanel:'Admin Panel', notifications:'Notifications', navigation:'Navigation',
    management:'Management', settings:'Settings', theme:'Theme', language:'Language',
    light:'Light', dark:'Dark', searchPlaceholder:'Search products...',
    splashTagline:'Premium e-commerce experience',
    footerDesc:"Bangladesh's best premium online shopping. Powered by Firebase.",
    quickLinks:'Quick Links', support:'Support', allRights:'All Rights Reserved',
    subtotal:'Subtotal', shipping:'Shipping', discount:'Discount', total:'Total', checkout:'Checkout',
    addToCart:'Add to Cart', buyNow:'Buy Now', outOfStock:'Out of Stock', inStock:'In Stock',
    empty:'No products found', allProducts:'All Products', featured:'Featured Products', newArrivals:'New Arrivals',
    price:'Price', stock:'Stock', category:'Category', save:'Save', cancel:'Cancel', delete:'Delete',
    edit:'Edit', yes:'Yes', no:'No', close:'Close', confirmDelete:'Are you sure?',
    pending:'Pending', confirmed:'Confirmed', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled',
    loginRequired:'Please login first', adminRequired:'Admin only',
    fullName:'Full Name', email:'Email', password:'Password', confirmPassword:'Confirm Password',
    phone:'Phone Number', address:'Address', city:'City',
    agreeTerms:'I agree to the Terms & Privacy Policy',
    yourProfile:'Your Profile', editProfile:'Edit Profile',
    newPassword:'New Password (blank = keep current)',
    orderId:'Order ID', orderDate:'Order Date', orderStatus:'Order Status', orderTotal:'Order Total',
    productName:'Product Name', productNameEn:'Product Name (English)',
    description:'Description', descriptionEn:'Description (English)', images:'Images',
    oldPrice:'Old Price', discountPercent:'Discount (%)', tags:'Tags', featured_product:'Featured Product',
    reviews:'Reviews', writeReview:'Write Review', submitReview:'Submit Review', yourRating:'Your Rating',
    relatedProducts:'Related Products',
    minPrice:'Min Price', maxPrice:'Max Price', applyFilter:'Apply',
    clearFilters:'Clear Filters', defaultSort:'Default',
    priceLowHigh:'Price: Low to High', priceHighLow:'Price: High to Low', newest:'Newest First',
    popular:'Popular', searchResults:'Search Results',
    profileUpdated:'Profile updated', loginSuccess:'Login successful', registerSuccess:'Registration successful',
    logoutSuccess:'Logged out', saveSuccess:'Saved', deleteSuccess:'Deleted',
    adminOnly:'Admin only',
    invalidCredentials:'Invalid credentials', accountBlocked:'Account is blocked',
    emailExists:'Email already exists', passwordMismatch:'Passwords do not match',
    weakPassword:'Password must be at least 6 characters',
    fillAllFields:'Please fill all fields', orderPlaced:'Order placed', orderFailed:'Order failed',
    couponApplied:'Coupon applied', invalidCoupon:'Invalid coupon',
    emptyCart:'Your cart is empty', cartItems:'items', imageUploadSuccess:'Image uploaded',
    imageUploadFailed:'Upload failed', processing:'Processing...', loadingData:'Loading data...',
    totalProducts:'Total Products', totalOrders:'Total Orders', totalUsers:'Total Users', totalSales:'Total Sales',
    pendingOrders:'Pending Orders', lowStock:'Low Stock', activeUsers:'Active Users',
    recentOrders:'Recent Orders', products:'Products', users:'Users', ordersTab:'Orders',
    coupons:'Coupons', categories:'Categories',
    addProduct:'Add Product', editProduct:'Edit Product', productSearch:'Search products...',
    addUser:'Add User', editUser:'Edit User', userSearch:'Search name / email...',
    orderSearch:'Search orders...', role:'Role', customer:'Customer', adminRole:'Admin',
    blocked:'Blocked', active:'Active', block:'Block', unblock:'Unblock',
    selected:'selected', deleteConfirm:'Delete this item?', categoryName:'Category Name', addCategory:'Add Category',
    couponCode:'Coupon Code', percentOff:'Percent (%)', flatOff:'Flat (৳)', addCoupon:'Add Coupon',
    siteName:'Site Name', supportPhone:'Support Phone',
    exportData:'Export JSON', resetAll:'Reset All Data', resetConfirm:'All data will be deleted!',
    noData:'No data', items:'items',
    quickView:'Quick View', printInvoice:'Print Invoice',
    installApp:'Install App', installHint:'Add to home screen for quick access', install:'Install',
    offlineMode:'Offline — some features limited',
    pushNotif:'Push Notifications', enable:'Enable', pushEnabled:'Push enabled',
    paymentMethod:'Payment Method', selectPayment:'Select payment method',
    cod:'Cash on Delivery', codDesc:'Pay when you receive',
    bkash:'bKash', nagad:'Nagad', rocket:'Rocket', mobilePayment:'Mobile Payment',
    paymentNumber:'Payment Number', copy:'Copy', copied:'Copied',
    sendMoneySteps:'Steps to send money', useDialCode:'Send via dial code',
    txnId:'Transaction ID', txnIdPlaceholder:'e.g. 8AB1C2D3E4',
    screenshot:'Screenshot', screenshotOptional:'(optional)', uploadScreenshot:'Upload Screenshot',
    confirmOrder:'Confirm Order',
    orderSuccessCOD:'Order placed! Pay on delivery',
    orderSuccessPaid:'Order placed! Awaiting verification',
    deliveryZone:'Delivery Zone', insideDhaka:'Inside Dhaka', outsideDhaka:'Outside Dhaka',
    deliveryCharge:'Delivery Charge', deliveryChargeEdit:'Edit Delivery Charge',
    adminComment:'Admin Comment', adminCommentOptional:'(optional)', commentPlaceholder:'Write comment...',
    paymentInfo:'Payment Info', paymentNumberConfig:'Payment Number Setup', settingsSaved:'Settings saved',
    numberCopied:'Number copied', dialCodeCopied:'Dial code copied',
    invalidTxnId:'Enter valid Transaction ID (min 6 chars)',
    sendOTP:'Send OTP', verifyOTP:'Verify', resendOTP:'Resend', resendIn:'Resend',
    verifyEmail:'Verify Email', weSentCode:'We sent a 6-digit code to',
    otpValidTime:'Valid for 10 minutes', changeInfo:'Change info',
    otpSent:'✅ OTP sent, check your email', otpSending:'Sending...',
    otpVerifying:'Verifying...', emailAvailable:'✓ Email available',
    emailTaken:'❌ This email is already registered',
    invalidEmail:'Enter a valid email', agreeToTerms:'Agree to terms',
    enterFullCode:'Enter complete 6-digit code', registrationSuccess:'🎉 Registration successful!',
    otpFailed:'Failed to send email'
  }
};
let LANG = localStorage.getItem('eco_lang') || 'bn';
const t = k => (I18N[LANG] && I18N[LANG][k]) || k;

/* ═══════════════════════════════════════════════════════════
   Storage
   ═══════════════════════════════════════════════════════════ */
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
const RecentStore = {
  get(){ try{ return JSON.parse(localStorage.getItem('eco_recent')) || []; }catch(e){ return []; } },
  add(id){
    let list = this.get().filter(x=>x!==id);
    list.unshift(id);
    list = list.slice(0, 12);
    localStorage.setItem('eco_recent', JSON.stringify(list));
  }
};

/* ═══════════════════════════════════════════════════════════
   DB
   ═══════════════════════════════════════════════════════════ */
const DB = {
  products: [], users: [], orders: [], categories: [], coupons: [], notifs: [], reviews: [],
  settings: { ...DEFAULT_SETTINGS }, catRaw: {}, reviewRaw: {},
  ready: { products:false, users:false, orders:false, categories:false, coupons:false, notifs:false, reviews:false },
  seeded: false, error: null,

  init(){
    if(!fbReady){ this.error = fbError || 'Firebase not initialized'; return; }
    this.watch('products', d => { this.products = this._toArray(d); this._markReady('products'); });
    this.watch('users', d => { this.users = this._toArray(d); this._markReady('users'); });
    this.watch('orders', d => { this.orders = this._toArray(d).sort((a,b)=>(b.date||0)-(a.date||0)); this._markReady('orders'); });
    this.watch('categories', d => { this.catRaw = d || {}; this.categories = Object.values(this.catRaw).filter(v=>typeof v==='string'); this._markReady('categories'); });
    this.watch('coupons', d => { this.coupons = this._toArray(d); this._markReady('coupons'); });
    this.watch('notifications', d => { this.notifs = this._toArray(d).sort((a,b)=>(b.time||0)-(a.time||0)); this._markReady('notifs'); });
    this.watch('reviews', d => { this.reviewRaw = d || {}; this.reviews = this._toArray(d); this._markReady('reviews'); });
    this.watch('settings', d => { this.settings = { ...DEFAULT_SETTINGS, ...(d || {}) }; });

    setTimeout(()=>{
      if(!(this.ready.products && this.ready.users && this.ready.orders)){
        this.ready.products = true; this.ready.users = true; this.ready.orders = true;
        App.hideSplash();
      }
      this.trySeed();
    }, 4000);
  },

  watch(path, cb){
    try {
      db.ref(path).on('value', s => { try{ cb(s.val()); }catch(e){ console.error(path, e); } },
        err => { this.error = err.message; });
    } catch(e){ console.error(e); }
  },

  _toArray(data){
    if(!data) return [];
    if(Array.isArray(data)) return data.filter(Boolean);
    return Object.entries(data).map(([k,v]) => typeof v==='object' && v!==null ? { ...v, id: v.id || k, _key: k } : { id:k, value:v, _key:k });
  },

  _markReady(w){
    this.ready[w] = true;
    if(this.ready.products && this.ready.users && this.ready.orders){
      App.hideSplash();
      this.trySeed();
      App.rerenderIfVisible();
    }
  },

  async trySeed(){
    if(this.seeded) return;
    this.seeded = true;
    if(!this.ready.products || this.products.length > 0) return;
    console.log('🌱 Seeding...');
    const products = {
      p1:{id:'p1',name:'প্রিমিয়াম ইকো-বোতল',nameEn:'Premium Eco Bottle',cat:'ইলেকট্রনিকস',catEn:'Electronics',price:850,oldPrice:1200,discount:29,stock:45,img:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',desc:'পরিবেশ বান্ধব স্টেইনলেস স্টিল বোতল।',featured:true,createdAt:Date.now(),tags:['ইকো'],rating:4.5,reviewCount:12},
      p2:{id:'p2',name:'ওয়্যারলেস হেডফোন',nameEn:'Wireless Headphone',cat:'ইলেকট্রনিকস',catEn:'Electronics',price:2500,oldPrice:3500,discount:29,stock:20,img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',desc:'নয়েজ ক্যানসেলিং হেডফোন।',featured:true,createdAt:Date.now()+1,tags:['অডিও'],rating:4.7,reviewCount:34},
      p3:{id:'p3',name:'স্মার্ট ওয়াচ',nameEn:'Smart Watch',cat:'গ্যাজেট',catEn:'Gadgets',price:3200,oldPrice:4500,discount:29,stock:15,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',desc:'ফিটনেস ট্র্যাকিং স্মার্ট ওয়াচ।',featured:true,createdAt:Date.now()+2,tags:['স্মার্ট'],rating:4.3,reviewCount:18},
      p4:{id:'p4',name:'মিনিমালিস্ট ব্যাগ',nameEn:'Minimalist Bag',cat:'ফ্যাশন',catEn:'Fashion',price:1200,oldPrice:1800,discount:33,stock:30,img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',desc:'ওয়াটারপ্রুফ ব্যাগ।',featured:false,createdAt:Date.now()+3,tags:['ব্যাগ'],rating:4.6,reviewCount:22},
      p5:{id:'p5',name:'ক্যামেরা লেন্স',nameEn:'Camera Lens',cat:'ফটোগ্রাফি',catEn:'Photography',price:8500,oldPrice:10000,discount:15,stock:8,img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',desc:'প্রফেশনাল ক্যামেরা লেন্স।',featured:false,createdAt:Date.now()+4,tags:['ক্যামেরা'],rating:4.8,reviewCount:9},
      p6:{id:'p6',name:'সানগ্লাস প্রিমিয়াম',nameEn:'Premium Sunglass',cat:'ফ্যাশন',catEn:'Fashion',price:950,oldPrice:1400,discount:32,stock:0,img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',desc:'UV400 সানগ্লাস।',featured:false,createdAt:Date.now()+5,tags:['সানগ্লাস'],rating:4.2,reviewCount:15}
    };
    const users = {
      u_admin:{id:'u_admin',name:'Admin',email:'admin@eco.pro',password:'admin123',role:'admin',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',phone:'01700000000'},
      u_rahim:{id:'u_rahim',name:'Rahim Uddin',email:'rahim@mail.com',password:'123456',role:'customer',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Rahim&background=10b981&color=fff',phone:'01711111111'}
    };
    const cats = { c1:'ইলেকট্রনিকস', c2:'গ্যাজেট', c3:'ফ্যাশন', c4:'ফটোগ্রাফি', c5:'হোম ও লিভিং', c6:'বিউটি' };
    const coupons = { cp1:{id:'cp1',code:'ECO10',type:'percent',value:10}, cp2:{id:'cp2',code:'FLAT100',type:'flat',value:100} };
    const notifs = { n1:{id:'n1',title:'স্বাগতম!',body:'EcoShop Pro MAX-এ স্বাগতম',time:Date.now(),read:false,type:'info'} };
    try {
      await Promise.all([
        db.ref('products').set(products),
        this.ready.users ? Promise.resolve() : db.ref('users').set(users),
        db.ref('categories').set(cats),
        db.ref('coupons').set(coupons),
        db.ref('notifications').set(notifs),
        db.ref('settings').set(DEFAULT_SETTINGS)
      ]);
      console.log('✅ Seed done');
      Toast.show(LANG==='bn'?'প্রাথমিক ডেটা লোড হয়েছে':'Initial data loaded','success');
    } catch(e){
      console.error('Seed failed:', e);
      Toast.show('Seed failed — Firebase Rules চেক করুন','error', 6000);
    }
  },

  saveProduct(p){ const id = p.id || 'p_'+Date.now(); p.id=id; p.updatedAt=Date.now(); if(!p.createdAt) p.createdAt=Date.now(); return db.ref('products/'+id).set(p); },
  deleteProduct(id){ return db.ref('products/'+id).remove(); },
  saveUser(u){ const id = u.id || 'u_'+Date.now(); u.id=id; if(!u.joined) u.joined=Date.now(); return db.ref('users/'+id).set(u); },
  deleteUser(id){ return db.ref('users/'+id).remove(); },
  updateUser(id, patch){ return db.ref('users/'+id).update(patch); },
  saveOrder(o){ const id = o.id || 'ORD-'+Date.now().toString().slice(-8); o.id=id; return db.ref('orders/'+id).set(o).then(()=>o); },
  updateOrder(id, patch){ return db.ref('orders/'+id).update(patch); },
  deleteOrder(id){ return db.ref('orders/'+id).remove(); },
  saveCategory(name){ return db.ref('categories/c_'+Date.now()).set(name); },
  deleteCategory(key){ return db.ref('categories/'+key).remove(); },
  saveCoupon(c){ const id = c.id || 'cp_'+Date.now(); c.id=id; return db.ref('coupons/'+id).set(c); },
  deleteCoupon(id){ return db.ref('coupons/'+id).remove(); },
  pushNotif(n){ const id='n_'+Date.now(); n.id=id; n.time=Date.now(); n.read=false; return db.ref('notifications/'+id).set(n); },
  saveReview(r){ const id='r_'+Date.now(); r.id=id; r.date=Date.now(); return db.ref('reviews/'+id).set(r); },

  isReady(){ return this.ready.products && this.ready.users && this.ready.orders; },
  updateStock(productId, newStock){ return db.ref('products/'+productId+'/stock').set(newStock); },
  getProductReviews(productId){ return this.reviews.filter(r=>r.productId===productId); },
  addReviewToProduct(productId, rating){
    const p = this.products.find(x=>x.id===productId); if(!p) return;
    const count = (p.reviewCount||0) + 1;
    const oldTotal = (p.rating||0) * (p.reviewCount||0);
    const newRating = (oldTotal + rating) / count;
    return db.ref('products/'+productId).update({ rating: parseFloat(newRating.toFixed(2)), reviewCount: count });
  },
  async saveSettings(s){ return db.ref('settings').set(s); }
};

/* ═══════════════════════════════════════════════════════════
   ImageUpload
   ═══════════════════════════════════════════════════════════ */
const ImageUpload = {
  async upload(file){
    if(!file) throw new Error('No file');
    if(file.size > 32*1024*1024) throw new Error('File too large (max 32MB)');
    if(!file.type.startsWith('image/')) throw new Error('Only images');
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', file);
    const res = await fetch(IMGBB_UPLOAD_URL, { method:'POST', body: form });
    const json = await res.json();
    if(!json.success) throw new Error(json.error?.message || 'Upload failed');
    return { url: json.data.url, thumb: json.data.thumb?.url || json.data.url, id: json.data.id };
  }
};

/* ═══════════════════════════════════════════════════════════
   EmailJS OTP Service
   ═══════════════════════════════════════════════════════════ */
const OTP = {
  currentEmail: null,
  currentCode: null,
  expiresAt: 0,
  attempts: 0,
  cooldownTimer: null,
  verified: false,

  init(){
    if(typeof emailjs === 'undefined'){
      console.warn('⚠️ EmailJS SDK not loaded');
      return false;
    }
    if(!EmailJSConfig.initialized){
      try {
        emailjs.init({ publicKey: EmailJSConfig.publicKey });
        EmailJSConfig.initialized = true;
        console.log('✅ EmailJS initialized');
      } catch(e){
        console.error('❌ EmailJS init failed:', e);
        return false;
      }
    }
    return true;
  },

  generate(){ return String(Math.floor(100000 + Math.random() * 900000)); },

  async send(email, name){
    if(!this.init()){
      return { ok:false, msg: LANG==='bn'?'EmailJS লোড হয়নি, পেজ রিফ্রেশ করুন':'EmailJS not loaded, refresh' };
    }
    if(Auth.isEmailTaken(email)){
      return { ok:false, msg: LANG==='bn'?'এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে':'Email already registered' };
    }
    const code = this.generate();
    this.currentEmail = email.trim().toLowerCase();
    this.currentCode = code;
    this.expiresAt = Date.now() + 10 * 60 * 1000;
    this.attempts = 0;
    this.verified = false;

    try {
      const result = await emailjs.send(
        EmailJSConfig.serviceId,
        EmailJSConfig.templateId,
        {
          to_email: this.currentEmail,
          otp_code: code,
          user_name: name || 'User',
          site_name: 'EcoShop Pro MAX'
        }
      );
      console.log('✅ OTP sent:', result);
      return { ok:true };
    } catch(err){
      console.error('❌ OTP send failed:', err);
      const errMsg = err?.text || err?.message || 'Email sending failed';
      return { ok:false, msg: errMsg };
    }
  },

  async verify(inputCode){
    if(!this.currentCode) return { ok:false, msg: LANG==='bn'?'আগে কোড পাঠান':'Send code first' };
    if(Date.now() > this.expiresAt) return { ok:false, msg: LANG==='bn'?'কোডের মেয়াদ শেষ, আবার পাঠান':'Code expired' };
    if(this.attempts >= 5) return { ok:false, msg: LANG==='bn'?'অনেকবার ভুল, আবার কোড পাঠান':'Too many attempts' };
    if(String(inputCode).trim() !== this.currentCode){
      this.attempts++;
      return { ok:false, msg: LANG==='bn'?`ভুল কোড (${5-this.attempts} বার বাকি)`:`Wrong code (${5-this.attempts} left)` };
    }
    this.verified = true;
    return { ok:true };
  },

  reset(){
    this.currentEmail = null;
    this.currentCode = null;
    this.expiresAt = 0;
    this.attempts = 0;
    this.verified = false;
    if(this.cooldownTimer){ clearInterval(this.cooldownTimer); this.cooldownTimer = null; }
  },

  startCooldown(seconds, onTick){
    if(this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(()=>{
      seconds--;
      if(onTick) onTick(seconds);
      if(seconds <= 0){ clearInterval(this.cooldownTimer); this.cooldownTimer = null; }
    }, 1000);
  },

  maskEmail(email){
    if(!email) return '';
    const [user, domain] = email.split('@');
    if(!domain) return email;
    const visible = user.slice(0, Math.min(3, user.length));
    return `${visible}${'*'.repeat(Math.max(2, user.length - visible.length))}@${domain}`;
  }
};

/* ═══════════════════════════════════════════════════════════
   PWA
   ═══════════════════════════════════════════════════════════ */
const PWA = {
  deferredPrompt: null,
  registerSW(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('✅ SW:', reg.scope))
        .catch(err => console.warn('SW failed:', err));
    }
  },
  initInstallPrompt(){
    const banner = document.getElementById('installBanner');
    window.addEventListener('beforeinstallprompt', (e)=>{
      e.preventDefault();
      this.deferredPrompt = e;
      if(banner && !localStorage.getItem('eco_install_dismissed')){
        setTimeout(()=>banner.classList.add('show'), 2500);
      }
    });
    const installBtn = document.getElementById('installBtn');
    const installClose = document.getElementById('installClose');
    if(installBtn){
      installBtn.onclick = async ()=>{
        if(!this.deferredPrompt) return;
        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        if(result.outcome === 'accepted') Toast.show('Installing...','success');
        this.deferredPrompt = null;
        banner?.classList.remove('show');
      };
    }
    if(installClose){
      installClose.onclick = ()=>{
        banner?.classList.remove('show');
        localStorage.setItem('eco_install_dismissed', '1');
      };
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   PushNotif
   ═══════════════════════════════════════════════════════════ */
const PushNotif = {
  async requestPermission(){
    if(!('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      if(perm === 'granted'){
        Toast.show(t('pushEnabled'),'success');
        const u = Auth.user();
        if(u) try { await db.ref('fcm_tokens/'+u.id).set({ token: 'web-'+Date.now(), time: Date.now(), user: u.email }); } catch(e){}
        return true;
      }
      return false;
    } catch(e){ return false; }
  },
  init(){
    const btn = document.getElementById('pushNotifBtn');
    if(btn) btn.onclick = async ()=>{ if(await this.requestPermission()) btn.textContent = '✓'; };
  },
  async localNotif(title, body){
    if(!('Notification' in window) || Notification.permission !== 'granted') return;
    try { new Notification(title, { body, icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzYzNjZmMSIgcng9IjMyIi8+PC9zdmc+' }); } catch(e){}
  }
};

/* ═══════════════════════════════════════════════════════════
   UI Helpers
   ═══════════════════════════════════════════════════════════ */
const Toast = {
  show(msg, type='info', ms=2800){
    const box = document.getElementById('toastContainer'); if(!box) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { info:'fa-circle-info', success:'fa-circle-check', error:'fa-circle-exclamation', warning:'fa-triangle-exclamation' };
    el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i><span>${msg}</span>`;
    box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(40px)'; setTimeout(()=>el.remove(),250); }, ms);
  },
  progress(){ const p=document.getElementById('topProgress'); if(!p) return; p.style.width='70%'; setTimeout(()=>{p.style.width='100%';setTimeout(()=>p.style.width='0',300);},300); }
};

const Modal = {
  open(html, cls=''){
    document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)Modal.close()"><div class="modal-box ${cls}">${html}</div></div>`;
    document.body.style.overflow='hidden';
  },
  close(){ document.getElementById('modalRoot').innerHTML=''; document.body.style.overflow=''; },
  confirm(msg, onYes, yesLabel){
    this.open(`<div class="confirm-box">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>${msg}</p>
      <div class="confirm-actions">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-danger btn-block" id="modalConfirmYes">${yesLabel||t('yes')}</button>
      </div>
    </div>`, 'sm');
    document.getElementById('modalConfirmYes').onclick = ()=>{ Modal.close(); onYes && onYes(); };
  }
};

function loadingHTML(msg, sub){
  return `<div class="loading-state"><div class="spinner"></div><p>${msg||t('loadingData')}</p>${sub?`<small>${sub}</small>`:''}</div>`;
}
function money(n){ return '৳' + (Number(n)||0).toLocaleString(LANG==='bn'?'bn-BD':'en-US'); }
function timeAgo(ts){
  const diff = Date.now() - ts;
  const s = Math.floor(diff/1000);
  if(s<60) return LANG==='bn'?'এইমাত্র':'Just now';
  const m = Math.floor(s/60); if(m<60) return LANG==='bn'?`${m} মিনিট আগে`:`${m}m ago`;
  const h = Math.floor(m/60); if(h<24) return LANG==='bn'?`${h} ঘণ্টা আগে`:`${h}h ago`;
  const d = Math.floor(h/24); if(d<30) return LANG==='bn'?`${d} দিন আগে`:`${d}d ago`;
  return new Date(ts).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US');
}
function starHTML(rating, size){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for(let i=0;i<5;i++){
    if(i<full) s += '<i class="fa-solid fa-star"></i>';
    else if(i===full && half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
    else s += '<i class="fa-regular fa-star"></i>';
  }
  return `<span class="stars" style="${size?`font-size:${size}`:''}">${s}</span>`;
}

/* ═══════════════════════════════════════════════════════════
   Auth
   ═══════════════════════════════════════════════════════════ */
const Auth = {
  user(){ return Session.get(); },
  isAdmin(){ const u=this.user(); return u && u.role==='admin'; },

  isEmailTaken(email){
    if(!email) return false;
    const n = email.trim().toLowerCase();
    return DB.users.some(u => (u.email||'').toLowerCase() === n);
  },

  async login(email, password){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const u = DB.users.find(x=>x.email===email && x.password===password);
    if(!u) return { ok:false, msg:t('invalidCredentials') };
    if(u.blocked) return { ok:false, msg:t('accountBlocked') };
    Session.set(u);
    return { ok:true, user:u };
  },

  async register(data){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    if(this.isEmailTaken(data.email)) return { ok:false, msg:t('emailExists') };
    const u = {
      id:'u_'+Date.now(),
      name:data.name,
      email:data.email.trim().toLowerCase(),
      password:data.password,
      phone:data.phone||'',
      role:'customer', blocked:false, joined:Date.now(), emailVerified:true,
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
    };
    try { await DB.saveUser(u); Session.set(u); return { ok:true, user:u }; }
    catch(e){ return { ok:false, msg:'Save failed: '+e.message }; }
  },
  logout(){ Session.clear(); Toast.show(t('logoutSuccess'),'success'); App.go('home'); }
};

/* ═══════════════════════════════════════════════════════════
   Cart
   ═══════════════════════════════════════════════════════════ */
const Cart = {
  items(){ return CartStore.get(); },
  save(items){ CartStore.set(items); this.refresh(); },
  add(id, qty=1){
    const items = this.items();
    const found = items.find(i=>i.id===id);
    const p = DB.products.find(x=>x.id===id);
    if(!p) return;
    if(p.stock < qty) return Toast.show(t('outOfStock'),'error');
    if(found){ if(found.qty+qty > p.stock) return Toast.show(t('outOfStock'),'error'); found.qty += qty; }
    else items.push({ id, qty });
    this.save(items);
    Toast.show(LANG==='bn'?'কার্টে যোগ হয়েছে':'Added to cart','success');
  },
  remove(id){ this.save(this.items().filter(i=>i.id!==id)); },
  setQty(id, qty){
    const items = this.items();
    const it = items.find(i=>i.id===id); if(!it) return;
    const p = DB.products.find(x=>x.id===id);
    if(p && qty > p.stock) return Toast.show(t('outOfStock'),'error');
    it.qty = Math.max(1, qty); this.save(items);
  },
  count(){ return this.items().reduce((s,i)=>s+i.qty,0); },
  subtotal(){ return this.items().reduce((s,i)=>{ const p=DB.products.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); },
  discountTotal(){ return this.items().reduce((s,i)=>{ const p=DB.products.find(x=>x.id===i.id); if(!p||!p.oldPrice) return s; return s+((p.oldPrice-p.price)*i.qty); },0); },
  shippingCharge(zone){
    if(this.count()<=0) return 0;
    return (zone==='outside') ? (DB.settings.shippingOutsideDhaka||120) : (DB.settings.shippingInsideDhaka||100);
  },
  total(zone){ return this.subtotal() + this.shippingCharge(zone); },
  refresh(){
    const c = this.count();
    const setT = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
    const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = c>0?c:'';
    const bnBadge = document.getElementById('bnCartBadge'); if(bnBadge) bnBadge.textContent = c>0?c:'';
    setT('cartCount', `${c} ${t('items')}`);
    setT('cartSubtotal', money(this.subtotal()));
    setT('cartShipping', money(this.shippingCharge('inside')));
    setT('cartDiscount', '-'+money(this.discountTotal()));
    setT('cartTotal', money(this.total('inside')));
    this.renderDrawer();
  },
  renderDrawer(){
    const body = document.getElementById('cartBody'); if(!body) return;
    const items = this.items();
    if(!items.length){
      body.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>${t('emptyCart')}</h3><button class="btn btn-primary" onclick="Modal.close();App.go('shop')">${t('shop')}</button></div>`;
      return;
    }
    body.innerHTML = items.map(i=>{
      const p = DB.products.find(x=>x.id===i.id); if(!p) return '';
      return `<div class="cart-item">
        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/70'">
        <div class="cart-item-info">
          <h5>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h5>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <span class="price" style="font-size:14px">${money(p.price)}</span>
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

/* ═══════════════════════════════════════════════════════════
   Wish / Orders / Notifs
   ═══════════════════════════════════════════════════════════ */
const Wish = {
  all(){ return WishStore.get(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all();
    const idx = list.indexOf(id);
    if(idx>-1){ list.splice(idx,1); Toast.show(LANG==='bn'?'সরানো হয়েছে':'Removed','info'); }
    else { list.push(id); Toast.show(LANG==='bn'?'যোগ হয়েছে':'Added','success'); }
    WishStore.set(list);
    if(['wishlist','shop','home','product'].includes(App.route)) App.render();
    else App.syncUI();
  }
};

const Orders = {
  all(){ return DB.orders; },
  mine(){ const u=Auth.user(); if(!u) return []; return DB.orders.filter(o=>o.userId===u.id); },
  async create(data){
    const u = Auth.user();
    const order = {
      id:'ORD-'+Date.now().toString().slice(-8),
      userId: u?u.id:0,
      customer: data.customer,
      items: data.items,
      subtotal: data.subtotal,
      deliveryCharge: data.deliveryCharge,
      deliveryZone: data.deliveryZone,
      discount: data.discount || 0,
      total: data.total,
      coupon: data.coupon || null,
      paymentMethod: data.paymentMethod,
      paymentNumber: data.paymentNumber || null,
      txnId: data.txnId || null,
      screenshot: data.screenshot || null,
      status: data.paymentMethod === 'cod' ? 'confirmed' : 'pending',
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'awaiting_verification',
      date: Date.now(),
      history: [{ status: data.paymentMethod === 'cod' ? 'confirmed' : 'pending', time: Date.now(), comment: data.paymentMethod === 'cod' ? 'COD order' : 'Awaiting verification' }]
    };
    const saved = await DB.saveOrder(order);
    data.items.forEach(async i=>{
      const p = DB.products.find(x=>x.id===i.id);
      if(p) try { await DB.updateStock(p.id, Math.max(0, p.stock - i.qty)); } catch(e){}
    });
    try { await DB.pushNotif({ title:LANG==='bn'?'নতুন অর্ডার!':'New Order!', body:`${data.customer.name} — ${money(data.total)}`, type:'order' }); } catch(e){}
    Cart.save([]);
    return saved;
  },
  async updateStatus(id, status, comment){
    const o = DB.orders.find(x=>x.id===id);
    const history = (o?.history || []).concat([{ status, time: Date.now(), comment: comment||'' }]);
    return DB.updateOrder(id, { status, history });
  },
  async updateDeliveryCharge(id, newCharge){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const newTotal = (o.subtotal || 0) + newCharge - (o.discount || 0);
    const history = (o.history || []).concat([{ status: o.status, time: Date.now(), comment: `Delivery: ${money(o.deliveryCharge)} → ${money(newCharge)}` }]);
    return DB.updateOrder(id, { deliveryCharge: newCharge, total: newTotal, history });
  },
  remove(id){ return DB.deleteOrder(id); }
};

const Notifs = {
  all(){ return DB.notifs; },
  unread(){ return this.all().filter(n=>!n.read).length; },
  markAllRead(){ this.all().forEach(n=>{ if(!n.read) db.ref('notifications/'+n.id+'/read').set(true).catch(()=>{}); }); },
  refresh(){
    const b = document.getElementById('notifBadge'); if(b) b.textContent = this.unread()||'';
    const c = document.getElementById('notifCount'); if(c) c.textContent = `${this.unread()} unread`;
    const list = document.getElementById('notifList'); if(!list) return;
    const arr = this.all();
    list.innerHTML = arr.length ? arr.map(n=>`
      <div class="notif-item ${n.read?'':'unread'}">
        <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
        <div><h5>${n.title}</h5><p>${n.body}</p><small>${timeAgo(n.time)}</small></div>
      </div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>${LANG==='bn'?'নোটিফিকেশন নেই':'No notifications'}</h3></div>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   QuickView / Share / Invoice
   ═══════════════════════════════════════════════════════════ */
const QuickView = {
  open(productId){
    const p = DB.products.find(x=>x.id===productId); if(!p) return;
    const name = LANG==='bn' ? p.name : (p.nameEn||p.name);
    document.getElementById('quickViewRoot').innerHTML = `
      <div class="qv-overlay" onclick="if(event.target===this)QuickView.close()">
        <div class="qv-box">
          <button class="modal-close" onclick="QuickView.close()"><i class="fa-solid fa-xmark"></i></button>
          <div class="qv-content">
            <div class="qv-img"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/400'"></div>
            <div class="qv-info">
              <span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span>
              <h3>${name}</h3>
              <div class="rating" style="margin:8px 0">${starHTML(p.rating||0,'13px')} <span>${p.rating?(p.rating).toFixed(1):'0'} (${p.reviewCount||0})</span></div>
              <div class="detail-price" style="margin:12px 0">
                <span class="price">${money(p.price)}</span>
                ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}
                ${p.discount?`<span class="discount-tag">-${p.discount}%</span>`:''}
              </div>
              <p class="detail-desc">${LANG==='bn'?p.desc:(p.descEn||p.desc||'')}</p>
              <div class="detail-actions" style="margin-top:16px">
                <button class="btn btn-primary btn-block" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}');QuickView.close()"><i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}</button>
                <button class="btn btn-outline" onclick="QuickView.close();App.go('product','${p.id}')" style="min-width:auto;flex:0"><i class="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.style.overflow='hidden';
  },
  close(){ document.getElementById('quickViewRoot').innerHTML = ''; document.body.style.overflow=''; }
};

const Invoice = {
  print(orderId){
    const o = DB.orders.find(x=>x.id===orderId); if(!o) return;
    const w = window.open('', '_blank', 'width=800,height=900');
    w.document.write(`<html><head><title>Invoice ${o.id}</title>
      <style>body{font-family:'Hind Siliguri',sans-serif;padding:32px;color:#0f1021;max-width:720px;margin:auto;}h1{color:#6366f1;}.head{display:flex;justify-content:space-between;border-bottom:2px solid #e5e8f0;padding-bottom:16px;margin-bottom:20px;}.box{background:#f8f9fd;padding:16px;border-radius:12px;margin-bottom:16px;}table{width:100%;border-collapse:collapse;margin:16px 0;}th,td{padding:12px;text-align:left;border-bottom:1px solid #e5e8f0;font-size:13px;}th{background:#f1f3fa;font-size:11px;}.totals{text-align:right;margin-top:12px;}.grand{font-size:20px;font-weight:800;color:#6366f1;}.foot{text-align:center;color:#64748b;font-size:12px;margin-top:32px;padding-top:20px;border-top:1px solid #e5e8f0;}</style>
      </head><body><h1>EcoShop Pro MAX</h1>
      <div class="head"><div><b>Invoice #${o.id}</b><br><small>Date: ${new Date(o.date).toLocaleDateString('en-US')}</small></div><div style="text-align:right"><b>Status: ${o.status.toUpperCase()}</b><br><small>Payment: ${o.paymentMethod.toUpperCase()}</small></div></div>
      <div class="box"><b>Customer</b><br>${o.customer.name}<br>${o.customer.phone||''}<br>${o.customer.address||''}${o.customer.city?', '+o.customer.city:''}</div>
      ${o.txnId?`<div class="box"><b>Txn ID:</b> ${o.txnId}</div>`:''}
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${(o.items||[]).map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>৳${i.price}</td><td>৳${i.price*i.qty}</td></tr>`).join('')}</tbody></table>
      <div class="totals"><div>Subtotal: ৳${o.subtotal||0}</div><div>Delivery: ৳${o.deliveryCharge||0}</div>${o.discount?`<div>Discount: -৳${o.discount}</div>`:''}<div class="grand">Total: ৳${o.total}</div></div>
      <div class="foot">Thank you!</div></body></html>`);
    w.document.close();
    setTimeout(()=>w.print(), 300);
  }
};

/* ═══════════════════════════════════════════════════════════
   Search Suggest
   ═══════════════════════════════════════════════════════════ */
const SearchSuggest = {
  init(){
    const inp = document.getElementById('globalSearch');
    const box = document.getElementById('searchSuggest');
    if(!inp || !box) return;
    inp.addEventListener('input', ()=>{
      const q = inp.value.trim().toLowerCase();
      if(!q){ box.classList.remove('active'); return; }
      const results = DB.products.filter(p=>(p.name+(p.nameEn||'')+(p.cat||'')).toLowerCase().includes(q)).slice(0, 6);
      box.innerHTML = results.length ? results.map(p=>`
        <div class="suggest-item" onclick="App.go('product','${p.id}');SearchSuggest.hide()">
          <img src="${p.img}" onerror="this.src='https://via.placeholder.com/42'">
          <div class="suggest-info"><h5>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h5><p>${LANG==='bn'?p.cat:(p.catEn||p.cat)}</p></div>
          <span class="price">${money(p.price)}</span>
        </div>`).join('') : `<div class="suggest-empty">${LANG==='bn'?'পাওয়া যায়নি':'Not found'}</div>`;
      box.classList.add('active');
    });
    inp.addEventListener('blur', ()=> setTimeout(()=>this.hide(), 200));
    inp.addEventListener('focus', ()=>{ if(inp.value.trim()) box.classList.add('active'); });
  },
  hide(){ document.getElementById('searchSuggest')?.classList.remove('active'); }
};

/* ═══════════════════════════════════════════════════════════
   App Router
   ═══════════════════════════════════════════════════════════ */
const App = {
  route:'home',
  _shopCat:'all', _shopSort:'default', _shopQ:'', _shopMinPrice:'', _shopMaxPrice:'',
  _adminTab:'dashboard', _pQuery:'', _uQuery:'', _oQuery:'', _selectedUsers:[],
  _authTab:'login', _authRedirect:null, _lastRoute:'home', _param:null,
  _otpStep:null, _pendingReg:null, _checkoutState:null,

  hideSplash(){
    const s = document.getElementById('splash');
    if(s && !s.classList.contains('hidden')){
      const bar = document.getElementById('splashBar'); if(bar) bar.style.width='100%';
      const st = document.getElementById('splashStatus'); if(st) st.textContent = LANG==='bn'?'স্বাগতম!':'Welcome!';
      setTimeout(()=>s.classList.add('hidden'), 400);
    }
  },

  rerenderIfVisible(){
    if(['home','shop','admin','orders','wishlist','profile','auth','product','checkout'].includes(this.route)) this.render();
    else { Cart.refresh(); Notifs.refresh(); this.syncUI(); }
  },

  go(route, param){
    if(['orders','profile','checkout'].includes(route) && !Auth.user()){
      Toast.show(t('loginRequired'),'warning');
      this._authRedirect = route;
      this.route = 'auth';
    } else if(route==='admin' && !Auth.isAdmin()){
      Toast.show(t('adminOnly'),'warning');
      this._authRedirect = 'admin';
      this.route = 'auth';
    } else {
      this._lastRoute = this.route;
      this.route = route;
      if(param) this._param = param;
    }
    document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active', a.dataset.nav===this.route));
    this.render();
    window.scrollTo({top:0,behavior:'smooth'});
  },

  render(){
    const el = document.getElementById('app'); if(!el) return;
    Toast.progress();
    let html = '';
    try {
      switch(this.route){
        case 'home': html = Pages.home(); break;
        case 'shop': html = Pages.shop(); break;
        case 'orders': html = Pages.orders(); break;
        case 'profile': html = Pages.profile(); break;
        case 'wishlist': html = Pages.wishlist(); break;
        case 'admin': html = Pages.admin(); break;
        case 'auth': html = Pages.auth(); break;
        case 'product': html = Pages.productDetail(this._param); break;
        case 'checkout': html = Pages.checkout(); break;
        default: html = Pages.home();
      }
    } catch(e){
      console.error('Render error:', e);
      html = `<div class="page"><div class="error-banner"><i class="fa-solid fa-triangle-exclamation"></i><div><b>Error</b>${e.message}</div></div></div>`;
    }
    el.innerHTML = html;
    this.syncUI();
    Cart.refresh();
    Notifs.refresh();
    this.applyI18n();
    this.initPageScripts();
  },

  applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.dataset.i18n; const val = t(k);
      if(val && val !== k) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      const k = el.dataset.i18nPh; const val = t(k);
      if(val && val !== k) el.placeholder = val;
    });
  },

  initPageScripts(){
    document.querySelectorAll('.detail-thumb').forEach(thumb=>{
      thumb.onclick = ()=>{
        const src = thumb.querySelector('img').src;
        const main = document.querySelector('.detail-main-img img');
        if(main) main.src = src;
        document.querySelectorAll('.detail-thumb').forEach(t2=>t2.classList.remove('active'));
        thumb.classList.add('active');
      };
    });
  },

  syncUI(){
    const u = Auth.user();
    const loginBtn = document.getElementById('loginBtn');
    const avatarBtn = document.getElementById('userAvatarBtn');
    if(!loginBtn || !avatarBtn) return;
    const adminLink = document.querySelector('.nav-admin-link');
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
      if(adminLink) adminLink.style.display = u.role==='admin' ? 'flex' : 'none';
    } else {
      loginBtn.style.display='inline-flex';
      avatarBtn.classList.remove('show');
      document.getElementById('pmName').textContent = LANG==='bn'?'অতিথি':'Guest';
      document.getElementById('pmEmail').textContent = LANG==='bn'?'লগইন করুন':'Login';
      document.getElementById('pmRole').textContent = 'GUEST';
      document.getElementById('pmAdminSection').style.display='none';
      document.getElementById('pmLoginBtn').style.display='flex';
      document.getElementById('pmLogoutBtn').style.display='none';
      if(adminLink) adminLink.style.display = 'flex';
    }
  },

  openCart(){ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; }
};

/* ═══════════════════════════════════════════════════════════
   Pages
   ═══════════════════════════════════════════════════════════ */
const Pages = {
  home(){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    const featured = DB.products.filter(p=>p.featured).slice(0,6);
    const newArr = [...DB.products].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
    const bestDeals = [...DB.products].filter(p=>p.discount>0).sort((a,b)=>b.discount-a.discount).slice(0,4);
    const recent = RecentStore.get().map(id=>DB.products.find(p=>p.id===id)).filter(Boolean).slice(0,6);
    return `
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-badge"><i class="fa-solid fa-bolt"></i> ${LANG==='bn'?'প্রিমিয়াম ২০২৬':'Premium 2026'}</div>
            <h1 class="hero-title">${LANG==='bn'?'সেরা <span class="grad">প্রিমিয়াম</span> পণ্য<br>এখন হাতের মুঠোয়':'Best <span class="grad">Premium</span> products<br>at your fingertips'}</h1>
            <p class="hero-sub">${LANG==='bn'?'দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট, ১০০% অরিজিনাল।':'Fast delivery, secure payment, 100% original.'}</p>
            <div class="hero-btns">
              <button class="btn btn-primary btn-lg" onclick="App.go('shop')"><i class="fa-solid fa-store"></i> ${t('shop')}</button>
              <button class="btn btn-outline btn-lg" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:#fff" onclick="App.go('orders')"><i class="fa-solid fa-box"></i> ${t('myOrders')}</button>
            </div>
          </div>
        </div>
      </section>
      <div class="page">
        ${DB.error?`<div class="error-banner"><i class="fa-solid fa-triangle-exclamation"></i><div><b>Firebase:</b> ${DB.error}</div></div>`:''}
        <div class="section-head"><h2><i class="fa-solid fa-fire" style="color:var(--accent)"></i> ${t('featured')}</h2><span class="count-chip">${featured.length} ${t('items')}</span></div>
        <div class="product-grid">${featured.length ? featured.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${t('empty')}</h3></div>`}</div>
        ${bestDeals.length?`<div class="section-head" style="margin-top:34px"><h2><i class="fa-solid fa-tags" style="color:var(--danger)"></i> ${LANG==='bn'?'সেরা অফার':'Best Deals'}</h2></div><div class="product-grid">${bestDeals.map(Components.productCard).join('')}</div>`:''}
        <div class="section-head" style="margin-top:34px"><h2><i class="fa-solid fa-star" style="color:var(--brand)"></i> ${t('newArrivals')}</h2><button class="btn btn-outline btn-sm" onclick="App.go('shop')">${LANG==='bn'?'সব দেখুন':'View All'} <i class="fa-solid fa-arrow-right"></i></button></div>
        <div class="product-grid">${newArr.map(Components.productCard).join('')}</div>
        ${recent.length?`<div class="section-head" style="margin-top:34px"><h2><i class="fa-solid fa-clock-rotate-left"></i> ${LANG==='bn'?'সম্প্রতি দেখা':'Recently Viewed'}</h2></div><div class="product-grid">${recent.map(Components.productCard).join('')}</div>`:''}
      </div>`;
  },

  shop(){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    let list = DB.products.slice();
    if(App._shopCat && App._shopCat!=='all') list = list.filter(p=>p.cat===App._shopCat);
    if(App._shopQ){ const s=App._shopQ.toLowerCase(); list = list.filter(p=>(p.name+(p.nameEn||'')+(p.desc||'')).toLowerCase().includes(s)); }
    if(App._shopMinPrice !== '' && App._shopMinPrice !== null) list = list.filter(p=>p.price >= +App._shopMinPrice);
    if(App._shopMaxPrice !== '' && App._shopMaxPrice !== null) list = list.filter(p=>p.price <= +App._shopMaxPrice);
    if(App._shopSort==='low') list.sort((a,b)=>a.price-b.price);
    else if(App._shopSort==='high') list.sort((a,b)=>b.price-a.price);
    else if(App._shopSort==='new') list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    else if(App._shopSort==='popular') list.sort((a,b)=>(b.reviewCount||0)-(a.reviewCount||0));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-store"></i> ${t('allProducts')}</h2><span class="count-chip">${list.length} ${t('items')}</span></div>
        <div class="filter-chips">
          <div class="filter-chip ${App._shopCat==='all'?'active':''}" onclick="App._shopCat='all';App.render()">${LANG==='bn'?'সব':'All'}</div>
          ${DB.categories.map(c=>`<div class="filter-chip ${App._shopCat===c?'active':''}" onclick="App._shopCat='${c}';App.render()">${c}</div>`).join('')}
        </div>
        <div class="filters-bar">
          <select onchange="App._shopSort=this.value;App.render()">
            <option value="default" ${App._shopSort==='default'?'selected':''}>${t('defaultSort')}</option>
            <option value="new" ${App._shopSort==='new'?'selected':''}>${t('newest')}</option>
            <option value="popular" ${App._shopSort==='popular'?'selected':''}>${t('popular')}</option>
            <option value="low" ${App._shopSort==='low'?'selected':''}>${t('priceLowHigh')}</option>
            <option value="high" ${App._shopSort==='high'?'selected':''}>${t('priceHighLow')}</option>
          </select>
          <input type="number" placeholder="${t('minPrice')}" value="${App._shopMinPrice}" oninput="App._shopMinPrice=this.value;clearTimeout(window._mf);window._mf=setTimeout(()=>App.render(),400)">
          <input type="number" placeholder="${t('maxPrice')}" value="${App._shopMaxPrice}" oninput="App._shopMaxPrice=this.value;clearTimeout(window._xf);window._xf=setTimeout(()=>App.render(),400)">
        </div>
        <div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('empty')}</h3></div>`}</div>
      </div>`;
  },

  productDetail(id){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    const p = DB.products.find(x=>x.id===id);
    if(!p) return `<div class="page"><div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'পাওয়া যায়নি':'Not found'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div></div>`;
    RecentStore.add(p.id);
    const reviews = DB.getProductReviews(p.id);
    const imgs = p.images && p.images.length ? p.images : [p.img];
    const related = DB.products.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,4);
    const stockCls = p.stock<=0 ? 'out' : (p.stock<10 ? 'low':'');
    return `
      <div class="page">
        <button class="btn btn-outline btn-sm" onclick="App.go('shop')" style="margin-bottom:14px"><i class="fa-solid fa-arrow-left"></i> ${t('shop')}</button>
        <div class="product-detail">
          <div class="detail-gallery">
            <div class="detail-main-img"><img id="mainImg" src="${imgs[0]}" onerror="this.src='https://via.placeholder.com/500'"></div>
            ${imgs.length>1?`<div class="detail-thumbs">${imgs.map((u,i)=>`<div class="detail-thumb ${i===0?'active':''}"><img src="${u}"></div>`).join('')}</div>`:''}
          </div>
          <div class="detail-info">
            <span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span>
            <h1>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h1>
            <div class="rating">${starHTML(p.rating||0)} <span>${p.rating?(p.rating).toFixed(1):'0'} (${p.reviewCount||0} ${t('reviews')})</span></div>
            <div class="detail-price">
              <span class="price">${money(p.price)}</span>
              ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}
              ${p.discount?`<span class="discount-tag">-${p.discount}%</span>`:''}
            </div>
            <p class="detail-desc">${LANG==='bn'?p.desc:(p.descEn||p.desc||'')}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px">
              <span class="chip ${stockCls==='out'?'blocked':'active-status'}"><i class="fa-solid fa-box"></i> ${p.stock<=0?t('outOfStock'):`${t('stock')}: ${p.stock}`}</span>
            </div>
            <div class="detail-actions">
              <button class="btn btn-primary btn-lg" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}</button>
              <button class="btn btn-outline btn-lg" onclick="Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart" style="${Wish.has(p.id)?'color:var(--danger)':''}"></i></button>
            </div>
          </div>
        </div>
        <div class="admin-card" style="margin-top:20px">
          <div class="admin-card-head"><h3><i class="fa-solid fa-comments"></i> ${t('reviews')} (${reviews.length})</h3>${Auth.user()?`<button class="btn btn-primary btn-sm" onclick="Components.openReviewModal('${p.id}')"><i class="fa-solid fa-pen"></i> ${t('writeReview')}</button>`:''}</div>
          ${reviews.length ? reviews.map(r=>{
            const u = DB.users.find(x=>x.id===r.userId);
            return `<div class="review-item">
              <img class="review-avatar" src="${u?.avatar||'https://ui-avatars.com/api/?name=U'}">
              <div class="review-body"><div class="review-head"><h5>${r.userName||'User'}</h5><span class="rating">${starHTML(r.rating,'14px')}</span></div><p>${r.text}</p><small style="font-size:11px;color:var(--text-soft)">${timeAgo(r.date)}</small></div>
            </div>`;
          }).join('') : `<p class="muted">${LANG==='bn'?'এখনো কোনো রিভিউ নেই।':'No reviews yet.'}</p>`}
        </div>
        ${related.length?`<div class="section-head" style="margin-top:26px"><h2><i class="fa-solid fa-layer-group"></i> ${t('relatedProducts')}</h2></div><div class="product-grid">${related.map(Components.productCard).join('')}</div>`:''}
      </div>`;
  },

  orders(){
    if(!Auth.user()) return this.authPage('orders');
    const mine = Orders.mine();
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-box"></i> ${t('myOrders')}</h2><span class="count-chip">${mine.length}</span></div>
        ${mine.length ? `<div class="orders-list">${mine.map(o=>{
          const statuses = ['pending','confirmed','shipped','delivered'];
          const currentIdx = statuses.indexOf(o.status);
          const cancelled = o.status==='cancelled';
          const payment = o.paymentMethod || 'cod';
          return `<div class="order-row" style="flex-direction:column;align-items:stretch">
            <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;width:100%">
              <div class="order-info">
                <h4>${o.id}</h4>
                <p>${new Date(o.date).toLocaleString(LANG==='bn'?'bn-BD':'en-US')} • ${o.items?.length||0} ${t('items')}</p>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
                  <span class="payment-badge ${payment}">${payment==='cod'?'COD':payment.toUpperCase()}</span>
                  ${o.txnId?`<span class="chip" style="font-size:10.5px">TXN: ${o.txnId}</span>`:''}
                </div>
              </div>
              <div class="order-right">
                <span class="price">${money(o.total)}</span>
                <span class="status-badge status-${o.status}">${t(o.status)}</span>
                <button class="icon-btn-sm" onclick="Invoice.print('${o.id}')" title="${t('printInvoice')}"><i class="fa-solid fa-print"></i></button>
              </div>
            </div>
            ${!cancelled?`<div class="order-timeline">${statuses.map((s,i)=>`
              <div class="timeline-step ${i<currentIdx?'done':''} ${i===currentIdx?'current':''}">
                ${i<statuses.length-1?'<div class="timeline-line"></div>':''}
                <div class="dot"><i class="fa-solid ${i<=currentIdx?'fa-check':'fa-circle'}"></i></div>
                <div class="label">${t(s)}</div>
              </div>`).join('')}</div>`:''}
            ${o.history && o.history.filter(h=>h.comment).length ? `<div class="order-comment-box"><b><i class="fa-solid fa-comment"></i> ${t('adminComment')}</b>${o.history.filter(h=>h.comment).slice(-1)[0].comment}</div>` : ''}
          </div>`;
        }).join('')}</div>` : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'কোনো অর্ডার নেই':'No orders yet'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}
      </div>`;
  },

  wishlist(){
    const ids = Wish.all();
    const list = DB.products.filter(p=>ids.includes(p.id));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-heart" style="color:var(--danger)"></i> ${t('wishlist')}</h2><span class="count-chip">${list.length}</span></div>
        <div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>${LANG==='bn'?'উইশলিস্ট খালি':'Wishlist empty'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}</div>
      </div>`;
  },

  profile(){
    const u = Auth.user();
    if(!u) return this.authPage('profile');
    const mine = Orders.mine();
    const totalSpent = mine.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+o.total,0);
    return `
      <div class="page">
        <div class="profile-header">
          <img class="profile-avatar" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'">
          <div class="profile-info">
            <h2>${u.name}</h2>
            <p><i class="fa-solid fa-envelope"></i> ${u.email}</p>
            ${u.phone?`<p><i class="fa-solid fa-phone"></i> ${u.phone}</p>`:''}
            <p><i class="fa-solid fa-user-tag"></i> ${u.role==='admin'?t('adminRole'):t('customer')}</p>
          </div>
        </div>
        <div class="dash-grid">
          <div class="dash-card clickable" onclick="App.go('orders')"><i class="fa-solid fa-box"></i><h3>${mine.length}</h3><p>${t('totalOrders')}</p></div>
          <div class="dash-card clickable" onclick="App.go('wishlist')"><i class="fa-solid fa-heart"></i><h3>${Wish.all().length}</h3><p>${t('wishlist')}</p></div>
          <div class="dash-card clickable" onclick="App.openCart()"><i class="fa-solid fa-cart-shopping"></i><h3>${Cart.count()}</h3><p>${t('cart')}</p></div>
          <div class="dash-card"><i class="fa-solid fa-wallet"></i><h3>${money(totalSpent)}</h3><p>${LANG==='bn'?'মোট খরচ':'Total Spent'}</p></div>
        </div>
        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-pen"></i> ${t('editProfile')}</h3></div>
          <div class="form-group"><label>${t('fullName')}</label><input id="pfName" value="${u.name}"></div>
          <div class="form-group"><label>${t('phone')}</label><input id="pfPhone" value="${u.phone||''}"></div>
          <div class="form-group"><label>${t('newPassword')}</label><input id="pfPass" type="password" placeholder="••••••"></div>
          <button class="btn btn-primary" onclick="Profile.save()"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
        </div>
      </div>`;
  },

  auth(){ return this.authPage(App._authRedirect||'home'); },

  authPage(redirect){
    const tab = App._authTab || 'login';
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="logo-icon"><i class="fa-solid fa-leaf"></i></div>
            <h2>EcoShop<span>Pro</span></h2>
            <p>${t('splashTagline')}</p>
          </div>
          <div class="auth-tabs">
            <button class="${tab==='login'?'active':''}" id="tabLogin" onclick="AuthUI.tab('login')">${t('login')}</button>
            <button class="${tab==='reg'?'active':''}" id="tabReg" onclick="AuthUI.tab('reg')">${t('register')}</button>
          </div>
          <div id="authForm">${tab==='login' ? AuthUI.loginForm(redirect) : AuthUI.regForm(redirect)}</div>
          <div class="info-banner" style="margin-top:16px;font-size:12px">
            <i class="fa-solid fa-circle-info"></i>
            <div>${LANG==='bn'?'ডেমো অ্যাডমিন:':'Demo Admin:'}<br><b>admin@eco.pro</b> / <b>admin123</b></div>
          </div>
        </div>
      </div>`;
  },

  admin(){
    if(!Auth.isAdmin()) return this.authPage('admin');
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    const tab = App._adminTab || 'dashboard';
    return `
      <div class="admin-layout">
        ${Components.adminSidebar(tab)}
        <div class="admin-main">
          <div class="admin-header">
            <button class="admin-sidebar-toggle" onclick="document.querySelector('.admin-sidebar').classList.toggle('active');document.getElementById('backdrop').classList.toggle('active')"><i class="fa-solid fa-bars"></i></button>
            <div class="admin-header-title">
              <h1>${Admin.titles[tab]||t('dashboard')}</h1>
              <p>EcoShop Pro MAX v7.0</p>
            </div>
            <div class="admin-header-actions">
              <button class="btn btn-outline btn-sm" onclick="App.go('home')"><i class="fa-solid fa-store"></i><span> ${t('shop')}</span></button>
              <button class="btn btn-primary btn-sm" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i><span> ${t('addProduct')}</span></button>
            </div>
          </div>
          <div class="admin-content" id="adminContent">${Admin.render(tab)}</div>
        </div>
      </div>`;
  },

  checkout(){
    const u = Auth.user();
    if(!u) return this.authPage('checkout');
    if(!Cart.count()) return `<div class="page"><div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>${t('emptyCart')}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div></div>`;

    const s = DB.settings;
    const methods = [];
    if(s.enableCOD) methods.push({id:'cod', label:t('cod'), desc:t('codDesc'), icon:'fa-money-bill-wave', cls:'cod'});
    if(s.enableBkash) methods.push({id:'bkash', label:t('bkash'), desc:t('mobilePayment'), icon:'fa-mobile-screen', cls:'bkash'});
    if(s.enableNagad) methods.push({id:'nagad', label:t('nagad'), desc:t('mobilePayment'), icon:'fa-mobile-screen', cls:'nagad'});
    if(s.enableRocket) methods.push({id:'rocket', label:t('rocket'), desc:t('mobilePayment'), icon:'fa-mobile-screen', cls:'rocket'});

    const zone = App._checkoutState?.zone || 'inside';
    const selectedPay = App._checkoutState?.payment || 'cod';
    const ship = zone==='inside' ? (s.shippingInsideDhaka||100) : (s.shippingOutsideDhaka||120);
    const subtotal = Cart.subtotal();
    const discount = App._checkoutState?.couponDiscount || 0;
    const total = subtotal + ship - discount;

    return `
      <div class="page" style="max-width:760px">
        <div class="section-head"><h2><i class="fa-solid fa-credit-card"></i> ${t('checkout')}</h2></div>
        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-location-dot"></i> ${LANG==='bn'?'শিপিং তথ্য':'Shipping'}</h3></div>
          <div class="form-group"><label>${t('fullName')} <span class="req">*</span></label><input id="coName" value="${u.name}"></div>
          <div class="form-row">
            <div class="form-group"><label>${t('phone')} <span class="req">*</span></label><input id="coPhone" value="${u.phone||''}" placeholder="017XXXXXXXX"></div>
            <div class="form-group"><label>${t('city')}</label><input id="coCity" value="ঢাকা"></div>
          </div>
          <div class="form-group"><label>${t('address')} <span class="req">*</span></label><textarea id="coAddr" rows="3"></textarea></div>
        </div>

        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-truck"></i> ${t('deliveryZone')}</h3></div>
          <div class="delivery-zones">
            <div class="delivery-zone ${zone==='inside'?'active':''}" onclick="Checkout.setZone('inside')">
              <b>${t('insideDhaka')}</b>
              <div class="zone-price">${money(s.shippingInsideDhaka||100)}</div>
              <small>${LANG==='bn'?'১-২ দিন':'1-2 days'}</small>
            </div>
            <div class="delivery-zone ${zone==='outside'?'active':''}" onclick="Checkout.setZone('outside')">
              <b>${t('outsideDhaka')}</b>
              <div class="zone-price">${money(s.shippingOutsideDhaka||120)}</div>
              <small>${LANG==='bn'?'২-৪ দিন':'2-4 days'}</small>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-wallet"></i> ${t('selectPayment')}</h3></div>
          <div class="payment-methods">
            ${methods.map(m=>`
              <div class="payment-method ${selectedPay===m.id?'active':''}" onclick="Checkout.setPayment('${m.id}')">
                <div class="pm-logo ${m.cls}"><i class="fa-solid ${m.icon}"></i></div>
                <b>${m.label}</b>
                <small>${m.desc}</small>
              </div>
            `).join('')}
          </div>
          <div id="paymentDetail">${Checkout.renderPaymentDetail(selectedPay)}</div>
        </div>

        <div class="admin-card">
          <div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> ${LANG==='bn'?'সারাংশ':'Summary'}</h3></div>
          <div class="form-group">
            <label>${t('couponCode')}</label>
            <div style="display:flex;gap:8px"><input id="coCoupon" placeholder="ECO10"><button class="btn btn-outline" onclick="Checkout.applyCoupon()">${t('applyFilter')}</button></div>
            <div id="couponStatus" class="form-hint"></div>
          </div>
          <div class="cart-summary-row"><span>${t('subtotal')}</span><span>${money(subtotal)}</span></div>
          <div class="cart-summary-row"><span>${t('deliveryCharge')}</span><span id="coShip">${money(ship)}</span></div>
          <div class="cart-summary-row"><span>${t('discount')}</span><span id="coDiscount">-${money(discount)}</span></div>
          <div class="cart-summary-row total"><span>${t('total')}</span><span id="coTotal">${money(total)}</span></div>
          <button class="btn btn-primary btn-block btn-lg" id="coSubmit" style="margin-top:14px" onclick="Checkout.place()"><i class="fa-solid fa-check"></i> ${t('confirmOrder')}</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   Checkout
   ═══════════════════════════════════════════════════════════ */
const Checkout = {
  coupon: null,
  ensureState(){
    if(!App._checkoutState) App._checkoutState = { zone:'inside', payment:'cod', couponDiscount:0, couponCode:null };
    return App._checkoutState;
  },
  setZone(zone){
    const s = this.ensureState();
    s.zone = zone;
    const shipping = zone==='inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const sub = Cart.subtotal();
    const total = sub + shipping - s.couponDiscount;
    const shipEl = document.getElementById('coShip'); if(shipEl) shipEl.textContent = money(shipping);
    const totEl = document.getElementById('coTotal'); if(totEl) totEl.textContent = money(total);
    document.querySelectorAll('.delivery-zone').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.delivery-zone')[zone==='inside'?0:1]?.classList.add('active');
  },
  setPayment(method){
    const s = this.ensureState();
    s.payment = method;
    document.querySelectorAll('.payment-method').forEach(el=>el.classList.remove('active'));
    const idx = ['cod','bkash','nagad','rocket'].indexOf(method);
    document.querySelectorAll('.payment-method')[idx]?.classList.add('active');
    const detail = document.getElementById('paymentDetail');
    if(detail) detail.innerHTML = this.renderPaymentDetail(method);
    this.bindScreenshotUpload();
  },
  renderPaymentDetail(method){
    const s = DB.settings;
    if(method === 'cod'){
      return `<div class="payment-info" style="background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.3)">
        <h4><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> ${t('cod')}</h4>
        <p style="font-size:13.5px;color:var(--text-dim);line-height:1.65">${LANG==='bn'?'পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন। অর্ডার এখনই কনফার্ম হবে।':'Pay when you receive. Order confirmed immediately.'}</p>
      </div>`;
    }
    const num = method==='bkash' ? (s.bkashNumber||'01700000000') : method==='nagad' ? (s.nagadNumber||'01700000000') : (s.rocketNumber||'01700000000');
    const brandName = method==='bkash' ? 'বিকাশ' : method==='nagad' ? 'নগদ' : 'রকেট';
    const dialFull = method==='bkash' ? `*247*${num}*` : method==='nagad' ? `*167*${num}*` : `*322*1*${num}*`;
    return `
      <div class="payment-info">
        <h4><span class="pm-brand ${method}">${brandName}</span> ${LANG==='bn'?'সেন্ড মানি':'Send Money'}</h4>
        <div class="copy-number-box">
          <div>
            <small style="font-size:11.5px;color:var(--text-dim);display:block;margin-bottom:2px">${t('paymentNumber')}</small>
            <span class="number" id="payNum">${num}</span>
          </div>
          <button class="copy-btn" id="copyNumBtn" onclick="Checkout.copyNumber('${num}')"><i class="fa-solid fa-copy"></i> ${t('copy')}</button>
        </div>
        <h5 style="font-size:13px;font-weight:800;margin:12px 0 8px">📋 ${t('sendMoneySteps')}:</h5>
        <ol class="steps-list">
          <li>${LANG==='bn'?`<b>${brandName}</b> অ্যাপ খুলুন বা ডায়াল করুন`:`Open <b>${brandName}</b> app or dial`}</li>
          <li>${LANG==='bn'?'<b>Send Money</b> অপশন বেছে নিন':'Choose <b>Send Money</b>'}</li>
          <li>${LANG==='bn'?'উপরের নাম্বারে সম্পূর্ণ টাকা সেন্ড করুন':'Send full amount to the number'}</li>
          <li>${LANG==='bn'?'সফল হলে <b>Transaction ID</b> নিচে লিখুন':'Enter the <b>Transaction ID</b> below'}</li>
        </ol>
        <div class="dial-code-box">
          <div style="flex:1">
            <small style="font-size:11px;color:var(--text-dim);display:block;margin-bottom:3px">${t('useDialCode')}</small>
            <code id="dialCode">${dialFull}</code>
          </div>
          <button onclick="Checkout.copyDial('${dialFull}')"><i class="fa-solid fa-copy"></i> ${t('copy')}</button>
        </div>
        <div class="txn-input-group">
          <label>${t('txnId')} <span class="req">*</span></label>
          <input id="txnIdInput" placeholder="${t('txnIdPlaceholder')}" autocomplete="off">
        </div>
        <div class="txn-input-group">
          <label>${t('screenshot')} <span class="optional">${t('screenshotOptional')}</span></label>
          <div class="payment-screenshot" style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-top:10px">
            <div class="img-preview" id="ssPreview" style="width:96px;height:96px;border-radius:14px;border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--surface-2);flex-shrink:0;"><i class="fa-solid fa-image" style="font-size:34px;color:var(--text-soft)"></i></div>
            <div class="upload-btn-wrap" style="flex:1;min-width:180px">
              <button type="button" class="upload-btn" id="ssUploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> ${t('uploadScreenshot')}</button>
              <input type="file" id="ssFile" accept="image/*" style="display:none">
              <div class="upload-progress" id="ssProgress"><span></span></div>
            </div>
          </div>
          <input type="hidden" id="ssUrl" value="">
        </div>
      </div>`;
  },
  bindScreenshotUpload(){
    const btn = document.getElementById('ssUploadBtn');
    const file = document.getElementById('ssFile');
    const prev = document.getElementById('ssPreview');
    const hidden = document.getElementById('ssUrl');
    const prog = document.getElementById('ssProgress');
    if(!btn || btn._bound) return;
    btn._bound = true;
    btn.onclick = ()=> file.click();
    file.onchange = async ()=>{
      const f = file.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = e => prev.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
      reader.readAsDataURL(f);
      btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> Uploading...`;
      if(prog){ prog.style.display='block'; prog.firstElementChild.style.width='40%'; }
      try {
        const res = await ImageUpload.upload(f);
        hidden.value = res.url;
        prev.innerHTML = `<img src="${res.url}" style="width:100%;height:100%;object-fit:cover">`;
        if(prog) prog.firstElementChild.style.width='100%';
        Toast.show(LANG==='bn'?'স্ক্রিনশট আপলোড হয়েছে':'Screenshot uploaded','success');
      } catch(err){
        Toast.show('Upload failed: '+err.message,'error');
        prev.innerHTML = '<i class="fa-solid fa-image" style="font-size:34px;color:var(--text-soft)"></i>';
      } finally {
        btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${t('uploadScreenshot')}`;
        if(prog) setTimeout(()=>{ prog.style.display='none'; prog.firstElementChild.style.width='0'; }, 800);
      }
    };
  },
  copyNumber(num){
    navigator.clipboard.writeText(num).then(()=>{
      Toast.show(t('numberCopied'),'success');
      const btn = document.getElementById('copyNumBtn');
      if(btn){ btn.classList.add('copied'); btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t('copied')}`;
        setTimeout(()=>{ btn.classList.remove('copied'); btn.innerHTML = `<i class="fa-solid fa-copy"></i> ${t('copy')}`; }, 2000); }
    });
  },
  copyDial(code){ navigator.clipboard.writeText(code).then(()=> Toast.show(t('dialCodeCopied'),'success')); },
  applyCoupon(){
    const code = document.getElementById('coCoupon').value.trim().toUpperCase();
    const c = DB.coupons.find(x=>x.code===code);
    const status = document.getElementById('couponStatus');
    if(!c){ Toast.show(t('invalidCoupon'),'error'); if(status) status.textContent=''; return; }
    this.coupon = c;
    const s = this.ensureState();
    const ship = s.zone==='inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const subtotal = Cart.subtotal();
    const off = c.type==='percent' ? Math.round(subtotal * c.value/100) : c.value;
    s.couponDiscount = off; s.couponCode = c.code;
    const total = subtotal + ship - off;
    if(status){ status.textContent = `✓ ${c.code} — ${LANG==='bn'?'ছাড়':'Save'} ${money(off)}`; status.style.color='var(--success)'; }
    const dEl = document.getElementById('coDiscount'); if(dEl) dEl.textContent = '-'+money(off);
    const tEl = document.getElementById('coTotal'); if(tEl) tEl.textContent = money(total);
    Toast.show(t('couponApplied'),'success');
  },
  async place(){
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const address = document.getElementById('coAddr').value.trim();
    if(!name || !phone || !address){ Toast.show(t('fillAllFields'),'error'); return; }
    const s = this.ensureState();
    const method = s.payment;
    let txnId = null, screenshot = null;
    if(method !== 'cod'){
      const inp = document.getElementById('txnIdInput');
      txnId = inp ? inp.value.trim() : '';
      if(!txnId || txnId.length < 6){ Toast.show(t('invalidTxnId'),'error'); return; }
      const ss = document.getElementById('ssUrl');
      screenshot = ss ? ss.value.trim() : '';
    }
    const ship = s.zone==='inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const subtotal = Cart.subtotal();
    const total = subtotal + ship - (s.couponDiscount||0);
    const items = Cart.items().map(i=>{
      const p = DB.products.find(x=>x.id===i.id);
      return { id:i.id, name:p?.name||'—', price:p?.price||0, qty:i.qty, img:p?.img||'' };
    });
    const btn = document.getElementById('coSubmit');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try {
      const order = await Orders.create({
        customer: { name, phone, city, address },
        items, subtotal,
        deliveryCharge: ship,
        deliveryZone: s.zone,
        discount: s.couponDiscount||0,
        total, coupon: s.couponCode,
        paymentMethod: method,
        paymentNumber: method==='cod' ? null : (DB.settings[method+'Number'] || ''),
        txnId, screenshot
      });
      App._checkoutState = null;
      this.coupon = null;
      Toast.show(method==='cod' ? t('orderSuccessCOD') : t('orderSuccessPaid'),'success',4000);
      PushNotif.localNotif(LANG==='bn'?'অর্ডার সফল':'Order placed', order.id);
      App.go('orders');
    } catch(e){
      Toast.show(t('orderFailed') + ': ' + e.message,'error');
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t('confirmOrder')}`;
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════════ */
const Components = {
  productCard(p){
    const name = LANG==='bn' ? p.name : (p.nameEn||p.name);
    const stockCls = p.stock<=0 ? 'out' : (p.stock<10 ? 'low':'');
    const stockTxt = p.stock<=0 ? t('outOfStock') : (p.stock<10 ? `${t('stock')}: ${p.stock}` : t('inStock'));
    const isNew = Date.now() - (p.createdAt||0) < 7*24*60*60*1000;
    const isHot = (p.reviewCount||0) > 20;
    let badge = '';
    if(p.discount) badge = `<span class="product-badge">-${p.discount}%</span>`;
    else if(isNew) badge = `<span class="product-badge new">NEW</span>`;
    else if(isHot) badge = `<span class="product-badge hot">HOT</span>`;
    return `
      <div class="product-card" onclick="App.go('product','${p.id}')">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
          ${badge}
          <span class="stock-badge ${stockCls}">${stockTxt}</span>
          <button class="wish-btn ${Wish.has(p.id)?'active':''}" onclick="event.stopPropagation();Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart"></i></button>
          <button class="quick-view-btn" onclick="event.stopPropagation();QuickView.open('${p.id}')"><i class="fa-solid fa-eye"></i> ${t('quickView')}</button>
        </div>
        <div class="product-body">
          <span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span>
          <h3 class="product-name">${name}</h3>
          <div class="rating">${starHTML(p.rating||0,'11px')} <span>${p.reviewCount?`(${p.reviewCount})`:''}</span></div>
          <div class="product-price"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div>
          <button class="btn btn-primary btn-block btn-sm" ${p.stock<=0?'disabled':''} onclick="event.stopPropagation();Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${p.stock<=0?t('outOfStock'):t('addToCart')}</button>
        </div>
      </div>`;
  },
  adminSidebar(tab){
    const pendingCount = DB.orders.filter(o=>o.status==='pending').length;
    const items = [
      {sec:LANG==='bn'?'মেইন':'Main', list:[
        {id:'dashboard', icon:'fa-chart-line', label:t('dashboard')},
        {id:'products', icon:'fa-box', label:t('products')},
        {id:'orders', icon:'fa-receipt', label:t('ordersTab'), badge: pendingCount},
        {id:'users', icon:'fa-users', label:t('users')},
      ]},
      {sec:LANG==='bn'?'অতিরিক্ত':'Extras', list:[
        {id:'categories', icon:'fa-tags', label:t('categories')},
        {id:'coupons', icon:'fa-ticket', label:t('coupons')},
        {id:'settings', icon:'fa-gear', label:t('settings')},
      ]}
    ];
    return `<aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-brand">
        <div class="logo-icon"><i class="fa-solid fa-leaf"></i></div>
        <span class="logo-text">EcoShop<span style="color:var(--brand)">Pro</span></span>
        <span class="admin-pill">ADMIN</span>
      </div>
      <nav class="admin-nav">
        ${items.map(g=>`
          <div class="nav-section">
            <div class="nav-section-title">${g.sec}</div>
            ${g.list.map(i=>`<a class="${tab===i.id?'active':''}" onclick="Admin.switchTab('${i.id}')">
              <i class="fa-solid ${i.icon}"></i> ${i.label}
              ${i.badge ? `<span class="nav-count">${i.badge}</span>` : ''}
            </a>`).join('')}
          </div>`).join('')}
      </nav>
      <div class="admin-footer">
        <button class="admin-exit" onclick="App.go('home')"><i class="fa-solid fa-arrow-left"></i> ${LANG==='bn'?'স্টোরে ফিরুন':'Back'}</button>
      </div>
    </aside>`;
  },
  openReviewModal(productId){
    if(!Auth.user()){ Toast.show(t('loginRequired'),'warning'); return; }
    let rating = 5;
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-star"></i> ${t('writeReview')}</h3></div>
      <div class="modal-body">
        <div class="form-group">
          <label>${t('yourRating')}</label>
          <div class="star-picker" id="starPicker">
            ${[1,2,3,4,5].map(i=>`<i class="fa-solid fa-star active" data-star="${i}"></i>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label>${t('reviews')}</label>
          <textarea id="reviewText" rows="4" placeholder="${LANG==='bn'?'আপনার মতামত লিখুন...':'Write your review...'}"></textarea>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" onclick="Components.submitReview('${productId}', ${rating})"><i class="fa-solid fa-paper-plane"></i> ${t('submitReview')}</button>
      </div>
    `);
    const picker = document.getElementById('starPicker');
    if(picker){
      picker.querySelectorAll('i').forEach(star=>{
        star.onclick = ()=>{
          rating = +star.dataset.star;
          picker.querySelectorAll('i').forEach(s=>s.classList.toggle('active', +s.dataset.star <= rating));
        };
      });
    }
  },
  async submitReview(productId, rating){
    const text = document.getElementById('reviewText').value.trim();
    if(!text){ Toast.show(t('fillAllFields'),'error'); return; }
    const u = Auth.user();
    try {
      await DB.saveReview({ productId, userId: u.id, userName: u.name, rating, text });
      await DB.addReviewToProduct(productId, rating);
      Modal.close();
      Toast.show(LANG==='bn'?'রিভিউ জমা হয়েছে':'Review submitted','success');
      App.render();
    } catch(e){ Toast.show('Failed: '+e.message,'error'); }
  }
};

/* ═══════════════════════════════════════════════════════════
   Admin
   ═══════════════════════════════════════════════════════════ */
const Admin = {
  get titles(){
    return { dashboard:t('dashboard'), products:t('products'), orders:t('ordersTab'),
      users:t('users'), categories:t('categories'), coupons:t('coupons'), settings:t('settings') };
  },
  switchTab(tab){
    App._adminTab = tab;
    document.getElementById('backdrop')?.classList.remove('active');
    document.getElementById('adminSidebar')?.classList.remove('active');
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
    const orders = DB.orders, users = DB.users, prods = DB.products;
    const totalSales = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0);
    const pending = orders.filter(o=>o.status==='pending').length;
    const lowStock = prods.filter(p=>p.stock<10).length;
    const recent = orders.slice(0,6);
    const topProducts = [...prods].sort((a,b)=>(b.reviewCount||0)-(a.reviewCount||0)).slice(0,5);
    return `
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div><div class="stat-info"><p>${t('totalSales')}</p><h3>${money(totalSales)}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-cart-shopping"></i></div><div class="stat-info"><p>${t('totalOrders')}</p><h3>${orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div class="stat-info"><p>${t('totalUsers')}</p><h3>${users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-box"></i></div><div class="stat-info"><p>${t('totalProducts')}</p><h3>${prods.length}</h3></div></div>
      </div>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${t('pendingOrders')}</p><h3>${pending}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-info"><p>${t('lowStock')}</p><h3>${lowStock}</h3></div></div>
        <div class="stat-card"><div class="stat-icon info"><i class="fa-solid fa-user-check"></i></div><div class="stat-info"><p>${t('activeUsers')}</p><h3>${users.filter(u=>!u.blocked).length}</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> ${t('recentOrders')}</h3><button class="btn btn-outline btn-sm" onclick="Admin.switchTab('orders')">${LANG==='bn'?'সব':'All'}</button></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>${t('orderId')}</th><th>${t('customer')}</th><th>${t('total')}</th><th>${t('paymentMethod')}</th><th>${t('orderStatus')}</th><th>${t('orderDate')}</th></tr></thead>
            <tbody>${recent.length ? recent.map(o=>`<tr>
              <td><b>${o.id}</b></td>
              <td>${o.customer?.name||'—'}</td>
              <td>${money(o.total)}</td>
              <td><span class="payment-badge ${o.paymentMethod||'cod'}">${(o.paymentMethod||'cod').toUpperCase()}</span></td>
              <td><span class="status-badge status-${o.status}">${t(o.status)}</span></td>
              <td>${new Date(o.date).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US')}</td>
            </tr>`).join('') : `<tr><td colspan="6" class="muted">${t('noData')}</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-trophy"></i> ${LANG==='bn'?'টপ পণ্য':'Top Products'}</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th></th><th>${t('productName')}</th><th>${t('price')}</th><th>${t('stock')}</th><th>${t('reviews')}</th></tr></thead>
            <tbody>${topProducts.map(p=>`<tr>
              <td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"></td>
              <td><b>${p.name}</b></td>
              <td>${money(p.price)}</td>
              <td>${p.stock}</td>
              <td>${starHTML(p.rating||0,'11px')} (${p.reviewCount||0})</td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  },
  products(){
    const q = App._pQuery||'';
    const list = DB.products.filter(p=> !q || (p.name+(p.nameEn||'')).toLowerCase().includes(q.toLowerCase()));
    return `
      <div class="admin-toolbar">
        <input placeholder="${t('productSearch')}" value="${q}" oninput="App._pQuery=this.value;clearTimeout(window._pq);window._pq=setTimeout(()=>Admin.refreshContent(),250)">
        <button class="btn btn-primary" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> ${t('addProduct')}</button>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>${t('totalProducts')} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th></th><th>${t('productName')}</th><th>${t('category')}</th><th>${t('price')}</th><th>${t('discount')}</th><th>${t('stock')}</th><th></th></tr></thead>
            <tbody>${list.length ? list.map(p=>`<tr>
              <td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"></td>
              <td><b>${p.name}</b><br><small style="color:var(--text-dim)">${p.nameEn||''}</small></td>
              <td><span class="chip">${p.cat}</span></td>
              <td>${money(p.price)} ${p.oldPrice?`<br><small style="text-decoration:line-through;color:var(--text-soft)">${money(p.oldPrice)}</small>`:''}</td>
              <td>${p.discount?`<span class="chip">-${p.discount}%</span>`:'—'}</td>
              <td>${p.stock<=0?`<span class="chip blocked">${t('outOfStock')}</span>`:(p.stock<10?`<span class="chip" style="background:rgba(245,158,11,.15);color:#b45309">${p.stock}</span>`:`<span class="chip active-status">${p.stock}</span>`)}</td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openProductModal('${p.id}')" title="${t('edit')}"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn-sm danger" onclick="Admin.deleteProduct('${p.id}')" title="${t('delete')}"><i class="fa-solid fa-trash"></i></button>
              </div></td>
            </tr>`).join('') : `<tr><td colspan="7" class="muted">${t('noData')}</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },
  openProductModal(id){
    const p = id ? DB.products.find(x=>x.id===id) : {name:'',nameEn:'',cat:'',catEn:'',price:'',oldPrice:'',discount:0,stock:'',img:'',images:[],desc:'',descEn:'',tags:[],featured:false};
    const cats = DB.categories.length ? DB.categories : ['ইলেকট্রনিকস','গ্যাজেট','ফ্যাশন','ফটোগ্রাফি'];
    const tags = (p.tags||[]).slice();
    const images = (p.images||[]).slice();
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3>${id?t('editProduct'):t('addProduct')}</h3></div>
      <div class="modal-body">
        <div class="form-tabs">
          <button class="active" data-tab="basic"><i class="fa-solid fa-circle-info"></i> ${LANG==='bn'?'মূল তথ্য':'Basic'}</button>
          <button data-tab="images"><i class="fa-solid fa-image"></i> ${t('images')}</button>
          <button data-tab="pricing"><i class="fa-solid fa-tag"></i> ${t('price')}</button>
          <button data-tab="extra"><i class="fa-solid fa-list"></i> ${LANG==='bn'?'অতিরিক্ত':'Extra'}</button>
        </div>
        <div class="form-tab-content active" data-content="basic">
          <div class="form-row">
            <div class="form-group"><label>${t('productName')} <span class="req">*</span></label><input id="pName" value="${p.name}"></div>
            <div class="form-group"><label>${t('productNameEn')}</label><input id="pNameEn" value="${p.nameEn||''}"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>${t('category')} <span class="req">*</span></label><select id="pCat">${cats.map(c=>`<option ${p.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>
            <div class="form-group"><label>Category (EN)</label><input id="pCatEn" value="${p.catEn||''}"></div>
          </div>
          <div class="form-group"><label>${t('description')}</label><textarea id="pDesc" rows="3">${p.desc||''}</textarea></div>
          <div class="form-group"><label>${t('descriptionEn')}</label><textarea id="pDescEn" rows="3">${p.descEn||''}</textarea></div>
        </div>
        <div class="form-tab-content" data-content="images">
          <div class="form-group">
            <label>${t('images')}</label>
            <div class="img-upload">
              <div class="img-preview" id="imgPreview">${p.img?`<img src="${p.img}">`:`<i class="fa-solid fa-image"></i>`}</div>
              <div class="upload-btn-wrap">
                <button type="button" class="upload-btn" id="uploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> ${LANG==='bn'?'মূল ছবি':'Main Image'}</button>
                <input type="file" id="imgFile" accept="image/*" style="display:none">
                <div class="upload-hint">JPG, PNG, WebP — Max 32MB</div>
                <div class="upload-progress" id="uploadProgress"><span></span></div>
              </div>
            </div>
            <input type="hidden" id="pImg" value="${p.img||''}">
          </div>
          <div class="form-group">
            <label>${LANG==='bn'?'অতিরিক্ত ছবি':'Gallery'}</label>
            <button type="button" class="upload-btn" id="uploadMultiBtn"><i class="fa-solid fa-images"></i> ${LANG==='bn'?'একাধিক ছবি':'Multiple Images'}</button>
            <input type="file" id="imgMultiFile" accept="image/*" multiple style="display:none">
            <div class="img-thumbs" id="imgThumbs">
              ${images.map((u,i)=>`<div class="img-thumb"><img src="${u}"><button class="remove-img" onclick="Admin.removeImage(${i})"><i class="fa-solid fa-xmark"></i></button>${i===0?'<span class="primary-tag">MAIN</span>':''}</div>`).join('')}
            </div>
            <input type="hidden" id="pImages" value='${JSON.stringify(images)}'>
          </div>
        </div>
        <div class="form-tab-content" data-content="pricing">
          <div class="form-row">
            <div class="form-group"><label>${t('price')} (৳) <span class="req">*</span></label><input id="pPrice" type="number" value="${p.price}" min="0"></div>
            <div class="form-group"><label>${t('oldPrice')} (৳)</label><input id="pOld" type="number" value="${p.oldPrice||''}" min="0"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>${t('discountPercent')}</label><input id="pDisc" type="number" value="${p.discount||0}" min="0" max="99"></div>
            <div class="form-group"><label>${t('stock')} <span class="req">*</span></label><input id="pStock" type="number" value="${p.stock}" min="0"></div>
          </div>
        </div>
        <div class="form-tab-content" data-content="extra">
          <div class="form-group">
            <label>${t('tags')}</label>
            <div class="tag-input-wrap" id="tagWrap">
              ${tags.map(t2=>`<span class="tag-pill" data-tag="${t2}">${t2}<button type="button" onclick="Admin.removeTag('${t2}')"><i class="fa-solid fa-xmark"></i></button></span>`).join('')}
              <input id="tagInput" placeholder="${LANG==='bn'?'ট্যাগ লিখে Enter':'Type and Enter'}">
            </div>
            <input type="hidden" id="pTags" value='${JSON.stringify(tags)}'>
          </div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" id="pFeatured" ${p.featured?'checked':''} style="width:auto"><span>${t('featured_product')}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" id="pSaveBtn" onclick="Admin.saveProduct('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `, 'lg');
    this.bindProductForm();
  },
  bindProductForm(){
    document.querySelectorAll('.form-tabs button').forEach(btn=>{
      btn.onclick = ()=>{
        document.querySelectorAll('.form-tabs button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.form-tab-content').forEach(c=>c.classList.remove('active'));
        document.querySelector(`.form-tab-content[data-content="${btn.dataset.tab}"]`)?.classList.add('active');
      };
    });
    const btn = document.getElementById('uploadBtn');
    const file = document.getElementById('imgFile');
    const prev = document.getElementById('imgPreview');
    const hidden = document.getElementById('pImg');
    const prog = document.getElementById('uploadProgress');
    if(btn){
      btn.onclick = ()=> file.click();
      file.onchange = async ()=>{
        const f = file.files[0]; if(!f) return;
        const reader = new FileReader();
        reader.onload = e => prev.innerHTML = `<img src="${e.target.result}">`;
        reader.readAsDataURL(f);
        btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
        prog.style.display='block'; prog.firstElementChild.style.width='40%';
        try {
          const res = await ImageUpload.upload(f);
          hidden.value = res.url;
          prev.innerHTML = `<img src="${res.url}">`;
          prog.firstElementChild.style.width='100%';
          Toast.show(t('imageUploadSuccess'),'success');
        } catch(err){ Toast.show(t('imageUploadFailed')+': '+err.message,'error'); }
        finally {
          btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ${LANG==='bn'?'মূল ছবি':'Main Image'}`;
          setTimeout(()=>{ prog.style.display='none'; prog.firstElementChild.style.width='0'; }, 800);
        }
      };
    }
    const mBtn = document.getElementById('uploadMultiBtn');
    const mFile = document.getElementById('imgMultiFile');
    const thumbs = document.getElementById('imgThumbs');
    const mHidden = document.getElementById('pImages');
    if(mBtn){
      mBtn.onclick = ()=> mFile.click();
      mFile.onchange = async ()=>{
        const files = Array.from(mFile.files); if(!files.length) return;
        mBtn.disabled = true;
        let current = JSON.parse(mHidden.value || '[]');
        let done = 0;
        for(const f of files){
          try {
            const res = await ImageUpload.upload(f);
            current.push(res.url); done++;
            mBtn.innerHTML = `<i class="fa-solid fa-spinner"></i> (${done}/${files.length})`;
            thumbs.innerHTML = current.map((u,i)=>`<div class="img-thumb"><img src="${u}"><button class="remove-img" onclick="Admin.removeImage(${i})"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
            mHidden.value = JSON.stringify(current);
          } catch(e){}
        }
        mBtn.disabled = false;
        mBtn.innerHTML = `<i class="fa-solid fa-images"></i> ${LANG==='bn'?'একাধিক ছবি':'Multiple Images'}`;
        if(done) Toast.show(`${done} uploaded`,'success');
      };
    }
    const tagInput = document.getElementById('tagInput');
    const tagWrap = document.getElementById('tagWrap');
    const tagsHidden = document.getElementById('pTags');
    if(tagInput){
      tagInput.onkeydown = (e)=>{
        if(e.key==='Enter' || e.key===','){
          e.preventDefault();
          const val = tagInput.value.trim(); if(!val) return;
          let tags = JSON.parse(tagsHidden.value || '[]');
          if(!tags.includes(val)){
            tags.push(val); tagsHidden.value = JSON.stringify(tags);
            const pill = document.createElement('span');
            pill.className = 'tag-pill'; pill.dataset.tag = val;
            pill.innerHTML = `${val}<button type="button" onclick="Admin.removeTag('${val}')"><i class="fa-solid fa-xmark"></i></button>`;
            tagWrap.insertBefore(pill, tagInput);
          }
          tagInput.value = '';
        }
      };
    }
  },
  removeImage(index){
    const hidden = document.getElementById('pImages');
    let imgs = JSON.parse(hidden.value || '[]');
    imgs.splice(index, 1);
    hidden.value = JSON.stringify(imgs);
    const thumbs = document.getElementById('imgThumbs');
    if(thumbs) thumbs.innerHTML = imgs.map((u,i)=>`<div class="img-thumb"><img src="${u}"><button class="remove-img" onclick="Admin.removeImage(${i})"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
  },
  removeTag(tag){
    const hidden = document.getElementById('pTags');
    let tags = JSON.parse(hidden.value || '[]');
    tags = tags.filter(x=>x!==tag);
    hidden.value = JSON.stringify(tags);
    document.querySelector(`.tag-pill[data-tag="${tag}"]`)?.remove();
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
      images: JSON.parse(document.getElementById('pImages').value || '[]'),
      desc: document.getElementById('pDesc').value.trim(),
      descEn: document.getElementById('pDescEn').value.trim(),
      tags: JSON.parse(document.getElementById('pTags').value || '[]'),
      featured: document.getElementById('pFeatured').checked
    };
    if(!data.name || !data.price){ Toast.show(t('fillAllFields'),'error'); return; }
    if(!data.img || data.img.includes('placeholder')) data.img = data.images[0] || data.img;
    const btn = document.getElementById('pSaveBtn');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try { await DB.saveProduct(data); Modal.close(); Toast.show(t('saveSuccess'),'success'); }
    catch(e){ Toast.show('Failed: '+e.message,'error'); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> ${t('save')}`; }
  },
  deleteProduct(id){
    Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteProduct(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); } });
  },
  orders(){
    const q = (App._oQuery||'').toLowerCase();
    const list = DB.orders.filter(o=> !q || o.id.toLowerCase().includes(q) || (o.customer?.name||'').toLowerCase().includes(q));
    return `
      <div class="admin-toolbar">
        <input placeholder="${t('orderSearch')}" value="${App._oQuery||''}" oninput="App._oQuery=this.value;clearTimeout(window._oq);window._oq=setTimeout(()=>Admin.refreshContent(),250)">
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>${t('totalOrders')} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>${t('orderId')}</th><th>${t('customer')}</th><th>${t('total')}</th><th>${t('paymentMethod')}</th><th>${t('orderStatus')}</th><th></th></tr></thead>
            <tbody>${list.length ? list.map(o=>`<tr>
              <td><b>${o.id}</b><br><small style="color:var(--text-dim)">${new Date(o.date).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US')}</small></td>
              <td>${o.customer?.name||'—'}<br><small style="color:var(--text-dim)">${o.customer?.phone||''}</small></td>
              <td><b>${money(o.total)}</b><br><small style="color:var(--text-dim)">Delivery: ${money(o.deliveryCharge||0)}</small></td>
              <td><span class="payment-badge ${o.paymentMethod||'cod'}">${(o.paymentMethod||'cod').toUpperCase()}</span>${o.txnId?`<br><small style="color:var(--text-dim);font-size:11px">${o.txnId}</small>`:''}</td>
              <td><span class="status-badge status-${o.status}">${t(o.status)}</span></td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button>
                <button class="icon-btn-sm" onclick="Invoice.print('${o.id}')"><i class="fa-solid fa-print"></i></button>
                <button class="icon-btn-sm danger" onclick="Admin.deleteOrder('${o.id}')"><i class="fa-solid fa-trash"></i></button>
              </div></td>
            </tr>`).join('') : `<tr><td colspan="6" class="muted">${t('noData')}</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },
  openOrderModal(id){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div>
      <div class="modal-body">
        <div style="background:var(--surface-2);padding:14px;border-radius:12px;margin-bottom:14px">
          <b style="font-size:14px">${o.customer.name}</b>
          <p style="font-size:12.5px;color:var(--text-dim);margin-top:4px">${o.customer.phone||''} • ${o.customer.address||''}${o.customer.city?', '+o.customer.city:''}</p>
        </div>
        <div class="form-group">
          <label>${t('orderStatus')}</label>
          <select id="aoStatus">${['pending','confirmed','shipped','delivered','cancelled'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${t(s)}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>${t('adminComment')} <span class="optional">${t('adminCommentOptional')}</span></label>
          <textarea id="aoComment" rows="2" placeholder="${t('commentPlaceholder')}"></textarea>
        </div>
        <div class="form-group">
          <label>${t('deliveryChargeEdit')} (৳)</label>
          <input id="aoDelivery" type="number" value="${o.deliveryCharge||0}" min="0">
          <div class="delivery-edit-hint"><i class="fa-solid fa-circle-info"></i> ${LANG==='bn'?'পরিবর্তন করলে সর্বমোট আপডেট হবে':'Total will auto-update'}</div>
        </div>
        <div class="form-group">
          <label>${t('paymentInfo')}</label>
          <div style="background:var(--surface-2);padding:12px;border-radius:10px;font-size:13px">
            <div><b>Method:</b> ${(o.paymentMethod||'cod').toUpperCase()}</div>
            ${o.txnId?`<div style="margin-top:4px"><b>Txn ID:</b> ${o.txnId}</div>`:''}
            ${o.screenshot?`<div style="margin-top:8px"><b>Screenshot:</b><br><img src="${o.screenshot}" style="max-width:120px;margin-top:6px;border-radius:8px;cursor:pointer" onclick="window.open('${o.screenshot}','_blank')"></div>`:''}
          </div>
        </div>
        ${o.history && o.history.length ? `<div class="form-group"><label>History</label><div style="font-size:12px;line-height:1.8">${o.history.map(h=>`<div>• ${new Date(h.time).toLocaleString(LANG==='bn'?'bn-BD':'en-US')} — <b>${t(h.status)}</b>${h.comment?` <i style="color:var(--text-dim)">— ${h.comment}</i>`:''}</div>`).join('')}</div></div>`:''}
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" onclick="Admin.saveOrderChanges('${o.id}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `, 'lg');
  },
  async saveOrderChanges(id){
    const status = document.getElementById('aoStatus').value;
    const comment = document.getElementById('aoComment').value.trim();
    const delivery = +document.getElementById('aoDelivery').value || 0;
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    try {
      if(delivery !== (o.deliveryCharge||0)) await Orders.updateDeliveryCharge(id, delivery);
      const o2 = DB.orders.find(x=>x.id===id);
      if(status !== o2.status || comment) await Orders.updateStatus(id, status, comment);
      Modal.close();
      Toast.show(t('saveSuccess'),'success');
      Admin.refreshContent();
    } catch(e){ Toast.show('Failed: '+e.message,'error'); }
  },
  deleteOrder(id){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await Orders.remove(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); } }); },
  users(){
    const q = (App._uQuery||'').toLowerCase();
    const list = DB.users.filter(u=> !q || (u.name+u.email).toLowerCase().includes(q));
    const selected = App._selectedUsers || [];
    return `
      <div class="admin-toolbar">
        <input placeholder="${t('userSearch')}" value="${App._uQuery||''}" oninput="App._uQuery=this.value;clearTimeout(window._uq);window._uq=setTimeout(()=>Admin.refreshContent(),250)">
        <button class="btn btn-primary" onclick="Admin.openUserModal()"><i class="fa-solid fa-user-plus"></i> ${t('addUser')}</button>
      </div>
      ${selected.length ? `<div class="bulk-bar">
        <span>${selected.length} ${t('selected')}</span>
        <button class="btn btn-sm btn-danger" onclick="Admin.bulkAction('delete')"><i class="fa-solid fa-trash"></i> ${t('delete')}</button>
        <button class="btn btn-sm btn-warning" onclick="Admin.bulkAction('block')"><i class="fa-solid fa-ban"></i> ${t('block')}</button>
        <button class="btn btn-sm btn-success" onclick="Admin.bulkAction('unblock')"><i class="fa-solid fa-check"></i> ${t('unblock')}</button>
        <button class="btn btn-sm btn-outline" onclick="App._selectedUsers=[];Admin.refreshContent()">${t('cancel')}</button>
      </div>` : ''}
      <div class="admin-card">
        <div class="admin-card-head"><h3>${t('totalUsers')} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr>
              <th><input type="checkbox" onchange="Admin.toggleAllUsers(this.checked)"></th>
              <th></th><th>${t('fullName')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('active')}</th><th></th>
            </tr></thead>
            <tbody>${list.length ? list.map(u=>`<tr>
              <td><input type="checkbox" ${selected.includes(u.id)?'checked':''} onchange="Admin.toggleUser('${u.id}', this.checked)"></td>
              <td><img class="thumb" style="border-radius:50%" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'"></td>
              <td><b>${u.name}</b></td>
              <td>${u.email}</td>
              <td><span class="chip ${u.role==='admin'?'active-status':''}">${u.role}</span></td>
              <td>${u.blocked?`<span class="chip blocked">${t('blocked')}</span>`:`<span class="chip active-status">${t('active')}</span>`}</td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openUserModal('${u.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn-sm ${u.blocked?'success':''}" onclick="Admin.toggleBlock('${u.id}')"><i class="fa-solid ${u.blocked?'fa-unlock':'fa-ban'}"></i></button>
                ${u.role!=='admin'?`<button class="icon-btn-sm danger" onclick="Admin.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>`:''}
              </div></td>
            </tr>`).join('') : `<tr><td colspan="7" class="muted">${t('noData')}</td></tr>`}</tbody>
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
  toggleAllUsers(checked){ App._selectedUsers = checked ? DB.users.map(u=>u.id) : []; this.refreshContent(); },
  bulkAction(type){
    const ids = App._selectedUsers || []; if(!ids.length) return;
    Modal.confirm(`${ids.length} ${t('selected')}?`, async ()=>{
      for(const id of ids){
        const u = DB.users.find(x=>x.id===id);
        if(!u || u.role==='admin') continue;
        try { if(type==='delete') await DB.deleteUser(id); else await DB.updateUser(id, { blocked: type==='block' }); } catch(e){}
      }
      App._selectedUsers = []; Toast.show(t('saveSuccess'),'success');
    });
  },
  openUserModal(id){
    const u = id ? DB.users.find(x=>x.id===id) : {name:'',email:'',password:'',phone:'',role:'customer'};
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3>${id?t('editUser'):t('addUser')}</h3></div>
      <div class="modal-body">
        <div class="form-group"><label>${t('fullName')}</label><input id="uName" value="${u.name}"></div>
        <div class="form-group"><label>${t('email')}</label><input id="uEmail" type="email" value="${u.email}"></div>
        <div class="form-group"><label>${t('phone')}</label><input id="uPhone" value="${u.phone||''}"></div>
        <div class="form-group"><label>${t('password')}</label><input id="uPass" value="${u.password}"></div>
        <div class="form-group"><label>${t('role')}</label>
          <select id="uRole">
            <option value="customer" ${u.role==='customer'?'selected':''}>${t('customer')}</option>
            <option value="admin" ${u.role==='admin'?'selected':''}>${t('adminRole')}</option>
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
    const phone = document.getElementById('uPhone').value.trim();
    const role = document.getElementById('uRole').value;
    if(!name || !email || !password){ Toast.show(t('fillAllFields'),'error'); return; }
    if(!id && DB.users.find(x=>x.email===email)){ Toast.show(t('emailExists'),'error'); return; }
    const existing = id ? DB.users.find(x=>x.id===id) : null;
    const data = { id, name, email, phone, password, role,
      blocked: existing?.blocked || false,
      joined: existing?.joined || Date.now(),
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` };
    try { await DB.saveUser(data); Modal.close(); Toast.show(t('saveSuccess'),'success'); }
    catch(e){ Toast.show('Failed: '+e.message,'error'); }
  },
  async toggleBlock(id){
    const u = DB.users.find(x=>x.id===id); if(!u || u.role==='admin') return;
    try { await DB.updateUser(id, { blocked: !u.blocked }); Toast.show(t('saveSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); }
  },
  deleteUser(id){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteUser(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); } }); },
  categories(){
    const keys = Object.entries(DB.catRaw);
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-tags"></i> ${t('categories')}</h3></div>
        <div class="admin-toolbar">
          <input id="newCat" placeholder="${t('categoryName')}">
          <button class="btn btn-primary" onclick="Admin.addCat()"><i class="fa-solid fa-plus"></i> ${t('addCategory')}</button>
        </div>
        <div class="chips-wrap">
          ${keys.length ? keys.map(([k,v])=>`<div class="chip-large">${v}<button onclick="Admin.delCat('${k}')"><i class="fa-solid fa-xmark"></i></button></div>`).join('') : `<p class="muted">${t('noData')}</p>`}
        </div>
      </div>`;
  },
  async addCat(){
    const v = document.getElementById('newCat').value.trim(); if(!v) return;
    if(DB.categories.includes(v)) return Toast.show(t('emailExists'),'warning');
    try { await DB.saveCategory(v); Toast.show(t('saveSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); }
  },
  delCat(key){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteCategory(key); Toast.show(t('deleteSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); } }); },
  coupons(){
    const list = DB.coupons;
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-ticket"></i> ${t('coupons')}</h3></div>
        <div class="admin-toolbar">
          <input id="cCode" placeholder="${t('couponCode')}">
          <select id="cType"><option value="percent">${t('percentOff')}</option><option value="flat">${t('flatOff')}</option></select>
          <input id="cVal" type="number" placeholder="${t('price')}">
          <button class="btn btn-primary" onclick="Admin.addCoupon()"><i class="fa-solid fa-plus"></i> ${t('addCoupon')}</button>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>${t('couponCode')}</th><th>${t('role')}</th><th>${t('price')}</th><th></th></tr></thead>
            <tbody>${list.length ? list.map(c=>`<tr>
              <td><b>${c.code}</b></td>
              <td><span class="chip">${c.type}</span></td>
              <td>${c.type==='percent'?c.value+'%':money(c.value)}</td>
              <td><button class="icon-btn-sm danger" onclick="Admin.delCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`).join('') : `<tr><td colspan="4" class="muted">${t('noData')}</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },
  async addCoupon(){
    const code = document.getElementById('cCode').value.trim().toUpperCase();
    const type = document.getElementById('cType').value;
    const value = +document.getElementById('cVal').value;
    if(!code || !value) return Toast.show(t('fillAllFields'),'error');
    if(DB.coupons.find(c=>c.code===code)) return Toast.show(t('emailExists'),'warning');
    try { await DB.saveCoupon({ code, type, value }); Toast.show(t('saveSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); }
  },
  async delCoupon(id){ try { await DB.deleteCoupon(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){ Toast.show('Failed','error'); } },
  settings(){
    const s = DB.settings;
    return `
      <div class="admin-card">
        <div class="settings-section">
          <h4><i class="fa-solid fa-globe"></i> ${LANG==='bn'?'সাইট তথ্য':'Site Info'}</h4>
          <div class="form-group"><label>${t('siteName')}</label><input id="stName" value="${s.siteName||''}"></div>
          <div class="form-group"><label>${t('supportPhone')}</label><input id="stPhone" value="${s.supportPhone||''}"></div>
          <div class="form-group"><label>${t('email')}</label><input id="stEmail" value="${s.supportEmail||''}"></div>
        </div>
        <div class="settings-section">
          <h4><i class="fa-solid fa-truck"></i> ${LANG==='bn'?'ডেলিভারি চার্জ':'Delivery'}</h4>
          <div class="form-row">
            <div class="form-group"><label>${t('insideDhaka')} (৳)</label><input id="stShipIn" type="number" value="${s.shippingInsideDhaka||100}"></div>
            <div class="form-group"><label>${t('outsideDhaka')} (৳)</label><input id="stShipOut" type="number" value="${s.shippingOutsideDhaka||120}"></div>
          </div>
        </div>
        <div class="settings-section">
          <h4><i class="fa-solid fa-mobile-screen"></i> ${t('paymentNumberConfig')}</h4>
          <div class="form-group"><label>${t('bkash')} ${t('paymentNumber')}</label><input id="stBkash" value="${s.bkashNumber||''}"></div>
          <div class="form-group"><label>${t('nagad')} ${t('paymentNumber')}</label><input id="stNagad" value="${s.nagadNumber||''}"></div>
          <div class="form-group"><label>${t('rocket')} ${t('paymentNumber')}</label><input id="stRocket" value="${s.rocketNumber||''}"></div>
        </div>
        <div class="settings-section">
          <h4><i class="fa-solid fa-toggle-on"></i> ${LANG==='bn'?'পেমেন্ট চালু/বন্ধ':'Enable Payments'}</h4>
          <div style="display:grid;gap:10px">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px;background:var(--surface-2);border-radius:10px"><input type="checkbox" id="stCOD" ${s.enableCOD?'checked':''} style="width:auto"><b>${t('cod')}</b></label>
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px;background:var(--surface-2);border-radius:10px"><input type="checkbox" id="stBkashEn" ${s.enableBkash?'checked':''} style="width:auto"><b>${t('bkash')}</b></label>
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px;background:var(--surface-2);border-radius:10px"><input type="checkbox" id="stNagadEn" ${s.enableNagad?'checked':''} style="width:auto"><b>${t('nagad')}</b></label>
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px;background:var(--surface-2);border-radius:10px"><input type="checkbox" id="stRocketEn" ${s.enableRocket?'checked':''} style="width:auto"><b>${t('rocket')}</b></label>
          </div>
        </div>
        <div class="settings-save-bar">
          <span><i class="fa-solid fa-circle-info"></i> ${LANG==='bn'?'পরিবর্তন সেভ করুন':'Save'}</span>
          <button class="btn btn-primary" onclick="Admin.saveSettings()"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-database"></i> ${t('exportData')}</h3></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-danger" onclick="Admin.resetAll()"><i class="fa-solid fa-trash"></i> ${t('resetAll')}</button>
          <button class="btn btn-outline" onclick="Admin.exportData()"><i class="fa-solid fa-download"></i> ${t('exportData')}</button>
        </div>
      </div>`;
  },
  async saveSettings(){
    const settings = {
      siteName: document.getElementById('stName').value.trim(),
      supportPhone: document.getElementById('stPhone').value.trim(),
      supportEmail: document.getElementById('stEmail').value.trim(),
      shippingInsideDhaka: +document.getElementById('stShipIn').value || 100,
      shippingOutsideDhaka: +document.getElementById('stShipOut').value || 120,
      bkashNumber: document.getElementById('stBkash').value.trim(),
      nagadNumber: document.getElementById('stNagad').value.trim(),
      rocketNumber: document.getElementById('stRocket').value.trim(),
      enableCOD: document.getElementById('stCOD').checked,
      enableBkash: document.getElementById('stBkashEn').checked,
      enableNagad: document.getElementById('stNagadEn').checked,
      enableRocket: document.getElementById('stRocketEn').checked
    };
    try { await DB.saveSettings(settings); Toast.show(t('settingsSaved'),'success'); }
    catch(e){ Toast.show('Failed: '+e.message,'error'); }
  },
  resetAll(){
    Modal.confirm(t('resetConfirm'), async ()=>{
      try { await db.ref().set({ settings: DEFAULT_SETTINGS }); localStorage.clear(); location.reload(); }
      catch(e){ Toast.show('Failed','error'); }
    });
  },
  exportData(){
    const data = { products:DB.products, users:DB.users, orders:DB.orders, categories:DB.categories, coupons:DB.coupons, reviews:DB.reviews, settings:DB.settings };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ecoshop-backup-${Date.now()}.json`; a.click();
    Toast.show(t('saveSuccess'),'success');
  },
  refreshContent(){
    const el = document.getElementById('adminContent');
    if(el) el.innerHTML = this.render(App._adminTab||'dashboard');
  }
};

/* ═══════════════════════════════════════════════════════════
   AuthUI (with OTP)
   ═══════════════════════════════════════════════════════════ */
const AuthUI = {
  tab(which){
    App._authTab = which;
    App._otpStep = null;
    OTP.reset();
    document.getElementById('tabLogin').classList.toggle('active', which==='login');
    document.getElementById('tabReg').classList.toggle('active', which==='reg');
    document.getElementById('authForm').innerHTML = which==='login'
      ? this.loginForm(App._authRedirect||'home')
      : this.regForm(App._authRedirect||'home');
  },

  loginForm(redirect='home'){
    return `<form onsubmit="AuthUI.doLogin(event, '${redirect}')">
      <div class="form-group">
        <label>${t('email')}</label>
        <div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="authEmail" required placeholder="you@example.com" autocomplete="email"></div>
      </div>
      <div class="form-group">
        <label>${t('password')}</label>
        <div class="input-wrap">
          <i class="fa-solid fa-lock input-icon"></i>
          <input type="password" id="authPass" required placeholder="••••••" autocomplete="current-password">
          <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('authPass', this)"><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmit">${t('login')} <i class="fa-solid fa-arrow-right"></i></button>
    </form>`;
  },

  regForm(redirect='home'){
    if(App._otpStep === 'verify' && OTP.currentEmail){
      return this.otpVerifyForm(redirect);
    }
    return this.regInfoForm(redirect);
  },

  regInfoForm(redirect='home'){
    return `<form onsubmit="AuthUI.sendOTP(event, '${redirect}')" novalidate>
      <div class="reg-steps">
        <div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">${LANG==='bn'?'তথ্য':'Info'}</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">${LANG==='bn'?'OTP':'Verify'}</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${LANG==='bn'?'সম্পন্ন':'Done'}</span></div>
      </div>

      <div class="form-group">
        <label>${t('fullName')} <span class="req">*</span></label>
        <div class="input-wrap"><i class="fa-solid fa-user input-icon"></i><input id="regName" required autocomplete="name" placeholder="Rahim Uddin"></div>
      </div>
      <div class="form-group">
        <label>${t('email')} <span class="req">*</span></label>
        <div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i>
          <input type="email" id="regEmail" required autocomplete="email" placeholder="you@example.com" oninput="AuthUI.checkEmailAvailability(this.value)">
        </div>
        <div class="form-hint" id="emailCheckHint"></div>
      </div>
      <div class="form-group">
        <label>${t('phone')}</label>
        <div class="input-wrap"><i class="fa-solid fa-phone input-icon"></i><input id="regPhone" autocomplete="tel" placeholder="017XXXXXXXX" inputmode="tel"></div>
      </div>
      <div class="form-group">
        <label>${t('password')} <span class="req">*</span></label>
        <div class="input-wrap">
          <i class="fa-solid fa-lock input-icon"></i>
          <input type="password" id="regPass" required minlength="6" autocomplete="new-password" placeholder="••••••" oninput="AuthUI.checkPwd(this.value)">
          <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('regPass', this)"><i class="fa-solid fa-eye"></i></button>
        </div>
        <div class="pwd-strength">
          <div class="pwd-bars">
            <div class="pwd-bar" id="pwdBar1"></div><div class="pwd-bar" id="pwdBar2"></div>
            <div class="pwd-bar" id="pwdBar3"></div><div class="pwd-bar" id="pwdBar4"></div>
          </div>
          <div class="pwd-text" id="pwdText">${LANG==='bn'?'পাসওয়ার্ড শক্তি':'Strength'}</div>
        </div>
      </div>
      <div class="form-group">
        <label>${t('confirmPassword')} <span class="req">*</span></label>
        <div class="input-wrap">
          <i class="fa-solid fa-lock input-icon"></i>
          <input type="password" id="regPass2" required autocomplete="new-password" placeholder="••••••">
          <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('regPass2', this)"><i class="fa-solid fa-eye"></i></button>
        </div>
        <div class="form-error" id="passError">${t('passwordMismatch')}</div>
      </div>
      <div class="form-group">
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:12.5px;line-height:1.5;font-weight:500;color:var(--text)">
          <input type="checkbox" id="regTerms" required style="width:auto;margin-top:3px">
          <span>${t('agreeTerms')}</span>
        </label>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="regSendBtn">
        <i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}
      </button>
      <div class="otp-info-note">
        <i class="fa-solid fa-shield-halved"></i>
        <span>${LANG==='bn'?'নিরাপত্তার জন্য ইমেইলে ৬-ডিজিটের কোড পাঠানো হবে':'A 6-digit code will be sent to your email'}</span>
      </div>
    </form>`;
  },

  otpVerifyForm(redirect='home'){
    const masked = OTP.maskEmail(OTP.currentEmail);
    return `<form onsubmit="AuthUI.verifyOTP(event, '${redirect}')" novalidate>
      <div class="reg-steps">
        <div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${LANG==='bn'?'তথ্য':'Info'}</span></div>
        <div class="reg-step-line done"></div>
        <div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">${LANG==='bn'?'OTP':'Verify'}</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${LANG==='bn'?'সম্পন্ন':'Done'}</span></div>
      </div>

      <div class="otp-header">
        <div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div>
        <h3>${t('verifyEmail')}</h3>
        <p>${t('weSentCode')}<br><b>${masked}</b></p>
      </div>

      <div class="otp-inputs" id="otpInputs">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="0" autocomplete="one-time-code" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="1" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="2" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="3" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="4" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
        <input type="text" inputmode="numeric" maxlength="1" data-idx="5" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">
      </div>

      <div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div>

      <button type="submit" class="btn btn-primary btn-block btn-lg" id="otpVerifyBtn">
        <i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}
      </button>

      <div class="otp-actions">
        <button type="button" class="btn-link" id="otpResendBtn" onclick="AuthUI.resendOTP()" disabled>
          <i class="fa-solid fa-rotate-right"></i> <span id="otpResendText">${t('resendOTP')}</span>
        </button>
        <button type="button" class="btn-link" onclick="AuthUI.backToInfo()">
          <i class="fa-solid fa-arrow-left"></i> ${t('changeInfo')}
        </button>
      </div>
    </form>`;
  },

  checkEmailAvailability(email){
    const hint = document.getElementById('emailCheckHint');
    if(!hint) return;
    if(!email || !email.includes('@')){ hint.textContent=''; return; }
    if(Auth.isEmailTaken(email)){
      hint.textContent = t('emailTaken');
      hint.style.color = 'var(--danger)';
    } else {
      hint.textContent = t('emailAvailable');
      hint.style.color = 'var(--success)';
    }
  },

  otpInput(el){
    let v = el.value.replace(/\D/g, '');
    el.value = v.slice(0, 1);
    el.classList.toggle('filled', !!el.value);
    if(v){
      const idx = +el.dataset.idx;
      const next = document.querySelector(`.otp-inputs input[data-idx="${idx+1}"]`);
      if(next) next.focus();
      else el.blur();
    }
  },

  otpKey(e, el){
    const idx = +el.dataset.idx;
    if(e.key === 'Backspace' && !el.value){
      const prev = document.querySelector(`.otp-inputs input[data-idx="${idx-1}"]`);
      if(prev){ prev.focus(); prev.value=''; prev.classList.remove('filled'); }
    }
    if(e.key === 'ArrowLeft'){ document.querySelector(`.otp-inputs input[data-idx="${idx-1}"]`)?.focus(); }
    if(e.key === 'ArrowRight'){ document.querySelector(`.otp-inputs input[data-idx="${idx+1}"]`)?.focus(); }
  },

  otpPaste(e){
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
    if(!text) return;
    const inputs = document.querySelectorAll('.otp-inputs input');
    text.split('').forEach((ch, i)=>{ if(inputs[i]){ inputs[i].value = ch; inputs[i].classList.add('filled'); } });
    const nextEmpty = Array.from(inputs).find(inp => !inp.value);
    (nextEmpty || inputs[inputs.length-1]).focus();
  },

  getOTPValue(){
    const inputs = document.querySelectorAll('.otp-inputs input');
    return Array.from(inputs).map(i=>i.value).join('');
  },

  clearOTPInputs(){
    document.querySelectorAll('.otp-inputs input').forEach(i=>{ i.value=''; i.classList.remove('filled','error'); });
    document.querySelector('.otp-inputs input[data-idx="0"]')?.focus();
  },

  async sendOTP(e, redirect){
    if(e) e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    const terms = document.getElementById('regTerms').checked;
    const err = document.getElementById('passError');

    if(!name || !email || !pass){ Toast.show(t('fillAllFields'),'error'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ Toast.show(t('invalidEmail'),'error'); return; }
    if(pass !== pass2){ err.classList.add('show'); Toast.show(t('passwordMismatch'),'error'); return; }
    err.classList.remove('show');
    if(pass.length < 6){ Toast.show(t('weakPassword'),'error'); return; }
    if(!terms){ Toast.show(t('agreeToTerms'),'warning'); return; }
    if(Auth.isEmailTaken(email)){ Toast.show(t('emailExists'),'error'); return; }

    App._pendingReg = { name, email, phone, password: pass };

    const btn = document.getElementById('regSendBtn');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpSending')}`;

    const result = await OTP.send(email, name);

    if(!result.ok){
      Toast.show(t('otpFailed') + ': ' + result.msg, 'error', 6000);
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}`;
      return;
    }

    Toast.show(t('otpSent'),'success', 4000);
    App._otpStep = 'verify';
    App._authRedirect = redirect;
    App.render();

    setTimeout(()=>{
      document.querySelector('.otp-inputs input[data-idx="0"]')?.focus();
      this.startResendCooldown(60);
    }, 300);
  },

  startResendCooldown(seconds){
    const btn = document.getElementById('otpResendBtn');
    const txt = document.getElementById('otpResendText');
    if(!btn || !txt) return;
    btn.disabled = true;
    txt.textContent = `${t('resendOTP')} (${seconds}s)`;
    OTP.startCooldown(seconds, (remaining)=>{
      if(remaining <= 0){
        btn.disabled = false;
        txt.textContent = t('resendOTP');
      } else {
        txt.textContent = `${t('resendOTP')} (${remaining}s)`;
      }
    });
  },

  async verifyOTP(e, redirect){
    if(e) e.preventDefault();
    const code = this.getOTPValue();
    if(code.length !== 6){ Toast.show(t('enterFullCode'),'warning'); return; }

    const btn = document.getElementById('otpVerifyBtn');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpVerifying')}`;

    const result = await OTP.verify(code);
    if(!result.ok){
      Toast.show(result.msg, 'error');
      document.querySelectorAll('.otp-inputs input').forEach(i=>i.classList.add('error'));
      setTimeout(()=>document.querySelectorAll('.otp-inputs input').forEach(i=>i.classList.remove('error')), 500);
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`;
      return;
    }

    const pending = App._pendingReg;
    if(!pending){
      Toast.show('Session lost, try again','error');
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`;
      return;
    }

    const reg = await Auth.register(pending);
    if(!reg.ok){
      Toast.show(reg.msg, 'error');
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`;
      return;
    }

    OTP.reset();
    App._pendingReg = null;
    App._otpStep = null;
    App._authRedirect = null;

    Toast.show(t('registrationSuccess') + ' ' + reg.user.name, 'success', 4000);
    PushNotif.localNotif(LANG==='bn'?'রেজিস্ট্রেশন সফল':'Registration successful', LANG==='bn'?'স্বাগতম '+reg.user.name:'Welcome '+reg.user.name);

    setTimeout(()=>{ App.go(redirect && redirect !== 'home' ? redirect : 'home'); }, 600);
  },

  async resendOTP(){
    const pending = App._pendingReg;
    if(!pending) return;
    const btn = document.getElementById('otpResendBtn');
    btn.disabled = true;
    const txt = document.getElementById('otpResendText');
    txt.textContent = LANG==='bn'?'পাঠানো হচ্ছে...':'Sending...';
    OTP.attempts = 0;
    const result = await OTP.send(pending.email, pending.name);
    if(!result.ok){
      Toast.show(t('otpFailed') + ': ' + result.msg,'error');
      btn.disabled = false;
      txt.textContent = t('resendOTP');
      return;
    }
    Toast.show(t('otpSent'),'success');
    this.clearOTPInputs();
    this.startResendCooldown(60);
  },

  backToInfo(){
    App._otpStep = null;
    OTP.reset();
    App.render();
    setTimeout(()=>{
      const pending = App._pendingReg;
      if(pending){
        const nEl = document.getElementById('regName'); if(nEl) nEl.value = pending.name || '';
        const eEl = document.getElementById('regEmail'); if(eEl) eEl.value = pending.email || '';
        const pEl = document.getElementById('regPhone'); if(pEl) pEl.value = pending.phone || '';
      }
    }, 100);
  },

  togglePass(id, btn){
    const input = document.getElementById(id); if(!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${show?'-slash':''}"></i>`;
  },

  checkPwd(val){
    let score = 0;
    if(val.length >= 6) score++;
    if(val.length >= 10) score++;
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if(/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
    const bars = [1,2,3,4].map(i=>document.getElementById('pwdBar'+i));
    const cls = score<=1 ? 'weak' : score<=3 ? 'medium' : 'strong';
    bars.forEach((b,i)=>{ if(b) b.className = 'pwd-bar' + (i < score ? ' ' + cls : ''); });
    const txt = document.getElementById('pwdText');
    if(txt){
      const labels = { weak: LANG==='bn'?'দুর্বল':'Weak', medium: LANG==='bn'?'মাঝারি':'Medium', strong: LANG==='bn'?'শক্তিশালী':'Strong' };
      txt.textContent = score ? labels[cls] : (LANG==='bn'?'পাসওয়ার্ড শক্তি':'Strength');
    }
  },

  async doLogin(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('loginSubmit');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    const r = await Auth.login(document.getElementById('authEmail').value.trim().toLowerCase(), document.getElementById('authPass').value);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `${t('login')} <i class="fa-solid fa-arrow-right"></i>`; return; }
    Toast.show(t('loginSuccess') + ', ' + r.user.name,'success');
    const target = r.user.role==='admin' ? 'admin' : (redirect && redirect!=='home' ? redirect : 'home');
    App._authRedirect = null;
    App.go(target);
  }
};

/* ═══════════════════════════════════════════════════════════
   Profile
   ═══════════════════════════════════════════════════════════ */
const Profile = {
  async save(){
    const u = Auth.user(); if(!u) return;
    const name = document.getElementById('pfName').value.trim();
    const phone = document.getElementById('pfPhone').value.trim();
    const pass = document.getElementById('pfPass').value;
    if(!name) return Toast.show(t('fillAllFields'),'error');
    const patch = { name, phone, avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` };
    if(pass && pass.length >= 6) patch.password = pass;
    try {
      await DB.updateUser(u.id, patch);
      Session.set({ ...u, ...patch });
      Toast.show(t('profileUpdated'),'success');
      App.render();
    } catch(e){ Toast.show('Failed','error'); }
  }
};

/* ═══════════════════════════════════════════════════════════
   Theme / Lang / Init
   ═══════════════════════════════════════════════════════════ */
function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('eco_theme', mode);
  document.querySelectorAll('[data-set-theme]').forEach(b=>b.classList.toggle('active', b.dataset.setTheme===mode));
  const tb = document.getElementById('themeBtn');
  if(tb) tb.innerHTML = `<i class="fa-solid fa-${mode==='dark'?'sun':'moon'}"></i>`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = mode==='dark' ? '#12141f' : '#6366f1';
}
function applyLang(lang){
  LANG = lang;
  localStorage.setItem('eco_lang', lang);
  document.documentElement.lang = lang;
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
function initOfflineDetect(){
  const bar = document.getElementById('offlineBar');
  const txt = document.getElementById('offlineText');
  function update(){
    if(navigator.onLine) bar?.classList.remove('show');
    else { if(txt) txt.textContent = t('offlineMode'); bar?.classList.add('show'); }
  }
  window.addEventListener('online', ()=>{ update(); Toast.show(LANG==='bn'?'✅ অনলাইনে':'✅ Online','success'); });
  window.addEventListener('offline', ()=>{ update(); Toast.show(LANG==='bn'?'⚠️ অফলাইন':'⚠️ Offline','warning'); });
  update();
}

document.addEventListener('DOMContentLoaded', ()=>{
  console.log('🚀 App v7.0 starting...');

  const savedTheme = localStorage.getItem('eco_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  LANG = localStorage.getItem('eco_lang') || 'bn';
  document.documentElement.lang = LANG;
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = LANG.toUpperCase();

  /* Init EmailJS */
  OTP.init();

  /* Splash */
  let p = 0;
  const statuses = ['Firebase-এ সংযুক্ত হচ্ছে...','ডেটা সিঙ্ক হচ্ছে...','প্রায় শেষ...','স্বাগতম!'];
  const splashTimer = setInterval(()=>{
    p += 25;
    const bar = document.getElementById('splashBar');
    const st = document.getElementById('splashStatus');
    if(bar) bar.style.width = p+'%';
    if(st) st.textContent = statuses[Math.min(3, Math.floor(p/25)-1)] || statuses[0];
    if(p>=100) clearInterval(splashTimer);
  }, 350);
  setTimeout(()=>App.hideSplash(), 5000);

  /* Firebase */
  if(fbReady){
    setFbStatus(false, 'Firebase: connecting...');
    try { db.ref('.info/connected').on('value', snap=>{ setFbStatus(snap.val()===true, snap.val()===true ? 'Firebase: ✅ connected' : 'Firebase: ⚠️ offline'); }); } catch(e){}
    DB.init();
  } else {
    setFbStatus(false, 'Firebase: ❌ failed');
    Toast.show('Firebase init failed: '+fbError, 'error', 8000);
    App.hideSplash();
  }

  PWA.registerSW();
  PWA.initInstallPrompt();
  PushNotif.init();
  initOfflineDetect();

  window.addEventListener('scroll', ()=>{
    const nb = document.getElementById('navbar'); if(nb) nb.classList.toggle('scrolled', window.scrollY>10);
    const btt = document.getElementById('backToTop'); if(btt) btt.classList.toggle('show', window.scrollY>400);
  }, { passive: true });
  const btt = document.getElementById('backToTop'); if(btt) btt.onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});

  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow = document.getElementById('cursorGlow');
    if(glow){
      let mx = 0, my = 0, cx = 0, cy = 0;
      document.addEventListener('mousemove', (e)=>{ mx = e.clientX; my = e.clientY; }, { passive:true });
      (function animate(){
        cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
        glow.style.left = cx+'px'; glow.style.top = cy+'px';
        requestAnimationFrame(animate);
      })();
    }
  }

  document.querySelectorAll('[data-nav]').forEach(a=>{
    a.onclick = ()=>{
      const r = a.dataset.nav;
      if(r==='cart'){ App.openCart(); return; }
      App.go(r);
    };
  });
  document.querySelectorAll('.nav-menu a').forEach(a=>{ a.onclick = ()=> App.go(a.dataset.nav); });

  const openPM = ()=>{ document.getElementById('powerMenu').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; };
  const closePM = ()=>{ document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };
  document.getElementById('menuToggle').onclick = openPM;
  document.getElementById('pmClose').onclick = closePM;

  const openCart = ()=>{ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; };
  const closeCart = ()=>{ document.getElementById('cartDrawer').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };
  document.getElementById('cartBtn').onclick = openCart;
  document.getElementById('cartClose').onclick = closeCart;
  document.getElementById('checkoutBtn').onclick = ()=>{ closeCart(); App.go('checkout'); };

  const openNotif = ()=>{ document.getElementById('notifPanel').classList.add('active'); document.getElementById('backdrop').classList.add('active'); Notifs.markAllRead(); document.body.style.overflow='hidden'; };
  const closeNotif = ()=>{ document.getElementById('notifPanel').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };
  document.getElementById('notifBtn').onclick = openNotif;
  document.getElementById('notifClose').onclick = closeNotif;

  document.getElementById('backdrop').onclick = ()=>{ closePM(); closeCart(); closeNotif(); document.querySelector('.admin-sidebar')?.classList.remove('active'); };

  document.getElementById('loginBtn').onclick = ()=>{ closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLoginBtn').onclick = ()=>{ closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLogoutBtn').onclick = ()=>{ closePM(); Auth.logout(); };

  const av = document.getElementById('userAvatarBtn');
  const dd = document.getElementById('userDropdown');
  if(av && dd){
    av.onclick = (e)=>{ e.stopPropagation(); dd.classList.toggle('active'); };
    document.addEventListener('click', ()=> dd.classList.remove('active'));
  }

  document.getElementById('themeBtn').onclick = ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  document.getElementById('langBtn').onclick = ()=> applyLang(LANG==='bn'?'en':'bn');
  document.querySelectorAll('[data-set-theme]').forEach(b=> b.onclick = ()=> applyTheme(b.dataset.setTheme));
  document.querySelectorAll('[data-set-lang]').forEach(b=> b.onclick = ()=> applyLang(b.dataset.setLang));

  const gs = document.getElementById('globalSearch');
  const searchClear = document.getElementById('searchClear');
  if(gs){
    gs.oninput = (e)=>{
      App._shopQ = e.target.value; App._shopCat='all';
      if(searchClear) searchClear.style.display = e.target.value ? 'flex' : 'none';
      if(App.route!=='shop') App.go('shop');
      else App.render();
    };
  }
  if(searchClear) searchClear.onclick = ()=>{ if(gs){ gs.value=''; App._shopQ=''; searchClear.style.display='none'; App.render(); gs.focus(); } };
  SearchSuggest.init();

  document.addEventListener('keydown', (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); document.getElementById('globalSearch')?.focus(); }
    if(e.key === 'Escape'){ Modal.close(); QuickView.close(); document.getElementById('searchSuggest')?.classList.remove('active'); }
  });

  document.addEventListener('touchmove', (e)=>{ if(e.touches.length > 1) e.preventDefault(); }, { passive: false });

  App.render();
  console.log('✅ App ready v7.0');
});
