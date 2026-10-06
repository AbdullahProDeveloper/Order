/* ═══════════════════════════════════════════════════════════════════════
   EcoShop Pro MAX v11.0 — Professional Order Management + AI Chatbot
   Full app.js
   ═══════════════════════════════════════════════════════════════════════ */

/* ───────── Firebase ───────── */
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
  whatsappNumber: '8801700000000',
  enableCOD: true, enableBkash: true, enableNagad: true, enableRocket: true,
  requireEmailOTP: true
};

/* ═══════════════════════════════════════════════════════════
   i18n
   ═══════════════════════════════════════════════════════════ */
const I18N = {
  bn: {
    home:'হোম', shop:'শপ', orders:'অর্ডার', profile:'প্রোফাইল', admin:'অ্যাডমিন',
    dashboard:'ড্যাশবোর্ড', myOrders:'আমার অর্ডার', wishlist:'উইশলিস্ট', cart:'কার্ট',
    login:'লগইন', logout:'লগআউট', register:'রেজিস্টার',
    adminPanel:'অ্যাডমিন প্যানেল', notifications:'নোটিফিকেশন', navigation:'নেভিগেশন',
    management:'ম্যানেজমেন্ট', settings:'সেটিংস', theme:'থিম', language:'ভাষা',
    light:'লাইট', dark:'ডার্ক', searchPlaceholder:'পণ্য খুঁজুন...',
    splashTagline:'প্রিমিয়াম ই-কমার্স অভিজ্ঞতা',
    footerDesc:'বাংলাদেশের সেরা প্রিমিয়াম অনলাইন শপিং প্ল্যাটফর্ম।',
    quickLinks:'দ্রুত লিংক', support:'সাপোর্ট', allRights:'সর্বস্বত্ব সংরক্ষিত',
    subtotal:'সাবটোটাল', shipping:'ডেলিভারি', discount:'ডিসকাউন্ট', total:'সর্বমোট', checkout:'চেকআউট',
    addToCart:'কার্টে যোগ করুন', outOfStock:'স্টক নেই', inStock:'স্টকে আছে',
    empty:'কোনো পণ্য নেই', allProducts:'সকল পণ্য', featured:'ফিচার্ড পণ্য', newArrivals:'নতুন পণ্য',
    price:'দাম', stock:'স্টক', category:'ক্যাটাগরি', save:'সেভ', cancel:'বাতিল', delete:'ডিলিট',
    edit:'এডিট', yes:'হ্যাঁ', no:'না', close:'বন্ধ', confirmDelete:'আপনি কি নিশ্চিত?',
    pending:'পেন্ডিং', confirmed:'কনফার্মড', processing:'প্রসেসিং', shipped:'শিপড',
    out_for_delivery:'ডেলিভারির পথে', delivered:'ডেলিভারড', cancelled:'বাতিল', rejected:'প্রত্যাখ্যাত',
    loginRequired:'অনুগ্রহ করে লগইন করুন', adminOnly:'শুধুমাত্র অ্যাডমিন',
    fullName:'পূর্ণ নাম', email:'ইমেইল', password:'পাসওয়ার্ড', confirmPassword:'পাসওয়ার্ড নিশ্চিত',
    phone:'ফোন নম্বর', address:'ঠিকানা', city:'শহর',
    agreeTerms:'আমি শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত',
    editProfile:'প্রোফাইল এডিট', newPassword:'নতুন পাসওয়ার্ড',
    orderId:'অর্ডার ID', orderDate:'তারিখ', orderStatus:'স্ট্যাটাস',
    productName:'পণ্যের নাম', productNameEn:'Product Name (English)',
    description:'বিবরণ', descriptionEn:'Description (English)', images:'ছবি',
    oldPrice:'পুরাতন দাম', discountPercent:'ডিসকাউন্ট (%)', tags:'ট্যাগ', featured_product:'ফিচার্ড পণ্য',
    reviews:'রিভিউ', writeReview:'রিভিউ লিখুন', submitReview:'রিভিউ জমা দিন', yourRating:'আপনার রেটিং',
    relatedProducts:'সম্পর্কিত পণ্য',
    minPrice:'সর্বনিম্ন', maxPrice:'সর্বোচ্চ', applyFilter:'প্রয়োগ', clearFilters:'মুছুন', defaultSort:'ডিফল্ট',
    priceLowHigh:'কম থেকে বেশি', priceHighLow:'বেশি থেকে কম', newest:'নতুন আগে', popular:'জনপ্রিয়',
    searchResults:'সার্চ ফলাফল',
    profileUpdated:'প্রোফাইল আপডেট হয়েছে', loginSuccess:'লগইন সফল', registerSuccess:'রেজিস্ট্রেশন সফল',
    logoutSuccess:'লগআউট সফল', saveSuccess:'সেভ হয়েছে', deleteSuccess:'ডিলিট হয়েছে',
    invalidCredentials:'ভুল ইমেইল বা পাসওয়ার্ড', accountBlocked:'অ্যাকাউন্ট ব্লক করা হয়েছে',
    emailExists:'এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে। লগইন করুন।',
    passwordMismatch:'পাসওয়ার্ড মিলছে না', weakPassword:'কমপক্ষে ৬ অক্ষর',
    fillAllFields:'সব তথ্য পূরণ করুন', orderPlaced:'অর্ডার সফল',
    invalidCoupon:'কুপন সঠিক নয়', emptyCart:'কার্ট খালি', items:'আইটেম',
    processing:'প্রসেসিং...', loadingData:'ডেটা লোড হচ্ছে...',
    totalProducts:'মোট পণ্য', totalOrders:'মোট অর্ডার', totalUsers:'মোট ইউজার', totalSales:'মোট বিক্রয়',
    pendingOrders:'পেন্ডিং অর্ডার', lowStock:'কম স্টক', activeUsers:'সক্রিয় ইউজার',
    recentOrders:'সাম্প্রতিক অর্ডার', products:'পণ্য', users:'ইউজার', ordersTab:'অর্ডার',
    coupons:'কুপন', categories:'ক্যাটাগরি',
    addProduct:'নতুন পণ্য', editProduct:'পণ্য এডিট', productSearch:'পণ্য সার্চ...',
    addUser:'নতুন ইউজার', editUser:'ইউজার এডিট', userSearch:'নাম / ইমেইল...',
    orderSearch:'অর্ডার সার্চ...', role:'রোল', customer:'কাস্টমার', adminRole:'অ্যাডমিন',
    blocked:'ব্লকড', active:'সক্রিয়', block:'ব্লক', unblock:'আনব্লক',
    selected:'নির্বাচিত', deleteConfirm:'ডিলিট?', categoryName:'ক্যাটাগরি নাম', addCategory:'যোগ',
    couponCode:'কুপন কোড', percentOff:'শতাংশ (%)', flatOff:'ফ্ল্যাট (৳)', addCoupon:'যোগ',
    siteName:'সাইটের নাম', supportPhone:'সাপোর্ট ফোন',
    exportData:'এক্সপোর্ট', resetAll:'সব রিসেট', resetConfirm:'সব ডেটা মুছে যাবে!',
    noData:'ডেটা নেই', quickView:'দ্রুত দেখুন', printInvoice:'প্রিন্ট',
    installApp:'অ্যাপ ইনস্টল করুন', installHint:'হোম স্ক্রিনে যোগ করুন', install:'ইনস্টল',
    offlineMode:'অফলাইন', pushNotif:'পুশ', enable:'চালু', pushEnabled:'পুশ চালু',
    paymentMethod:'পেমেন্ট', selectPayment:'পেমেন্ট নির্বাচন',
    cod:'ক্যাশ অন ডেলিভারি', codDesc:'হাতে পেয়ে পেমেন্ট',
    bkash:'বিকাশ', nagad:'নগদ', rocket:'রকেট', mobilePayment:'মোবাইল পেমেন্ট',
    paymentNumber:'পেমেন্ট নাম্বার', copy:'কপি', copied:'কপি হয়েছে',
    sendMoneySteps:'সেন্ড মানি করুন', useDialCode:'ডায়াল কোড',
    txnId:'ট্রানজেকশন আইডি', txnIdPlaceholder:'যেমন: 8AB1C2D3E4',
    screenshot:'স্ক্রিনশট', screenshotOptional:'(ঐচ্ছিক)', uploadScreenshot:'আপলোড',
    confirmOrder:'অর্ডার কনফার্ম',
    orderSuccessCOD:'অর্ডার সফল!',
    orderSuccessPaid:'অর্ডার সফল! পেমেন্ট ভেরিফিকেশনে',
    deliveryZone:'ডেলিভারি এলাকা', insideDhaka:'ঢাকার ভিতরে', outsideDhaka:'ঢাকার বাইরে',
    deliveryCharge:'ডেলিভারি চার্জ', deliveryChargeEdit:'ডেলিভারি চার্জ',
    adminComment:'কমেন্ট', adminCommentOptional:'(ঐচ্ছিক)', commentPlaceholder:'কমেন্ট লিখুন...',
    paymentInfo:'পেমেন্ট তথ্য', paymentNumberConfig:'পেমেন্ট নাম্বার', settingsSaved:'সেভ হয়েছে',
    numberCopied:'নাম্বার কপি', dialCodeCopied:'ডায়াল কোড কপি',
    invalidTxnId:'সঠিক Txn ID দিন',
    sendOTP:'OTP পাঠান', verifyOTP:'যাচাই', resendOTP:'আবার পাঠান',
    verifyEmail:'ইমেইল যাচাই', weSentCode:'৬-ডিজিটের কোড পাঠিয়েছি',
    otpValidTime:'১০ মিনিট বৈধ', changeInfo:'তথ্য পরিবর্তন',
    otpSent:'✅ OTP পাঠানো হয়েছে', otpSending:'পাঠানো হচ্ছে...',
    otpVerifying:'যাচাই...', emailAvailable:'✓ ব্যবহারযোগ্য',
    emailTaken:'❌ আগেই রেজিস্ট্রেশন করা হয়েছে',
    invalidEmail:'সঠিক ইমেইল দিন', agreeToTerms:'শর্তাবলীতে সম্মতি দিন',
    enterFullCode:'৬-ডিজিটের কোড দিন', registrationSuccess:'🎉 রেজিস্ট্রেশন সফল!',
    otpFailed:'ইমেইল পাঠানো যায়নি',
    dataLoadingWait:'ডেটা লোড হচ্ছে...',
    forgotPassword:'পাসওয়ার্ড ভুলে গেছেন?', resetPassword:'পাসওয়ার্ড রিসেট',
    resetPasswordDesc:'রেজিস্টার্ড ইমেইল দিন',
    sendCode:'কোড পাঠান', back:'পিছনে',
    newPassword2:'নতুন পাসওয়ার্ড', updatePassword:'আপডেট',
    passwordUpdated:'✅ পাসওয়ার্ড আপডেট', passwordUpdatedDesc:'নতুন পাসওয়ার্ড দিয়ে লগইন করুন',
    loginNow:'লগইন করুন', noAccountWithEmail:'এই ইমেইলে অ্যাকাউন্ট নেই',
    verifyCodeFirst:'আগে কোড যাচাই করুন', updateFailed:'আপডেট ব্যর্থ',
    codeVerified:'✅ কোড যাচাই সফল',
    stepEmail:'ইমেইল', stepOtp:'OTP', stepNew:'নতুন',
    compare:'তুলনা', clearCompare:'সব মুছুন', features:'বৈশিষ্ট্য',
    wallet:'ওয়ালেট', walletBalance:'ওয়ালেট ব্যালেন্স', addMoney:'টাকা যোগ', balance:'ব্যালেন্স',
    transactions:'লেনদেন', noTransactions:'লেনদেন নেই', amount:'পরিমাণ',
    referral:'রেফারেল', referralCode:'রেফারেল কোড', applyCode:'কোড প্রয়োগ',
    inviteFriends:'🎁 বন্ধুদের ইনভাইট করুন',
    loyalty:'লয়্যালটি পয়েন্ট', trackOrder:'অর্ডার ট্র্যাক', track:'ট্র্যাকিং',
    salesTrend:'বিক্রয় ট্রেন্ড', totalSalesLabel:'মোট বিক্রয়', ordersLabel:'অর্ডার', avgPerDay:'দৈনিক গড়',
    whatsappOrder:'WhatsApp-এ অর্ডার কনফার্ম', whatsappSend:'WhatsApp-এ পাঠান',
    whatsappDesc:'কাস্টমারকে WhatsApp-এ অর্ডার ডিটেইল পাঠান',
    downloadPDF:'PDF ডাউনলোড', printInvoicePDF:'PDF ইনভয়েস', invoice:'ইনভয়েস',
    chatbot:'AI সহকারী', botOnline:'অনলাইন', botPlaceholder:'মেসেজ লিখুন...',
    botTyping:'টাইপ করছে...', botGreeting:'আসসালামু আলাইকুম! আমি EcoBot। কীভাবে সাহায্য করতে পারি?',
    botSearchingProducts:'পণ্য খুঁজছি...',
    botNoProducts:'দুঃখিত, কোনো পণ্য পাওয়া যায়নি।',
    botFoundProducts:'এই পণ্যগুলো পেয়েছি:',
    botOrderTracking:'অর্ডার আইডি লিখুন (ORD-...)',
    botHelpMessage:'আমি সাহায্য করতে পারি: পণ্য খোঁজা, অর্ডার ট্র্যাক, দাম জিজ্ঞাসা, যোগাযোগ',
    botContact:'যোগাযোগ: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'অর্ডার পাওয়া যায়নি',
    botOrderStatus:'আপনার অর্ডার স্ট্যাটাস:',
    botThanks:'ধন্যবাদ! আর কোনো সাহায্য লাগলে বলুন।',
    botPrice:'দাম: ',
    /* v11 order management */
    orderDetails:'অর্ডার বিস্তারিত', changeStatus:'স্ট্যাটাস পরিবর্তন',
    courier:'কুরিয়ার', trackingNumber:'ট্র্যাকিং নাম্বার', eta:'সম্ভাব্য ডেলিভারি',
    internalNotes:'ইন্টারনাল নোট (শুধু অ্যাডমিন)', writeNote:'নোট লিখুন...',
    addNote:'নোট যোগ', orderHistory:'অর্ডার হিস্ট্রি', orderItems:'পণ্যসমূহ',
    customerInfo:'কাস্টমার তথ্য', paymentDetails:'পেমেন্ট তথ্য',
    amounts:'অ্যামাউন্ট', recalculate:'রিক্যালকুলেট',
    bulkSelected:'নির্বাচিত', bulkConfirm:'কনফার্ম', bulkCancel:'বাতিল', bulkPrint:'বাল্ক প্রিন্ট',
    filterStatus:'স্ট্যাটাস', filterPayment:'পেমেন্ট', filterFrom:'শুরুর তারিখ',
    filterTo:'শেষ তারিখ', filterSearch:'সার্চ', filterReset:'রিসেট',
    cancelOrder:'অর্ডার বাতিল', cancelReason:'বাতিলের কারণ',
    writeReason:'কারণ লিখুন...', confirmCancelAction:'বাতিল করুন',
    reorder:'আবার অর্ডার', activeOrders:'চলমান', allOrders:'সব অর্ডার',
    orderReceived:'অর্ডার গ্রহণ করা হয়েছে, অ্যাডমিন কনফার্মেশনের অপেক্ষায়',
    confirmedByAdmin:'অ্যাডমিন অর্ডার কনফার্ম করেছেন',
    processingStarted:'প্যাকিং শুরু হয়েছে',
    shippedByCourier:'কুরিয়ারে পাঠানো হয়েছে',
    outForDelivery:'ডেলিভারির পথে',
    deliveredSuccess:'সফলভাবে ডেলিভার করা হয়েছে',
    cancelledByAdmin:'অ্যাডমিন অর্ডার বাতিল করেছেন',
    rejectedByAdmin:'অ্যাডমিন অর্ডার প্রত্যাখ্যান করেছেন',
    noReasonGiven:'কারণ উল্লেখ করা হয়নি',
    saveChanges:'পরিবর্তন সেভ করুন', updatedByAdmin:'অ্যাডমিন আপডেট করেছেন',
    quickConfirmTitle:'অর্ডার কনফার্ম করবেন?'
  },
  en: {
    home:'Home', shop:'Shop', orders:'Orders', profile:'Profile', admin:'Admin',
    dashboard:'Dashboard', myOrders:'My Orders', wishlist:'Wishlist', cart:'Cart',
    login:'Login', logout:'Logout', register:'Register',
    adminPanel:'Admin Panel', notifications:'Notifications', navigation:'Navigation',
    management:'Management', settings:'Settings', theme:'Theme', language:'Language',
    light:'Light', dark:'Dark', searchPlaceholder:'Search products...',
    splashTagline:'Premium e-commerce experience',
    footerDesc:"Bangladesh's best premium online shopping platform.",
    quickLinks:'Quick Links', support:'Support', allRights:'All Rights Reserved',
    subtotal:'Subtotal', shipping:'Shipping', discount:'Discount', total:'Total', checkout:'Checkout',
    addToCart:'Add to Cart', outOfStock:'Out of Stock', inStock:'In Stock',
    empty:'No products found', allProducts:'All Products', featured:'Featured Products', newArrivals:'New Arrivals',
    price:'Price', stock:'Stock', category:'Category', save:'Save', cancel:'Cancel', delete:'Delete',
    edit:'Edit', yes:'Yes', no:'No', close:'Close', confirmDelete:'Are you sure?',
    pending:'Pending', confirmed:'Confirmed', processing:'Processing', shipped:'Shipped',
    out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled', rejected:'Rejected',
    loginRequired:'Please login first', adminOnly:'Admin only',
    fullName:'Full Name', email:'Email', password:'Password', confirmPassword:'Confirm Password',
    phone:'Phone', address:'Address', city:'City',
    agreeTerms:'I agree to the Terms & Privacy Policy',
    editProfile:'Edit Profile', newPassword:'New Password',
    orderId:'Order ID', orderDate:'Date', orderStatus:'Status',
    productName:'Product Name', productNameEn:'Product Name (English)',
    description:'Description', descriptionEn:'Description (English)', images:'Images',
    oldPrice:'Old Price', discountPercent:'Discount (%)', tags:'Tags', featured_product:'Featured Product',
    reviews:'Reviews', writeReview:'Write Review', submitReview:'Submit Review', yourRating:'Your Rating',
    relatedProducts:'Related Products',
    minPrice:'Min', maxPrice:'Max', applyFilter:'Apply', clearFilters:'Clear', defaultSort:'Default',
    priceLowHigh:'Low to High', priceHighLow:'High to Low', newest:'Newest', popular:'Popular',
    searchResults:'Search Results',
    profileUpdated:'Profile updated', loginSuccess:'Login successful', registerSuccess:'Registration successful',
    logoutSuccess:'Logged out', saveSuccess:'Saved', deleteSuccess:'Deleted',
    invalidCredentials:'Invalid credentials', accountBlocked:'Account blocked',
    emailExists:'This email is already registered. Please login.',
    passwordMismatch:'Passwords do not match', weakPassword:'Min 6 characters',
    fillAllFields:'Please fill all fields', orderPlaced:'Order placed',
    invalidCoupon:'Invalid coupon', emptyCart:'Cart empty', items:'items',
    processing:'Processing...', loadingData:'Loading...',
    totalProducts:'Total Products', totalOrders:'Total Orders', totalUsers:'Total Users', totalSales:'Total Sales',
    pendingOrders:'Pending Orders', lowStock:'Low Stock', activeUsers:'Active Users',
    recentOrders:'Recent Orders', products:'Products', users:'Users', ordersTab:'Orders',
    coupons:'Coupons', categories:'Categories',
    addProduct:'Add Product', editProduct:'Edit Product', productSearch:'Search products...',
    addUser:'Add User', editUser:'Edit User', userSearch:'Search name / email...',
    orderSearch:'Search orders...', role:'Role', customer:'Customer', adminRole:'Admin',
    blocked:'Blocked', active:'Active', block:'Block', unblock:'Unblock',
    selected:'selected', deleteConfirm:'Delete?', categoryName:'Category Name', addCategory:'Add',
    couponCode:'Coupon Code', percentOff:'Percent (%)', flatOff:'Flat (৳)', addCoupon:'Add',
    siteName:'Site Name', supportPhone:'Support Phone',
    exportData:'Export', resetAll:'Reset All', resetConfirm:'All data will be deleted!',
    noData:'No data', quickView:'Quick View', printInvoice:'Print',
    installApp:'Install App', installHint:'Add to home screen', install:'Install',
    offlineMode:'Offline', pushNotif:'Push', enable:'Enable', pushEnabled:'Push enabled',
    paymentMethod:'Payment', selectPayment:'Select payment',
    cod:'Cash on Delivery', codDesc:'Pay when you receive',
    bkash:'bKash', nagad:'Nagad', rocket:'Rocket', mobilePayment:'Mobile Payment',
    paymentNumber:'Payment Number', copy:'Copy', copied:'Copied',
    sendMoneySteps:'Send money steps', useDialCode:'Dial code',
    txnId:'Transaction ID', txnIdPlaceholder:'e.g. 8AB1C2D3E4',
    screenshot:'Screenshot', screenshotOptional:'(optional)', uploadScreenshot:'Upload',
    confirmOrder:'Confirm Order',
    orderSuccessCOD:'Order placed!',
    orderSuccessPaid:'Order placed! Awaiting verification',
    deliveryZone:'Delivery Zone', insideDhaka:'Inside Dhaka', outsideDhaka:'Outside Dhaka',
    deliveryCharge:'Delivery Charge', deliveryChargeEdit:'Delivery Charge',
    adminComment:'Comment', adminCommentOptional:'(optional)', commentPlaceholder:'Write comment...',
    paymentInfo:'Payment Info', paymentNumberConfig:'Payment Number', settingsSaved:'Settings saved',
    numberCopied:'Number copied', dialCodeCopied:'Dial code copied',
    invalidTxnId:'Enter valid Txn ID',
    sendOTP:'Send OTP', verifyOTP:'Verify', resendOTP:'Resend',
    verifyEmail:'Verify Email', weSentCode:'We sent a 6-digit code to',
    otpValidTime:'Valid 10 minutes', changeInfo:'Change info',
    otpSent:'✅ OTP sent', otpSending:'Sending...',
    otpVerifying:'Verifying...', emailAvailable:'✓ Available',
    emailTaken:'❌ Already registered',
    invalidEmail:'Enter valid email', agreeToTerms:'Agree to terms',
    enterFullCode:'Enter 6-digit code', registrationSuccess:'🎉 Registration successful!',
    otpFailed:'Failed to send email',
    dataLoadingWait:'Loading...',
    forgotPassword:'Forgot Password?', resetPassword:'Reset Password',
    resetPasswordDesc:'Enter your registered email',
    sendCode:'Send Code', back:'Back',
    newPassword2:'New Password', updatePassword:'Update',
    passwordUpdated:'✅ Password Updated', passwordUpdatedDesc:'Login with your new password',
    loginNow:'Login Now', noAccountWithEmail:'No account with this email',
    verifyCodeFirst:'Verify code first', updateFailed:'Update failed',
    codeVerified:'✅ Code verified',
    stepEmail:'Email', stepOtp:'OTP', stepNew:'New',
    compare:'Compare', clearCompare:'Clear All', features:'Features',
    wallet:'Wallet', walletBalance:'Wallet Balance', addMoney:'Add Money', balance:'Balance',
    transactions:'Transactions', noTransactions:'No transactions', amount:'Amount',
    referral:'Referral', referralCode:'Referral Code', applyCode:'Apply Code',
    inviteFriends:'🎁 Invite Friends',
    loyalty:'Loyalty Points', trackOrder:'Track Order', track:'Tracking',
    salesTrend:'Sales Trend', totalSalesLabel:'Total Sales', ordersLabel:'Orders', avgPerDay:'Avg/Day',
    whatsappOrder:'WhatsApp Order Confirmation', whatsappSend:'Send via WhatsApp',
    whatsappDesc:'Send order details to customer via WhatsApp',
    downloadPDF:'Download PDF', printInvoicePDF:'PDF Invoice', invoice:'Invoice',
    chatbot:'AI Assistant', botOnline:'Online', botPlaceholder:'Type a message...',
    botTyping:'Typing...', botGreeting:'Hello! I am EcoBot. How can I help you?',
    botSearchingProducts:'Searching products...',
    botNoProducts:'Sorry, no products found.',
    botFoundProducts:'I found these products:',
    botOrderTracking:'Enter order ID (ORD-...)',
    botHelpMessage:'I can help with: find products, track orders, price inquiry, contact',
    botContact:'Contact: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'Order not found',
    botOrderStatus:'Your order status:',
    botThanks:'Thanks! Let me know if you need more help.',
    botPrice:'Price: ',
    orderDetails:'Order Details', changeStatus:'Change Status',
    courier:'Courier', trackingNumber:'Tracking Number', eta:'Expected Delivery',
    internalNotes:'Internal Notes (admin only)', writeNote:'Write note...',
    addNote:'Add Note', orderHistory:'Order History', orderItems:'Items',
    customerInfo:'Customer Info', paymentDetails:'Payment Details',
    amounts:'Amounts', recalculate:'Recalculate',
    bulkSelected:'selected', bulkConfirm:'Confirm', bulkCancel:'Cancel', bulkPrint:'Bulk Print',
    filterStatus:'Status', filterPayment:'Payment', filterFrom:'From',
    filterTo:'To', filterSearch:'Search', filterReset:'Reset',
    cancelOrder:'Cancel Order', cancelReason:'Reason for cancellation',
    writeReason:'Write reason...', confirmCancelAction:'Cancel Order',
    reorder:'Reorder', activeOrders:'Active', allOrders:'All Orders',
    orderReceived:'Order received, awaiting admin confirmation',
    confirmedByAdmin:'Order confirmed by admin',
    processingStarted:'Processing started',
    shippedByCourier:'Shipped via courier',
    outForDelivery:'Out for delivery',
    deliveredSuccess:'Delivered successfully',
    cancelledByAdmin:'Cancelled by admin',
    rejectedByAdmin:'Rejected by admin',
    noReasonGiven:'No reason given',
    saveChanges:'Save changes', updatedByAdmin:'Updated by admin',
    quickConfirmTitle:'Confirm this order?'
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
    list.unshift(id); list = list.slice(0, 12);
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
    try { db.ref(path).on('value', s => { try{ cb(s.val()); }catch(e){ console.error(path, e); } }, err => { this.error = err.message; }); }
    catch(e){ console.error(e); }
  },

  _toArray(data){
    if(!data) return [];
    if(Array.isArray(data)) return data.filter(Boolean);
    return Object.entries(data).map(([k,v]) => typeof v==='object' && v!==null ? { ...v, id: v.id || k, _key: k } : { id:k, value:v, _key:k });
  },

  _markReady(w){
    this.ready[w] = true;
    if(this.ready.products && this.ready.users && this.ready.orders){
      App.hideSplash(); this.trySeed(); App.rerenderIfVisible();
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
      u_admin:{id:'u_admin',name:'Admin',email:'admin@eco.pro',password:'admin123',role:'admin',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',phone:'01700000000'}
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
    } catch(e){ console.error('Seed failed:', e); }
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
    if(file.size > 32*1024*1024) throw new Error('File too large');
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
   EmailJS OTP
   ═══════════════════════════════════════════════════════════ */
const OTP = {
  currentEmail: null, currentCode: null, expiresAt: 0, attempts: 0,
  cooldownTimer: null, verified: false,

  init(){
    if(typeof emailjs === 'undefined') return false;
    if(!EmailJSConfig.initialized){
      try { emailjs.init({ publicKey: EmailJSConfig.publicKey }); EmailJSConfig.initialized = true; return true; }
      catch(e){ console.error(e); return false; }
    }
    return true;
  },
  generate(){ return String(Math.floor(100000 + Math.random() * 900000)); },
  async send(email, name){
    if(!this.init()) return { ok:false, msg: 'EmailJS not loaded' };
    const code = this.generate();
    this.currentEmail = Auth.normalizeEmail(email);
    this.currentCode = code;
    this.expiresAt = Date.now() + 10 * 60 * 1000;
    this.attempts = 0; this.verified = false;
    try {
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, {
        to_email: this.currentEmail, email: this.currentEmail,
        reply_to: this.currentEmail, otp_code: code, code: code,
        user_name: name || 'User', site_name: 'EcoShop Pro MAX', expiry: '10 minutes'
      });
      return { ok:true };
    } catch(err){
      return { ok:false, msg: err?.text || err?.message || 'Failed' };
    }
  },
  async verify(inputCode){
    if(!this.currentCode) return { ok:false, msg:'Send code first' };
    if(Date.now() > this.expiresAt) return { ok:false, msg:'Code expired' };
    if(this.attempts >= 5) return { ok:false, msg:'Too many attempts' };
    if(String(inputCode).trim() !== this.currentCode){
      this.attempts++;
      return { ok:false, msg:`Wrong code (${5-this.attempts} left)` };
    }
    this.verified = true;
    return { ok:true };
  },
  reset(){
    this.currentEmail = null; this.currentCode = null; this.expiresAt = 0;
    this.attempts = 0; this.verified = false;
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
   WhatsApp
   ═══════════════════════════════════════════════════════════ */
const WhatsApp = {
  cleanNumber(num){ return num ? String(num).replace(/\D/g, '') : ''; },
  formatBD(number){
    let n = this.cleanNumber(number);
    if(n.startsWith('0')) n = '88' + n;
    else if(n.startsWith('880')) {}
    else if(!n.startsWith('88')) n = '880' + n.replace(/^0+/, '');
    return n;
  },
  buildOrderMessage(order){
    const itemsList = (order.items || []).map((it, i) =>
      `${i+1}. ${it.name}\n   ${it.qty} × ৳${it.price} = ৳${it.qty * it.price}`
    ).join('\n\n');
    const isBn = LANG === 'bn';
    const msg = isBn
      ? `🛒 *EcoShop Pro MAX — অর্ডার কনফার্মেশন*\n\n` +
        `👤 *নাম:* ${order.customer.name}\n` +
        `📞 *ফোন:* ${order.customer.phone}\n` +
        `📍 *ঠিকানা:* ${order.customer.address}${order.customer.city ? ', ' + order.customer.city : ''}\n\n` +
        `📦 *পণ্য:*\n${itemsList}\n\n` +
        `💰 *সাবটোটাল:* ৳${order.subtotal || 0}\n` +
        `🚚 *ডেলিভারি:* ৳${order.deliveryCharge || 0}\n` +
        (order.discount ? `🎁 *ডিসকাউন্ট:* -৳${order.discount}\n` : '') +
        `✅ *সর্বমোট:* ৳${order.total}\n\n` +
        `💳 *পেমেন্ট:* ${(order.paymentMethod || 'cod').toUpperCase()}\n` +
        (order.txnId ? `🔢 *Txn ID:* ${order.txnId}\n` : '') +
        `\n🆔 *অর্ডার আইডি:* ${order.id}\n` +
        `📊 *স্ট্যাটাস:* ${Orders.statusLabel(order.status)}\n` +
        `🕐 *সময়:* ${new Date(order.date).toLocaleString('bn-BD')}\n\n` +
        `ধন্যবাদ EcoShop Pro MAX থেকে কেনাকাটার জন্য! 🌿`
      : `🛒 *EcoShop Pro MAX — Order Confirmation*\n\n` +
        `👤 *Name:* ${order.customer.name}\n` +
        `📞 *Phone:* ${order.customer.phone}\n` +
        `📍 *Address:* ${order.customer.address}${order.customer.city ? ', ' + order.customer.city : ''}\n\n` +
        `📦 *Items:*\n${itemsList}\n\n` +
        `💰 *Subtotal:* ৳${order.subtotal || 0}\n` +
        `🚚 *Delivery:* ৳${order.deliveryCharge || 0}\n` +
        (order.discount ? `🎁 *Discount:* -৳${order.discount}\n` : '') +
        `✅ *Total:* ৳${order.total}\n\n` +
        `💳 *Payment:* ${(order.paymentMethod || 'cod').toUpperCase()}\n` +
        (order.txnId ? `🔢 *Txn ID:* ${order.txnId}\n` : '') +
        `\n🆔 *Order ID:* ${order.id}\n` +
        `📊 *Status:* ${Orders.statusLabel(order.status)}\n` +
        `🕐 *Time:* ${new Date(order.date).toLocaleString('en-US')}\n\n` +
        `Thanks for shopping with EcoShop Pro MAX! 🌿`;
    return msg;
  },
  sendOrder(order, toPhone){
    if(!order) return;
    const phone = toPhone ? this.formatBD(toPhone) : this.formatBD(order.customer.phone);
    if(!phone){ Toast.show('Invalid phone', 'error'); return; }
    const msg = encodeURIComponent(this.buildOrderMessage(order));
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    Toast.show(LANG==='bn'?'WhatsApp খোলা হচ্ছে...':'Opening WhatsApp...','success');
  },
  sendToAdmin(order){
    const adminPhone = DB.settings.whatsappNumber || '8801700000000';
    const phone = this.formatBD(adminPhone);
    const msg = encodeURIComponent(this.buildOrderMessage(order));
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }
};

/* ═══════════════════════════════════════════════════════════
   PDF Invoice
   ═══════════════════════════════════════════════════════════ */
const PDFInvoice = {
  generate(orderId, lang){
    const o = DB.orders.find(x => x.id === orderId);
    if(!o) return;
    const useLang = lang || LANG;
    const isBn = useLang === 'bn';
    const siteName = DB.settings.siteName || 'EcoShop Pro MAX';

    const T = isBn ? {
      title:'ইনভয়েস', invoice:'ইনভয়েস নং', date:'তারিখ', status:'স্ট্যাটাস',
      from:'প্রেরক', to:'প্রাপক', phone:'ফোন', address:'ঠিকানা',
      item:'পণ্য', qty:'পরিমাণ', price:'দর', total:'মোট',
      subtotal:'সাবটোটাল', delivery:'ডেলিভারি', discount:'ডিসকাউন্ট',
      grand:'সর্বমোট', payment:'পেমেন্ট', txn:'ট্রানজেকশন',
      thankYou:'ধন্যবাদ!', footer:'কম্পিউটার-জেনারেটেড'
    } : {
      title:'INVOICE', invoice:'Invoice', date:'Date', status:'Status',
      from:'From', to:'Bill To', phone:'Phone', address:'Address',
      item:'Item', qty:'Qty', price:'Price', total:'Total',
      subtotal:'Subtotal', delivery:'Delivery', discount:'Discount',
      grand:'Grand Total', payment:'Payment', txn:'Transaction',
      thankYou:'Thank you!', footer:'Computer-generated'
    };

    const trackUrl = `${location.origin}${location.pathname}?track=${o.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(trackUrl)}`;

    const html = `<!DOCTYPE html>
<html lang="${useLang}">
<head><meta charset="UTF-8"><title>Invoice ${o.id}</title>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${isBn?"'Hind Siliguri',":"'Plus Jakarta Sans',"}sans-serif;background:#f5f6fa;padding:30px 20px;color:#0f1021;line-height:1.55}
.invoice{max-width:800px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(15,16,33,.08)}
.header{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:32px 36px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{width:52px;height:52px;background:rgba(255,255,255,.2);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px}
.brand-text h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800}
.brand-text h1 span{color:#ffe49a}
.brand-text p{font-size:12px;opacity:.9;margin-top:2px}
.invoice-meta{text-align:right;font-size:13px}
.invoice-meta h2{font-size:26px;font-weight:800;letter-spacing:1px;margin-bottom:8px}
.invoice-meta .row{display:flex;justify-content:flex-end;gap:8px;opacity:.95}
.status-badge{display:inline-block;padding:4px 12px;background:rgba(255,255,255,.25);border-radius:100px;font-size:11px;font-weight:800;text-transform:uppercase;margin-top:8px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:28px 36px;border-bottom:1px dashed #e5e8f0}
@media(max-width:560px){.parties{grid-template-columns:1fr}}
.party-label{font-size:10.5px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.party-name{font-size:15px;font-weight:800;margin-bottom:6px}
.party-detail{font-size:13px;color:#64748b;line-height:1.65}
.items-wrap{padding:28px 36px 0}
.items-table{width:100%;border-collapse:collapse}
.items-table th{background:#f8f9fd;padding:12px 14px;text-align:left;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;border-bottom:2px solid #e5e8f0}
.items-table th:last-child,.items-table td:last-child{text-align:right}
.items-table th:nth-child(2),.items-table td:nth-child(2){text-align:center;width:70px}
.items-table th:nth-child(3),.items-table td:nth-child(3){text-align:right;width:110px}
.items-table td{padding:14px;font-size:13.5px;border-bottom:1px solid #e5e8f0}
.items-table td:first-child{font-weight:600}
.totals{display:flex;justify-content:flex-end;padding:20px 36px 0}
.totals-box{width:100%;max-width:320px}
.total-row{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;color:#64748b}
.total-row span:last-child{font-weight:700;color:#0f1021}
.total-row.grand{border-top:2px solid #e5e8f0;margin-top:8px;padding-top:14px;font-size:18px;font-weight:800}
.total-row.grand span:last-child{color:#6366f1;font-size:22px}
.payment-info{margin:24px 36px 0;padding:16px 20px;background:#f8f9fd;border-radius:12px;border-left:4px solid #6366f1}
.payment-info h4{font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;margin-bottom:10px}
.payment-info .info-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
.payment-info .info-row span:first-child{color:#64748b}
.payment-info .info-row span:last-child{font-weight:700}
.footer-section{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:28px 36px;margin-top:20px;background:#f8f9fd;flex-wrap:wrap}
.qr-section{display:flex;align-items:center;gap:14px}
.qr-section img{width:80px;height:80px;border-radius:8px;background:#fff;padding:4px}
.qr-text{font-size:12px;color:#64748b}
.qr-text b{display:block;color:#0f1021;font-size:13px;margin-bottom:3px}
.thank-you{text-align:right;flex:1;min-width:200px}
.thank-you h3{font-size:18px;font-weight:800;color:#6366f1;margin-bottom:4px}
.thank-you p{font-size:12px;color:#64748b}
.print-bar{position:fixed;top:20px;right:20px;display:flex;gap:8px;z-index:100}
.print-bar button{padding:12px 20px;border:none;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.3);font-family:inherit}
.print-bar .btn-print{background:#6366f1;color:#fff}
.print-bar .btn-close{background:#fff;color:#64748b;border:1.5px solid #e5e8f0}
@media print{body{background:#fff;padding:0}.print-bar{display:none}.invoice{box-shadow:none;border-radius:0}}
</style></head><body>
<div class="print-bar">
<button class="btn-print" onclick="window.print()">🖨️ ${isBn?'প্রিন্ট / PDF':'Print / Save PDF'}</button>
<button class="btn-close" onclick="window.close()">✕</button>
</div>
<div class="invoice">
<div class="header">
<div class="brand">
<div class="brand-icon">🌿</div>
<div class="brand-text"><h1>EcoShop<span>Pro</span></h1><p>${DB.settings.supportEmail || ''} • ${DB.settings.supportPhone || ''}</p></div>
</div>
<div class="invoice-meta">
<h2>${T.invoice}</h2>
<div class="row"><span>${T.invoice}:</span><strong>${o.id}</strong></div>
<div class="row"><span>${T.date}:</span><strong>${new Date(o.date).toLocaleDateString(isBn?'bn-BD':'en-US')}</strong></div>
<div class="status-badge">${Orders.statusLabel(o.status)}</div>
</div>
</div>
<div class="parties">
<div class="party">
<div class="party-label">${T.from}</div>
<div class="party-name">${siteName}</div>
<div class="party-detail">
<div>📍 ${isBn?'ঢাকা, বাংলাদেশ':'Dhaka, Bangladesh'}</div>
<div>📞 ${DB.settings.supportPhone || ''}</div>
<div>✉️ ${DB.settings.supportEmail || ''}</div>
</div>
</div>
<div class="party">
<div class="party-label">${T.to}</div>
<div class="party-name">${o.customer.name}</div>
<div class="party-detail">
<div>📞 ${o.customer.phone || ''}</div>
<div>📍 ${o.customer.address || ''}${o.customer.city?', '+o.customer.city:''}</div>
</div>
</div>
</div>
<div class="items-wrap">
<table class="items-table">
<thead><tr><th>${T.item}</th><th>${T.qty}</th><th>${T.price}</th><th>${T.total}</th></tr></thead>
<tbody>${(o.items||[]).map(it=>`<tr>
<td>${it.name}</td><td>${it.qty}</td>
<td>৳${Number(it.price).toLocaleString(isBn?'bn-BD':'en-US')}</td>
<td>৳${Number(it.qty*it.price).toLocaleString(isBn?'bn-BD':'en-US')}</td>
</tr>`).join('')}</tbody>
</table>
</div>
<div class="totals"><div class="totals-box">
<div class="total-row"><span>${T.subtotal}</span><span>৳${Number(o.subtotal||0).toLocaleString(isBn?'bn-BD':'en-US')}</span></div>
<div class="total-row"><span>${T.delivery}</span><span>৳${Number(o.deliveryCharge||0).toLocaleString(isBn?'bn-BD':'en-US')}</span></div>
${o.discount?`<div class="total-row"><span>${T.discount}</span><span>-৳${Number(o.discount).toLocaleString(isBn?'bn-BD':'en-US')}</span></div>`:''}
<div class="total-row grand"><span>${T.grand}</span><span>৳${Number(o.total).toLocaleString(isBn?'bn-BD':'en-US')}</span></div>
</div></div>
<div class="payment-info">
<h4>${T.payment}</h4>
<div class="info-row"><span>${isBn?'পদ্ধতি':'Method'}</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>
${o.txnId?`<div class="info-row"><span>${T.txn}</span><span>${o.txnId}</span></div>`:''}
</div>
<div class="footer-section">
<div class="qr-section">
<img src="${qrUrl}" alt="QR" onerror="this.style.display='none'">
<div class="qr-text"><b>${isBn?'ট্র্যাক করুন':'Track Order'}</b><span>${o.id}</span></div>
</div>
<div class="thank-you">
<h3>${T.thankYou}</h3>
<p>${T.footer}</p>
<p style="margin-top:6px;font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} ${siteName}</p>
</div>
</div>
</div>
</body></html>`;

    const w = window.open('', '_blank', 'width=900,height=1000');
    if(!w){ Toast.show('Popup blocked', 'error'); return; }
    w.document.write(html);
    w.document.close();
  }
};

/* ═══════════════════════════════════════════════════════════
   Chatbot
   ═══════════════════════════════════════════════════════════ */
const Chatbot = {
  open: false,
  messages: [],
  isTyping: false,

  init(){
    const toggle = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');
    const badge = document.getElementById('chatbotBadge');
    if(toggle) toggle.onclick = () => this.toggle();
    if(closeBtn) closeBtn.onclick = () => this.close();
    if(sendBtn) sendBtn.onclick = () => this.sendFromInput();
    if(input) input.addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); this.sendFromInput(); } });
    if(badge) setTimeout(()=>{ badge.style.display = 'none'; }, 8000);
  },
  toggle(){ if(this.open) this.close(); else this.openChat(); },
  openChat(){
    this.open = true;
    document.getElementById('chatbotWidget')?.classList.add('open');
    const badge = document.getElementById('chatbotBadge');
    if(badge) badge.style.display = 'none';
    if(!this.messages.length){
      this.addBotMessage(t('botGreeting'));
      this.renderQuickReplies();
    }
    setTimeout(()=> document.getElementById('chatbotInput')?.focus(), 300);
  },
  close(){
    this.open = false;
    document.getElementById('chatbotWidget')?.classList.remove('open');
  },
  addBotMessage(text, extraHTML){
    this.messages.push({ type:'bot', text, extra: extraHTML });
    this.render();
  },
  addUserMessage(text){
    this.messages.push({ type:'user', text });
    this.render();
  },
  render(){
    const box = document.getElementById('chatbotMessages');
    if(!box) return;
    box.innerHTML = this.messages.map(m => {
      if(m.type === 'typing'){
        return `<div class="chat-msg bot typing"><span></span><span></span><span></span></div>`;
      }
      return `<div class="chat-msg ${m.type}">
        <div>${this.escapeHtml(m.text).replace(/\n/g, '<br>')}</div>
        ${m.extra || ''}
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  },
  escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
  showTyping(){ this.messages.push({ type:'typing' }); this.render(); },
  hideTyping(){ this.messages = this.messages.filter(m => m.type !== 'typing'); this.render(); },
  renderQuickReplies(){
    const box = document.getElementById('chatbotQuick');
    if(!box) return;
    const replies = LANG === 'bn'
      ? ['পণ্য দেখুন', 'অর্ডার ট্র্যাক', 'সাহায্য', 'যোগাযোগ']
      : ['Browse Products', 'Track Order', 'Help', 'Contact'];
    box.innerHTML = replies.map(r =>
      `<button onclick="Chatbot.quick('${r.replace(/'/g, "\\'")}')">${r}</button>`
    ).join('');
  },
  quick(text){ this.addUserMessage(text); this.processMessage(text); },
  sendFromInput(){
    const input = document.getElementById('chatbotInput');
    if(!input) return;
    const text = input.value.trim();
    if(!text) return;
    input.value = '';
    this.addUserMessage(text);
    this.processMessage(text);
  },
  async processMessage(text){
    this.showTyping();
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    this.hideTyping();
    const lower = text.toLowerCase();
    const trackMatch = text.match(/ord-?\d+/i);
    if(trackMatch){
      const orderId = trackMatch[0].toUpperCase();
      const order = DB.orders.find(o => o.id.toUpperCase() === orderId);
      if(order){
        this.addBotMessage(`${t('botOrderStatus')}\n\n🆔 ${order.id}\n📦 ${Orders.statusLabel(order.status)}\n💰 ৳${order.total}\n📅 ${new Date(order.date).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US')}`);
      } else {
        this.addBotMessage(t('botInvalidOrder'));
      }
      return;
    }
    if(/^(hi|hello|hey|হাই|হ্যালো|সালাম|assalam|আসসালামু)/i.test(lower)){ this.addBotMessage(t('botGreeting')); return; }
    if(/(thanks|thank you|ধন্যবাদ|শুকরিয়া)/i.test(lower)){ this.addBotMessage(t('botThanks')); return; }
    if(/(help|সাহায্য|সহায়তা|কি করতে|কীভাবে)/i.test(lower)){ this.addBotMessage(t('botHelpMessage')); return; }
    if(/(contact|যোগাযোগ|ফোন|phone|call)/i.test(lower)){ this.addBotMessage(t('botContact')); return; }
    if(/(track|ট্র্যাক|tracking)/i.test(lower)){ this.addBotMessage(t('botOrderTracking')); return; }
    if(/(product|পণ্য|প্রোডাক্ট|item|buy|কিনবো|show)/i.test(lower)){
      this.addBotMessage(t('botSearchingProducts'));
      await new Promise(r => setTimeout(r, 500));
      const featured = DB.products.filter(p => p.featured && p.stock > 0).slice(0, 3);
      if(!featured.length){ this.addBotMessage(t('botNoProducts')); return; }
      const cards = featured.map(p => `
        <div class="chat-product" onclick="Chatbot.goToProduct('${p.id}')">
          <img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'">
          <div class="chat-product-info">
            <h6>${LANG === 'bn' ? p.name : (p.nameEn || p.name)}</h6>
            <span>৳${p.price}</span>
          </div>
        </div>`).join('');
      this.addBotMessage(t('botFoundProducts'), cards);
      return;
    }
    const words = lower.split(/\s+/).filter(w => w.length > 2);
    const matches = DB.products.filter(p =>
      words.some(w => (p.name + ' ' + (p.nameEn||'') + ' ' + (p.cat||'')).toLowerCase().includes(w))
    ).slice(0, 3);
    if(matches.length){
      const cards = matches.map(p => `
        <div class="chat-product" onclick="Chatbot.goToProduct('${p.id}')">
          <img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'">
          <div class="chat-product-info">
            <h6>${LANG === 'bn' ? p.name : (p.nameEn || p.name)}</h6>
            <span>৳${p.price}</span>
          </div>
        </div>`).join('');
      this.addBotMessage(t('botFoundProducts'), cards);
      return;
    }
    this.addBotMessage(LANG === 'bn'
      ? 'দুঃখিত, আমি বুঝতে পারিনি। আপনি জিজ্ঞেস করতে পারেন:\n• "পণ্য দেখুন"\n• "অর্ডার ট্র্যাক ORD-12345678"\n• "সাহায্য"\n• "যোগাযোগ"'
      : 'Sorry, I didn\'t understand. Try:\n• "Browse products"\n• "Track order ORD-12345678"\n• "Help"\n• "Contact"'
    );
  },
  goToProduct(id){ this.close(); App.go('product', id); }
};

/* ═══════════════════════════════════════════════════════════
   PWA / Push
   ═══════════════════════════════════════════════════════════ */
const PWA = {
  deferredPrompt: null,
  registerSW(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js').then(r => console.log('✅ SW:', r.scope)).catch(e => console.warn('SW:', e));
    }
  },
  initInstallPrompt(){
    const banner = document.getElementById('installBanner');
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      if(banner && !localStorage.getItem('eco_install_dismissed')) setTimeout(() => banner.classList.add('show'), 2500);
    });
    const installBtn = document.getElementById('installBtn');
    const installClose = document.getElementById('installClose');
    if(installBtn) installBtn.onclick = async () => {
      if(!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      banner?.classList.remove('show');
    };
    if(installClose) installClose.onclick = () => {
      banner?.classList.remove('show');
      localStorage.setItem('eco_install_dismissed', '1');
    };
  }
};

const PushNotif = {
  async requestPermission(){
    if(!('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      if(perm === 'granted'){ Toast.show(t('pushEnabled'), 'success'); return true; }
      return false;
    } catch(e){ return false; }
  },
  init(){
    const btn = document.getElementById('pushNotifBtn');
    if(btn) btn.onclick = async () => { if(await this.requestPermission()) btn.textContent = '✓'; };
  },
  async localNotif(title, body){
    if(!('Notification' in window) || Notification.permission !== 'granted') return;
    try { new Notification(title, { body }); } catch(e){}
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
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(40px)'; setTimeout(() => el.remove(), 250); }, ms);
  },
  progress(){ const p = document.getElementById('topProgress'); if(!p) return; p.style.width='70%'; setTimeout(()=>{p.style.width='100%';setTimeout(()=>p.style.width='0',300);},300); }
};

const Modal = {
  open(html, cls=''){
    document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)Modal.close()"><div class="modal-box ${cls}">${html}</div></div>`;
    document.body.style.overflow = 'hidden';
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
    document.getElementById('modalConfirmYes').onclick = () => { Modal.close(); onYes && onYes(); };
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
  normalizeEmail(email){ return email ? String(email).trim().toLowerCase() : ''; },
  checkEmailStatus(email){
    const target = this.normalizeEmail(email);
    if(!target) return { status: 'free' };
    if(!DB.ready.users) return { status: 'unknown' };
    const exists = (DB.users || []).some(u => this.normalizeEmail(u.email) === target);
    return { status: exists ? 'taken' : 'free' };
  },
  isEmailTaken(email){ return this.checkEmailStatus(email).status === 'taken'; },
  async login(email, password){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.normalizeEmail(email);
    const u = DB.users.find(x => this.normalizeEmail(x.email) === target && x.password === password);
    if(!u) return { ok:false, msg:t('invalidCredentials') };
    if(u.blocked) return { ok:false, msg:t('accountBlocked') };
    Session.set(u);
    return { ok:true, user:u };
  },
  async register(data){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.normalizeEmail(data.email);
    if(this.isEmailTaken(target)) return { ok:false, msg:t('emailExists'), code:'EMAIL_TAKEN' };
    const u = {
      id: 'u_' + Date.now() + '_' + Math.floor(Math.random()*1000),
      name: data.name, email: target, password: data.password,
      phone: data.phone || '', role: 'customer', blocked: false,
      joined: Date.now(), emailVerified: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
    };
    try {
      if(this.isEmailTaken(target)) return { ok:false, msg:t('emailExists'), code:'EMAIL_TAKEN' };
      await DB.saveUser(u);
      Session.set(u);
      return { ok:true, user:u };
    } catch(e){ return { ok:false, msg:'Save failed: ' + e.message }; }
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
    const found = items.find(i => i.id === id);
    const p = DB.products.find(x => x.id === id);
    if(!p) return;
    if(p.stock < qty) return Toast.show(t('outOfStock'),'error');
    if(found){ if(found.qty + qty > p.stock) return Toast.show(t('outOfStock'),'error'); found.qty += qty; }
    else items.push({ id, qty });
    this.save(items);
    Toast.show(LANG==='bn'?'কার্টে যোগ হয়েছে':'Added to cart','success');
  },
  remove(id){ this.save(this.items().filter(i => i.id !== id)); },
  setQty(id, qty){
    const items = this.items();
    const it = items.find(i => i.id === id); if(!it) return;
    const p = DB.products.find(x => x.id === id);
    if(p && qty > p.stock) return Toast.show(t('outOfStock'),'error');
    it.qty = Math.max(1, qty); this.save(items);
  },
  count(){ return this.items().reduce((s, i) => s + i.qty, 0); },
  subtotal(){ return this.items().reduce((s, i) => { const p = DB.products.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
  shippingCharge(zone){
    if(this.count() <= 0) return 0;
    return (zone === 'outside') ? (DB.settings.shippingOutsideDhaka || 120) : (DB.settings.shippingInsideDhaka || 100);
  },
  total(zone){ return this.subtotal() + this.shippingCharge(zone); },
  refresh(){
    const c = this.count();
    const setT = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = c > 0 ? c : '';
    const bnBadge = document.getElementById('bnCartBadge'); if(bnBadge) bnBadge.textContent = c > 0 ? c : '';
    setT('cartCount', `${c} ${t('items')}`);
    setT('cartSubtotal', money(this.subtotal()));
    setT('cartShipping', money(this.shippingCharge('inside')));
    setT('cartDiscount', '-' + money(0));
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
    body.innerHTML = items.map(i => {
      const p = DB.products.find(x => x.id === i.id); if(!p) return '';
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
   Wish
   ═══════════════════════════════════════════════════════════ */
const Wish = {
  all(){ return WishStore.get(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all();
    const idx = list.indexOf(id);
    if(idx > -1){ list.splice(idx, 1); Toast.show(LANG==='bn'?'সরানো হয়েছে':'Removed','info'); }
    else { list.push(id); Toast.show(LANG==='bn'?'যোগ হয়েছে':'Added','success'); }
    WishStore.set(list);
    if(['wishlist','shop','home','product'].includes(App.route)) App.render();
    else App.syncUI();
  }
};

/* ═══════════════════════════════════════════════════════════
   Orders v11.0 — Advanced Order Management
   ═══════════════════════════════════════════════════════════ */
const Orders = {
  STATUS_FLOW: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'],
  STATUS_ALL: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'rejected'],

  all(){ return DB.orders; },
  mine(){ const u = Auth.user(); if(!u) return []; return DB.orders.filter(o => o.userId === u.id); },
  pending(){ return DB.orders.filter(o => o.status === 'pending'); },

  async create(data){
    const u = Auth.user();
    const order = {
      id: 'ORD-' + Date.now().toString().slice(-8),
      userId: u ? u.id : 0,
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
      status: 'pending',
      paymentStatus: data.paymentMethod === 'cod' ? 'cod_pending' : 'awaiting_verification',
      courier: null,
      trackingNumber: null,
      eta: null,
      adminNote: '',
      internalNotes: [],
      date: Date.now(),
      history: [{
        status: 'pending',
        time: Date.now(),
        comment: t('orderReceived'),
        by: 'Customer'
      }]
    };
    const saved = await DB.saveOrder(order);
    data.items.forEach(async i => {
      const p = DB.products.find(x => x.id === i.id);
      if(p) try { await DB.updateStock(p.id, Math.max(0, p.stock - i.qty)); } catch(e){}
    });
    try {
      await DB.pushNotif({
        title: LANG === 'bn' ? '🛒 নতুন অর্ডার!' : '🛒 New Order!',
        body: `${data.customer.name} — ${money(data.total)} — ${data.paymentMethod.toUpperCase()}`,
        type: 'order'
      });
    } catch(e){}
    Cart.save([]);
    return saved;
  },

  async updateStatus(id, status, comment, extra){
    const o = DB.orders.find(x => x.id === id);
    if(!o) return;
    const history = (o.history || []).concat([{
      status,
      time: Date.now(),
      comment: comment || '',
      by: (Auth.user() && Auth.user().name) || 'System'
    }]);
    const patch = { status, history };
    if(extra && typeof extra === 'object') Object.assign(patch, extra);
    return DB.updateOrder(id, patch);
  },

  async updateDeliveryCharge(id, newCharge){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const newTotal = (o.subtotal || 0) + newCharge - (o.discount || 0);
    const history = (o.history || []).concat([{
      status: o.status, time: Date.now(),
      comment: `Delivery charge: ${money(o.deliveryCharge)} → ${money(newCharge)}`,
      by: (Auth.user() && Auth.user().name) || 'Admin'
    }]);
    return DB.updateOrder(id, { deliveryCharge: newCharge, total: newTotal, history });
  },

  async update(id, patch){ return DB.updateOrder(id, patch); },

  async addNote(id, note){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const notes = (o.internalNotes || []).concat([{
      text: note,
      time: Date.now(),
      by: (Auth.user() && Auth.user().name) || 'Admin'
    }]);
    return DB.updateOrder(id, { internalNotes: notes });
  },

  async bulkUpdateStatus(ids, status, comment){
    for(const id of ids){ await this.updateStatus(id, status, comment); }
  },

  async cancel(id, reason){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    return this.updateStatus(id, 'cancelled', reason || t('cancelledByAdmin'));
  },

  async reject(id, reason){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    (o.items || []).forEach(async item => {
      const p = DB.products.find(x => x.id === item.id);
      if(p) try { await DB.updateStock(p.id, p.stock + item.qty); } catch(e){}
    });
    return this.updateStatus(id, 'rejected', reason || t('rejectedByAdmin'), { paymentStatus: 'rejected' });
  },

  remove(id){ return DB.deleteOrder(id); },

  counts(){
    const c = { pending:0, confirmed:0, processing:0, shipped:0, out_for_delivery:0, delivered:0, cancelled:0, rejected:0 };
    DB.orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  },

  statusLabel(status){ return t(status) || status; },
  statusIcon(status){
    const icons = {
      pending:'fa-clock', confirmed:'fa-check-circle', processing:'fa-gears',
      shipped:'fa-truck', out_for_delivery:'fa-motorcycle', delivered:'fa-circle-check',
      cancelled:'fa-xmark-circle', rejected:'fa-ban'
    };
    return icons[status] || 'fa-circle';
  },

  /* Detail modal */
  detail(orderId){
    const o = DB.orders.find(x => x.id === orderId);
    if(!o) return;
    const isBn = LANG === 'bn';

    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div>
      <div class="modal-body">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <span class="status-badge status-${o.status}">
            <i class="fa-solid ${Orders.statusIcon(o.status)}"></i>
            ${Orders.statusLabel(o.status)}
          </span>
          <span class="order-amount">${money(o.total)}</span>
        </div>
        <div class="order-detail-grid">
          <div class="order-detail-section">
            <h5><i class="fa-solid fa-user"></i> ${isBn?'কাস্টমার':'Customer'}</h5>
            <div class="detail-row"><span>${isBn?'নাম':'Name'}</span><span>${o.customer.name}</span></div>
            <div class="detail-row"><span>${isBn?'ফোন':'Phone'}</span><span>${o.customer.phone}</span></div>
            <div class="detail-row"><span>${isBn?'ঠিকানা':'Address'}</span><span>${o.customer.address}${o.customer.city?', '+o.customer.city:''}</span></div>
          </div>
          <div class="order-detail-section">
            <h5><i class="fa-solid fa-credit-card"></i> ${isBn?'পেমেন্ট':'Payment'}</h5>
            <div class="detail-row"><span>${isBn?'পদ্ধতি':'Method'}</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>
            <div class="detail-row"><span>Status</span><span>${o.paymentStatus||'—'}</span></div>
            ${o.txnId?`<div class="detail-row"><span>Txn ID</span><span>${o.txnId}</span></div>`:''}
          </div>
          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-box"></i> ${isBn?'পণ্যসমূহ':'Items'}</h5>
            <div class="order-items-list">
              ${(o.items||[]).map(it => {
                const p = DB.products.find(x => x.id === it.id);
                return `<div class="order-item-row">
                  <img src="${p?p.img:''}" onerror="this.src='https://via.placeholder.com/48'">
                  <div class="order-item-info"><h6>${it.name}</h6><p>${it.qty} × ${money(it.price)}</p></div>
                  <span class="order-item-price">${money(it.qty * it.price)}</span>
                </div>`;
              }).join('')}
            </div>
            <div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px">
              <div class="detail-row"><span>${isBn?'সাবটোটাল':'Subtotal'}</span><span>${money(o.subtotal||0)}</span></div>
              <div class="detail-row"><span>${isBn?'ডেলিভারি':'Delivery'}</span><span>${money(o.deliveryCharge||0)}</span></div>
              ${o.discount?`<div class="detail-row"><span>${isBn?'ডিসকাউন্ট':'Discount'}</span><span>-${money(o.discount)}</span></div>`:''}
              <div class="detail-row" style="border-top:2px solid var(--border);margin-top:6px;padding-top:10px"><span><b>${isBn?'সর্বমোট':'Total'}</b></span><span style="color:var(--brand);font-size:16px;font-weight:800">${money(o.total)}</span></div>
            </div>
          </div>
          ${o.courier || o.trackingNumber || o.eta ? `
            <div class="order-detail-section" style="grid-column:1/-1">
              <h5><i class="fa-solid fa-truck-fast"></i> ${isBn?'ডেলিভারি তথ্য':'Delivery Info'}</h5>
              ${o.courier?`<div class="detail-row"><span>${t('courier')}</span><span>${o.courier}</span></div>`:''}
              ${o.trackingNumber?`<div class="detail-row"><span>${t('trackingNumber')}</span><span>${o.trackingNumber}</span></div>`:''}
              ${o.eta?`<div class="detail-row"><span>${t('eta')}</span><span>${o.eta}</span></div>`:''}
            </div>
          ` : ''}
          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5>
            <ul class="order-history">
              ${(o.history||[]).slice().reverse().map((h, i) => `
                <li class="${i===0?'current':''}">
                  <span class="h-dot"></span>
                  <h6>${Orders.statusLabel(h.status)}</h6>
                  <small>${new Date(h.time).toLocaleString(isBn?'bn-BD':'en-US')}${h.by?' • '+h.by:''}</small>
                  ${h.comment?`<div class="h-comment">${h.comment}</div>`:''}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
        <button class="btn btn-whatsapp btn-block" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button>
      </div>
    `, 'lg');
  },

  reorder(orderId){
    const o = DB.orders.find(x => x.id === orderId);
    if(!o) return;
    let added = 0;
    (o.items || []).forEach(it => {
      const p = DB.products.find(x => x.id === it.id);
      if(p && p.stock > 0){ Cart.add(p.id, Math.min(it.qty, p.stock)); added++; }
    });
    if(added){
      Toast.show(LANG==='bn'?`${added}টি পণ্য কার্টে যোগ হয়েছে`:`${added} items added`,'success');
      App.openCart();
    } else {
      Toast.show(LANG==='bn'?'পণ্য স্টকে নেই':'Out of stock','error');
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   Notifs
   ═══════════════════════════════════════════════════════════ */
const Notifs = {
  all(){ return DB.notifs; },
  unread(){ return this.all().filter(n => !n.read).length; },
  markAllRead(){ this.all().forEach(n => { if(!n.read) db.ref('notifications/'+n.id+'/read').set(true).catch(()=>{}); }); },
  refresh(){
    const b = document.getElementById('notifBadge'); if(b) b.textContent = this.unread() || '';
    const c = document.getElementById('notifCount'); if(c) c.textContent = `${this.unread()} unread`;
    const list = document.getElementById('notifList'); if(!list) return;
    const arr = this.all();
    list.innerHTML = arr.length ? arr.map(n => `
      <div class="notif-item ${n.read?'':'unread'}">
        <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
        <div><h5>${n.title}</h5><p>${n.body}</p><small>${timeAgo(n.time)}</small></div>
      </div>
    `).join('') : `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>No notifications</h3></div>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   Compare
   ═══════════════════════════════════════════════════════════ */
const Compare = {
  MAX: 4,
  key: 'eco_compare',
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; } },
  save(list){ localStorage.setItem(this.key, JSON.stringify(list)); this.updateBar(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all();
    const idx = list.indexOf(id);
    if(idx > -1){ list.splice(idx, 1); Toast.show(LANG==='bn'?'সরানো হয়েছে':'Removed','info'); }
    else {
      if(list.length >= this.MAX){ Toast.show(`Max ${this.MAX}`, 'warning'); return; }
      list.push(id); Toast.show(LANG==='bn'?'যোগ হয়েছে':'Added','success');
    }
    this.save(list);
    if(['home','shop','wishlist','product'].includes(App.route)) App.render();
  },
  clear(){ this.save([]); },
  updateBar(){
    const bar = document.getElementById('compareBar');
    const thumbs = document.getElementById('compareThumbs');
    const count = document.getElementById('compareCount');
    if(!bar || !thumbs) return;
    const list = this.all();
    if(!list.length){ bar.style.display = 'none'; return; }
    bar.style.display = 'block';
    if(count) count.textContent = list.length;
    thumbs.innerHTML = list.map(id => {
      const p = DB.products.find(x => x.id === id);
      if(!p) return '';
      return `<div class="compare-thumb">
        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'">
        <button onclick="event.stopPropagation();Compare.toggle('${id}')"><i class="fa-solid fa-xmark"></i></button>
      </div>`;
    }).join('');
  },
  open(){
    const list = this.all();
    if(list.length < 2){ Toast.show(LANG==='bn'?'অন্তত ২টি নির্বাচন করুন':'Select 2+','warning'); return; }
    const products = list.map(id => DB.products.find(p => p.id === id)).filter(Boolean);
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-scale-balanced"></i> ${t('compare')}</h3></div>
      <div class="modal-body" style="padding-left:0;padding-right:0">
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead><tr><th>${t('features')}</th>${products.map(p => `<th style="text-align:center"><div class="compare-product-head"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/80'"><h5>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h5></div></th>`).join('')}</tr></thead>
            <tbody>
              <tr><td><b>${t('price')}</b></td>${products.map(p => `<td style="text-align:center"><span class="price">${money(p.price)}</span>${p.oldPrice?`<br><span class="old-price">${money(p.oldPrice)}</span>`:''}</td>`).join('')}</tr>
              <tr><td><b>${t('category')}</b></td>${products.map(p => `<td style="text-align:center">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</td>`).join('')}</tr>
              <tr><td><b>${t('reviews')}</b></td>${products.map(p => `<td style="text-align:center">${starHTML(p.rating||0)}<br><small>${p.reviewCount||0}</small></td>`).join('')}</tr>
              <tr><td><b>${t('stock')}</b></td>${products.map(p => `<td style="text-align:center">${p.stock<=0?`<span style="color:var(--danger)">${t('outOfStock')}</span>`:p.stock}</td>`).join('')}</tr>
              <tr><td><b>${t('discount')}</b></td>${products.map(p => `<td style="text-align:center">${p.discount?`<span class="chip">-${p.discount}%</span>`:'—'}</td>`).join('')}</tr>
              <tr><td><b>${t('addToCart')}</b></td>${products.map(p => `<td style="text-align:center"><button class="btn btn-primary btn-sm" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i></button></td>`).join('')}</tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button>
        <button class="btn btn-danger btn-block" onclick="Compare.clear();Modal.close()">${t('clearCompare')}</button>
      </div>
    `, 'lg');
  }
};

/* ═══════════════════════════════════════════════════════════
   Wallet / Referral / Loyalty
   ═══════════════════════════════════════════════════════════ */
const Wallet = {
  getBalance(userId){
    if(!userId) return 0;
    try { const d = JSON.parse(localStorage.getItem('eco_wallet_balance') || '{}'); return d[userId] || 0; } catch(e){ return 0; }
  },
  setBalance(userId, amount){
    if(!userId) return;
    try { const d = JSON.parse(localStorage.getItem('eco_wallet_balance') || '{}'); d[userId] = amount; localStorage.setItem('eco_wallet_balance', JSON.stringify(d)); } catch(e){}
  },
  addBalance(userId, amount, reason){
    if(!userId) return;
    const cur = this.getBalance(userId);
    const nb = Math.max(0, cur + amount);
    this.setBalance(userId, nb);
    this.addTransaction(userId, { amount, type: amount > 0 ? 'credit' : 'debit', reason: reason || 'Transaction', time: Date.now(), balance: nb });
    return nb;
  },
  addTransaction(userId, tx){
    if(!userId) return;
    try {
      const all = JSON.parse(localStorage.getItem('eco_wallet_tx') || '{}');
      if(!all[userId]) all[userId] = [];
      all[userId].unshift({ ...tx, id: 'tx_' + Date.now() });
      all[userId] = all[userId].slice(0, 50);
      localStorage.setItem('eco_wallet_tx', JSON.stringify(all));
    } catch(e){}
  },
  getTransactions(userId){
    if(!userId) return [];
    try { const all = JSON.parse(localStorage.getItem('eco_wallet_tx') || '{}'); return all[userId] || []; } catch(e){ return []; }
  },
  open(){
    const u = Auth.user();
    if(!u){ Toast.show(t('loginRequired'),'warning'); return; }
    const balance = this.getBalance(u.id);
    const txs = this.getTransactions(u.id);
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-wallet"></i> ${t('wallet')}</h3></div>
      <div class="modal-body">
        <div class="wallet-card">
          <div class="wallet-card-inner">
            <label>${t('balance')}</label>
            <span class="wallet-amount">${money(balance)}</span>
            <div class="wallet-actions">
              <button class="btn btn-sm btn-solid" onclick="Wallet.topUpPrompt()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button>
            </div>
          </div>
        </div>
        <h4 style="font-size:14px;font-weight:800;margin:20px 0 10px"><i class="fa-solid fa-list"></i> ${t('transactions')}</h4>
        ${txs.length ? txs.map(tx => `
          <div class="tx-item">
            <div class="tx-icon ${tx.type}"><i class="fa-solid fa-${tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}"></i></div>
            <div class="tx-info"><h5>${tx.reason}</h5><p>${new Date(tx.time).toLocaleString(LANG==='bn'?'bn-BD':'en-US')}</p></div>
            <span class="tx-amount ${tx.type}">${tx.type === 'credit' ? '+' : ''}${money(tx.amount)}</span>
          </div>
        `).join('') : `<p class="muted">${t('noTransactions')}</p>`}
      </div>
      <div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>
    `);
  },
  topUpPrompt(){
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-plus"></i> ${t('addMoney')}</h3></div>
      <div class="modal-body">
        <div class="form-group"><label>${t('amount')} (৳)</label><input type="number" id="walletTopUp" min="50" step="50" value="500" autofocus></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          ${[100, 500, 1000, 2000].map(a => `<button class="btn btn-outline btn-sm" onclick="document.getElementById('walletTopUp').value=${a}">৳${a}</button>`).join('')}
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" onclick="Wallet.processTopUp()"><i class="fa-solid fa-check"></i> ${t('save')}</button>
      </div>
    `);
  },
  processTopUp(){
    const amount = +document.getElementById('walletTopUp').value;
    if(!amount || amount < 50){ Toast.show('Min ৳50','error'); return; }
    const u = Auth.user(); if(!u) return;
    Wallet.addBalance(u.id, amount, 'Top up');
    Modal.close();
    Toast.show(`${money(amount)} added`, 'success');
    App.render();
  }
};

const Referral = {
  BONUS: 50,
  generateCode(userId){
    if(!userId) return 'ECO000';
    return ('ECO' + userId.slice(-5).toUpperCase()).replace(/[^A-Z0-9]/g, '').slice(0, 10);
  },
  async applyCode(code){
    const u = Auth.user();
    if(!u){ Toast.show(t('loginRequired'),'warning'); return; }
    if(!code){ Toast.show('Enter code','error'); return; }
    const cleanCode = code.trim().toUpperCase();
    if(cleanCode === this.generateCode(u.id)){ Toast.show('Own code', 'error'); return; }
    if(u.referralApplied){ Toast.show('Already applied','warning'); return; }
    const referrer = DB.users.find(x => this.generateCode(x.id) === cleanCode);
    if(!referrer){ Toast.show('Invalid code','error'); return; }
    Wallet.addBalance(u.id, this.BONUS, 'Referral bonus');
    Wallet.addBalance(referrer.id, this.BONUS, 'Referral bonus');
    Session.set({ ...u, referralApplied: true, referralCode: cleanCode });
    await DB.updateUser(u.id, { referralApplied: true, referralCode: cleanCode });
    Toast.show(`🎉 ৳${this.BONUS} for both!`, 'success', 5000);
    App.render();
  },
  open(){
    const u = Auth.user();
    if(!u){ Toast.show(t('loginRequired'),'warning'); return; }
    const code = this.generateCode(u.id);
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-users"></i> ${t('referral')}</h3></div>
      <div class="modal-body">
        <div class="referral-card">
          <div style="font-size:14px;font-weight:700;margin-bottom:8px">${t('inviteFriends')}</div>
          <p style="font-size:12.5px;opacity:.9">${LANG==='bn'?`আপনার কোড শেয়ার করুন। দুজনেই ৳${this.BONUS} পাবেন!`:`Share your code. Both get ৳${this.BONUS}!`}</p>
          <div class="referral-code">
            <span>${code}</span>
            <button onclick="Referral.copyCode('${code}')"><i class="fa-solid fa-copy"></i></button>
          </div>
        </div>
        <div class="form-group" style="margin-top:20px">
          <label>${t('applyCode')}</label>
          <div style="display:flex;gap:8px">
            <input id="applyCodeInput" placeholder="ECO..." style="flex:1">
            <button class="btn btn-primary" onclick="Referral.applyCode(document.getElementById('applyCodeInput').value)"><i class="fa-solid fa-check"></i></button>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button>
        <button class="btn btn-primary btn-block" onclick="Referral.share('${code}')"><i class="fa-brands fa-whatsapp"></i> ${t('whatsappSend')}</button>
      </div>
    `);
  },
  copyCode(code){ navigator.clipboard.writeText(code).then(() => Toast.show('Copied','success')); },
  async share(code){
    const text = LANG==='bn'
      ? `EcoShop Pro MAX-এ যোগ দিন আমার কোড দিয়ে: ${code}\nদুজনেই ৳50 বোনাস পাবেন!`
      : `Join EcoShop Pro MAX with my code: ${code}\nBoth get ৳50 bonus!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
};

const Loyalty = {
  RATE: 0.01,
  REDEEM: 100,
  getPoints(userId){
    if(!userId) return 0;
    try { const d = JSON.parse(localStorage.getItem('eco_loyalty') || '{}'); return d[userId] || 0; } catch(e){ return 0; }
  },
  setPoints(userId, points){
    try { const d = JSON.parse(localStorage.getItem('eco_loyalty') || '{}'); d[userId] = points; localStorage.setItem('eco_loyalty', JSON.stringify(d)); } catch(e){}
  },
  addFromOrder(userId, orderTotal){
    if(!userId) return 0;
    const points = Math.floor(orderTotal * this.RATE);
    this.setPoints(userId, this.getPoints(userId) + points);
    return points;
  }
};

/* ═══════════════════════════════════════════════════════════
   Analytics
   ═══════════════════════════════════════════════════════════ */
const Analytics = {
  period: '7d',
  setPeriod(p){ this.period = p; Admin.refreshContent(); },
  getData(){
    const orders = DB.orders;
    let days = this.period === '30d' ? 30 : this.period === '90d' ? 90 : 7;
    const points = [];
    for(let i = days - 1; i >= 0; i--){
      const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
      const dayOrders = orders.filter(o => o.date >= dayStart.getTime() && o.date < dayEnd.getTime() && o.status !== 'cancelled');
      points.push({
        date: dayStart,
        sales: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
        orders: dayOrders.length,
        label: days <= 7 ? dayStart.toLocaleDateString(LANG==='bn'?'bn-BD':'en-US', { weekday: 'short' }) : dayStart.getDate()
      });
    }
    return points;
  },
  renderChart(){
    const data = this.getData();
    if(!data.length) return '';
    const maxSales = Math.max(...data.map(d => d.sales), 100);
    const W = 600, H = 220, PAD = 30;
    const chartW = W - PAD * 2, chartH = H - PAD * 2;
    const bars = data.map((d, i) => {
      const x = PAD + i * (chartW / data.length) + (chartW / data.length) * 0.15;
      const h = (d.sales / maxSales) * chartH;
      const y = H - PAD - h;
      const barW = (chartW / data.length) * 0.7;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="url(#barGrad)"><title>${d.label}: ${money(d.sales)}</title></rect>`;
    }).join('');
    return `
      <svg class="chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--brand)"/><stop offset="100%" stop-color="var(--brand-light)"/></linearGradient></defs>
        ${bars}
      </svg>
    `;
  },
  render(){
    const data = this.getData();
    const totalSales = data.reduce((s, d) => s + d.sales, 0);
    const totalOrders = data.reduce((s, d) => s + d.orders, 0);
    return `
      <div class="chart-wrap">
        <div class="chart-header">
          <h3><i class="fa-solid fa-chart-line"></i> ${t('salesTrend')}</h3>
          <div class="chart-period">
            <button class="${this.period==='7d'?'active':''}" onclick="Analytics.setPeriod('7d')">7D</button>
            <button class="${this.period==='30d'?'active':''}" onclick="Analytics.setPeriod('30d')">30D</button>
            <button class="${this.period==='90d'?'active':''}" onclick="Analytics.setPeriod('90d')">90D</button>
          </div>
        </div>
        ${this.renderChart()}
        <div class="chart-legend">
          <span>${t('totalSalesLabel')}: ${money(totalSales)}</span>
          <span>${t('ordersLabel')}: ${totalOrders}</span>
        </div>
      </div>
    `;
  }
};

/* ═══════════════════════════════════════════════════════════
   Tracking
   ═══════════════════════════════════════════════════════════ */
const Tracking = {
  open(){
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-truck-fast"></i> ${t('trackOrder')}</h3></div>
      <div class="modal-body">
        <p class="pr-desc">${LANG==='bn'?'আপনার অর্ডার আইডি লিখুন (যেমন: ORD-12345678)':'Enter your order ID (e.g. ORD-12345678)'}</p>
        <div class="tracking-input-group">
          <input id="trackOrderInput" placeholder="ORD-XXXXXXXX">
          <button class="btn btn-primary" onclick="Tracking.lookup()"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div id="trackingResult"></div>
      </div>
      <div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>
    `);
    setTimeout(() => {
      const inp = document.getElementById('trackOrderInput');
      if(inp){ inp.focus(); inp.addEventListener('keydown', e => { if(e.key === 'Enter') Tracking.lookup(); }); }
    }, 100);
  },
  lookup(){
    const inp = document.getElementById('trackOrderInput');
    const res = document.getElementById('trackingResult');
    if(!inp || !res) return;
    const orderId = inp.value.trim().toUpperCase();
    if(!orderId) return;
    const order = DB.orders.find(o => o.id.toUpperCase() === orderId);
    if(!order){
      res.innerHTML = `<div class="error-banner" style="margin:0"><i class="fa-solid fa-triangle-exclamation"></i><div>${t('botInvalidOrder')}</div></div>`;
      return;
    }
    const statuses = Orders.STATUS_FLOW;
    const currentIdx = statuses.indexOf(order.status);
    const isCancelled = ['cancelled', 'rejected'].includes(order.status);
    res.innerHTML = `
      <div class="tracking-result">
        <h3>${order.id}</h3>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
          <div><p style="font-size:12px;color:var(--text-dim)">${t('orderDate')}</p><p style="font-weight:700">${new Date(order.date).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US')}</p></div>
          <div><p style="font-size:12px;color:var(--text-dim)">${t('total')}</p><p style="font-weight:800;color:var(--brand)">${money(order.total)}</p></div>
        </div>
        <span class="status-badge status-${order.status}">${Orders.statusLabel(order.status)}</span>
        ${!isCancelled ? `
          <div class="order-timeline">
            ${statuses.map((s, i) => `
              <div class="timeline-step ${i < currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}">
                ${i < statuses.length - 1 ? '<div class="timeline-line"></div>' : ''}
                <div class="dot"><i class="fa-solid ${i <= currentIdx ? 'fa-check' : Orders.statusIcon(s)}"></i></div>
                <div class="label">${Orders.statusLabel(s)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
};

/* ═══════════════════════════════════════════════════════════
   Quick Actions
   ═══════════════════════════════════════════════════════════ */
const QuickActions = {
  render(){
    const u = Auth.user();
    if(!u) return '';
    return `
      <div class="quick-actions">
        <div class="quick-action" onclick="App.go('orders')"><i class="fa-solid fa-box"></i><span>${t('myOrders')}</span></div>
        <div class="quick-action" onclick="Wallet.open()"><i class="fa-solid fa-wallet"></i><span>${t('wallet')}</span></div>
        <div class="quick-action" onclick="Referral.open()"><i class="fa-solid fa-users"></i><span>${t('referral')}</span></div>
        <div class="quick-action" onclick="Tracking.open()"><i class="fa-solid fa-truck-fast"></i><span>${t('track')}</span></div>
      </div>
    `;
  }
};

/* ═══════════════════════════════════════════════════════════
   App Router
   ═══════════════════════════════════════════════════════════ */
const App = {
  route: 'home',
  _shopCat: 'all', _shopSort: 'default', _shopQ: '',
  _adminTab: 'dashboard', _pQuery: '', _uQuery: '',
  _orderFilter: { status:'all', payment:'all', search:'', from:'', to:'' },
  _selectedOrders: [],
  _orderFilterUser: 'all',
  _authTab: 'login', _authRedirect: null, _param: null,
  _otpStep: null, _pendingReg: null, _checkoutState: null,

  hideSplash(){
    const s = document.getElementById('splash');
    if(s && !s.classList.contains('hidden')){
      const bar = document.getElementById('splashBar'); if(bar) bar.style.width = '100%';
      const st = document.getElementById('splashStatus'); if(st) st.textContent = LANG==='bn'?'স্বাগতম!':'Welcome!';
      setTimeout(() => s.classList.add('hidden'), 400);
    }
  },
  rerenderIfVisible(){
    if(['home','shop','admin','orders','wishlist','profile','auth','product','checkout'].includes(this.route)) this.render();
    else { Cart.refresh(); Notifs.refresh(); this.syncUI(); }
  },
  go(route, param){
    if(['orders','profile','checkout'].includes(route) && !Auth.user()){
      Toast.show(t('loginRequired'),'warning');
      this._authRedirect = route; this.route = 'auth';
    } else if(route === 'admin' && !Auth.isAdmin()){
      Toast.show(t('adminOnly'),'warning');
      this._authRedirect = 'admin'; this.route = 'auth';
    } else {
      this.route = route;
      if(param) this._param = param;
    }
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === this.route));
    this.render();
    window.scrollTo({ top:0, behavior:'smooth' });
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
      console.error(e);
      html = `<div class="page"><div class="error-banner"><i class="fa-solid fa-triangle-exclamation"></i><div>${e.message}</div></div></div>`;
    }
    el.innerHTML = html;
    this.syncUI();
    Cart.refresh();
    Notifs.refresh();
    this.applyI18n();
    Compare.updateBar();
    this.initPageScripts();
  },
  applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n; const val = t(k);
      if(val && val !== k) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh; const val = t(k);
      if(val && val !== k) el.placeholder = val;
    });
  },
  initPageScripts(){
    document.querySelectorAll('.detail-thumb').forEach(thumb => {
      thumb.onclick = () => {
        const src = thumb.querySelector('img').src;
        const main = document.querySelector('.detail-main-img img');
        if(main) main.src = src;
        document.querySelectorAll('.detail-thumb').forEach(t2 => t2.classList.remove('active'));
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
      loginBtn.style.display = 'none';
      avatarBtn.classList.add('show');
      document.getElementById('navAvatar').src = u.avatar;
      document.getElementById('ddName').textContent = u.name;
      document.getElementById('ddEmail').textContent = u.email;
      document.getElementById('ddAdmin').style.display = u.role === 'admin' ? 'flex' : 'none';
      document.getElementById('pmName').textContent = u.name;
      document.getElementById('pmEmail').textContent = u.email;
      document.getElementById('pmAvatar').src = u.avatar;
      document.getElementById('pmRole').textContent = u.role.toUpperCase();
      document.getElementById('pmAdminSection').style.display = u.role === 'admin' ? 'block' : 'none';
      document.getElementById('pmLoginBtn').style.display = 'none';
      document.getElementById('pmLogoutBtn').style.display = 'flex';
      document.getElementById('pmOrderCount').textContent = Orders.mine().length;
      document.getElementById('pmWishCount').textContent = Wish.all().length;
      if(adminLink) adminLink.style.display = u.role === 'admin' ? 'flex' : 'none';
    } else {
      loginBtn.style.display = 'inline-flex';
      avatarBtn.classList.remove('show');
      document.getElementById('pmName').textContent = LANG==='bn'?'অতিথি':'Guest';
      document.getElementById('pmEmail').textContent = LANG==='bn'?'লগইন করুন':'Login';
      document.getElementById('pmRole').textContent = 'GUEST';
      document.getElementById('pmAdminSection').style.display = 'none';
      document.getElementById('pmLoginBtn').style.display = 'flex';
      document.getElementById('pmLogoutBtn').style.display = 'none';
      if(adminLink) adminLink.style.display = 'flex';
    }
  },
  openCart(){ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow = 'hidden'; }
};

/* ═══════════════════════════════════════════════════════════
   Pages
   ═══════════════════════════════════════════════════════════ */
const Pages = {
  home(){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    const featured = DB.products.filter(p => p.featured).slice(0, 6);
    const newArr = [...DB.products].sort((a,b) => (b.createdAt||0) - (a.createdAt||0)).slice(0, 8);
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
        <div class="section-head"><h2><i class="fa-solid fa-fire" style="color:var(--accent)"></i> ${t('featured')}</h2><span class="count-chip">${featured.length} ${t('items')}</span></div>
        <div class="product-grid">${featured.length ? featured.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${t('empty')}</h3></div>`}</div>
        <div class="section-head" style="margin-top:34px"><h2><i class="fa-solid fa-star" style="color:var(--brand)"></i> ${t('newArrivals')}</h2><button class="btn btn-outline btn-sm" onclick="App.go('shop')">${LANG==='bn'?'সব দেখুন':'View All'} <i class="fa-solid fa-arrow-right"></i></button></div>
        <div class="product-grid">${newArr.map(Components.productCard).join('')}</div>
      </div>`;
  },

  shop(){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    let list = DB.products.slice();
    if(App._shopCat && App._shopCat !== 'all') list = list.filter(p => p.cat === App._shopCat);
    if(App._shopQ){ const s = App._shopQ.toLowerCase(); list = list.filter(p => (p.name + (p.nameEn||'') + (p.desc||'')).toLowerCase().includes(s)); }
    if(App._shopSort === 'low') list.sort((a,b) => a.price - b.price);
    else if(App._shopSort === 'high') list.sort((a,b) => b.price - a.price);
    else if(App._shopSort === 'new') list.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    else if(App._shopSort === 'popular') list.sort((a,b) => (b.reviewCount||0) - (a.reviewCount||0));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-store"></i> ${t('allProducts')}</h2><span class="count-chip">${list.length} ${t('items')}</span></div>
        <div class="filter-chips">
          <div class="filter-chip ${App._shopCat==='all'?'active':''}" onclick="App._shopCat='all';App.render()">${LANG==='bn'?'সব':'All'}</div>
          ${DB.categories.map(c => `<div class="filter-chip ${App._shopCat===c?'active':''}" onclick="App._shopCat='${c}';App.render()">${c}</div>`).join('')}
        </div>
        <div class="filters-bar">
          <select onchange="App._shopSort=this.value;App.render()">
            <option value="default">${t('defaultSort')}</option>
            <option value="new" ${App._shopSort==='new'?'selected':''}>${t('newest')}</option>
            <option value="popular" ${App._shopSort==='popular'?'selected':''}>${t('popular')}</option>
            <option value="low" ${App._shopSort==='low'?'selected':''}>${t('priceLowHigh')}</option>
            <option value="high" ${App._shopSort==='high'?'selected':''}>${t('priceHighLow')}</option>
          </select>
        </div>
        <div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('empty')}</h3></div>`}</div>
      </div>`;
  },

  productDetail(id){
    if(!DB.isReady()) return loadingHTML(t('loadingData'));
    const p = DB.products.find(x => x.id === id);
    if(!p) return `<div class="page"><div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>Not found</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div></div>`;
    RecentStore.add(p.id);
    const reviews = DB.getProductReviews(p.id);
    const imgs = p.images && p.images.length ? p.images : [p.img];
    const related = DB.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const stockCls = p.stock <= 0 ? 'out' : (p.stock < 10 ? 'low' : '');
    return `
      <div class="page">
        <button class="btn btn-outline btn-sm" onclick="App.go('shop')" style="margin-bottom:14px"><i class="fa-solid fa-arrow-left"></i> ${t('shop')}</button>
        <div class="product-detail">
          <div class="detail-gallery">
            <div class="detail-main-img"><img id="mainImg" src="${imgs[0]}" onerror="this.src='https://via.placeholder.com/500'"></div>
            ${imgs.length > 1 ? `<div class="detail-thumbs">${imgs.map((u, i) => `<div class="detail-thumb ${i===0?'active':''}"><img src="${u}"></div>`).join('')}</div>` : ''}
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
              <button class="btn btn-outline btn-lg" onclick="Compare.toggle('${p.id}')"><i class="fa-solid fa-scale-balanced"></i></button>
            </div>
          </div>
        </div>
        ${related.length?`<div class="section-head" style="margin-top:26px"><h2><i class="fa-solid fa-layer-group"></i> ${t('relatedProducts')}</h2></div><div class="product-grid">${related.map(Components.productCard).join('')}</div>`:''}
      </div>`;
  },

  orders(){
    if(!Auth.user()) return this.authPage('orders');
    const mine = Orders.mine();
    const counts = {
      all: mine.length,
      active: mine.filter(o => ['pending','confirmed','processing','shipped','out_for_delivery'].includes(o.status)).length,
      delivered: mine.filter(o => o.status === 'delivered').length,
      cancelled: mine.filter(o => ['cancelled','rejected'].includes(o.status)).length
    };
    const filter = App._orderFilterUser || 'all';
    const filtered = filter === 'all' ? mine :
      filter === 'active' ? mine.filter(o => ['confirmed','processing','shipped','out_for_delivery','pending'].includes(o.status)) :
      filter === 'delivered' ? mine.filter(o => o.status === 'delivered') :
      filter === 'cancelled' ? mine.filter(o => ['cancelled','rejected'].includes(o.status)) : mine;
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-box"></i> ${t('myOrders')}</h2><span class="count-chip">${mine.length}</span></div>
        <div class="filter-chips">
          <div class="filter-chip ${filter==='all'?'active':''}" onclick="App._orderFilterUser='all';App.render()">${t('allOrders')} (${counts.all})</div>
          <div class="filter-chip ${filter==='active'?'active':''}" onclick="App._orderFilterUser='active';App.render()">${t('activeOrders')} (${counts.active})</div>
          <div class="filter-chip ${filter==='delivered'?'active':''}" onclick="App._orderFilterUser='delivered';App.render()">${t('delivered')} (${counts.delivered})</div>
          <div class="filter-chip ${filter==='cancelled'?'active':''}" onclick="App._orderFilterUser='cancelled';App.render()">${t('cancelled')} (${counts.cancelled})</div>
        </div>
        ${filtered.length ? filtered.map(o => Components.orderCard(o, 'user')).join('') :
          `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'কোনো অর্ডার নেই':'No orders yet'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}
      </div>`;
  },

  wishlist(){
    const ids = Wish.all();
    const list = DB.products.filter(p => ids.includes(p.id));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-heart" style="color:var(--danger)"></i> ${t('wishlist')}</h2><span class="count-chip">${list.length}</span></div>
        <div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>Wishlist empty</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}</div>
      </div>`;
  },

  profile(){
    const u = Auth.user();
    if(!u) return this.authPage('profile');
    const mine = Orders.mine();
    const spent = mine.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const balance = Wallet.getBalance(u.id);
    const points = Loyalty.getPoints(u.id);
    const refCode = Referral.generateCode(u.id);
    return `
      <div class="page">
        <div class="profile-header">
          <img class="profile-avatar" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'">
          <div class="profile-info">
            <h2>${u.name}</h2>
            <p><i class="fa-solid fa-envelope"></i> ${u.email}</p>
            ${u.phone?`<p><i class="fa-solid fa-phone"></i> ${u.phone}</p>`:''}
          </div>
        </div>
        ${QuickActions.render()}
        <div style="display:grid;gap:14px;margin-bottom:20px">
          <div class="wallet-card">
            <div class="wallet-card-inner">
              <label>${t('walletBalance')}</label>
              <span class="wallet-amount">${money(balance)}</span>
              <div class="wallet-actions">
                <button class="btn btn-sm btn-solid" onclick="Wallet.open()"><i class="fa-solid fa-wallet"></i> ${t('wallet')}</button>
                <button class="btn btn-sm" onclick="Wallet.topUpPrompt()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button>
              </div>
            </div>
          </div>
          <div class="loyalty-card">
            <div>
              <div style="font-size:12px;opacity:.9;font-weight:700;text-transform:uppercase">${t('loyalty')}</div>
              <div class="loyalty-points">${points}</div>
              <div style="font-size:11.5px;opacity:.85;margin-top:4px">≈ ${money(Math.floor(points/100))}</div>
            </div>
            <i class="fa-solid fa-gift" style="font-size:42px;opacity:.4"></i>
          </div>
          <div class="referral-card">
            <div style="font-size:13px;font-weight:700;margin-bottom:6px">${t('inviteFriends')}</div>
            <div class="referral-code">
              <span>${refCode}</span>
              <button onclick="Referral.copyCode('${refCode}')"><i class="fa-solid fa-copy"></i></button>
            </div>
            <button class="btn btn-block btn-sm" style="background:rgba(255,255,255,.2);color:#fff;border:none;margin-top:8px" onclick="Referral.open()">
              <i class="fa-solid fa-users"></i> ${t('referral')}
            </button>
          </div>
        </div>
        <div class="dash-grid">
          <div class="dash-card clickable" onclick="App.go('orders')"><i class="fa-solid fa-box"></i><h3>${mine.length}</h3><p>${t('totalOrders')}</p></div>
          <div class="dash-card clickable" onclick="App.go('wishlist')"><i class="fa-solid fa-heart"></i><h3>${Wish.all().length}</h3><p>${t('wishlist')}</p></div>
          <div class="dash-card"><i class="fa-solid fa-wallet"></i><h3>${money(spent)}</h3><p>Total Spent</p></div>
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

  auth(){ return this.authPage(App._authRedirect || 'home'); },

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
            <div class="admin-header-title"><h1>${Admin.titles[tab]||t('dashboard')}</h1><p>EcoShop Pro MAX v11.0</p></div>
            <div class="admin-header-actions">
              <button class="btn btn-outline btn-sm" onclick="App.go('home')"><i class="fa-solid fa-store"></i></button>
              <button class="btn btn-primary btn-sm" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i></button>
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
    if(s.enableCOD) methods.push({ id:'cod', label:t('cod'), icon:'fa-money-bill-wave', cls:'cod' });
    if(s.enableBkash) methods.push({ id:'bkash', label:t('bkash'), icon:'fa-mobile-screen', cls:'bkash' });
    if(s.enableNagad) methods.push({ id:'nagad', label:t('nagad'), icon:'fa-mobile-screen', cls:'nagad' });
    if(s.enableRocket) methods.push({ id:'rocket', label:t('rocket'), icon:'fa-mobile-screen', cls:'rocket' });
    const zone = App._checkoutState?.zone || 'inside';
    const pay = App._checkoutState?.payment || 'cod';
    const ship = zone === 'inside' ? (s.shippingInsideDhaka||100) : (s.shippingOutsideDhaka||120);
    return `
      <div class="page" style="max-width:760px">
        <div class="section-head"><h2><i class="fa-solid fa-credit-card"></i> ${t('checkout')}</h2></div>
        <div class="admin-card">
          <div class="admin-card-head"><h3>${t('address')}</h3></div>
          <div class="form-group"><label>${t('fullName')}</label><input id="coName" value="${u.name}"></div>
          <div class="form-row">
            <div class="form-group"><label>${t('phone')}</label><input id="coPhone" value="${u.phone||''}"></div>
            <div class="form-group"><label>${t('city')}</label><input id="coCity" value="ঢাকা"></div>
          </div>
          <div class="form-group"><label>${t('address')}</label><textarea id="coAddr" rows="3"></textarea></div>
        </div>
        <div class="admin-card">
          <div class="admin-card-head"><h3>${t('deliveryZone')}</h3></div>
          <div class="delivery-zones">
            <div class="delivery-zone ${zone==='inside'?'active':''}" onclick="Checkout.setZone('inside')">
              <b>${t('insideDhaka')}</b><div class="zone-price">${money(s.shippingInsideDhaka||100)}</div>
            </div>
            <div class="delivery-zone ${zone==='outside'?'active':''}" onclick="Checkout.setZone('outside')">
              <b>${t('outsideDhaka')}</b><div class="zone-price">${money(s.shippingOutsideDhaka||120)}</div>
            </div>
          </div>
        </div>
        <div class="admin-card">
          <div class="admin-card-head"><h3>${t('selectPayment')}</h3></div>
          <div class="payment-methods">
            ${methods.map(m => `<div class="payment-method ${pay===m.id?'active':''}" onclick="Checkout.setPayment('${m.id}')"><div class="pm-logo ${m.cls}"><i class="fa-solid ${m.icon}"></i></div><b>${m.label}</b></div>`).join('')}
          </div>
          <div id="paymentDetail">${Checkout.renderPaymentDetail(pay)}</div>
        </div>
        <div class="admin-card">
          <div class="cart-summary-row"><span>${t('subtotal')}</span><span>${money(Cart.subtotal())}</span></div>
          <div class="cart-summary-row"><span>${t('deliveryCharge')}</span><span>${money(ship)}</span></div>
          <div class="cart-summary-row total"><span>${t('total')}</span><span>${money(Cart.subtotal() + ship)}</span></div>
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:14px" id="coSubmit" onclick="Checkout.place()"><i class="fa-solid fa-check"></i> ${t('confirmOrder')}</button>
        </div>
      </div>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   Checkout
   ═══════════════════════════════════════════════════════════ */
const Checkout = {
  ensureState(){
    if(!App._checkoutState) App._checkoutState = { zone:'inside', payment:'cod', couponDiscount:0, couponCode:null };
    return App._checkoutState;
  },
  setZone(zone){
    const s = this.ensureState();
    s.zone = zone;
    App.render();
  },
  setPayment(method){
    const s = this.ensureState();
    s.payment = method;
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    const detail = document.getElementById('paymentDetail');
    if(detail) detail.innerHTML = this.renderPaymentDetail(method);
    this.bindScreenshotUpload();
  },
  renderPaymentDetail(method){
    const s = DB.settings;
    if(method === 'cod') return `<div class="payment-info" style="background:rgba(16,185,129,.08)"><h4><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> ${t('cod')}</h4><p style="font-size:13px;color:var(--text-dim)">${LANG==='bn'?'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।':'Pay when you receive.'}</p></div>`;
    const num = method === 'bkash' ? s.bkashNumber : method === 'nagad' ? s.nagadNumber : s.rocketNumber;
    const brandName = method === 'bkash' ? 'বিকাশ' : method === 'nagad' ? 'নগদ' : 'রকেট';
    return `
      <div class="payment-info">
        <h4><span class="pm-brand ${method}">${brandName}</span></h4>
        <div class="copy-number-box">
          <div><small style="font-size:11px;color:var(--text-dim)">${t('paymentNumber')}</small><br><span class="number">${num}</span></div>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${num}').then(()=>Toast.show('${t('numberCopied')}','success'))"><i class="fa-solid fa-copy"></i> ${t('copy')}</button>
        </div>
        <div class="txn-input-group">
          <label>${t('txnId')} *</label>
          <input id="txnIdInput" placeholder="${t('txnIdPlaceholder')}">
        </div>
        <div class="txn-input-group">
          <label>${t('screenshot')} ${t('screenshotOptional')}</label>
          <div class="img-upload" style="margin-top:10px">
            <div class="img-preview" id="ssPreview"><i class="fa-solid fa-image"></i></div>
            <div class="upload-btn-wrap">
              <button type="button" class="upload-btn" id="ssUploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> ${t('uploadScreenshot')}</button>
              <input type="file" id="ssFile" accept="image/*" style="display:none">
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
    if(!btn || btn._bound) return;
    btn._bound = true;
    btn.onclick = () => file.click();
    file.onchange = async () => {
      const f = file.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = e => prev.innerHTML = `<img src="${e.target.result}">`;
      r.readAsDataURL(f);
      try {
        const res = await ImageUpload.upload(f);
        hidden.value = res.url;
        prev.innerHTML = `<img src="${res.url}">`;
        Toast.show('Uploaded', 'success');
      } catch(e){ Toast.show('Failed', 'error'); }
    };
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
    const ship = s.zone === 'inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const subtotal = Cart.subtotal();
    const total = subtotal + ship;
    const items = Cart.items().map(i => {
      const p = DB.products.find(x => x.id === i.id);
      return { id:i.id, name:p?.name||'—', price:p?.price||0, qty:i.qty };
    });
    const btn = document.getElementById('coSubmit');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try {
      const order = await Orders.create({
        customer: { name, phone, city, address }, items, subtotal,
        deliveryCharge: ship, deliveryZone: s.zone, discount: 0, total,
        paymentMethod: method, paymentNumber: method==='cod'?null:DB.settings[method+'Number'], txnId, screenshot
      });
      if(Auth.user()) Loyalty.addFromOrder(Auth.user().id, total);
      App._checkoutState = null;
      Toast.show(method === 'cod' ? t('orderSuccessCOD') : t('orderSuccessPaid'), 'success', 4000);
      setTimeout(() => {
        Modal.open(`
          <div style="padding:28px 24px;text-align:center">
            <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;margin:0 auto 18px">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <h3 style="font-size:19px;font-weight:800;margin-bottom:8px">${t('whatsappOrder')}</h3>
            <p style="font-size:13.5px;color:var(--text-dim);line-height:1.6;margin-bottom:22px">${t('whatsappDesc')}</p>
            <button class="btn btn-whatsapp btn-block" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${order.id}'), '${phone}');Modal.close();App.go('orders')">
              <i class="fa-brands fa-whatsapp"></i> ${t('whatsappSend')}
            </button>
            <button class="btn btn-outline btn-block" style="margin-top:8px" onclick="Modal.close();App.go('orders')">${t('close')}</button>
          </div>
        `, 'sm');
      }, 500);
    } catch(e){
      Toast.show('Failed: ' + e.message, 'error');
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t('confirmOrder')}`;
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════════ */
const Components = {
  productCard(p){
    const name = LANG === 'bn' ? p.name : (p.nameEn || p.name);
    const stockCls = p.stock <= 0 ? 'out' : (p.stock < 10 ? 'low' : '');
    const stockTxt = p.stock <= 0 ? t('outOfStock') : t('inStock');
    const isNew = Date.now() - (p.createdAt||0) < 7*24*60*60*1000;
    let badge = '';
    if(p.discount) badge = `<span class="product-badge">-${p.discount}%</span>`;
    else if(isNew) badge = `<span class="product-badge new">NEW</span>`;
    const inCompare = Compare.has(p.id);
    return `
      <div class="product-card" onclick="App.go('product','${p.id}')">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
          ${badge}
          <span class="stock-badge ${stockCls}">${stockTxt}</span>
          <button class="wish-btn ${Wish.has(p.id)?'active':''}" onclick="event.stopPropagation();Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart"></i></button>
          <button class="product-compare-btn ${inCompare?'active':''}" onclick="event.stopPropagation();Compare.toggle('${p.id}')"><i class="fa-solid fa-scale-balanced"></i></button>
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

  orderCard(o, mode = 'user'){
    const statusFlow = Orders.STATUS_FLOW;
    const idx = statusFlow.indexOf(o.status);
    const isCancelled = ['cancelled', 'rejected'].includes(o.status);
    const isBn = LANG === 'bn';
    return `
      <div class="order-card" data-order-id="${o.id}">
        <div class="order-card-head">
          <div class="order-id-block">
            <h4><i class="fa-solid fa-receipt" style="color:var(--brand)"></i> ${o.id}</h4>
            <p><i class="fa-regular fa-calendar"></i> ${new Date(o.date).toLocaleString(isBn ? 'bn-BD' : 'en-US')} • ${(o.items || []).length} ${t('items')}</p>
          </div>
          <div class="order-meta">
            <span class="order-amount">${money(o.total)}</span>
            <span class="status-badge status-${o.status}">
              <i class="fa-solid ${Orders.statusIcon(o.status)}"></i>
              ${Orders.statusLabel(o.status)}
            </span>
          </div>
        </div>
        ${!isCancelled ? `
          <div class="order-timeline">
            ${statusFlow.map((s, i) => `
              <div class="timeline-step ${i < idx ? 'done' : ''} ${i === idx ? 'current' : ''}">
                ${i < statusFlow.length - 1 ? '<div class="timeline-line"></div>' : ''}
                <div class="dot"><i class="fa-solid ${i <= idx ? 'fa-check' : Orders.statusIcon(s)}"></i></div>
                <div class="label">${Orders.statusLabel(s)}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:rgba(239,68,68,.08);border-left:3px solid var(--danger);padding:10px 14px;border-radius:8px;margin:10px 0">
            <b style="color:var(--danger);font-size:13px"><i class="fa-solid fa-ban"></i> ${Orders.statusLabel(o.status)}</b>
            ${(o.history || []).slice(-1)[0]?.comment ? `<p style="font-size:12.5px;color:var(--text-dim);margin-top:4px">${(o.history || []).slice(-1)[0].comment}</p>` : ''}
          </div>
        `}
        <div class="invoice-actions" style="margin-top:14px">
          <button class="btn btn-outline btn-sm" onclick="Orders.detail('${o.id}')">
            <i class="fa-solid fa-eye"></i> ${isBn ? 'বিস্তারিত' : 'Details'}
          </button>
          <button class="btn btn-pdf btn-sm" onclick="PDFInvoice.generate('${o.id}', '${LANG}')">
            <i class="fa-solid fa-file-pdf"></i> ${isBn ? 'ইনভয়েস' : 'Invoice'}
          </button>
          <button class="btn btn-whatsapp btn-sm" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </button>
          ${['delivered','cancelled','rejected'].includes(o.status) ? `
            <button class="btn btn-outline btn-sm" onclick="Orders.reorder('${o.id}')">
              <i class="fa-solid fa-rotate-right"></i> ${t('reorder')}
            </button>
          ` : ''}
        </div>
      </div>`;
  },

  adminSidebar(tab){
    const pending = DB.orders.filter(o => o.status === 'pending').length;
    const items = [
      { sec: LANG==='bn'?'মেইন':'Main', list: [
        { id:'dashboard', icon:'fa-chart-line', label:t('dashboard') },
        { id:'products', icon:'fa-box', label:t('products') },
        { id:'orders', icon:'fa-receipt', label:t('ordersTab'), badge: pending },
        { id:'users', icon:'fa-users', label:t('users') }
      ]},
      { sec: LANG==='bn'?'অতিরিক্ত':'Extras', list: [
        { id:'categories', icon:'fa-tags', label:t('categories') },
        { id:'coupons', icon:'fa-ticket', label:t('coupons') },
        { id:'settings', icon:'fa-gear', label:t('settings') }
      ]}
    ];
    return `<aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-brand">
        <div class="logo-icon"><i class="fa-solid fa-leaf"></i></div>
        <span class="logo-text">EcoShop<span style="color:var(--brand)">Pro</span></span>
        <span class="admin-pill">ADMIN</span>
      </div>
      <nav class="admin-nav">
        ${items.map(g => `
          <div class="nav-section">
            <div class="nav-section-title">${g.sec}</div>
            ${g.list.map(i => `<a class="${tab===i.id?'active':''}" onclick="Admin.switchTab('${i.id}')">
              <i class="fa-solid ${i.icon}"></i> ${i.label}
              ${i.badge ? `<span class="nav-count">${i.badge}</span>` : ''}
            </a>`).join('')}
          </div>
        `).join('')}
      </nav>
      <div class="admin-footer">
        <button class="admin-exit" onclick="App.go('home')"><i class="fa-solid fa-arrow-left"></i> Back</button>
      </div>
    </aside>`;
  }
};

/* ═══════════════════════════════════════════════════════════
   Admin
   ═══════════════════════════════════════════════════════════ */
const Admin = {
  get titles(){
    return { dashboard:t('dashboard'), products:t('products'), orders:t('ordersTab'), users:t('users'), categories:t('categories'), coupons:t('coupons'), settings:t('settings') };
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
    } catch(e){ return `<div class="error-banner">${e.message}</div>`; }
  },

  dashboard(){
    const orders = DB.orders, users = DB.users, prods = DB.products;
    const sales = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total||0), 0);
    const counts = Orders.counts();
    const lowStock = prods.filter(p => p.stock < 10).length;
    return `
      ${Analytics.render()}
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div><div class="stat-info"><p>${t('totalSales')}</p><h3>${money(sales)}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-cart-shopping"></i></div><div class="stat-info"><p>${t('totalOrders')}</p><h3>${orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div class="stat-info"><p>${t('totalUsers')}</p><h3>${users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-box"></i></div><div class="stat-info"><p>${t('totalProducts')}</p><h3>${prods.length}</h3></div></div>
      </div>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${t('pendingOrders')}</p><h3>${counts.pending}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-info"><p>${t('lowStock')}</p><h3>${lowStock}</h3></div></div>
        <div class="stat-card"><div class="stat-icon info"><i class="fa-solid fa-user-check"></i></div><div class="stat-info"><p>${t('activeUsers')}</p><h3>${users.filter(u => !u.blocked).length}</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> ${t('recentOrders')}</h3><button class="btn btn-outline btn-sm" onclick="Admin.switchTab('orders')">${LANG==='bn'?'সব':'All'}</button></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>${t('orderId')}</th><th>${t('customer')}</th><th>${t('total')}</th><th>${t('paymentMethod')}</th><th>${t('orderStatus')}</th><th></th></tr></thead>
            <tbody>${orders.slice(0,6).map(o => `<tr>
              <td><b>${o.id}</b></td>
              <td>${o.customer?.name||'—'}</td>
              <td>${money(o.total)}</td>
              <td><span class="payment-badge ${o.paymentMethod||'cod'}">${(o.paymentMethod||'cod').toUpperCase()}</span></td>
              <td><span class="status-badge status-${o.status}">${Orders.statusLabel(o.status)}</span></td>
              <td><div class="actions">
                ${o.status === 'pending' ? `<button class="icon-btn-sm success" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>` : ''}
                <button class="icon-btn-sm" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button>
                <button class="icon-btn-sm" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button>
                <button class="icon-btn-sm" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer?.phone||''}')"><i class="fa-brands fa-whatsapp"></i></button>
              </div></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  },

  products(){
    const q = App._pQuery || '';
    const list = DB.products.filter(p => !q || (p.name + (p.nameEn||'')).toLowerCase().includes(q.toLowerCase()));
    return `
      <div class="admin-toolbar">
        <input placeholder="${t('productSearch')}" value="${q}" oninput="App._pQuery=this.value;clearTimeout(window._pq);window._pq=setTimeout(()=>Admin.refreshContent(),250)">
        <button class="btn btn-primary" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> ${t('addProduct')}</button>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>${t('totalProducts')} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th></th><th>${t('productName')}</th><th>${t('category')}</th><th>${t('price')}</th><th>${t('stock')}</th><th></th></tr></thead>
            <tbody>${list.map(p => `<tr>
              <td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"></td>
              <td><b>${p.name}</b><br><small style="color:var(--text-dim)">${p.nameEn||''}</small></td>
              <td><span class="chip">${p.cat}</span></td>
              <td>${money(p.price)}</td>
              <td>${p.stock<=0?`<span class="chip blocked">${t('outOfStock')}</span>`:`<span class="chip active-status">${p.stock}</span>`}</td>
              <td><div class="actions">
                <button class="icon-btn-sm" onclick="Admin.openProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn-sm danger" onclick="Admin.deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
              </div></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  },

  openProductModal(id){
    const p = id ? DB.products.find(x => x.id === id) : { name:'', nameEn:'', cat:'', price:'', oldPrice:'', discount:0, stock:'', img:'', desc:'', tags:[], featured:false };
    const cats = DB.categories.length ? DB.categories : ['ইলেকট্রনিকস','গ্যাজেট','ফ্যাশন'];
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3>${id?t('editProduct'):t('addProduct')}</h3></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>${t('productName')} *</label><input id="pName" value="${p.name}"></div>
          <div class="form-group"><label>${t('productNameEn')}</label><input id="pNameEn" value="${p.nameEn||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t('category')}</label><select id="pCat">${cats.map(c => `<option ${p.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>
          <div class="form-group"><label>Category EN</label><input id="pCatEn" value="${p.catEn||''}"></div>
        </div>
        <div class="form-group"><label>${t('description')}</label><textarea id="pDesc" rows="3">${p.desc||''}</textarea></div>
        <div class="form-group"><label>${t('images')}</label>
          <div class="img-upload">
            <div class="img-preview" id="imgPreview">${p.img?`<img src="${p.img}">`:`<i class="fa-solid fa-image"></i>`}</div>
            <div class="upload-btn-wrap">
              <button type="button" class="upload-btn" id="uploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Upload</button>
              <input type="file" id="imgFile" accept="image/*" style="display:none">
            </div>
          </div>
          <input type="hidden" id="pImg" value="${p.img||''}">
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t('price')} *</label><input id="pPrice" type="number" value="${p.price}"></div>
          <div class="form-group"><label>${t('oldPrice')}</label><input id="pOld" type="number" value="${p.oldPrice||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>${t('discountPercent')}</label><input id="pDisc" type="number" value="${p.discount||0}"></div>
          <div class="form-group"><label>${t('stock')}</label><input id="pStock" type="number" value="${p.stock}"></div>
        </div>
        <div class="form-group"><label style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" id="pFeatured" ${p.featured?'checked':''} style="width:auto"><span>${t('featured_product')}</span></label></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" id="pSaveBtn" onclick="Admin.saveProduct('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `);
    const btn = document.getElementById('uploadBtn');
    const file = document.getElementById('imgFile');
    const prev = document.getElementById('imgPreview');
    const hidden = document.getElementById('pImg');
    if(btn){
      btn.onclick = () => file.click();
      file.onchange = async () => {
        const f = file.files[0]; if(!f) return;
        const r = new FileReader();
        r.onload = e => prev.innerHTML = `<img src="${e.target.result}">`;
        r.readAsDataURL(f);
        btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner"></i>';
        try {
          const res = await ImageUpload.upload(f);
          hidden.value = res.url;
          prev.innerHTML = `<img src="${res.url}">`;
          Toast.show('Uploaded','success');
        } catch(e){ Toast.show('Failed','error'); }
        btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Upload';
      };
    }
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
      img: document.getElementById('pImg').value.trim() || 'https://via.placeholder.com/300',
      desc: document.getElementById('pDesc').value.trim(),
      featured: document.getElementById('pFeatured').checked
    };
    if(!data.name || !data.price){ Toast.show(t('fillAllFields'),'error'); return; }
    try { await DB.saveProduct(data); Modal.close(); Toast.show(t('saveSuccess'),'success'); }
    catch(e){ Toast.show('Failed','error'); }
  },
  deleteProduct(id){ Modal.confirm(t('deleteConfirm'), async () => { try { await DB.deleteProduct(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },

  /* ═══════ ORDERS — Advanced ═══════ */
  orders(){
    App._orderFilter = App._orderFilter || { status:'all', payment:'all', search:'', from:'', to:'' };
    App._selectedOrders = App._selectedOrders || [];
    const f = App._orderFilter;
    const counts = Orders.counts();
    let list = DB.orders.slice();
    if(f.status !== 'all') list = list.filter(o => o.status === f.status);
    if(f.payment !== 'all') list = list.filter(o => (o.paymentMethod || 'cod') === f.payment);
    if(f.search){
      const s = f.search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(s) ||
        (o.customer?.name || '').toLowerCase().includes(s) ||
        (o.customer?.phone || '').includes(f.search)
      );
    }
    if(f.from){ const from = new Date(f.from).getTime(); list = list.filter(o => o.date >= from); }
    if(f.to){ const to = new Date(f.to).getTime() + 86400000; list = list.filter(o => o.date <= to); }
    const selected = App._selectedOrders;
    const isBn = LANG === 'bn';
    return `
      <div class="stat-grid">
        <div class="stat-card" onclick="App._orderFilter.status='pending';Admin.refreshContent()" style="cursor:pointer">
          <div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div>
          <div class="stat-info"><p>${Orders.statusLabel('pending')}</p><h3>${counts.pending}</h3></div>
        </div>
        <div class="stat-card" onclick="App._orderFilter.status='confirmed';Admin.refreshContent()" style="cursor:pointer">
          <div class="stat-icon brand"><i class="fa-solid fa-check-circle"></i></div>
          <div class="stat-info"><p>${Orders.statusLabel('confirmed')}</p><h3>${counts.confirmed}</h3></div>
        </div>
        <div class="stat-card" onclick="App._orderFilter.status='shipped';Admin.refreshContent()" style="cursor:pointer">
          <div class="stat-icon info"><i class="fa-solid fa-truck"></i></div>
          <div class="stat-info"><p>${Orders.statusLabel('shipped')}</p><h3>${counts.shipped}</h3></div>
        </div>
        <div class="stat-card" onclick="App._orderFilter.status='delivered';Admin.refreshContent()" style="cursor:pointer">
          <div class="stat-icon success"><i class="fa-solid fa-circle-check"></i></div>
          <div class="stat-info"><p>${Orders.statusLabel('delivered')}</p><h3>${counts.delivered}</h3></div>
        </div>
      </div>

      <div class="order-filter-panel">
        <div class="order-filter-grid">
          <div>
            <label>${t('filterStatus')}</label>
            <select onchange="App._orderFilter.status=this.value;Admin.refreshContent()">
              <option value="all" ${f.status==='all'?'selected':''}>${isBn?'সব':'All'}</option>
              ${Orders.STATUS_ALL.map(s => `<option value="${s}" ${f.status===s?'selected':''}>${Orders.statusLabel(s)} (${counts[s]||0})</option>`).join('')}
            </select>
          </div>
          <div>
            <label>${t('filterPayment')}</label>
            <select onchange="App._orderFilter.payment=this.value;Admin.refreshContent()">
              <option value="all" ${f.payment==='all'?'selected':''}>${isBn?'সব':'All'}</option>
              <option value="cod" ${f.payment==='cod'?'selected':''}>COD</option>
              <option value="bkash" ${f.payment==='bkash'?'selected':''}>bKash</option>
              <option value="nagad" ${f.payment==='nagad'?'selected':''}>Nagad</option>
              <option value="rocket" ${f.payment==='rocket'?'selected':''}>Rocket</option>
            </select>
          </div>
          <div>
            <label>${t('filterFrom')}</label>
            <input type="date" value="${f.from}" onchange="App._orderFilter.from=this.value;Admin.refreshContent()">
          </div>
          <div>
            <label>${t('filterTo')}</label>
            <input type="date" value="${f.to}" onchange="App._orderFilter.to=this.value;Admin.refreshContent()">
          </div>
          <div>
            <label>${t('filterSearch')}</label>
            <input placeholder="${isBn?'অর্ডার ID / নাম / ফোন':'Order ID / name / phone'}" value="${f.search}" oninput="App._orderFilter.search=this.value;clearTimeout(window._os);window._os=setTimeout(()=>Admin.refreshContent(),300)">
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
          <button class="btn btn-outline btn-sm" onclick="App._orderFilter={status:'all',payment:'all',search:'',from:'',to:''};Admin.refreshContent()">
            <i class="fa-solid fa-rotate-left"></i> ${t('filterReset')}
          </button>
          <button class="btn btn-primary btn-sm" onclick="Admin.bulkPrint()">
            <i class="fa-solid fa-print"></i> ${t('bulkPrint')} (${list.length})
          </button>
        </div>
      </div>

      ${selected.length ? `
        <div class="bulk-bar">
          <span><i class="fa-solid fa-check-square"></i> ${selected.length} ${t('bulkSelected')}</span>
          <button class="btn btn-sm btn-success" onclick="Admin.bulkConfirm()"><i class="fa-solid fa-check"></i> ${t('bulkConfirm')}</button>
          <button class="btn btn-sm btn-warning" onclick="Admin.bulkStatus('processing')"><i class="fa-solid fa-gears"></i> ${Orders.statusLabel('processing')}</button>
          <button class="btn btn-sm" style="background:var(--info);color:#fff" onclick="Admin.bulkStatus('shipped')"><i class="fa-solid fa-truck"></i> ${Orders.statusLabel('shipped')}</button>
          <button class="btn btn-sm btn-primary" onclick="Admin.bulkStatus('delivered')"><i class="fa-solid fa-circle-check"></i> ${Orders.statusLabel('delivered')}</button>
          <button class="btn btn-sm btn-danger" onclick="Admin.bulkCancel()"><i class="fa-solid fa-ban"></i> ${t('bulkCancel')}</button>
          <button class="btn btn-sm btn-outline" onclick="App._selectedOrders=[];Admin.refreshContent()">${t('cancel')}</button>
        </div>
      ` : ''}

      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-list"></i> ${isBn?'অর্ডার লিস্ট':'Order List'} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:40px"><input type="checkbox" class="bulk-checkbox" onchange="Admin.toggleAllOrders(this.checked, ${JSON.stringify(list.map(o=>o.id))})"></th>
                <th>${t('orderId')}</th>
                <th>${t('customer')}</th>
                <th>${t('total')}</th>
                <th>${t('paymentMethod')}</th>
                <th>${t('orderStatus')}</th>
                <th>${isBn?'অ্যাকশন':'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              ${list.length ? list.map(o => `
                <tr style="${o.status === 'pending' ? 'background:rgba(245,158,11,.05)' : ''}">
                  <td><input type="checkbox" class="bulk-checkbox" data-order="${o.id}" ${selected.includes(o.id)?'checked':''} onchange="Admin.toggleOrderSelect('${o.id}', this.checked)"></td>
                  <td><b style="font-family:var(--font-en)">${o.id}</b><br><small style="color:var(--text-dim);font-size:11px">${new Date(o.date).toLocaleDateString(isBn?'bn-BD':'en-US')}</small></td>
                  <td><b>${o.customer?.name||'—'}</b><br><small style="color:var(--text-dim);font-size:11px">${o.customer?.phone||''}</small></td>
                  <td><b style="font-family:var(--font-en)">${money(o.total)}</b><br><small style="color:var(--text-dim);font-size:11px">${(o.items||[]).length} items</small></td>
                  <td><span class="payment-badge ${o.paymentMethod||'cod'}">${(o.paymentMethod||'cod').toUpperCase()}</span>${o.txnId?`<br><small style="font-size:10.5px;color:var(--text-dim)">${o.txnId.slice(0,12)}</small>`:''}</td>
                  <td><span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.statusIcon(o.status)}"></i> ${Orders.statusLabel(o.status)}</span></td>
                  <td><div class="order-quick-actions">
                    ${o.status === 'pending' ? `<button class="icon-btn-sm success" title="Confirm" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>` : ''}
                    <button class="icon-btn-sm info" title="View" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button>
                    <button class="icon-btn-sm" title="PDF" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button>
                    <button class="icon-btn-sm" title="WhatsApp" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer?.phone||''}')"><i class="fa-brands fa-whatsapp"></i></button>
                    ${!['delivered','cancelled','rejected'].includes(o.status) ? `<button class="icon-btn-sm danger" title="Cancel" onclick="Admin.quickCancel('${o.id}')"><i class="fa-solid fa-ban"></i></button>` : ''}
                  </div></td>
                </tr>
              `).join('') : `<tr><td colspan="7" class="muted">${t('noData')}</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  },

  openOrderModal(id){
    const o = DB.orders.find(x => x.id === id);
    if(!o) return;
    const isBn = LANG === 'bn';
    const statusFlow = Orders.STATUS_FLOW;
    const idx = statusFlow.indexOf(o.status);
    const isCancelled = ['cancelled', 'rejected'].includes(o.status);
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div>
      <div class="modal-body">
        ${!isCancelled ? `
          <div class="order-timeline" style="margin-bottom:20px">
            ${statusFlow.map((s, i) => `
              <div class="timeline-step ${i < idx ? 'done' : ''} ${i === idx ? 'current' : ''}">
                ${i < statusFlow.length - 1 ? '<div class="timeline-line"></div>' : ''}
                <div class="dot"><i class="fa-solid ${i <= idx ? 'fa-check' : Orders.statusIcon(s)}"></i></div>
                <div class="label">${Orders.statusLabel(s)}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background:rgba(239,68,68,.08);border-left:3px solid var(--danger);padding:12px 16px;border-radius:10px;margin-bottom:16px">
            <b style="color:var(--danger)"><i class="fa-solid fa-ban"></i> ${Orders.statusLabel(o.status)}</b>
            ${(o.history||[]).slice(-1)[0]?.comment ? `<p style="font-size:12.5px;margin-top:4px;color:var(--text-dim)">${(o.history||[]).slice(-1)[0].comment}</p>` : ''}
          </div>
        `}

        <div class="admin-card" style="margin-bottom:14px;padding:14px">
          <h5 style="font-size:12px;font-weight:800;color:var(--text-dim);text-transform:uppercase;margin-bottom:10px"><i class="fa-solid fa-exchange"></i> ${t('changeStatus')}</h5>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            ${Orders.STATUS_ALL.map(s => `
              <button class="chip ${o.status===s?'active-status':''}" style="cursor:pointer;border:${o.status===s?'2px solid var(--brand)':'1px solid var(--border)'};background:${o.status===s?'var(--brand-50)':'var(--surface)'}" onclick="Admin.setOrderStatus('${o.id}', '${s}')">
                <i class="fa-solid ${Orders.statusIcon(s)}"></i> ${Orders.statusLabel(s)}
              </button>
            `).join('')}
          </div>
          <div class="form-group" style="margin:0">
            <label>${isBn?'কমেন্ট (ঐচ্ছিক)':'Comment (optional)'}</label>
            <input id="aoComment" placeholder="${isBn?'কাস্টমারের জন্য কমেন্ট...':'Comment for customer...'}">
          </div>
        </div>

        <div class="order-detail-grid">
          <div class="order-detail-section">
            <h5><i class="fa-solid fa-user"></i> ${t('customerInfo')}</h5>
            <div class="detail-row"><span>${isBn?'নাম':'Name'}</span><span>${o.customer.name}</span></div>
            <div class="detail-row"><span>${isBn?'ফোন':'Phone'}</span><span>${o.customer.phone}</span></div>
            <div class="detail-row"><span>${isBn?'ঠিকানা':'Address'}</span><span>${o.customer.address}${o.customer.city?', '+o.customer.city:''}</span></div>
          </div>

          <div class="order-detail-section">
            <h5><i class="fa-solid fa-credit-card"></i> ${t('paymentDetails')}</h5>
            <div class="detail-row"><span>${isBn?'পদ্ধতি':'Method'}</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>
            <div class="detail-row"><span>Status</span><span>${o.paymentStatus||'—'}</span></div>
            ${o.txnId?`<div class="detail-row"><span>Txn ID</span><span>${o.txnId}</span></div>`:''}
            ${o.screenshot?`<div style="margin-top:10px"><img src="${o.screenshot}" style="max-width:100%;border-radius:10px;cursor:pointer" onclick="window.open('${o.screenshot}','_blank')"></div>`:''}
          </div>

          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-money-bill"></i> ${t('amounts')}</h5>
            <div class="form-row">
              <div class="form-group" style="margin:0"><label>${t('deliveryCharge')}</label><input type="number" id="aoDelivery" value="${o.deliveryCharge||0}" min="0"></div>
              <div class="form-group" style="margin:0"><label>${t('discount')}</label><input type="number" id="aoDiscount" value="${o.discount||0}" min="0"></div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px">
              <button class="btn btn-outline btn-sm" onclick="Admin.recalcOrder('${o.id}')"><i class="fa-solid fa-calculator"></i> ${t('recalculate')}</button>
              <span style="font-weight:800;font-size:16px;color:var(--brand)">${t('total')}: <span id="aoTotal">${money(o.total)}</span></span>
            </div>
          </div>

          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-truck-fast"></i> ${isBn?'ডেলিভারি তথ্য':'Delivery Info'}</h5>
            <div class="form-row">
              <div class="form-group" style="margin:0"><label>${t('courier')}</label><input id="aoCourier" value="${o.courier||''}" placeholder="Pathao / Steadfast"></div>
              <div class="form-group" style="margin:0"><label>${t('trackingNumber')}</label><input id="aoTracking" value="${o.trackingNumber||''}"></div>
            </div>
            <div class="form-group" style="margin-top:10px"><label>${t('eta')}</label><input id="aoEta" value="${o.eta||''}" placeholder="${isBn?'২-৩ দিন':'2-3 days'}"></div>
          </div>

          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-box"></i> ${t('orderItems')}</h5>
            <div class="order-items-list">
              ${(o.items||[]).map(it => {
                const p = DB.products.find(x => x.id === it.id);
                return `<div class="order-item-row">
                  <img src="${p?p.img:''}" onerror="this.src='https://via.placeholder.com/48'">
                  <div class="order-item-info"><h6>${it.name}</h6><p>${it.qty} × ${money(it.price)}</p></div>
                  <span class="order-item-price">${money(it.qty * it.price)}</span>
                </div>`;
              }).join('')}
            </div>
          </div>

          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-lock"></i> ${t('internalNotes')}</h5>
            ${(o.internalNotes||[]).length ? `<div style="margin-bottom:10px">
              ${(o.internalNotes||[]).slice().reverse().map(n => `
                <div style="background:var(--surface);padding:8px 12px;border-radius:8px;margin-bottom:6px;border-left:3px solid var(--warning)">
                  <p style="font-size:12.5px">${n.text}</p>
                  <small style="font-size:10.5px;color:var(--text-soft)">${new Date(n.time).toLocaleString(isBn?'bn-BD':'en-US')} • ${n.by||'Admin'}</small>
                </div>
              `).join('')}
            </div>` : ''}
            <div style="display:flex;gap:8px">
              <input id="aoNote" placeholder="${t('writeNote')}" style="flex:1">
              <button class="btn btn-primary btn-sm" onclick="Admin.addNote('${o.id}')"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>

          <div class="order-detail-section" style="grid-column:1/-1">
            <h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5>
            <ul class="order-history">
              ${(o.history||[]).slice().reverse().map((h, i) => `
                <li class="${i===0?'current':''}">
                  <span class="h-dot"></span>
                  <h6>${Orders.statusLabel(h.status)}</h6>
                  <small>${new Date(h.time).toLocaleString(isBn?'bn-BD':'en-US')}${h.by?' • '+h.by:''}</small>
                  ${h.comment?`<div class="h-comment">${h.comment}</div>`:''}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
        <button class="btn btn-whatsapp btn-block" onclick="WhatsApp.sendOrder(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        <button class="btn btn-primary btn-block" onclick="Admin.saveOrderChanges('${o.id}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>
    `, 'lg');
  },

  setOrderStatus(id, status){
    const defaults = {
      confirmed: t('confirmedByAdmin'),
      processing: t('processingStarted'),
      shipped: t('shippedByCourier'),
      out_for_delivery: t('outForDelivery'),
      delivered: t('deliveredSuccess'),
      cancelled: t('cancelledByAdmin'),
      rejected: t('rejectedByAdmin')
    };
    const comment = defaults[status] || '';
    Modal.confirm(
      LANG === 'bn' ? `স্ট্যাটাস পরিবর্তন করে "${Orders.statusLabel(status)}" করবেন?` : `Change status to "${Orders.statusLabel(status)}"?`,
      async () => {
        try {
          if(status === 'rejected') await Orders.reject(id, comment);
          else if(status === 'cancelled') await Orders.cancel(id, comment);
          else await Orders.updateStatus(id, status, comment);
          Toast.show(LANG === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status updated', 'success');
          Modal.close();
          Admin.refreshContent();
        } catch(e){ Toast.show('Failed: ' + e.message, 'error'); }
      }
    );
  },

  async quickConfirm(id){
    try {
      await Orders.updateStatus(id, 'confirmed', t('confirmedByAdmin'));
      Toast.show(LANG === 'bn' ? '✅ অর্ডার কনফার্ম হয়েছে' : '✅ Order confirmed', 'success');
      Admin.refreshContent();
    } catch(e){ Toast.show('Failed', 'error'); }
  },

  quickCancel(id){
    const isBn = LANG === 'bn';
    Modal.open(`
      <button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-ban"></i> ${t('cancelOrder')}</h3></div>
      <div class="modal-body">
        <div class="form-group"><label>${t('cancelReason')}</label><textarea id="cancelReason" rows="3" placeholder="${t('writeReason')}"></textarea></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button>
        <button class="btn btn-danger btn-block" onclick="Admin.confirmCancel('${id}')"><i class="fa-solid fa-ban"></i> ${t('confirmCancelAction')}</button>
      </div>
    `);
  },

  async confirmCancel(id){
    const reason = document.getElementById('cancelReason').value.trim() || t('noReasonGiven');
    try {
      await Orders.cancel(id, reason);
      Toast.show(LANG === 'bn' ? 'অর্ডার বাতিল হয়েছে' : 'Order cancelled', 'success');
      Modal.close();
      Admin.refreshContent();
    } catch(e){ Toast.show('Failed', 'error'); }
  },

  toggleOrderSelect(id, checked){
    App._selectedOrders = App._selectedOrders || [];
    if(checked && !App._selectedOrders.includes(id)) App._selectedOrders.push(id);
    else if(!checked) App._selectedOrders = App._selectedOrders.filter(x => x !== id);
    Admin.refreshContent();
  },

  toggleAllOrders(checked, allIds){
    App._selectedOrders = checked ? [...allIds] : [];
    Admin.refreshContent();
  },

  async bulkConfirm(){
    const ids = App._selectedOrders || []; if(!ids.length) return;
    Modal.confirm(LANG === 'bn' ? `${ids.length}টি অর্ডার কনফার্ম করবেন?` : `Confirm ${ids.length} orders?`, async () => {
      try {
        for(const id of ids) await Orders.updateStatus(id, 'confirmed', t('confirmedByAdmin'));
        Toast.show(LANG === 'bn' ? `${ids.length}টি অর্ডার কনফার্ম হয়েছে` : `${ids.length} orders confirmed`, 'success');
        App._selectedOrders = [];
        Admin.refreshContent();
      } catch(e){ Toast.show('Failed', 'error'); }
    });
  },

  async bulkStatus(status){
    const ids = App._selectedOrders || []; if(!ids.length) return;
    Modal.confirm(LANG === 'bn' ? `${ids.length}টি অর্ডার "${Orders.statusLabel(status)}" করবেন?` : `Change ${ids.length} orders to "${Orders.statusLabel(status)}"?`, async () => {
      try {
        for(const id of ids) await Orders.updateStatus(id, status, 'Bulk update');
        Toast.show(LANG === 'bn' ? 'আপডেট সফল' : 'Updated', 'success');
        App._selectedOrders = [];
        Admin.refreshContent();
      } catch(e){ Toast.show('Failed', 'error'); }
    });
  },

  async bulkCancel(){
    const ids = App._selectedOrders || []; if(!ids.length) return;
    Modal.confirm(LANG === 'bn' ? `${ids.length}টি অর্ডার বাতিল করবেন?` : `Cancel ${ids.length} orders?`, async () => {
      try {
        for(const id of ids) await Orders.cancel(id, t('cancelledByAdmin'));
        Toast.show(LANG === 'bn' ? 'বাতিল সফল' : 'Cancelled', 'success');
        App._selectedOrders = [];
        Admin.refreshContent();
      } catch(e){ Toast.show('Failed', 'error'); }
    });
  },

  bulkPrint(){
    const f = App._orderFilter || {};
    let list = DB.orders.slice();
    if(f.status && f.status !== 'all') list = list.filter(o => o.status === f.status);
    if(!list.length){ Toast.show(LANG === 'bn' ? 'কোনো অর্ডার নেই' : 'No orders', 'warning'); return; }
    Admin.printOrders(list);
  },

  printOrders(orders){
    const w = window.open('', '_blank', 'width=900,height=1000');
    const isBn = LANG === 'bn';
    w.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Orders Print</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:${isBn?"'Hind Siliguri',":""}sans-serif;padding:20px;color:#0f1021}
        .head{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:18px 22px;border-radius:12px;margin-bottom:20px}
        .head h1{font-size:22px;margin-bottom:4px}
        .head p{font-size:12px;opacity:.9}
        .order-block{background:#fff;border:1px solid #e5e8f0;border-radius:12px;padding:18px;margin-bottom:16px;page-break-inside:avoid}
        .order-head{display:flex;justify-content:space-between;border-bottom:2px solid #e5e8f0;padding-bottom:10px;margin-bottom:12px}
        .order-head h3{font-size:16px;font-family:monospace}
        .order-info{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;font-size:13px}
        .order-info div{margin-bottom:4px}
        .order-info b{font-size:11px;color:#64748b;text-transform:uppercase;display:block;margin-bottom:2px}
        table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
        th,td{padding:8px;text-align:left;border-bottom:1px solid #e5e8f0}
        th{background:#f8f9fd;font-size:10px;text-transform:uppercase}
        .total-row{text-align:right;margin-top:10px;font-size:14px;font-weight:800;color:#6366f1}
        .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;text-transform:uppercase;background:#eef2ff;color:#6366f1}
        .print-bar{position:fixed;top:20px;right:20px;z-index:100}
        .print-bar button{padding:10px 18px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer}
        @media print{.print-bar{display:none}}
      </style></head><body>
      <div class="print-bar"><button onclick="window.print()">🖨️ Print All</button></div>
      <div class="head">
        <h1>EcoShop Pro MAX — ${isBn?'অর্ডার লিস্ট':'Orders List'}</h1>
        <p>${orders.length} ${isBn?'টি অর্ডার':'orders'} • ${new Date().toLocaleString(isBn?'bn-BD':'en-US')}</p>
      </div>
      ${orders.map(o => `
        <div class="order-block">
          <div class="order-head"><h3>${o.id}</h3><span class="badge">${Orders.statusLabel(o.status)}</span></div>
          <div class="order-info">
            <div><b>${isBn?'কাস্টমার':'Customer'}</b>${o.customer.name}</div>
            <div><b>${isBn?'ফোন':'Phone'}</b>${o.customer.phone||''}</div>
            <div style="grid-column:1/-1"><b>${isBn?'ঠিকানা':'Address'}</b>${o.customer.address}${o.customer.city?', '+o.customer.city:''}</div>
            <div><b>${isBn?'তারিখ':'Date'}</b>${new Date(o.date).toLocaleString(isBn?'bn-BD':'en-US')}</div>
            <div><b>${isBn?'পেমেন্ট':'Payment'}</b>${(o.paymentMethod||'cod').toUpperCase()}</div>
          </div>
          <table>
            <thead><tr><th>${isBn?'পণ্য':'Item'}</th><th>${isBn?'পরিমাণ':'Qty'}</th><th>${isBn?'দর':'Price'}</th><th>${isBn?'মোট':'Total'}</th></tr></thead>
            <tbody>${(o.items||[]).map(it => `<tr><td>${it.name}</td><td>${it.qty}</td><td>৳${it.price}</td><td>৳${it.qty*it.price}</td></tr>`).join('')}</tbody>
          </table>
          <div class="total-row">${isBn?'সর্বমোট':'Grand Total'}: ৳${o.total}</div>
        </div>
      `).join('')}
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  },

  recalcOrder(id){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const delivery = +document.getElementById('aoDelivery').value || 0;
    const discount = +document.getElementById('aoDiscount').value || 0;
    const newTotal = (o.subtotal||0) + delivery - discount;
    document.getElementById('aoTotal').textContent = money(newTotal);
    Toast.show(LANG === 'bn' ? 'রিক্যালকুলেট হয়েছে' : 'Recalculated', 'info', 1500);
  },

  async addNote(id){
    const inp = document.getElementById('aoNote'); if(!inp) return;
    const text = inp.value.trim(); if(!text) return;
    try {
      await Orders.addNote(id, text);
      Toast.show(LANG === 'bn' ? 'নোট যোগ হয়েছে' : 'Note added', 'success');
      Admin.openOrderModal(id);
    } catch(e){ Toast.show('Failed', 'error'); }
  },

  async saveOrderChanges(id){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const comment = document.getElementById('aoComment')?.value.trim() || '';
    const delivery = +document.getElementById('aoDelivery').value || 0;
    const discount = +document.getElementById('aoDiscount').value || 0;
    const courier = document.getElementById('aoCourier')?.value.trim() || '';
    const tracking = document.getElementById('aoTracking')?.value.trim() || '';
    const eta = document.getElementById('aoEta')?.value.trim() || '';
    try {
      const newTotal = (o.subtotal||0) + delivery - discount;
      const history = (o.history||[]).concat([{
        status: o.status, time: Date.now(),
        comment: comment || t('updatedByAdmin'),
        by: (Auth.user() && Auth.user().name) || 'Admin'
      }]);
      await Orders.update(id, {
        deliveryCharge: delivery,
        discount,
        total: newTotal,
        courier: courier || null,
        trackingNumber: tracking || null,
        eta: eta || null,
        history
      });
      Toast.show(LANG === 'bn' ? 'সেভ হয়েছে' : 'Saved', 'success');
      Modal.close();
      Admin.refreshContent();
    } catch(e){ Toast.show('Failed: ' + e.message, 'error'); }
  },

  deleteOrder(id){ Modal.confirm(t('deleteConfirm'), async () => { try { await Orders.remove(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },

  users(){
    const q = (App._uQuery||'').toLowerCase();
    const list = DB.users.filter(u => !q || (u.name + u.email).toLowerCase().includes(q));
    return `
      <div class="admin-toolbar">
        <input placeholder="${t('userSearch')}" value="${App._uQuery||''}" oninput="App._uQuery=this.value;clearTimeout(window._uq);window._uq=setTimeout(()=>Admin.refreshContent(),250)">
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3>${t('totalUsers')} (${list.length})</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th></th><th>${t('fullName')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('active')}</th><th></th></tr></thead>
            <tbody>${list.map(u => `<tr>
              <td><img class="thumb" style="border-radius:50%" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'"></td>
              <td><b>${u.name}</b></td>
              <td>${u.email}</td>
              <td><span class="chip ${u.role==='admin'?'active-status':''}">${u.role}</span></td>
              <td>${u.blocked?`<span class="chip blocked">${t('blocked')}</span>`:`<span class="chip active-status">${t('active')}</span>`}</td>
              <td><div class="actions">
                <button class="icon-btn-sm ${u.blocked?'success':''}" onclick="Admin.toggleBlock('${u.id}')"><i class="fa-solid ${u.blocked?'fa-unlock':'fa-ban'}"></i></button>
                ${u.role!=='admin'?`<button class="icon-btn-sm danger" onclick="Admin.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>`:''}
              </div></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  },
  async toggleBlock(id){
    const u = DB.users.find(x => x.id === id); if(!u || u.role === 'admin') return;
    try { await DB.updateUser(id, { blocked: !u.blocked }); Toast.show(t('saveSuccess'),'success'); } catch(e){}
  },
  deleteUser(id){ Modal.confirm(t('deleteConfirm'), async () => { try { await DB.deleteUser(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },

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
          ${keys.map(([k, v]) => `<div class="chip-large">${v}<button onclick="Admin.delCat('${k}')"><i class="fa-solid fa-xmark"></i></button></div>`).join('')}
        </div>
      </div>`;
  },
  async addCat(){
    const v = document.getElementById('newCat').value.trim(); if(!v) return;
    try { await DB.saveCategory(v); Toast.show(t('saveSuccess'),'success'); } catch(e){}
  },
  delCat(key){ Modal.confirm(t('deleteConfirm'), async () => { try { await DB.deleteCategory(key); } catch(e){} }); },

  coupons(){
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
            <thead><tr><th>${t('couponCode')}</th><th>Type</th><th>Value</th><th></th></tr></thead>
            <tbody>${DB.coupons.map(c => `<tr>
              <td><b>${c.code}</b></td>
              <td><span class="chip">${c.type}</span></td>
              <td>${c.type === 'percent' ? c.value + '%' : money(c.value)}</td>
              <td><button class="icon-btn-sm danger" onclick="Admin.delCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`;
  },
  async addCoupon(){
    const code = document.getElementById('cCode').value.trim().toUpperCase();
    const type = document.getElementById('cType').value;
    const value = +document.getElementById('cVal').value;
    if(!code || !value){ Toast.show(t('fillAllFields'),'error'); return; }
    try { await DB.saveCoupon({ code, type, value }); Toast.show(t('saveSuccess'),'success'); } catch(e){}
  },
  async delCoupon(id){ try { await DB.deleteCoupon(id); } catch(e){} },

  settings(){
    const s = DB.settings;
    return `
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-gear"></i> ${t('settings')}</h3></div>
        <div class="form-group"><label>${t('siteName')}</label><input id="stName" value="${s.siteName||''}"></div>
        <div class="form-group"><label>${t('supportPhone')}</label><input id="stPhone" value="${s.supportPhone||''}"></div>
        <div class="form-group"><label>WhatsApp Number</label><input id="stWhatsapp" value="${s.whatsappNumber||''}" placeholder="8801700000000"></div>
        <div class="form-row">
          <div class="form-group"><label>${t('insideDhaka')} (৳)</label><input id="stShipIn" type="number" value="${s.shippingInsideDhaka||100}"></div>
          <div class="form-group"><label>${t('outsideDhaka')} (৳)</label><input id="stShipOut" type="number" value="${s.shippingOutsideDhaka||120}"></div>
        </div>
        <div class="form-group"><label>${t('bkash')} ${t('paymentNumber')}</label><input id="stBkash" value="${s.bkashNumber||''}"></div>
        <div class="form-group"><label>${t('nagad')} ${t('paymentNumber')}</label><input id="stNagad" value="${s.nagadNumber||''}"></div>
        <div class="form-group"><label>${t('rocket')} ${t('paymentNumber')}</label><input id="stRocket" value="${s.rocketNumber||''}"></div>
        <button class="btn btn-primary" onclick="Admin.saveSettings()"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button>
      </div>`;
  },
  async saveSettings(){
    const settings = {
      ...DB.settings,
      siteName: document.getElementById('stName').value.trim(),
      supportPhone: document.getElementById('stPhone').value.trim(),
      whatsappNumber: document.getElementById('stWhatsapp').value.trim(),
      shippingInsideDhaka: +document.getElementById('stShipIn').value || 100,
      shippingOutsideDhaka: +document.getElementById('stShipOut').value || 120,
      bkashNumber: document.getElementById('stBkash').value.trim(),
      nagadNumber: document.getElementById('stNagad').value.trim(),
      rocketNumber: document.getElementById('stRocket').value.trim()
    };
    try { await DB.saveSettings(settings); Toast.show(t('settingsSaved'),'success'); } catch(e){ Toast.show('Failed','error'); }
  },
  refreshContent(){ const el = document.getElementById('adminContent'); if(el) el.innerHTML = this.render(App._adminTab||'dashboard'); }
};

/* ═══════════════════════════════════════════════════════════
   Password Reset
   ═══════════════════════════════════════════════════════════ */
const PasswordReset = {
  step: 1, email: null, otpCode: null, otpExpiresAt: 0, otpAttempts: 0,
  cooldownTimer: null, verified: false,

  open(){ this.reset(); this.step = 1; this.renderModal(); },
  close(){ Modal.close(); this.reset(); if(this.cooldownTimer) clearInterval(this.cooldownTimer); },
  reset(){ this.step = 1; this.email = null; this.otpCode = null; this.otpExpiresAt = 0; this.otpAttempts = 0; this.verified = false; },
  renderModal(){ if(this.step === 1) this.renderStep1(); else if(this.step === 2) this.renderStep2(); else this.renderStep3(); },

  renderStep1(){
    Modal.open(`
      <button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-key"></i> ${t('resetPassword')}</h3></div>
      <div class="modal-body">
        <div class="reg-steps">
          <div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">${t('stepEmail')}</span></div>
          <div class="reg-step-line"></div>
          <div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">${t('stepOtp')}</span></div>
          <div class="reg-step-line"></div>
          <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div>
        </div>
        <p class="pr-desc">${t('resetPasswordDesc')}</p>
        <div class="form-group">
          <label>${t('email')}</label>
          <div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="prEmail" placeholder="you@example.com" autofocus></div>
          <div class="form-hint" id="prEmailHint"></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="PasswordReset.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" id="prSendBtn" onclick="PasswordReset.sendOTP()"><i class="fa-solid fa-paper-plane"></i> ${t('sendCode')}</button>
      </div>
    `);
    setTimeout(() => {
      const inp = document.getElementById('prEmail');
      if(inp){ inp.focus(); inp.addEventListener('keydown', e => { if(e.key === 'Enter') PasswordReset.sendOTP(); }); }
    }, 100);
  },

  async sendOTP(){
    const inp = document.getElementById('prEmail');
    const hint = document.getElementById('prEmailHint');
    const email = Auth.normalizeEmail(inp ? inp.value : '');
    if(!email){ Toast.show(t('invalidEmail'),'error'); return; }
    if(!DB.ready.users){ if(hint){ hint.textContent = t('dataLoadingWait'); } return; }
    const user = DB.users.find(u => Auth.normalizeEmail(u.email) === email);
    if(!user){
      if(hint){ hint.textContent = t('noAccountWithEmail'); hint.style.color = 'var(--danger)'; }
      Toast.show(t('noAccountWithEmail'),'error'); return;
    }
    const code = OTP.generate();
    this.email = email; this.otpCode = code;
    this.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    this.otpAttempts = 0; this.verified = false;
    if(!OTP.init()){ Toast.show('EmailJS not loaded','error'); return; }
    const btn = document.getElementById('prSendBtn');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpSending')}`;
    try {
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, {
        to_email: this.email, email: this.email, reply_to: this.email,
        otp_code: code, code: code, user_name: user.name, site_name: 'EcoShop Pro MAX'
      });
      Toast.show(t('otpSent'),'success');
      this.step = 2; this.renderModal();
      setTimeout(() => { document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.startCooldown(60); }, 250);
    } catch(err){
      Toast.show(t('otpFailed') + ': ' + (err?.text || err?.message || 'Failed'), 'error', 6000);
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('sendCode')}`;
    }
  },

  renderStep2(){
    Modal.open(`
      <button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-shield-halved"></i> ${t('verifyOTP')}</h3></div>
      <div class="modal-body">
        <div class="reg-steps">
          <div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepEmail')}</span></div>
          <div class="reg-step-line done"></div>
          <div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">${t('stepOtp')}</span></div>
          <div class="reg-step-line"></div>
          <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div>
        </div>
        <div class="otp-header">
          <div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div>
          <h3>${t('verifyEmail')}</h3>
          <p>${t('weSentCode')}<br><b>${OTP.maskEmail(this.email)}</b></p>
        </div>
        <div class="otp-inputs" id="otpInputs">
          ${[0,1,2,3,4,5].map(i => `<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">`).join('')}
        </div>
        <div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" style="flex:1" onclick="PasswordReset.backToStep1()"><i class="fa-solid fa-arrow-left"></i> ${t('back')}</button>
        <button class="btn btn-outline" style="flex:1" id="prResendBtn" onclick="PasswordReset.resendOTP()" disabled>${t('resendOTP')}</button>
        <button class="btn btn-primary" style="flex:1" onclick="PasswordReset.verifyOTP()"><i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}</button>
      </div>
    `);
    setTimeout(() => document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(), 200);
  },

  verifyOTP(){
    const code = AuthUI.getOTPValue();
    if(code.length !== 6){ Toast.show(t('enterFullCode'),'warning'); return; }
    if(!this.otpCode){ Toast.show('Send code first','error'); return; }
    if(Date.now() > this.otpExpiresAt){ Toast.show('Code expired','error'); return; }
    if(this.otpAttempts >= 5){ Toast.show('Too many attempts','error'); return; }
    if(code !== this.otpCode){
      this.otpAttempts++;
      Toast.show(`Wrong code (${5 - this.otpAttempts} left)`,'error');
      return;
    }
    this.verified = true;
    Toast.show(t('codeVerified'),'success');
    this.step = 3; this.renderModal();
  },

  startCooldown(seconds){
    const btn = document.getElementById('prResendBtn');
    if(!btn) return;
    btn.disabled = true;
    if(this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      seconds--;
      if(seconds <= 0){
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
        btn.disabled = false;
        btn.textContent = t('resendOTP');
      } else {
        btn.textContent = `${t('resendOTP')} (${seconds}s)`;
      }
    }, 1000);
  },

  async resendOTP(){
    if(!this.email){ this.backToStep1(); return; }
    const code = OTP.generate();
    this.otpCode = code;
    this.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    this.otpAttempts = 0;
    const btn = document.getElementById('prResendBtn');
    if(btn){ btn.disabled = true; btn.textContent = t('otpSending'); }
    try {
      const user = DB.users.find(u => Auth.normalizeEmail(u.email) === this.email);
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, {
        to_email: this.email, email: this.email, reply_to: this.email,
        otp_code: code, code: code, user_name: user?.name || 'User', site_name: 'EcoShop Pro MAX'
      });
      Toast.show(t('otpSent'),'success');
      AuthUI.clearOTPInputs();
      this.startCooldown(60);
    } catch(err){
      Toast.show('Failed: ' + (err?.text || err?.message || ''),'error');
      if(btn){ btn.disabled = false; btn.textContent = t('resendOTP'); }
    }
  },

  backToStep1(){
    this.step = 1;
    if(this.cooldownTimer){ clearInterval(this.cooldownTimer); this.cooldownTimer = null; }
    this.renderModal();
  },

  renderStep3(){
    Modal.open(`
      <button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-lock"></i> ${t('newPassword2')}</h3></div>
      <div class="modal-body">
        <div class="reg-steps">
          <div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepEmail')}</span></div>
          <div class="reg-step-line done"></div>
          <div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepOtp')}</span></div>
          <div class="reg-step-line done"></div>
          <div class="reg-step active"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div>
        </div>
        <div class="form-group">
          <label>${t('newPassword2')}</label>
          <div class="input-wrap">
            <i class="fa-solid fa-lock input-icon"></i>
            <input type="password" id="prNewPass" placeholder="••••••" oninput="AuthUI.checkPwd(this.value)">
            <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('prNewPass', this)"><i class="fa-solid fa-eye"></i></button>
          </div>
        </div>
        <div class="form-group">
          <label>${t('confirmPassword')}</label>
          <div class="input-wrap">
            <i class="fa-solid fa-lock input-icon"></i>
            <input type="password" id="prNewPass2" placeholder="••••••">
            <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('prNewPass2', this)"><i class="fa-solid fa-eye"></i></button>
          </div>
          <div class="form-error" id="prPassError">${t('passwordMismatch')}</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline btn-block" onclick="PasswordReset.close()">${t('cancel')}</button>
        <button class="btn btn-primary btn-block" id="prUpdateBtn" onclick="PasswordReset.updatePassword()"><i class="fa-solid fa-floppy-disk"></i> ${t('updatePassword')}</button>
      </div>
    `);
    setTimeout(() => document.getElementById('prNewPass')?.focus(), 200);
  },

  async updatePassword(){
    const p1 = document.getElementById('prNewPass').value;
    const p2 = document.getElementById('prNewPass2').value;
    const err = document.getElementById('prPassError');
    if(!p1 || !p2){ Toast.show(t('fillAllFields'),'error'); return; }
    if(p1.length < 6){ Toast.show(t('weakPassword'),'error'); return; }
    if(p1 !== p2){ err.classList.add('show'); Toast.show(t('passwordMismatch'),'error'); return; }
    err.classList.remove('show');
    if(!this.verified){ Toast.show(t('verifyCodeFirst'),'error'); return; }
    const btn = document.getElementById('prUpdateBtn');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try {
      const user = DB.users.find(u => Auth.normalizeEmail(u.email) === this.email);
      if(!user) throw new Error('User not found');
      await DB.updateUser(user.id, { password: p1 });
      const emailForLogin = this.email;
      Modal.open(`
        <div style="padding:32px 24px;text-align:center">
          <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;margin:0 auto 18px">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 style="font-size:19px;font-weight:800;margin-bottom:8px">${t('passwordUpdated')}</h3>
          <p style="font-size:13.5px;color:var(--text-dim);line-height:1.6;margin-bottom:22px">${t('passwordUpdatedDesc')}</p>
          <button class="btn btn-primary btn-block" onclick="PasswordReset.finishAndLogin('${emailForLogin}')"><i class="fa-solid fa-right-to-bracket"></i> ${t('loginNow')}</button>
        </div>
      `);
      this.reset();
    } catch(e){
      Toast.show(t('updateFailed') + ': ' + e.message, 'error');
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> ${t('updatePassword')}`;
    }
  },

  finishAndLogin(email){
    Modal.close();
    App._authTab = 'login'; App._otpStep = null; App._pendingReg = null;
    OTP.reset(); this.reset();
    App.go('auth');
    setTimeout(() => {
      const e = document.getElementById('authEmail'); if(e) e.value = email || '';
      document.getElementById('authPass')?.focus();
    }, 150);
  }
};

/* ═══════════════════════════════════════════════════════════
   AuthUI
   ═══════════════════════════════════════════════════════════ */
const AuthUI = {
  tab(which){
    App._authTab = which; App._otpStep = null; App._pendingReg = null;
    OTP.reset();
    document.getElementById('tabLogin').classList.toggle('active', which === 'login');
    document.getElementById('tabReg').classList.toggle('active', which === 'reg');
    document.getElementById('authForm').innerHTML = which === 'login'
      ? this.loginForm(App._authRedirect || 'home')
      : this.regForm(App._authRedirect || 'home');
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
      <div style="display:flex;justify-content:flex-end;margin-bottom:14px">
        <button type="button" class="forgot-password-link" onclick="PasswordReset.open()">
          <i class="fa-solid fa-key"></i> ${t('forgotPassword')}
        </button>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmit">${t('login')} <i class="fa-solid fa-arrow-right"></i></button>
    </form>`;
  },

  regForm(redirect='home'){
    if(App._otpStep === 'verify' && OTP.currentEmail) return this.otpVerifyForm(redirect);
    return this.regInfoForm(redirect);
  },

  regInfoForm(redirect='home'){
    return `<form onsubmit="AuthUI.sendOTP(event, '${redirect}')" novalidate>
      <div class="reg-steps">
        <div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">Info</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div>
      </div>
      <div class="form-group">
        <label>${t('fullName')} *</label>
        <div class="input-wrap"><i class="fa-solid fa-user input-icon"></i><input id="regName" required placeholder="Rahim Uddin"></div>
      </div>
      <div class="form-group">
        <label>${t('email')} *</label>
        <div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="regEmail" required placeholder="you@example.com" oninput="AuthUI.onEmailInput(this.value)"></div>
        <div class="form-hint" id="emailCheckHint"></div>
      </div>
      <div class="form-group">
        <label>${t('phone')}</label>
        <div class="input-wrap"><i class="fa-solid fa-phone input-icon"></i><input id="regPhone" placeholder="017XXXXXXXX"></div>
      </div>
      <div class="form-group">
        <label>${t('password')} *</label>
        <div class="input-wrap">
          <i class="fa-solid fa-lock input-icon"></i>
          <input type="password" id="regPass" required minlength="6" oninput="AuthUI.checkPwd(this.value)">
          <button type="button" class="toggle-pass" onclick="AuthUI.togglePass('regPass', this)"><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>
      <div class="form-group">
        <label>${t('confirmPassword')} *</label>
        <div class="input-wrap">
          <i class="fa-solid fa-lock input-icon"></i>
          <input type="password" id="regPass2" required>
        </div>
        <div class="form-error" id="passError">${t('passwordMismatch')}</div>
      </div>
      <div class="form-group">
        <label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:12.5px">
          <input type="checkbox" id="regTerms" required style="width:auto;margin-top:3px"><span>${t('agreeTerms')}</span>
        </label>
      </div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="regSendBtn"><i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}</button>
    </form>`;
  },

  otpVerifyForm(redirect='home'){
    return `<form onsubmit="AuthUI.verifyOTP(event, '${redirect}')" novalidate>
      <div class="reg-steps">
        <div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">Info</span></div>
        <div class="reg-step-line done"></div>
        <div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div>
        <div class="reg-step-line"></div>
        <div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div>
      </div>
      <div class="otp-header">
        <div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div>
        <h3>${t('verifyEmail')}</h3>
        <p>${t('weSentCode')}<br><b>${OTP.maskEmail(OTP.currentEmail)}</b></p>
      </div>
      <div class="otp-inputs" id="otpInputs">
        ${[0,1,2,3,4,5].map(i => `<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">`).join('')}
      </div>
      <div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div>
      <button type="submit" class="btn btn-primary btn-block btn-lg" id="otpVerifyBtn"><i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}</button>
      <div class="otp-actions">
        <button type="button" class="btn-link" id="otpResendBtn" onclick="AuthUI.resendOTP()" disabled><i class="fa-solid fa-rotate-right"></i> <span id="otpResendText">${t('resendOTP')}</span></button>
        <button type="button" class="btn-link" onclick="AuthUI.backToInfo()"><i class="fa-solid fa-arrow-left"></i> ${t('changeInfo')}</button>
      </div>
    </form>`;
  },

  onEmailInput(email){
    const hint = document.getElementById('emailCheckHint');
    if(!hint) return;
    hint.textContent = ''; hint.style.color = '';
    const target = Auth.normalizeEmail(email);
    if(!target || target.length < 5 || !target.includes('@')) return;
    if(!DB.ready.users){ hint.textContent = t('dataLoadingWait'); hint.style.color = 'var(--text-dim)'; return; }
    const s = Auth.checkEmailStatus(target);
    if(s.status === 'taken'){ hint.textContent = t('emailTaken'); hint.style.color = 'var(--danger)'; }
    else if(s.status === 'free'){ hint.textContent = t('emailAvailable'); hint.style.color = 'var(--success)'; }
  },

  otpInput(el){
    const v = el.value.replace(/\D/g, '');
    el.value = v.slice(0, 1);
    el.classList.toggle('filled', !!el.value);
    if(v){
      const idx = +el.dataset.idx;
      const next = document.querySelector(`.otp-inputs input[data-idx="${idx+1}"]`);
      if(next) next.focus(); else el.blur();
    }
  },
  otpKey(e, el){
    const idx = +el.dataset.idx;
    if(e.key === 'Backspace' && !el.value){
      const prev = document.querySelector(`.otp-inputs input[data-idx="${idx-1}"]`);
      if(prev){ prev.focus(); prev.value = ''; prev.classList.remove('filled'); }
    }
  },
  otpPaste(e){
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
    const inputs = document.querySelectorAll('.otp-inputs input');
    text.split('').forEach((ch, i) => { if(inputs[i]){ inputs[i].value = ch; inputs[i].classList.add('filled'); } });
    (Array.from(inputs).find(i => !i.value) || inputs[inputs.length-1]).focus();
  },
  getOTPValue(){ return Array.from(document.querySelectorAll('.otp-inputs input')).map(i => i.value).join(''); },
  clearOTPInputs(){ document.querySelectorAll('.otp-inputs input').forEach(i => { i.value = ''; i.classList.remove('filled','error'); }); },

  async sendOTP(e, redirect){
    if(e) e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = Auth.normalizeEmail(document.getElementById('regEmail').value);
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
    if(!DB.ready.users){ Toast.show(t('dataLoadingWait'),'warning'); return; }
    if(Auth.isEmailTaken(email)){
      Toast.show(t('emailExists'),'error',4000);
      setTimeout(() => { App._authTab = 'login'; App.render(); }, 600);
      return;
    }
    App._pendingReg = { name, email, phone, password: pass };
    const btn = document.getElementById('regSendBtn');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpSending')}`;
    const r = await OTP.send(email, name);
    if(!r.ok){
      Toast.show(t('otpFailed') + ': ' + r.msg, 'error', 6000);
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}`;
      return;
    }
    Toast.show(t('otpSent'),'success');
    App._otpStep = 'verify'; App._authRedirect = redirect;
    App.render();
    setTimeout(() => { document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.startResendCooldown(60); }, 300);
  },

  startResendCooldown(seconds){
    const btn = document.getElementById('otpResendBtn');
    const txt = document.getElementById('otpResendText');
    if(!btn || !txt) return;
    btn.disabled = true;
    OTP.startCooldown(seconds, (r) => {
      txt.textContent = r > 0 ? `${t('resendOTP')} (${r}s)` : t('resendOTP');
      if(r <= 0) btn.disabled = false;
    });
  },

  async verifyOTP(e, redirect){
    if(e) e.preventDefault();
    const code = this.getOTPValue();
    if(code.length !== 6){ Toast.show(t('enterFullCode'),'warning'); return; }
    const btn = document.getElementById('otpVerifyBtn');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpVerifying')}`;
    const r = await OTP.verify(code);
    if(!r.ok){
      Toast.show(r.msg, 'error');
      btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`;
      return;
    }
    const pending = App._pendingReg;
    if(!pending){ Toast.show('Session lost','error'); return; }
    const reg = await Auth.register(pending);
    if(!reg.ok){ Toast.show(reg.msg, 'error'); btn.disabled = false; return; }
    OTP.reset(); App._pendingReg = null; App._otpStep = null; App._authRedirect = null;
    Toast.show(t('registrationSuccess') + ' ' + reg.user.name, 'success', 4000);
    setTimeout(() => App.go(redirect && redirect !== 'home' ? redirect : 'home'), 600);
  },

  async resendOTP(){
    const pending = App._pendingReg; if(!pending) return;
    const btn = document.getElementById('otpResendBtn');
    btn.disabled = true;
    const txt = document.getElementById('otpResendText');
    txt.textContent = t('otpSending');
    OTP.attempts = 0;
    const r = await OTP.send(pending.email, pending.name);
    if(!r.ok){ Toast.show('Failed: ' + r.msg, 'error'); btn.disabled = false; txt.textContent = t('resendOTP'); return; }
    Toast.show(t('otpSent'),'success');
    this.clearOTPInputs();
    this.startResendCooldown(60);
  },

  backToInfo(){ App._otpStep = null; OTP.reset(); App.render(); },

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
    const bars = [1,2,3,4].map(i => document.getElementById('pwdBar'+i));
    const cls = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';
    bars.forEach((b,i) => { if(b) b.className = 'pwd-bar' + (i < score ? ' ' + cls : ''); });
    const txt = document.getElementById('pwdText');
    if(txt) txt.textContent = score ? cls : 'Password strength';
  },

  async doLogin(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('loginSubmit');
    btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    const r = await Auth.login(document.getElementById('authEmail').value, document.getElementById('authPass').value);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `${t('login')} <i class="fa-solid fa-arrow-right"></i>`; return; }
    Toast.show(t('loginSuccess') + ', ' + r.user.name,'success');
    const target = r.user.role === 'admin' ? 'admin' : (redirect && redirect !== 'home' ? redirect : 'home');
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
  document.querySelectorAll('[data-set-theme]').forEach(b => b.classList.toggle('active', b.dataset.setTheme === mode));
  const tb = document.getElementById('themeBtn');
  if(tb) tb.innerHTML = `<i class="fa-solid fa-${mode === 'dark' ? 'sun' : 'moon'}"></i>`;
}
function applyLang(lang){
  LANG = lang;
  localStorage.setItem('eco_lang', lang);
  document.documentElement.lang = lang;
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = lang.toUpperCase();
  document.querySelectorAll('[data-set-lang]').forEach(b => b.classList.toggle('active', b.dataset.setLang === lang));
  App.render();
  Chatbot.renderQuickReplies();
}
function setFbStatus(ok, text){
  const el = document.getElementById('fbStatus'); if(el) el.style.color = ok ? 'var(--success)' : 'var(--warning)';
  const txt = document.getElementById('fbStatusText'); if(txt) txt.textContent = text;
}
function initOfflineDetect(){
  const bar = document.getElementById('offlineBar');
  const txt = document.getElementById('offlineText');
  function update(){
    if(navigator.onLine) bar?.classList.remove('show');
    else { if(txt) txt.textContent = t('offlineMode'); bar?.classList.add('show'); }
  }
  window.addEventListener('online', () => { update(); });
  window.addEventListener('offline', () => { update(); });
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App v11.0 starting...');

  const savedTheme = localStorage.getItem('eco_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  LANG = localStorage.getItem('eco_lang') || 'bn';
  document.documentElement.lang = LANG;
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = LANG.toUpperCase();

  OTP.init();
  Chatbot.init();

  let p = 0;
  const statuses = ['Firebase-এ সংযুক্ত হচ্ছে...','ডেটা সিঙ্ক হচ্ছে...','প্রায় শেষ...','স্বাগতম!'];
  const splashTimer = setInterval(() => {
    p += 25;
    const bar = document.getElementById('splashBar');
    const st = document.getElementById('splashStatus');
    if(bar) bar.style.width = p + '%';
    if(st) st.textContent = statuses[Math.min(3, Math.floor(p/25) - 1)] || statuses[0];
    if(p >= 100) clearInterval(splashTimer);
  }, 350);
  setTimeout(() => App.hideSplash(), 5000);

  if(fbReady){
    setFbStatus(false, 'Firebase: connecting...');
    try { db.ref('.info/connected').on('value', snap => { setFbStatus(snap.val() === true, snap.val() === true ? 'Firebase: ✅ connected' : 'Firebase: ⚠️ offline'); }); } catch(e){}
    DB.init();
  } else {
    setFbStatus(false, 'Firebase: ❌ failed');
    App.hideSplash();
  }

  PWA.registerSW();
  PWA.initInstallPrompt();
  PushNotif.init();
  initOfflineDetect();

  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar'); if(nb) nb.classList.toggle('scrolled', window.scrollY > 10);
    const btt = document.getElementById('backToTop'); if(btt) btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  document.getElementById('backToTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow = document.getElementById('cursorGlow');
    if(glow){
      let mx = 0, my = 0, cx = 0, cy = 0;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive:true });
      (function animate(){ cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12; glow.style.left = cx + 'px'; glow.style.top = cy + 'px'; requestAnimationFrame(animate); })();
    }
  }

  document.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      const r = a.dataset.nav;
      if(r === 'cart'){ App.openCart(); return; }
      App.go(r);
    };
  });
  document.querySelectorAll('.nav-menu a').forEach(a => a.onclick = () => App.go(a.dataset.nav));

  const openPM = () => { document.getElementById('powerMenu').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closePM = () => { document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow = ''; };
  document.getElementById('menuToggle').onclick = openPM;
  document.getElementById('pmClose').onclick = closePM;

  const openCart = () => { document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { document.getElementById('cartDrawer').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow = ''; };
  document.getElementById('cartBtn').onclick = openCart;
  document.getElementById('cartClose').onclick = closeCart;
  document.getElementById('checkoutBtn').onclick = () => { closeCart(); App.go('checkout'); };

  const openNotif = () => { document.getElementById('notifPanel').classList.add('active'); document.getElementById('backdrop').classList.add('active'); Notifs.markAllRead(); document.body.style.overflow = 'hidden'; };
  const closeNotif = () => { document.getElementById('notifPanel').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow = ''; };
  document.getElementById('notifBtn').onclick = openNotif;
  document.getElementById('notifClose').onclick = closeNotif;

  document.getElementById('backdrop').onclick = () => { closePM(); closeCart(); closeNotif(); document.querySelector('.admin-sidebar')?.classList.remove('active'); };

  document.getElementById('loginBtn').onclick = () => { closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; App._pendingReg=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLoginBtn').onclick = () => { closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; App._pendingReg=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLogoutBtn').onclick = () => { closePM(); Auth.logout(); };

  const av = document.getElementById('userAvatarBtn');
  const dd = document.getElementById('userDropdown');
  av.onclick = e => { e.stopPropagation(); dd.classList.toggle('active'); };
  document.addEventListener('click', () => dd.classList.remove('active'));

  document.getElementById('themeBtn').onclick = () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  document.getElementById('langBtn').onclick = () => applyLang(LANG === 'bn' ? 'en' : 'bn');
  document.querySelectorAll('[data-set-theme]').forEach(b => b.onclick = () => applyTheme(b.dataset.setTheme));
  document.querySelectorAll('[data-set-lang]').forEach(b => b.onclick = () => applyLang(b.dataset.setLang));

  const gs = document.getElementById('globalSearch');
  const searchClear = document.getElementById('searchClear');
  if(gs){
    gs.oninput = e => {
      App._shopQ = e.target.value; App._shopCat = 'all';
      if(searchClear) searchClear.style.display = e.target.value ? 'flex' : 'none';
      if(App.route !== 'shop') App.go('shop'); else App.render();
    };
  }
  if(searchClear) searchClear.onclick = () => { gs.value = ''; App._shopQ = ''; searchClear.style.display = 'none'; App.render(); gs.focus(); };

  document.addEventListener('keydown', e => {
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); document.getElementById('globalSearch')?.focus(); }
    if(e.key === 'Escape'){ Modal.close(); }
  });

  App.render();
  console.log('✅ App ready v11.0');
});
   
