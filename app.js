/* ═══════════════════════════════════════════════════════════════════════
   EcoShop Pro MAX v13.0 — Professional Edition
   Full app.js
   ═══════════════════════════════════════════════════════════════════════ */

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
const EmailJSConfig = { publicKey: 'zuPQJsWL-br59MV3t', serviceId: 'service_Abdullah_200', templateId: 'template_edu2aen', initialized: false };

let fbApp, db, fbReady = false, fbError = null;
try { fbApp = firebase.initializeApp(firebaseConfig); db = firebase.database(); try { firebase.analytics(); } catch(e){} fbReady = true; }
catch(e){ fbError = e.message; console.error('❌ Firebase init:', e); }

const DEFAULT_SETTINGS = {
  siteName:'EcoShop Pro MAX',
  shippingInsideDhaka: 100, shippingOutsideDhaka: 120,
  supportPhone: '+880 1700-000000', supportEmail: 'support@ecoshop.pro',
  bkashNumber: '01700000000', nagadNumber: '01700000000', rocketNumber: '01700000000',
  whatsappNumber: '8801700000000',
  enableCOD: true, enableBkash: true, enableNagad: true, enableRocket: true
};

/* ═══ i18n ═══ */
const I18N = {
  bn: {
    home:'হোম', shop:'শপ', orders:'অর্ডার', profile:'প্রোফাইল', admin:'অ্যাডমিন',
    dashboard:'ড্যাশবোর্ড', myOrders:'আমার অর্ডার', wishlist:'উইশলিস্ট', cart:'কার্ট',
    login:'লগইন', logout:'লগআউট', register:'রেজিস্টার',
    adminPanel:'অ্যাডমিন প্যানেল', notifications:'নোটিফিকেশন',
    settings:'সেটিংস', theme:'থিম', language:'ভাষা', light:'লাইট', dark:'ডার্ক',
    searchPlaceholder:'পণ্য খুঁজুন...',
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
    productName:'পণ্যের নাম', description:'বিবরণ', images:'ছবি',
    oldPrice:'পুরাতন দাম', discountPercent:'ডিসকাউন্ট (%)', featured_product:'ফিচার্ড পণ্য',
    reviews:'রিভিউ', relatedProducts:'সম্পর্কিত পণ্য',
    defaultSort:'ডিফল্ট', priceLowHigh:'কম থেকে বেশি', priceHighLow:'বেশি থেকে কম',
    newest:'নতুন আগে', popular:'জনপ্রিয়',
    profileUpdated:'প্রোফাইল আপডেট হয়েছে', loginSuccess:'লগইন সফল', registerSuccess:'রেজিস্ট্রেশন সফল',
    logoutSuccess:'লগআউট সফল', saveSuccess:'সেভ হয়েছে', deleteSuccess:'ডিলিট হয়েছে',
    invalidCredentials:'ভুল ইমেইল বা পাসওয়ার্ড', accountBlocked:'অ্যাকাউন্ট ব্লক করা হয়েছে',
    emailExists:'এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে। লগইন করুন।',
    passwordMismatch:'পাসওয়ার্ড মিলছে না', weakPassword:'কমপক্ষে ৬ অক্ষর',
    fillAllFields:'সব তথ্য পূরণ করুন',
    invalidCoupon:'কুপন সঠিক নয়', emptyCart:'কার্ট খালি', items:'আইটেম',
    processing:'প্রসেসিং...', loadingData:'ডেটা লোড হচ্ছে...',
    totalProducts:'মোট পণ্য', totalOrders:'মোট অর্ডার', totalUsers:'মোট ইউজার', totalSales:'মোট বিক্রয়',
    pendingOrders:'পেন্ডিং অর্ডার', lowStock:'কম স্টক', activeUsers:'সক্রিয় ইউজার',
    recentOrders:'সাম্প্রতিক অর্ডার', products:'পণ্য', users:'ইউজার', ordersTab:'অর্ডার',
    coupons:'কুপন', categories:'ক্যাটাগরি',
    addProduct:'নতুন পণ্য', editProduct:'পণ্য এডিট', productSearch:'পণ্য সার্চ...',
    userSearch:'নাম / ইমেইল...', orderSearch:'অর্ডার সার্চ...',
    role:'রোল', customer:'কাস্টমার', adminRole:'অ্যাডমিন',
    blocked:'ব্লকড', active:'সক্রিয়', block:'ব্লক', unblock:'আনব্লক',
    selected:'নির্বাচিত', deleteConfirm:'ডিলিট?', categoryName:'ক্যাটাগরি নাম', addCategory:'যোগ',
    couponCode:'কুপন কোড', percentOff:'শতাংশ (%)', flatOff:'ফ্ল্যাট (৳)', addCoupon:'যোগ',
    siteName:'সাইটের নাম', supportPhone:'সাপোর্ট ফোন',
    noData:'ডেটা নেই', quickView:'দ্রুত দেখুন',
    installApp:'অ্যাপ ইনস্টল করুন', installHint:'হোম স্ক্রিনে যোগ করুন', install:'ইনস্টল',
    offlineMode:'অফলাইন', pushNotif:'পুশ', enable:'চালু', pushEnabled:'পুশ চালু',
    paymentMethod:'পেমেন্ট', selectPayment:'পেমেন্ট নির্বাচন',
    cod:'ক্যাশ অন ডেলিভারি', codDesc:'হাতে পেয়ে পেমেন্ট',
    bkash:'বিকাশ', nagad:'নগদ', rocket:'রকেট', mobilePayment:'মোবাইল পেমেন্ট',
    paymentNumber:'পেমেন্ট নাম্বার', copy:'কপি', copied:'কপি হয়েছে',
    txnId:'ট্রানজেকশন আইডি', txnIdPlaceholder:'যেমন: 8AB1C2D3E4',
    screenshot:'স্ক্রিনশট', screenshotOptional:'(ঐচ্ছিক)', uploadScreenshot:'আপলোড',
    confirmOrder:'অর্ডার কনফার্ম',
    orderSuccessCOD:'অর্ডার সফল!',
    orderSuccessPaid:'অর্ডার সফল! পেমেন্ট ভেরিফিকেশনে',
    deliveryZone:'ডেলিভারি এলাকা', insideDhaka:'ঢাকার ভিতরে', outsideDhaka:'ঢাকার বাইরে',
    deliveryCharge:'ডেলিভারি চার্জ',
    adminComment:'কমেন্ট', adminCommentOptional:'(ঐচ্ছিক)', commentPlaceholder:'কমেন্ট লিখুন...',
    paymentInfo:'পেমেন্ট তথ্য', settingsSaved:'সেভ হয়েছে',
    numberCopied:'নাম্বার কপি', invalidTxnId:'সঠিক Txn ID দিন',
    sendOTP:'OTP পাঠান', verifyOTP:'যাচাই', resendOTP:'আবার পাঠান',
    verifyEmail:'ইমেইল যাচাই', weSentCode:'৬-ডিজিটের কোড পাঠিয়েছি',
    otpValidTime:'১০ মিনিট বৈধ', changeInfo:'তথ্য পরিবর্তন',
    otpSent:'✅ OTP পাঠানো হয়েছে', otpSending:'পাঠানো হচ্ছে...',
    otpVerifying:'যাচাই...', emailAvailable:'✓ ব্যবহারযোগ্য',
    emailTaken:'❌ আগেই রেজিস্ট্রেশন করা হয়েছে',
    invalidEmail:'সঠিক ইমেইল দিন', agreeToTerms:'শর্তাবলীতে সম্মতি দিন',
    enterFullCode:'৬-ডিজিটের কোড দিন', registrationSuccess:'🎉 রেজিস্ট্রেশন সফল!',
    otpFailed:'ইমেইল পাঠানো যায়নি', dataLoadingWait:'ডেটা লোড হচ্ছে...',
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
    referral:'রেফারেল', inviteFriends:'🎁 বন্ধুদের ইনভাইট করুন',
    loyalty:'লয়্যালটি পয়েন্ট', trackOrder:'অর্ডার ট্র্যাক', track:'ট্র্যাকিং',
    salesTrend:'বিক্রয় ট্রেন্ড', totalSalesLabel:'মোট বিক্রয়', ordersLabel:'অর্ডার',
    whatsappOrder:'WhatsApp-এ অর্ডার কনফার্ম', whatsappSend:'WhatsApp-এ পাঠান',
    whatsappDesc:'কাস্টমারকে WhatsApp-এ অর্ডার ডিটেইল পাঠান',
    downloadPDF:'PDF ডাউনলোড', printInvoicePDF:'PDF ইনভয়েস', invoice:'ইনভয়েস',
    chatbot:'AI সহকারী', botOnline:'অনলাইন', botPlaceholder:'মেসেজ লিখুন...',
    botGreeting:'আসসালামু আলাইকুম! আমি EcoBot। কীভাবে সাহায্য করতে পারি?',
    botHelpMessage:'আমি সাহায্য করতে পারি: পণ্য খোঁজা, অর্ডার ট্র্যাক, দাম জিজ্ঞাসা, যোগাযোগ',
    botContact:'যোগাযোগ: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'অর্ডার পাওয়া যায়নি',
    botOrderStatus:'আপনার অর্ডার স্ট্যাটাস:',
    botThanks:'ধন্যবাদ! আর কোনো সাহায্য লাগলে বলুন।',
    botFoundProducts:'এই পণ্যগুলো পেয়েছি:',
    botSearchingProducts:'পণ্য খুঁজছি...',
    botOrderTracking:'অর্ডার আইডি লিখুন (ORD-...)',
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
    updatedByAdmin:'অ্যাডমিন আপডেট করেছেন',
    changePassword:'পাসওয়ার্ড পরিবর্তন',
    currentPassword:'বর্তমান পাসওয়ার্ড',
    changePasswordDesc:'নিরাপত্তার জন্য আগে বর্তমান পাসওয়ার্ড দিন',
    profilePicture:'প্রোফাইল ছবি',
    personalInfo:'ব্যক্তিগত তথ্য',
    personalInfoDesc:'আপনার নাম, ফোন ও ঠিকানা আপডেট করুন',
    security:'নিরাপত্তা',
    wrongCurrentPassword:'বর্তমান পাসওয়ার্ড ভুল',
    passwordChanged:'✅ পাসওয়ার্ড পরিবর্তন হয়েছে',
    passwordChangedDesc:'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।',
    saveInfo:'তথ্য সেভ করুন',
    orderCount:'অর্ডার', cartItems:'কার্ট', wishItems:'উইশ',
    joinedOn:'যোগদান', verifiedCustomer:'ভেরিফায়েড কাস্টমার',
    menu:'মেনু', management:'ম্যানেজমেন্ট',
    uploadHint:'JPG, PNG (সর্বোচ্চ 5MB)',
    imgUploadSuccess:'✅ ছবি আপলোড হয়েছে', imgUploadFailed:'আপলোড ব্যর্থ',
    ordersPending:'পেন্ডিং অর্ডার', totalSpent:'মোট খরচ',
    reviewCart:'কার্ট রিভিউ', deliveryDetails:'ডেলিভারি তথ্য',
    paymentMethodStep:'পেমেন্ট পদ্ধতি', orderSummary:'অর্ডার সারাংশ',
    placeOrder:'অর্ডার নিশ্চিত করুন',
    searchResults:'সার্চ ফলাফল', suggestions:'পরামর্শ', noSuggestions:'কোনো পরামর্শ নেই',
    broadcastNotif:'ব্রডকাস্ট নোটিফিকেশন', broadcastDesc:'সব ইউজারকে একসাথে নোটিফিকেশন পাঠান',
    broadcastTitle:'নোটিফিকেশন টাইটেল', broadcastBody:'মেসেজ', sendBroadcast:'সবাইকে পাঠান',
    broadcastSent:'✅ সব ইউজারকে পাঠানো হয়েছে', broadcastFailed:'পাঠানো যায়নি',
    typeMessage:'মেসেজ লিখুন', recipients:'প্রাপক',
    productReviews:'পণ্যের রিভিউ', writeReview:'রিভিউ লিখুন',
    yourRating:'আপনার রেটিং', reviewText:'আপনার মতামত',
    submitReview:'রিভিউ জমা দিন', reviewSubmitted:'✅ রিভিউ জমা হয়েছে',
    noReviews:'এখনো কোনো রিভিউ নেই', beFirstReview:'প্রথম রিভিউ দিন',
    alreadyReviewed:'আপনি ইতিমধ্যে রিভিউ দিয়েছেন',
    adminAllAccess:'অ্যাডমিন সব কিছু দেখতে ও পরিবর্তন করতে পারে',
    readOnly:'শুধু পড়া যাবে', yourOrders:'আপনার অর্ডার', anotherUser:'অন্য ইউজারের তথ্য',
    accessDenied:'অ্যাক্সেস নেই', cannotViewOthers:'অন্য কারো তথ্য দেখতে পারবেন না',
    voiceSearch:'ভয়েস সার্চ', listening:'শুনছি...',
    imageSearch:'ছবি দিয়ে খুঁজুন', searchByImage:'ছবি আপলোড করে খুঁজুন',
    searchNoResults:'কিছু পাওয়া যায়নি', searching:'খোঁজা হচ্ছে...',
    filterByPrice:'দাম অনুসারে', priceRange:'দামের সীমা',
    minPrice:'সর্বনিম্ন', maxPrice:'সর্বোচ্চ', applyFilters:'প্রয়োগ করুন',
    clearAllFilters:'সব মুছুন', newProducts:'নতুন পণ্য', popularProducts:'জনপ্রিয়',
    bestSelling:'বেস্ট সেলিং', topRated:'উচ্চ রেটিং',
    freeDelivery:'ফ্রি ডেলিভারি', cashOnDelivery:'ক্যাশ অন ডেলিভারি'
  },
  en: {
    home:'Home', shop:'Shop', orders:'Orders', profile:'Profile', admin:'Admin',
    dashboard:'Dashboard', myOrders:'My Orders', wishlist:'Wishlist', cart:'Cart',
    login:'Login', logout:'Logout', register:'Register',
    adminPanel:'Admin Panel', notifications:'Notifications',
    settings:'Settings', theme:'Theme', language:'Language', light:'Light', dark:'Dark',
    searchPlaceholder:'Search products...',
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
    productName:'Product Name', description:'Description', images:'Images',
    oldPrice:'Old Price', discountPercent:'Discount (%)', featured_product:'Featured Product',
    reviews:'Reviews', relatedProducts:'Related Products',
    defaultSort:'Default', priceLowHigh:'Low to High', priceHighLow:'High to Low',
    newest:'Newest', popular:'Popular',
    profileUpdated:'Profile updated', loginSuccess:'Login successful', registerSuccess:'Registration successful',
    logoutSuccess:'Logged out', saveSuccess:'Saved', deleteSuccess:'Deleted',
    invalidCredentials:'Invalid credentials', accountBlocked:'Account blocked',
    emailExists:'This email is already registered. Please login.',
    passwordMismatch:'Passwords do not match', weakPassword:'Min 6 characters',
    fillAllFields:'Please fill all fields',
    invalidCoupon:'Invalid coupon', emptyCart:'Cart empty', items:'items',
    processing:'Processing...', loadingData:'Loading...',
    totalProducts:'Total Products', totalOrders:'Total Orders', totalUsers:'Total Users', totalSales:'Total Sales',
    pendingOrders:'Pending Orders', lowStock:'Low Stock', activeUsers:'Active Users',
    recentOrders:'Recent Orders', products:'Products', users:'Users', ordersTab:'Orders',
    coupons:'Coupons', categories:'Categories',
    addProduct:'Add Product', editProduct:'Edit Product', productSearch:'Search products...',
    userSearch:'Search name / email...', orderSearch:'Search orders...',
    role:'Role', customer:'Customer', adminRole:'Admin',
    blocked:'Blocked', active:'Active', block:'Block', unblock:'Unblock',
    selected:'selected', deleteConfirm:'Delete?', categoryName:'Category Name', addCategory:'Add',
    couponCode:'Coupon Code', percentOff:'Percent (%)', flatOff:'Flat (৳)', addCoupon:'Add',
    siteName:'Site Name', supportPhone:'Support Phone',
    noData:'No data', quickView:'Quick View',
    installApp:'Install App', installHint:'Add to home screen', install:'Install',
    offlineMode:'Offline', pushNotif:'Push', enable:'Enable', pushEnabled:'Push enabled',
    paymentMethod:'Payment', selectPayment:'Select payment',
    cod:'Cash on Delivery', codDesc:'Pay when you receive',
    bkash:'bKash', nagad:'Nagad', rocket:'Rocket', mobilePayment:'Mobile Payment',
    paymentNumber:'Payment Number', copy:'Copy', copied:'Copied',
    txnId:'Transaction ID', txnIdPlaceholder:'e.g. 8AB1C2D3E4',
    screenshot:'Screenshot', screenshotOptional:'(optional)', uploadScreenshot:'Upload',
    confirmOrder:'Confirm Order',
    orderSuccessCOD:'Order placed!',
    orderSuccessPaid:'Order placed! Awaiting verification',
    deliveryZone:'Delivery Zone', insideDhaka:'Inside Dhaka', outsideDhaka:'Outside Dhaka',
    deliveryCharge:'Delivery Charge',
    adminComment:'Comment', adminCommentOptional:'(optional)', commentPlaceholder:'Write comment...',
    paymentInfo:'Payment Info', settingsSaved:'Settings saved',
    numberCopied:'Number copied', invalidTxnId:'Enter valid Txn ID',
    sendOTP:'Send OTP', verifyOTP:'Verify', resendOTP:'Resend',
    verifyEmail:'Verify Email', weSentCode:'We sent a 6-digit code to',
    otpValidTime:'Valid 10 minutes', changeInfo:'Change info',
    otpSent:'✅ OTP sent', otpSending:'Sending...',
    otpVerifying:'Verifying...', emailAvailable:'✓ Available',
    emailTaken:'❌ Already registered',
    invalidEmail:'Enter valid email', agreeToTerms:'Agree to terms',
    enterFullCode:'Enter 6-digit code', registrationSuccess:'🎉 Registration successful!',
    otpFailed:'Failed to send email', dataLoadingWait:'Loading...',
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
    referral:'Referral', inviteFriends:'🎁 Invite Friends',
    loyalty:'Loyalty Points', trackOrder:'Track Order', track:'Tracking',
    salesTrend:'Sales Trend', totalSalesLabel:'Total Sales', ordersLabel:'Orders',
    whatsappOrder:'WhatsApp Order Confirmation', whatsappSend:'Send via WhatsApp',
    whatsappDesc:'Send order details to customer via WhatsApp',
    downloadPDF:'Download PDF', printInvoicePDF:'PDF Invoice', invoice:'Invoice',
    chatbot:'AI Assistant', botOnline:'Online', botPlaceholder:'Type a message...',
    botGreeting:'Hello! I am EcoBot. How can I help you?',
    botHelpMessage:'I can help with: find products, track orders, price inquiry, contact',
    botContact:'Contact: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'Order not found',
    botOrderStatus:'Your order status:',
    botThanks:'Thanks! Let me know if you need more help.',
    botFoundProducts:'I found these products:',
    botSearchingProducts:'Searching products...',
    botOrderTracking:'Enter order ID (ORD-...)',
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
    updatedByAdmin:'Updated by admin',
    changePassword:'Change Password',
    currentPassword:'Current Password',
    changePasswordDesc:'Enter current password for security',
    profilePicture:'Profile Picture',
    personalInfo:'Personal Info',
    personalInfoDesc:'Update your name, phone and address',
    security:'Security',
    wrongCurrentPassword:'Current password is wrong',
    passwordChanged:'✅ Password changed',
    passwordChangedDesc:'Your password has been changed successfully.',
    saveInfo:'Save Info',
    orderCount:'Orders', cartItems:'Cart', wishItems:'Wish',
    joinedOn:'Joined', verifiedCustomer:'Verified Customer',
    menu:'Menu', management:'Management',
    uploadHint:'JPG, PNG (max 5MB)',
    imgUploadSuccess:'✅ Image uploaded', imgUploadFailed:'Upload failed',
    ordersPending:'Pending Orders', totalSpent:'Total Spent',
    reviewCart:'Review Cart', deliveryDetails:'Delivery Details',
    paymentMethodStep:'Payment Method', orderSummary:'Order Summary',
    placeOrder:'Place Order',
    searchResults:'Search Results', suggestions:'Suggestions', noSuggestions:'No suggestions',
    broadcastNotif:'Broadcast Notification', broadcastDesc:'Send notification to all users at once',
    broadcastTitle:'Notification Title', broadcastBody:'Message', sendBroadcast:'Send to All',
    broadcastSent:'✅ Sent to all users', broadcastFailed:'Failed to send',
    typeMessage:'Type message', recipients:'Recipients',
    productReviews:'Product Reviews', writeReview:'Write Review',
    yourRating:'Your Rating', reviewText:'Your Review',
    submitReview:'Submit Review', reviewSubmitted:'✅ Review submitted',
    noReviews:'No reviews yet', beFirstReview:'Be the first to review',
    alreadyReviewed:'You already reviewed this product',
    adminAllAccess:'Admin can view and modify everything',
    readOnly:'Read only', yourOrders:'Your orders', anotherUser:'Another user',
    accessDenied:'Access denied', cannotViewOthers:'Cannot view others\' info',
    voiceSearch:'Voice Search', listening:'Listening...',
    imageSearch:'Search by Image', searchByImage:'Upload image to search',
    searchNoResults:'No results found', searching:'Searching...',
    filterByPrice:'Filter by Price', priceRange:'Price Range',
    minPrice:'Min', maxPrice:'Max', applyFilters:'Apply',
    clearAllFilters:'Clear All', newProducts:'New Products', popularProducts:'Popular',
    bestSelling:'Best Selling', topRated:'Top Rated',
    freeDelivery:'Free Delivery', cashOnDelivery:'Cash on Delivery'
  }
};
let LANG = localStorage.getItem('eco_lang') || 'bn';
const t = k => (I18N[LANG] && I18N[LANG][k]) || k;

/* ═══ Storage ═══ */
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

/* ═══ DB ═══ */
const DB = {
  products: [], users: [], orders: [], categories: [], coupons: [], notifs: [], reviews: [],
  settings: { ...DEFAULT_SETTINGS }, catRaw: {},
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
    this.watch('reviews', d => { this.reviews = this._toArray(d).sort((a,b)=>(b.date||0)-(a.date||0)); this._markReady('reviews'); });
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
    if(this.seeded) return; this.seeded = true;
    if(!this.ready.products || this.products.length > 0) return;
    const products = {
      p1:{id:'p1',name:'প্রিমিয়াম ইকো-বোতল',nameEn:'Premium Eco Bottle',cat:'ইলেকট্রনিকস',price:850,oldPrice:1200,discount:29,stock:45,img:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',desc:'পরিবেশ বান্ধব স্টেইনলেস স্টিল বোতল।',featured:true,createdAt:Date.now(),rating:4.5,reviewCount:12},
      p2:{id:'p2',name:'ওয়্যারলেস হেডফোন',nameEn:'Wireless Headphone',cat:'ইলেকট্রনিকস',price:2500,oldPrice:3500,discount:29,stock:20,img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',desc:'নয়েজ ক্যানসেলিং হেডফোন।',featured:true,createdAt:Date.now()+1,rating:4.7,reviewCount:34},
      p3:{id:'p3',name:'স্মার্ট ওয়াচ',nameEn:'Smart Watch',cat:'গ্যাজেট',price:3200,oldPrice:4500,discount:29,stock:15,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',desc:'ফিটনেস ট্র্যাকিং স্মার্ট ওয়াচ।',featured:true,createdAt:Date.now()+2,rating:4.3,reviewCount:18}
    };
    const users = { u_admin:{id:'u_admin',name:'Admin',email:'admin@eco.pro',password:'admin123',role:'admin',blocked:false,joined:Date.now(),avatar:'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',phone:'01700000000'} };
    const cats = { c1:'ইলেকট্রনিকস', c2:'গ্যাজেট', c3:'ফ্যাশন', c4:'ফটোগ্রাফি' };
    const coupons = { cp1:{id:'cp1',code:'ECO10',type:'percent',value:10} };
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
  /* v13 — Broadcast to all users */
  async broadcastNotif(title, body){
    const id = 'n_broadcast_' + Date.now();
    const notif = { id, title, body, time: Date.now(), read: false, type: 'broadcast', broadcast: true };
    return db.ref('notifications/'+id).set(notif);
  },
  saveReview(r){ const id='r_'+Date.now(); r.id=id; r.date=Date.now(); return db.ref('reviews/'+id).set(r); },
  isReady(){ return this.ready.products && this.ready.users && this.ready.orders; },
  updateStock(productId, newStock){ return db.ref('products/'+productId+'/stock').set(newStock); },
  getProductReviews(productId){ return this.reviews.filter(r=>r.productId===productId); },
  async addReviewToProduct(productId, rating){
    const p = this.products.find(x=>x.id===productId); if(!p) return;
    const count = (p.reviewCount||0) + 1;
    const oldTotal = (p.rating||0) * (p.reviewCount||0);
    const newRating = (oldTotal + rating) / count;
    return db.ref('products/'+productId).update({ rating: parseFloat(newRating.toFixed(2)), reviewCount: count });
  },
  async saveSettings(s){ return db.ref('settings').set(s); }
};

/* ═══ Image Upload ═══ */
const ImageUpload = {
  async upload(file){
    if(!file) throw new Error('No file');
    if(file.size > 5*1024*1024) throw new Error('Max 5MB');
    if(!file.type.startsWith('image/')) throw new Error('Images only');
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', file);
    const res = await fetch(IMGBB_UPLOAD_URL, { method:'POST', body: form });
    const json = await res.json();
    if(!json.success) throw new Error(json.error?.message || 'Upload failed');
    return { url: json.data.url, thumb: json.data.thumb?.url || json.data.url };
  }
};

/* ═══ OTP ═══ */
const OTP = {
  currentEmail: null, currentCode: null, expiresAt: 0, attempts: 0, cooldownTimer: null, verified: false,
  init(){ if(typeof emailjs === 'undefined') return false; if(!EmailJSConfig.initialized){ try { emailjs.init({ publicKey: EmailJSConfig.publicKey }); EmailJSConfig.initialized = true; return true; } catch(e){ return false; } } return true; },
  generate(){ return String(Math.floor(100000 + Math.random() * 900000)); },
  async send(email, name){
    if(!this.init()) return { ok:false, msg:'EmailJS not loaded' };
    const code = this.generate();
    this.currentEmail = Auth.normalizeEmail(email); this.currentCode = code;
    this.expiresAt = Date.now() + 10*60*1000; this.attempts = 0; this.verified = false;
    try {
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, { to_email:this.currentEmail, email:this.currentEmail, reply_to:this.currentEmail, otp_code:code, code:code, user_name:name||'User', site_name:'EcoShop Pro MAX' });
      return { ok:true };
    } catch(err){ return { ok:false, msg: err?.text || err?.message || 'Failed' }; }
  },
  async verify(input){
    if(!this.currentCode) return { ok:false, msg:'Send code first' };
    if(Date.now() > this.expiresAt) return { ok:false, msg:'Code expired' };
    if(this.attempts >= 5) return { ok:false, msg:'Too many attempts' };
    if(String(input).trim() !== this.currentCode){ this.attempts++; return { ok:false, msg:`Wrong code (${5-this.attempts} left)` }; }
    this.verified = true; return { ok:true };
  },
  reset(){ this.currentEmail=null; this.currentCode=null; this.expiresAt=0; this.attempts=0; this.verified=false; if(this.cooldownTimer) clearInterval(this.cooldownTimer); },
  startCooldown(sec, cb){ if(this.cooldownTimer) clearInterval(this.cooldownTimer); this.cooldownTimer = setInterval(()=>{ sec--; if(cb) cb(sec); if(sec <= 0){ clearInterval(this.cooldownTimer); this.cooldownTimer = null; } }, 1000); },
  maskEmail(email){ if(!email) return ''; const [u, d] = email.split('@'); if(!d) return email; return `${u.slice(0, Math.min(3, u.length))}${'*'.repeat(Math.max(2, u.length - 3))}@${d}`; }
};

/* ═══ WhatsApp ═══ */
const WhatsApp = {
  formatBD(n){ let s = String(n||'').replace(/\D/g,''); if(s.startsWith('0')) s='88'+s; else if(!s.startsWith('88')) s='880'+s.replace(/^0+/,''); return s; },
  buildMessage(o){
    const items = (o.items||[]).map((it,i)=>`${i+1}. ${it.name}\n   ${it.qty} × ৳${it.price} = ৳${it.qty*it.price}`).join('\n\n');
    return LANG==='bn' ? `🛒 *EcoShop Pro MAX*\n\n👤 ${o.customer.name}\n📞 ${o.customer.phone}\n📍 ${o.customer.address}\n\n📦 *পণ্য:*\n${items}\n\n💰 সাবটোটাল: ৳${o.subtotal||0}\n🚚 ডেলিভারি: ৳${o.deliveryCharge||0}\n✅ *সর্বমোট: ৳${o.total}*\n\n🆔 ${o.id}\n📊 ${Orders.statusLabel(o.status)}`
      : `🛒 *EcoShop Pro MAX*\n\n👤 ${o.customer.name}\n📞 ${o.customer.phone}\n📍 ${o.customer.address}\n\n📦 *Items:*\n${items}\n\n💰 Subtotal: ৳${o.subtotal||0}\n🚚 Delivery: ৳${o.deliveryCharge||0}\n✅ *Total: ৳${o.total}*\n\n🆔 ${o.id}\n📊 ${Orders.statusLabel(o.status)}`;
  },
  send(o, phone){
    if(!o) return;
    const p = this.formatBD(phone || o.customer.phone);
    if(!p){ Toast.show('Invalid phone','error'); return; }
    window.open(`https://wa.me/${p}?text=${encodeURIComponent(this.buildMessage(o))}`, '_blank');
  }
};

/* ═══ PDF ═══ */
const PDFInvoice = {
  generate(orderId){
    const o = DB.orders.find(x => x.id === orderId); if(!o) return;
    const isBn = LANG === 'bn';
    const w = window.open('', '_blank', 'width=900,height=1000');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${o.id}</title>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet">
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'${isBn?'Hind Siliguri':'Plus Jakarta Sans'}',sans-serif;background:#f5f6fa;padding:24px;color:#0f1021}
      .inv{max-width:760px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(15,16,33,.08)}
      .h{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:28px 32px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}
      .h h1{font-size:22px;font-weight:800}.h h1 span{color:#ffe49a}
      .h .meta{text-align:right;font-size:13px}.h .meta h2{font-size:24px;font-weight:800;margin-bottom:6px}
      .parties{padding:24px 32px;border-bottom:1px dashed #e5e8f0;display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:13px}
      .pl{font-size:10.5px;font-weight:800;color:#94a3b8;text-transform:uppercase;margin-bottom:6px}
      .pn{font-size:15px;font-weight:800;margin-bottom:6px}.pd{color:#64748b;line-height:1.6}
      table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:12px;text-align:left;border-bottom:1px solid #e5e8f0;font-size:13px}
      th{background:#f8f9fd;font-size:11px;text-transform:uppercase;color:#64748b}
      td:nth-child(2),td:nth-child(3),td:nth-child(4){text-align:right}
      .totals{padding:0 32px 24px;display:flex;justify-content:flex-end}.tb{width:100%;max-width:320px}
      .tr{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;color:#64748b}
      .tr.g{border-top:2px solid #e5e8f0;margin-top:8px;padding-top:14px;font-size:18px;font-weight:800;color:#6366f1}
      .f{padding:20px 32px;background:#f8f9fd;text-align:center;font-size:12px;color:#64748b}
      .bar{position:fixed;top:20px;right:20px;display:flex;gap:8px;z-index:100}
      .bar button{padding:12px 20px;background:#6366f1;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit}
      @media print{.bar{display:none}}</style></head><body>
      <div class="bar"><button onclick="window.print()">🖨️ ${isBn?'প্রিন্ট / সেভ PDF':'Print / Save PDF'}</button><button style="background:#fff;color:#64748b" onclick="window.close()">✕</button></div>
      <div class="inv"><div class="h"><div><h1>EcoShop<span>Pro</span></h1><p style="font-size:12px;opacity:.9;margin-top:4px">${DB.settings.supportPhone||''}</p></div>
      <div class="meta"><h2>${isBn?'ইনভয়েস':'INVOICE'}</h2><div>${o.id}</div><div>${new Date(o.date).toLocaleDateString(isBn?'bn-BD':'en-US')}</div></div></div>
      <div class="parties"><div><div class="pl">${isBn?'প্রেরক':'From'}</div><div class="pn">${DB.settings.siteName}</div><div class="pd">${DB.settings.supportEmail}<br>${DB.settings.supportPhone}</div></div>
      <div><div class="pl">${isBn?'প্রাপক':'Bill To'}</div><div class="pn">${o.customer.name}</div><div class="pd">${o.customer.phone}<br>${o.customer.address}</div></div></div>
      <table><thead><tr><th>${isBn?'পণ্য':'Item'}</th><th>${isBn?'পরিমাণ':'Qty'}</th><th>${isBn?'দর':'Price'}</th><th>${isBn?'মোট':'Total'}</th></tr></thead>
      <tbody>${(o.items||[]).map(it=>`<tr><td>${it.name}</td><td>${it.qty}</td><td>৳${it.price}</td><td>৳${it.qty*it.price}</td></tr>`).join('')}</tbody></table>
      <div class="totals"><div class="tb"><div class="tr"><span>${isBn?'সাবটোটাল':'Subtotal'}</span><span>৳${o.subtotal||0}</span></div><div class="tr"><span>${isBn?'ডেলিভারি':'Delivery'}</span><span>৳${o.deliveryCharge||0}</span></div>${o.discount?`<div class="tr"><span>${isBn?'ডিসকাউন্ট':'Discount'}</span><span>-৳${o.discount}</span></div>`:''}<div class="tr g"><span>${isBn?'সর্বমোট':'Grand Total'}</span><span>৳${o.total}</span></div></div></div>
      <div class="f">${isBn?'ধন্যবাদ!':'Thank you!'} — ${DB.settings.siteName} © ${new Date().getFullYear()}</div></div></body></html>`);
    w.document.close();
  }
};

/* ═══ UI ═══ */
const Toast = {
  show(msg, type='info', ms=2800){
    const box = document.getElementById('toastContainer'); if(!box) return;
    const el = document.createElement('div'); el.className = `toast ${type}`;
    const icons = { info:'fa-circle-info', success:'fa-circle-check', error:'fa-circle-exclamation', warning:'fa-triangle-exclamation' };
    el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i><span>${msg}</span>`;
    box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(40px)'; setTimeout(()=>el.remove(),250); }, ms);
  },
  progress(){ const p=document.getElementById('topProgress'); if(!p) return; p.style.width='70%'; setTimeout(()=>{p.style.width='100%';setTimeout(()=>p.style.width='0',300);},300); }
};
const Modal = {
  open(html, cls=''){ document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)Modal.close()"><div class="modal-box ${cls}">${html}</div></div>`; document.body.style.overflow = 'hidden'; },
  close(){ document.getElementById('modalRoot').innerHTML=''; document.body.style.overflow=''; },
  confirm(msg, onYes){
    this.open(`<div class="confirm-box"><i class="fa-solid fa-triangle-exclamation"></i><p>${msg}</p><div class="confirm-actions"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-danger btn-block" id="modalConfirmYes">${t('yes')}</button></div></div>`, 'sm');
    document.getElementById('modalConfirmYes').onclick = () => { Modal.close(); onYes && onYes(); };
  }
};
function loadingHTML(msg){ return `<div class="loading-state"><div class="spinner"></div><p>${msg||t('loadingData')}</p></div>`; }
function money(n){ return '৳' + (Number(n)||0).toLocaleString(LANG==='bn'?'bn-BD':'en-US'); }
function timeAgo(ts){
  const diff = Date.now() - ts; const s = Math.floor(diff/1000);
  if(s<60) return LANG==='bn'?'এইমাত্র':'Just now';
  const m = Math.floor(s/60); if(m<60) return LANG==='bn'?`${m} মিনিট আগে`:`${m}m ago`;
  const h = Math.floor(m/60); if(h<24) return LANG==='bn'?`${h} ঘণ্টা আগে`:`${h}h ago`;
  const d = Math.floor(h/24); if(d<30) return LANG==='bn'?`${d} দিন আগে`:`${d}d ago`;
  return new Date(ts).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US');
}
function starHTML(rating, size){
  const full = Math.floor(rating||0); const half = rating - full >= 0.5;
  let s = '';
  for(let i=0;i<5;i++){
    if(i<full) s += '<i class="fa-solid fa-star"></i>';
    else if(i===full && half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
    else s += '<i class="fa-regular fa-star"></i>';
  }
  return `<span class="stars" style="${size?`font-size:${size}`:''}">${s}</span>`;
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ═══ Auth ═══ */
const Auth = {
  user(){ return Session.get(); },
  isAdmin(){ const u=this.user(); return u && u.role==='admin'; },
  normalizeEmail(email){ return email ? String(email).trim().toLowerCase() : ''; },
  checkEmailStatus(email){
    const target = this.normalizeEmail(email);
    if(!target) return { status:'free' };
    if(!DB.ready.users) return { status:'unknown' };
    return { status: (DB.users||[]).some(u => this.normalizeEmail(u.email) === target) ? 'taken' : 'free' };
  },
  isEmailTaken(email){ return this.checkEmailStatus(email).status === 'taken'; },
  async login(email, password){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.normalizeEmail(email);
    const u = DB.users.find(x => this.normalizeEmail(x.email) === target && x.password === password);
    if(!u) return { ok:false, msg:t('invalidCredentials') };
    if(u.blocked) return { ok:false, msg:t('accountBlocked') };
    Session.set(u); return { ok:true, user:u };
  },
  async register(data){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.normalizeEmail(data.email);
    if(this.isEmailTaken(target)) return { ok:false, msg:t('emailExists') };
    const u = { id:'u_'+Date.now()+'_'+Math.floor(Math.random()*1000), name:data.name, email:target, password:data.password, phone:data.phone||'', address:data.address||'', role:'customer', blocked:false, joined:Date.now(), emailVerified:true, avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff` };
    try { await DB.saveUser(u); Session.set(u); return { ok:true, user:u }; }
    catch(e){ return { ok:false, msg:'Save failed: ' + e.message }; }
  },
  logout(){ Session.clear(); Toast.show(t('logoutSuccess'),'success'); App.go('home'); }
};

/* ═══ Cart ═══ */
const Cart = {
  items(){ return CartStore.get(); },
  save(items){ CartStore.set(items); this.refresh(); },
  add(id, qty=1){
    const items = this.items(); const found = items.find(i=>i.id===id);
    const p = DB.products.find(x=>x.id===id); if(!p) return;
    if(p.stock < qty) return Toast.show(t('outOfStock'),'error');
    if(found){ if(found.qty+qty > p.stock) return Toast.show(t('outOfStock'),'error'); found.qty += qty; }
    else items.push({ id, qty });
    this.save(items);
    Toast.show(LANG==='bn'?'কার্টে যোগ হয়েছে':'Added to cart','success');
  },
  remove(id){ this.save(this.items().filter(i=>i.id!==id)); },
  setQty(id, qty){
    const items = this.items(); const it = items.find(i=>i.id===id); if(!it) return;
    const p = DB.products.find(x=>x.id===id);
    if(p && qty > p.stock) return Toast.show(t('outOfStock'),'error');
    it.qty = Math.max(1, qty); this.save(items);
  },
  count(){ return this.items().reduce((s,i)=>s+i.qty,0); },
  subtotal(){ return this.items().reduce((s,i)=>{ const p=DB.products.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); },
  shippingCharge(zone){ if(this.count()<=0) return 0; return (zone==='outside') ? (DB.settings.shippingOutsideDhaka||120) : (DB.settings.shippingInsideDhaka||100); },
  refresh(){
    const c = this.count();
    const setT = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
    const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = c>0?c:'';
    const bn = document.getElementById('bnCartBadge'); if(bn) bn.textContent = c>0?c:'';
    const pmc = document.getElementById('pmCartCount'); if(pmc) pmc.textContent = c;
    setT('cartCount', `${c} ${t('items')}`);
    setT('cartSubtotal', money(this.subtotal()));
    setT('cartShipping', money(this.shippingCharge('inside')));
    setT('cartTotal', money(this.subtotal()+this.shippingCharge('inside')));
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
      return `<div class="cart-item"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/70'"><div class="cart-item-info"><h5>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h5><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="price" style="font-size:14px">${money(p.price)}</span><button class="icon-btn-sm danger" onclick="Cart.remove('${p.id}')"><i class="fa-solid fa-trash"></i></button></div><div class="qty-ctrl"><button onclick="Cart.setQty('${p.id}', ${i.qty-1})">−</button><span>${i.qty}</span><button onclick="Cart.setQty('${p.id}', ${i.qty+1})">+</button></div></div></div>`;
    }).join('');
  }
};

/* ═══ Wish ═══ */
const Wish = {
  all(){ return WishStore.get(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all(); const idx = list.indexOf(id);
    if(idx>-1){ list.splice(idx,1); Toast.show(LANG==='bn'?'সরানো হয়েছে':'Removed','info'); }
    else { list.push(id); Toast.show(LANG==='bn'?'যোগ হয়েছে':'Added','success'); }
    WishStore.set(list);
    if(['wishlist','shop','home','product'].includes(App.route)) App.render(); else App.syncUI();
  }
};

/* ═══ Orders ═══ */
const Orders = {
  STATUS_FLOW: ['pending','confirmed','processing','shipped','out_for_delivery','delivered'],
  STATUS_ALL: ['pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','rejected'],
  all(){ return DB.orders; },
  mine(){ const u=Auth.user(); if(!u) return []; return DB.orders.filter(o=>o.userId===u.id); },
  async create(data){
    const u = Auth.user();
    const order = { id:'ORD-'+Date.now().toString().slice(-8), userId:u?u.id:0, customer:data.customer, items:data.items, subtotal:data.subtotal, deliveryCharge:data.deliveryCharge, deliveryZone:data.deliveryZone, discount:data.discount||0, total:data.total, coupon:data.coupon||null, paymentMethod:data.paymentMethod, paymentNumber:data.paymentNumber||null, txnId:data.txnId||null, screenshot:data.screenshot||null, status:'pending', paymentStatus:data.paymentMethod==='cod'?'cod_pending':'awaiting_verification', courier:null, trackingNumber:null, eta:null, internalNotes:[], date:Date.now(), history:[{ status:'pending', time:Date.now(), comment:t('orderReceived'), by:'Customer' }] };
    const saved = await DB.saveOrder(order);
    data.items.forEach(async i => { const p = DB.products.find(x=>x.id===i.id); if(p) try { await DB.updateStock(p.id, Math.max(0, p.stock-i.qty)); } catch(e){} });
    try { await DB.pushNotif({ title:LANG==='bn'?'🛒 নতুন অর্ডার!':'🛒 New Order!', body:`${data.customer.name} — ${money(data.total)}`, type:'order' }); } catch(e){}
    Cart.save([]); return saved;
  },
  async updateStatus(id, status, comment, extra){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const history = (o.history||[]).concat([{ status, time:Date.now(), comment:comment||'', by:(Auth.user()&&Auth.user().name)||'System' }]);
    const patch = { status, history };
    if(extra) Object.assign(patch, extra);
    return DB.updateOrder(id, patch);
  },
  async update(id, patch){ return DB.updateOrder(id, patch); },
  async addNote(id, note){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const notes = (o.internalNotes||[]).concat([{ text:note, time:Date.now(), by:(Auth.user()&&Auth.user().name)||'Admin' }]);
    return DB.updateOrder(id, { internalNotes: notes });
  },
  async cancel(id, reason){ return this.updateStatus(id, 'cancelled', reason||t('cancelledByAdmin')); },
  async reject(id, reason){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    (o.items||[]).forEach(async item => { const p=DB.products.find(x=>x.id===item.id); if(p) try { await DB.updateStock(p.id, p.stock+item.qty); } catch(e){} });
    return this.updateStatus(id, 'rejected', reason||t('rejectedByAdmin'), { paymentStatus:'rejected' });
  },
  remove(id){ return DB.deleteOrder(id); },
  counts(){ const c = { pending:0, confirmed:0, processing:0, shipped:0, out_for_delivery:0, delivered:0, cancelled:0, rejected:0 }; DB.orders.forEach(o => { c[o.status] = (c[o.status]||0)+1; }); return c; },
  statusLabel(s){ return t(s) || s; },
  statusIcon(s){
    const m = { pending:'fa-clock', confirmed:'fa-check-circle', processing:'fa-gears', shipped:'fa-truck', out_for_delivery:'fa-motorcycle', delivered:'fa-circle-check', cancelled:'fa-xmark-circle', rejected:'fa-ban' };
    return m[s] || 'fa-circle';
  },
  detail(orderId){
    const o = DB.orders.find(x=>x.id===orderId); if(!o) return;
    const u = Auth.user();
    /* ✅ Privacy check: User can only view their own orders */
    if(!Auth.isAdmin() && (!u || o.userId !== u.id)){
      return Toast.show(t('cannotViewOthers'),'error');
    }
    const isBn = LANG==='bn';
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div>
      <div class="modal-body">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.statusIcon(o.status)}"></i> ${Orders.statusLabel(o.status)}</span>
          <span class="order-amount">${money(o.total)}</span>
        </div>
        <div class="order-detail-grid">
          <div class="order-detail-section"><h5><i class="fa-solid fa-user"></i> ${t('customerInfo')}</h5>
            <div class="detail-row"><span>${isBn?'নাম':'Name'}</span><span>${o.customer.name}</span></div>
            <div class="detail-row"><span>${isBn?'ফোন':'Phone'}</span><span>${o.customer.phone}</span></div>
            <div class="detail-row"><span>${isBn?'ঠিকানা':'Address'}</span><span>${o.customer.address}${o.customer.city?', '+o.customer.city:''}</span></div>
          </div>
          <div class="order-detail-section"><h5><i class="fa-solid fa-credit-card"></i> ${t('paymentDetails')}</h5>
            <div class="detail-row"><span>${isBn?'পদ্ধতি':'Method'}</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>
            ${o.txnId?`<div class="detail-row"><span>Txn ID</span><span>${o.txnId}</span></div>`:''}
          </div>
          <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-box"></i> ${t('orderItems')}</h5>
            <div class="order-items-list">${(o.items||[]).map(it=>{const p=DB.products.find(x=>x.id===it.id);return `<div class="order-item-row"><img src="${p?p.img:''}" onerror="this.src='https://via.placeholder.com/48'"><div class="order-item-info"><h6>${it.name}</h6><p>${it.qty} × ${money(it.price)}</p></div><span class="order-item-price">${money(it.qty*it.price)}</span></div>`;}).join('')}</div>
            <div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px">
              <div class="detail-row"><span>${t('subtotal')}</span><span>${money(o.subtotal||0)}</span></div>
              <div class="detail-row"><span>${t('deliveryCharge')}</span><span>${money(o.deliveryCharge||0)}</span></div>
              ${o.discount?`<div class="detail-row"><span>${t('discount')}</span><span>-${money(o.discount)}</span></div>`:''}
              <div class="detail-row" style="border-top:2px solid var(--border);margin-top:6px;padding-top:10px"><span><b>${t('total')}</b></span><span style="color:var(--brand);font-size:16px;font-weight:800">${money(o.total)}</span></div>
            </div>
          </div>
          <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5>
            <ul class="order-history">${(o.history||[]).slice().reverse().map((h,i)=>`<li class="${i===0?'current':''}"><span class="h-dot"></span><h6>${Orders.statusLabel(h.status)}</h6><small>${new Date(h.time).toLocaleString(isBn?'bn-BD':'en-US')}${h.by?' • '+h.by:''}</small>${h.comment?`<div class="h-comment">${h.comment}</div>`:''}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
        <button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        <button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button>
      </div>`, 'lg');
  },
  reorder(orderId){
    const o = DB.orders.find(x=>x.id===orderId); if(!o) return;
    let added = 0;
    (o.items||[]).forEach(it => { const p = DB.products.find(x=>x.id===it.id); if(p && p.stock>0){ Cart.add(p.id, Math.min(it.qty, p.stock)); added++; } });
    if(added){ Toast.show(LANG==='bn'?`${added}টি পণ্য কার্টে যোগ হয়েছে`:`${added} items added`,'success'); App.openCart(); }
    else Toast.show(LANG==='bn'?'পণ্য স্টকে নেই':'Out of stock','error');
  }
};

/* ═══ Notifs ═══ */
const Notifs = {
  all(){ return DB.notifs; },
  unread(){ return this.all().filter(n=>!n.read).length; },
  markAllRead(){ this.all().forEach(n => { if(!n.read) db.ref('notifications/'+n.id+'/read').set(true).catch(()=>{}); }); },
  refresh(){
    const b = document.getElementById('notifBadge'); if(b) b.textContent = this.unread()||'';
    const c = document.getElementById('notifCount'); if(c) c.textContent = `${this.unread()} unread`;
    const list = document.getElementById('notifList'); if(!list) return;
    const arr = this.all();
    list.innerHTML = arr.length ? arr.map(n=>`<div class="notif-item ${n.read?'':'unread'}"><div class="notif-icon"><i class="fa-solid ${n.type==='broadcast'?'fa-bullhorn':'fa-bell'}"></i></div><div><h5>${n.title}</h5><p>${n.body}</p><small>${timeAgo(n.time)}</small></div></div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>No notifications</h3></div>`;
  }
};

/* ═══ Advanced Search Engine ═══ */
const SearchEngine = {
  /* Levenshtein distance for fuzzy matching */
  levenshtein(a, b){
    if(a.length === 0) return b.length;
    if(b.length === 0) return a.length;
    const matrix = [];
    for(let i=0;i<=b.length;i++) matrix[i] = [i];
    for(let j=0;j<=a.length;j++) matrix[0][j] = j;
    for(let i=1;i<=b.length;i++){
      for(let j=1;j<=a.length;j++){
        if(b.charAt(i-1) === a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1];
        else matrix[i][j] = Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
      }
    }
    return matrix[b.length][a.length];
  },
  /* Calculate match score */
  score(product, query){
    const q = query.toLowerCase().trim();
    if(!q) return 0;
    const name = (product.name||'').toLowerCase();
    const nameEn = (product.nameEn||'').toLowerCase();
    const cat = (product.cat||'').toLowerCase();
    const desc = (product.desc||'').toLowerCase();
    const combined = `${name} ${nameEn} ${cat} ${desc}`;

    let score = 0;
    // Exact name match
    if(name === q || nameEn === q) score += 100;
    // Name starts with
    else if(name.startsWith(q) || nameEn.startsWith(q)) score += 80;
    // Name contains
    else if(name.includes(q) || nameEn.includes(q)) score += 60;
    // Category match
    if(cat.includes(q)) score += 40;
    // Description match
    if(desc.includes(q)) score += 20;

    // Word-by-word match
    const words = q.split(/\s+/).filter(w => w.length > 1);
    if(words.length > 1){
      words.forEach(w => {
        if(combined.includes(w)) score += 15;
        else {
          // Fuzzy match
          const combinedWords = combined.split(/\s+/);
          for(const cw of combinedWords){
            if(cw.length > 2 && this.levenshtein(w, cw) <= 1){ score += 8; break; }
          }
        }
      });
    }
    return score;
  },
  /* Search products */
  search(query, opts = {}){
    if(!query || !query.trim()) return [];
    const limit = opts.limit || 20;
    const results = DB.products
      .map(p => ({ product: p, score: this.score(p, query) }))
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, limit);
    return results;
  },
  /* Image search — match by looking for similar products (simplified) */
  async imageSearch(file){
    if(!file) return [];
    const fileName = file.name.toLowerCase();
    const keywords = fileName.replace(/\.[^.]+$/, '').split(/[-_\s]+/).filter(w => w.length > 2);
    if(!keywords.length) return DB.products.slice(0, 6);
    let results = [];
    keywords.forEach(kw => {
      const found = this.search(kw, { limit: 6 });
      found.forEach(r => {
        if(!results.find(x => x.product.id === r.product.id)) results.push(r);
      });
    });
    return results.slice(0, 12);
  }
};

/* ═══ Voice Search ═══ */
const VoiceSearch = {
  init(onResult){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return false;
    const rec = new SR();
    rec.lang = LANG === 'bn' ? 'bn-BD' : 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if(onResult) onResult(text);
    };
    rec.onerror = () => Toast.show(LANG==='bn'?'ভয়েস শোনা যায়নি':'Voice not recognized','error');
    try { rec.start(); return true; } catch(e){ return false; }
  }
};

/* ═══ Compare ═══ */
const Compare = {
  MAX: 4, key:'eco_compare',
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; } },
  save(list){ localStorage.setItem(this.key, JSON.stringify(list)); this.updateBar(); },
  has(id){ return this.all().includes(id); },
  toggle(id){
    const list = this.all(); const idx = list.indexOf(id);
    if(idx>-1) list.splice(idx,1);
    else { if(list.length >= this.MAX) return Toast.show(`Max ${this.MAX}`,'warning'); list.push(id); }
    this.save(list);
    if(['home','shop','wishlist','product'].includes(App.route)) App.render();
  },
  clear(){ this.save([]); },
  updateBar(){
    const bar = document.getElementById('compareBar'); if(!bar) return;
    const list = this.all();
    if(!list.length){ bar.style.display = 'none'; return; }
    bar.style.display = 'block';
  }
};

/* ═══ Wallet / Referral / Loyalty ═══ */
const Wallet = {
  getBalance(uid){ if(!uid) return 0; try { const d=JSON.parse(localStorage.getItem('eco_wallet_balance')||'{}'); return d[uid]||0; } catch(e){ return 0; } },
  setBalance(uid, amt){ try { const d=JSON.parse(localStorage.getItem('eco_wallet_balance')||'{}'); d[uid]=amt; localStorage.setItem('eco_wallet_balance', JSON.stringify(d)); } catch(e){} },
  addBalance(uid, amt, reason){
    if(!uid) return; const cur = this.getBalance(uid); const nb = Math.max(0, cur+amt);
    this.setBalance(uid, nb);
    try { const all=JSON.parse(localStorage.getItem('eco_wallet_tx')||'{}'); if(!all[uid]) all[uid]=[]; all[uid].unshift({ amount:amt, type:amt>0?'credit':'debit', reason:reason||'Transaction', time:Date.now(), balance:nb, id:'tx_'+Date.now() }); all[uid]=all[uid].slice(0,50); localStorage.setItem('eco_wallet_tx', JSON.stringify(all)); } catch(e){}
    return nb;
  },
  getTransactions(uid){ try { const all=JSON.parse(localStorage.getItem('eco_wallet_tx')||'{}'); return all[uid]||[]; } catch(e){ return []; } },
  open(){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const balance = this.getBalance(u.id); const txs = this.getTransactions(u.id);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-wallet"></i> ${t('wallet')}</h3></div><div class="modal-body"><div class="wallet-card"><div class="wallet-card-inner"><label>${t('balance')}</label><span class="wallet-amount">${money(balance)}</span><div class="wallet-actions"><button class="btn btn-sm btn-solid" onclick="Wallet.topUp()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button></div></div></div><h4 style="font-size:14px;font-weight:800;margin:20px 0 10px"><i class="fa-solid fa-list"></i> ${t('transactions')}</h4>${txs.length ? txs.map(tx=>`<div class="tx-item"><div class="tx-icon ${tx.type}"><i class="fa-solid fa-${tx.type==='credit'?'arrow-down':'arrow-up'}"></i></div><div class="tx-info"><h5>${tx.reason}</h5><p>${new Date(tx.time).toLocaleString()}</p></div><span class="tx-amount ${tx.type}">${tx.type==='credit'?'+':''}${money(tx.amount)}</span></div>`).join('') : `<p class="muted">${t('noTransactions')}</p>`}</div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`);
  },
  topUp(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-plus"></i> ${t('addMoney')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('amount')} (৳)</label><input type="number" id="walletTopUp" min="50" step="50" value="500" autofocus></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="Wallet.processTopUp()"><i class="fa-solid fa-check"></i> ${t('save')}</button></div>`);
  },
  processTopUp(){
    const amt = +document.getElementById('walletTopUp').value;
    if(!amt || amt < 50) return Toast.show('Min ৳50','error');
    const u = Auth.user(); if(!u) return;
    Wallet.addBalance(u.id, amt, 'Top up');
    Modal.close(); Toast.show(`${money(amt)} added`,'success'); App.render();
  }
};
const Referral = {
  BONUS: 50,
  generateCode(uid){ return uid ? ('ECO'+uid.slice(-5).toUpperCase()).replace(/[^A-Z0-9]/g,'').slice(0,10) : 'ECO000'; },
  async applyCode(code){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const cleanCode = (code||'').trim().toUpperCase();
    if(!cleanCode) return Toast.show('Enter code','error');
    if(cleanCode === this.generateCode(u.id)) return Toast.show('Own code','error');
    if(u.referralApplied) return Toast.show('Already applied','warning');
    const referrer = DB.users.find(x => this.generateCode(x.id) === cleanCode);
    if(!referrer) return Toast.show('Invalid code','error');
    Wallet.addBalance(u.id, this.BONUS, 'Referral bonus');
    Wallet.addBalance(referrer.id, this.BONUS, 'Referral bonus');
    Session.set({...u, referralApplied:true, referralCode:cleanCode});
    await DB.updateUser(u.id, { referralApplied:true, referralCode:cleanCode });
    Toast.show(`🎉 ৳${this.BONUS} for both!`,'success',5000);
    App.render();
  },
  open(){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const code = this.generateCode(u.id);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-users"></i> ${t('referral')}</h3></div><div class="modal-body"><div class="referral-card"><div style="font-size:14px;font-weight:700;margin-bottom:8px">${t('inviteFriends')}</div><div class="referral-code"><span>${code}</span><button onclick="navigator.clipboard.writeText('${code}').then(()=>Toast.show('Copied','success'))"><i class="fa-solid fa-copy"></i></button></div></div><div class="form-group" style="margin-top:20px"><label>Apply Code</label><div style="display:flex;gap:8px"><input id="applyCodeInput" placeholder="ECO..." style="flex:1"><button class="btn btn-primary" onclick="Referral.applyCode(document.getElementById('applyCodeInput').value)"><i class="fa-solid fa-check"></i></button></div></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`);
  }
};
const Loyalty = {
  RATE: 0.01,
  getPoints(uid){ if(!uid) return 0; try { const d=JSON.parse(localStorage.getItem('eco_loyalty')||'{}'); return d[uid]||0; } catch(e){ return 0; } },
  setPoints(uid, p){ try { const d=JSON.parse(localStorage.getItem('eco_loyalty')||'{}'); d[uid]=p; localStorage.setItem('eco_loyalty', JSON.stringify(d)); } catch(e){} },
  addFromOrder(uid, total){ if(!uid) return 0; const pts = Math.floor(total*this.RATE); this.setPoints(uid, this.getPoints(uid)+pts); return pts; }
};

/* ═══ Analytics ═══ */
const Analytics = {
  period: '7d',
  setPeriod(p){ this.period = p; Admin.refreshContent(); },
  getData(){
    const days = this.period==='30d'?30:this.period==='90d'?90:7;
    const points = [];
    for(let i=days-1;i>=0;i--){
      const ds = new Date(); ds.setHours(0,0,0,0); ds.setDate(ds.getDate()-i);
      const de = new Date(ds); de.setDate(de.getDate()+1);
      const dayOrders = DB.orders.filter(o => o.date >= ds.getTime() && o.date < de.getTime() && o.status !== 'cancelled');
      points.push({ date:ds, sales: dayOrders.reduce((s,o)=>s+(o.total||0),0), orders: dayOrders.length, label: days<=7 ? ds.toLocaleDateString(LANG==='bn'?'bn-BD':'en-US',{weekday:'short'}) : ds.getDate() });
    }
    return points;
  },
  renderChart(){
    const data = this.getData();
    const maxSales = Math.max(...data.map(d=>d.sales), 100);
    const W = 600, H = 220, PAD = 30, chartW = W-PAD*2, chartH = H-PAD*2;
    const bars = data.map((d,i)=>{
      const x = PAD + i*(chartW/data.length) + (chartW/data.length)*0.15;
      const h = (d.sales/maxSales)*chartH;
      const y = H - PAD - h;
      const barW = (chartW/data.length)*0.7;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="url(#barGrad)"><title>${d.label}: ${money(d.sales)}</title></rect>`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--brand)"/><stop offset="100%" stop-color="var(--brand-light)"/></linearGradient></defs>${bars}</svg>`;
  },
  render(){
    const data = this.getData();
    const totalSales = data.reduce((s,d)=>s+d.sales,0);
    const totalOrders = data.reduce((s,d)=>s+d.orders,0);
    return `<div class="chart-wrap"><div class="chart-header"><h3><i class="fa-solid fa-chart-line"></i> ${t('salesTrend')}</h3><div class="chart-period"><button class="${this.period==='7d'?'active':''}" onclick="Analytics.setPeriod('7d')">7D</button><button class="${this.period==='30d'?'active':''}" onclick="Analytics.setPeriod('30d')">30D</button><button class="${this.period==='90d'?'active':''}" onclick="Analytics.setPeriod('90d')">90D</button></div></div>${this.renderChart()}<div class="chart-legend"><span>${t('totalSalesLabel')}: ${money(totalSales)}</span><span>${t('ordersLabel')}: ${totalOrders}</span></div></div>`;
  }
};

/* ═══ Tracking ═══ */
const Tracking = {
  open(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-truck-fast"></i> ${t('trackOrder')}</h3></div><div class="modal-body"><div class="form-group"><label>Order ID</label><input id="trackOrderInput" placeholder="ORD-XXXXXXXX"></div><div id="trackingResult"></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button><button class="btn btn-primary btn-block" onclick="Tracking.lookup()"><i class="fa-solid fa-magnifying-glass"></i> ${t('track')}</button></div>`);
    setTimeout(()=>document.getElementById('trackOrderInput')?.focus(), 100);
  },
  lookup(){
    const inp = document.getElementById('trackOrderInput');
    const res = document.getElementById('trackingResult');
    const orderId = (inp?.value||'').trim().toUpperCase();
    if(!orderId) return;
    const order = DB.orders.find(o => o.id.toUpperCase() === orderId);
    if(!order){ res.innerHTML = `<div style="background:rgba(239,68,68,.1);border-left:3px solid var(--danger);padding:12px;border-radius:8px;margin-top:14px;color:var(--danger);font-size:13px">${t('botInvalidOrder')}</div>`; return; }
    const statuses = Orders.STATUS_FLOW;
    const idx = statuses.indexOf(order.status);
    res.innerHTML = `<div style="margin-top:16px;background:var(--surface-2);padding:16px;border-radius:12px"><b>${order.id}</b><br><span class="status-badge status-${order.status}" style="margin-top:8px;display:inline-block">${Orders.statusLabel(order.status)}</span></div>`;
  }
};

/* ═══ Chatbot ═══ */
const Chatbot = {
  open: false, messages: [],
  init(){
    document.getElementById('chatbotToggle').onclick = ()=> this.toggle();
    document.getElementById('chatbotClose').onclick = ()=> this.close();
    document.getElementById('chatbotSend').onclick = ()=> this.send();
    document.getElementById('chatbotInput')?.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); this.send(); } });
    setTimeout(()=>{ const b=document.getElementById('chatbotBadge'); if(b) b.style.display='none'; }, 8000);
  },
  toggle(){ this.open ? this.close() : this.openChat(); },
  openChat(){
    this.open = true;
    document.getElementById('chatbotWidget').classList.add('open');
    const b = document.getElementById('chatbotBadge'); if(b) b.style.display='none';
    if(!this.messages.length){ this.addBot(t('botGreeting')); this.renderQuick(); }
    setTimeout(()=>document.getElementById('chatbotInput')?.focus(), 300);
  },
  close(){ this.open = false; document.getElementById('chatbotWidget').classList.remove('open'); },
  addBot(text, extra){ this.messages.push({ type:'bot', text, extra }); this.render(); },
  addUser(text){ this.messages.push({ type:'user', text }); this.render(); },
  render(){
    const box = document.getElementById('chatbotMessages'); if(!box) return;
    box.innerHTML = this.messages.map(m => m.type==='typing' ? `<div class="chat-msg bot typing"><span></span><span></span><span></span></div>` : `<div class="chat-msg ${m.type}"><div>${escapeHtml(m.text).replace(/\n/g,'<br>')}</div>${m.extra||''}</div>`).join('');
    box.scrollTop = box.scrollHeight;
  },
  showTyping(){ this.messages.push({ type:'typing' }); this.render(); },
  hideTyping(){ this.messages = this.messages.filter(m => m.type!=='typing'); this.render(); },
  renderQuick(){
    const box = document.getElementById('chatbotQuick'); if(!box) return;
    const r = LANG==='bn' ? ['পণ্য দেখুন','অর্ডার ট্র্যাক','সাহায্য','যোগাযোগ'] : ['Browse Products','Track Order','Help','Contact'];
    box.innerHTML = r.map(x => `<button onclick="Chatbot.quick('${x.replace(/'/g,"\\'")}')">${x}</button>`).join('');
  },
  quick(t){ this.addUser(t); this.process(t); },
  send(){ const inp=document.getElementById('chatbotInput'); if(!inp) return; const v=inp.value.trim(); if(!v) return; inp.value=''; this.addUser(v); this.process(v); },
  async process(text){
    this.showTyping(); await new Promise(r => setTimeout(r, 600)); this.hideTyping();
    const low = text.toLowerCase();
    const m = text.match(/ord-?\d+/i);
    if(m){
      const o = DB.orders.find(x => x.id.toUpperCase() === m[0].toUpperCase());
      if(o) this.addBot(`${t('botOrderStatus')}\n\n🆔 ${o.id}\n📦 ${Orders.statusLabel(o.status)}\n💰 ৳${o.total}`);
      else this.addBot(t('botInvalidOrder'));
      return;
    }
    if(/^(hi|hello|হাই|হ্যালো|সালাম)/i.test(low)){ this.addBot(t('botGreeting')); return; }
    if(/(thanks|ধন্যবাদ)/i.test(low)){ this.addBot(t('botThanks')); return; }
    if(/(help|সাহায্য)/i.test(low)){ this.addBot(t('botHelpMessage')); return; }
    if(/(contact|যোগাযোগ|ফোন)/i.test(low)){ this.addBot(t('botContact')); return; }
    if(/(track|ট্র্যাক)/i.test(low)){ this.addBot(t('botOrderTracking')); return; }
    /* Search using advanced engine */
    const results = SearchEngine.search(text, { limit: 3 });
    if(results.length){
      const cards = results.map(r => { const p = r.product; return `<div style="display:flex;gap:10px;margin-top:8px;background:var(--surface-2);padding:8px;border-radius:10px;cursor:pointer" onclick="Chatbot.goTo('${p.id}')"><img src="${p.img}" style="width:44px;height:44px;border-radius:8px;object-fit:cover"><div style="flex:1"><div style="font-size:12.5px;font-weight:700">${p.name}</div><div style="font-size:12px;font-weight:800;color:var(--brand-dark)">৳${p.price}</div></div></div>`; }).join('');
      this.addBot(t('botFoundProducts'), cards);
      return;
    }
    this.addBot(LANG==='bn' ? 'দুঃখিত, বুঝতে পারিনি। "পণ্য দেখুন", "অর্ডার ট্র্যাক", "সাহায্য" চেষ্টা করুন।' : 'Sorry, try "Browse products", "Track order", "Help".');
  },
  goTo(id){ this.close(); App.go('product', id); }
};

/* ═══ PWA ═══ */
const PWA = {
  deferredPrompt: null,
  registerSW(){ if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}); },
  initInstallPrompt(){
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      /* Show in side menu instead of top banner */
      const pmInstall = document.getElementById('pmInstallStatus');
      if(pmInstall) pmInstall.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => {
      const pmInstall = document.getElementById('pmInstallStatus');
      if(pmInstall) pmInstall.style.display = 'none';
      Toast.show(LANG==='bn'?'✅ অ্যাপ ইনস্টল হয়েছে':'✅ App installed','success');
    });
  },
  async triggerInstall(){
    if(!this.deferredPrompt){
      Toast.show(LANG==='bn'?'অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে বা ব্রাউজার সাপোর্ট করে না':'Already installed or not supported','info');
      return;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    if(outcome === 'accepted'){
      const pmInstall = document.getElementById('pmInstallStatus');
      if(pmInstall) pmInstall.style.display = 'none';
    }
  }
};
const PushNotif = {
  async request(){
    if(!('Notification' in window)) return false;
    const p = await Notification.requestPermission();
    if(p === 'granted'){ Toast.show(t('pushEnabled'),'success'); return true; }
    return false;
  },
  init(){ document.getElementById('pushNotifBtn').onclick = async () => { if(await this.request()) document.getElementById('pushNotifBtn').textContent = '✓'; }; },
  async local(title, body){ if(!('Notification' in window) || Notification.permission !== 'granted') return; try { new Notification(title, { body }); } catch(e){} }
};

/* ═══ App Router ═══ */
const App = {
  route: 'home',
  _shopCat:'all', _shopSort:'default', _shopQ:'',
  _adminTab:'dashboard', _pQuery:'', _uQuery:'',
  _orderFilter: { status:'all', payment:'all', search:'', from:'', to:'' },
  _selectedOrders: [],
  _orderFilterUser: 'all',
  _authTab:'login', _authRedirect:null, _param:null,
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
      this._authRedirect = route; this.route = 'auth';
    } else if(route==='admin' && !Auth.isAdmin()){
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
      html = `<div class="page"><div style="background:rgba(239,68,68,.1);border-left:4px solid var(--danger);padding:16px;border-radius:12px;color:var(--danger)"><b>Error:</b> ${e.message}</div></div>`;
    }
    el.innerHTML = html;
    this.syncUI();
    Cart.refresh();
    Notifs.refresh();
    this.initPageScripts();
  },
  initPageScripts(){
    document.querySelectorAll('.detail-thumb').forEach(thumb => {
      thumb.onclick = () => {
        const src = thumb.querySelector('img').src;
        const main = document.querySelector('.detail-main-img img');
        if(main) main.src = src;
        document.querySelectorAll('.detail-thumb').forEach(x => x.classList.remove('active'));
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
      loginBtn.style.display='none'; avatarBtn.classList.add('show');
      document.getElementById('navAvatar').src = u.avatar;
      document.getElementById('ddName').textContent = u.name;
      document.getElementById('ddEmail').textContent = u.email;
      document.getElementById('ddAdmin').style.display = u.role==='admin'?'flex':'none';
      document.getElementById('pmName').textContent = u.name;
      document.getElementById('pmEmail').textContent = u.email;
      document.getElementById('pmAvatar').src = u.avatar;
      document.getElementById('pmRole').textContent = u.role.toUpperCase();
      document.getElementById('pmAdminSection').style.display = u.role==='admin'?'block':'none';
      document.getElementById('pmStats').style.display = 'grid';
      document.getElementById('pmLoginBtn').style.display='none';
      document.getElementById('pmLogoutBtn').style.display='flex';
      document.getElementById('pmOrderCount').textContent = Orders.mine().length;
      document.getElementById('pmOrderBadge').textContent = Orders.mine().length;
      document.getElementById('pmWishCount').textContent = Wish.all().length;
      document.getElementById('pmWishBadge').textContent = Wish.all().length;
      if(adminLink) adminLink.style.display = u.role==='admin'?'flex':'none';
    } else {
      loginBtn.style.display='inline-flex'; avatarBtn.classList.remove('show');
      document.getElementById('pmName').textContent = LANG==='bn'?'অতিথি':'Guest';
      document.getElementById('pmEmail').textContent = LANG==='bn'?'লগইন করুন':'Login';
      document.getElementById('pmAvatar').src = 'https://ui-avatars.com/api/?name=Guest&background=6366f1&color=fff';
      document.getElementById('pmRole').textContent = 'GUEST';
      document.getElementById('pmStats').style.display = 'none';
      document.getElementById('pmAdminSection').style.display='none';
      document.getElementById('pmLoginBtn').style.display='flex';
      document.getElementById('pmLogoutBtn').style.display='none';
      if(adminLink) adminLink.style.display = 'flex';
    }
  },
  openCart(){ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; },
  closePM(){ document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; },
  closeAllDrawers(){
    document.getElementById('powerMenu').classList.remove('active');
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('notifPanel').classList.remove('active');
    document.querySelector('.admin-sidebar')?.classList.remove('active');
    document.getElementById('backdrop').classList.remove('active');
    document.getElementById('mobileSearchModal').classList.remove('active');
    document.body.style.overflow='';
  }
};

/* ═══ Pages ═══ */
const Pages = {
  home(){
    if(!DB.isReady()) return loadingHTML();
    const featured = DB.products.filter(p=>p.featured).slice(0,6);
    const newArr = [...DB.products].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
    return `
      <section class="hero"><div class="hero-inner"><div class="hero-content">
        <div class="hero-badge"><i class="fa-solid fa-bolt"></i> Premium 2026</div>
        <h1 class="hero-title">${LANG==='bn'?'সেরা <span class="grad">প্রিমিয়াম</span> পণ্য<br>এখন হাতের মুঠোয়':'Best <span class="grad">Premium</span> products<br>at your fingertips'}</h1>
        <p class="hero-sub">${LANG==='bn'?'দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট, ১০০% অরিজিনাল।':'Fast delivery, secure payment, 100% original.'}</p>
        <div class="hero-btns">
          <button class="btn btn-primary btn-lg" onclick="App.go('shop')"><i class="fa-solid fa-store"></i> ${t('shop')}</button>
          <button class="btn btn-outline btn-lg" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:#fff" onclick="App.go('orders')"><i class="fa-solid fa-box"></i> ${t('myOrders')}</button>
        </div>
      </div></div></section>
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-fire" style="color:var(--accent)"></i> ${t('featured')}</h2><span class="count-chip">${featured.length} ${t('items')}</span></div>
        <div class="product-grid">${featured.length ? featured.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${t('empty')}</h3></div>`}</div>
        <div class="section-head" style="margin-top:34px"><h2><i class="fa-solid fa-star" style="color:var(--brand)"></i> ${t('newArrivals')}</h2><button class="btn btn-outline btn-sm" onclick="App.go('shop')">${LANG==='bn'?'সব দেখুন':'View All'} <i class="fa-solid fa-arrow-right"></i></button></div>
        <div class="product-grid">${newArr.map(Components.productCard).join('')}</div>
      </div>`;
  },
  shop(){
    if(!DB.isReady()) return loadingHTML();
    let list = DB.products.slice();
    if(App._shopCat && App._shopCat!=='all') list = list.filter(p=>p.cat===App._shopCat);
    if(App._shopQ){ const results = SearchEngine.search(App._shopQ, { limit: 100 }); list = results.map(r => r.product); }
    if(App._shopSort==='low') list.sort((a,b)=>a.price-b.price);
    else if(App._shopSort==='high') list.sort((a,b)=>b.price-a.price);
    else if(App._shopSort==='new') list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    else if(App._shopSort==='popular') list.sort((a,b)=>(b.reviewCount||0)-(a.reviewCount||0));
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
        ${App._shopQ?`<div class="section-head" style="margin-bottom:14px"><span class="count-chip">${t('searchResults')}: "${escapeHtml(App._shopQ)}" (${list.length})</span><button class="btn btn-outline btn-sm" onclick="App._shopQ='';App.render()"><i class="fa-solid fa-xmark"></i> ${t('clearAllFilters')}</button></div>`:''}
        <div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('empty')}</h3><p>${t('searchNoResults')}</p></div>`}</div>
      </div>`;
  },
  productDetail(id){
    if(!DB.isReady()) return loadingHTML();
    const p = DB.products.find(x=>x.id===id);
    if(!p) return `<div class="page"><div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>Not found</h3></div></div>`;
    const imgs = p.images && p.images.length ? p.images : [p.img];
    const related = DB.products.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,4);
    const reviews = DB.getProductReviews(p.id);
    const stockCls = p.stock<=0?'out':(p.stock<10?'low':'');
    return `
      <div class="page">
        <button class="btn btn-outline btn-sm" onclick="App.go('shop')" style="margin-bottom:14px"><i class="fa-solid fa-arrow-left"></i> ${t('shop')}</button>
        <div class="product-detail">
          <div class="detail-gallery">
            <div class="detail-main-img"><img id="mainImg" src="${imgs[0]}" onerror="this.src='https://via.placeholder.com/500'"></div>
            ${imgs.length>1 ? `<div class="detail-thumbs">${imgs.map((u,i)=>`<div class="detail-thumb ${i===0?'active':''}"><img src="${u}"></div>`).join('')}</div>` : ''}
          </div>
          <div class="detail-info">
            <span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span>
            <h1>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h1>
            <div class="rating">${starHTML(p.rating||0)} <span>${p.rating?(p.rating).toFixed(1):'0'} (${p.reviewCount||0})</span></div>
            <div class="detail-price">
              <span class="price">${money(p.price)}</span>
              ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}
              ${p.discount?`<span style="background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:#fff;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:800">-${p.discount}%</span>`:''}
            </div>
            <p class="detail-desc">${LANG==='bn'?p.desc:(p.descEn||p.desc||'')}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px"><span class="chip ${stockCls==='out'?'blocked':'active-status'}"><i class="fa-solid fa-box"></i> ${p.stock<=0?t('outOfStock'):`${t('stock')}: ${p.stock}`}</span></div>
            <div class="detail-actions">
              <button class="btn btn-primary btn-lg" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}</button>
              <button class="btn btn-outline btn-lg" onclick="Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart" style="${Wish.has(p.id)?'color:var(--danger)':''}"></i></button>
            </div>
          </div>
        </div>

        <!-- ✅ Reviews visible to everyone -->
        <div class="admin-card" style="margin-top:24px">
          <div class="admin-card-head">
            <h3><i class="fa-solid fa-star"></i> ${t('productReviews')} (${reviews.length})</h3>
            ${Auth.user()?`<button class="btn btn-primary btn-sm" onclick="Reviews.openModal('${p.id}')"><i class="fa-solid fa-pen"></i> ${t('writeReview')}</button>`:''}
          </div>
          ${reviews.length ? reviews.map(r => {
            const user = DB.users.find(x=>x.id===r.userId);
            return `<div class="review-item">
              <img class="review-avatar" src="${user?.avatar||'https://ui-avatars.com/api/?name=U'}" onerror="this.src='https://ui-avatars.com/api/?name=U'">
              <div class="review-body">
                <div class="review-head"><h5>${escapeHtml(r.userName||'User')}</h5><span class="rating">${starHTML(r.rating,'14px')}</span></div>
                <p>${escapeHtml(r.text)}</p>
                <small style="font-size:11px;color:var(--text-soft);display:block;margin-top:6px">${timeAgo(r.date)}</small>
              </div>
            </div>`;
          }).join('') : `<p class="muted">${t('beFirstReview')}</p>`}
        </div>

        ${related.length?`<div class="section-head" style="margin-top:26px"><h2><i class="fa-solid fa-layer-group"></i> ${t('relatedProducts')}</h2></div><div class="product-grid">${related.map(Components.productCard).join('')}</div>`:''}
      </div>`;
  },
  orders(){
    if(!Auth.user()) return this.authPage('orders');
    const mine = Orders.mine();
    const counts = { all:mine.length, active: mine.filter(o=>['pending','confirmed','processing','shipped','out_for_delivery'].includes(o.status)).length, delivered: mine.filter(o=>o.status==='delivered').length, cancelled: mine.filter(o=>['cancelled','rejected'].includes(o.status)).length };
    const filter = App._orderFilterUser || 'all';
    const filtered = filter === 'all' ? mine : filter === 'active' ? mine.filter(o=>['pending','confirmed','processing','shipped','out_for_delivery'].includes(o.status)) : filter === 'delivered' ? mine.filter(o=>o.status==='delivered') : mine.filter(o=>['cancelled','rejected'].includes(o.status));
    return `
      <div class="page">
        <div class="section-head"><h2><i class="fa-solid fa-box"></i> ${t('myOrders')}</h2><span class="count-chip">${mine.length}</span></div>
        <div class="filter-chips">
          <div class="filter-chip ${filter==='all'?'active':''}" onclick="App._orderFilterUser='all';App.render()">${t('allOrders')} (${counts.all})</div>
          <div class="filter-chip ${filter==='active'?'active':''}" onclick="App._orderFilterUser='active';App.render()">${t('activeOrders')} (${counts.active})</div>
          <div class="filter-chip ${filter==='delivered'?'active':''}" onclick="App._orderFilterUser='delivered';App.render()">${t('delivered')} (${counts.delivered})</div>
          <div class="filter-chip ${filter==='cancelled'?'active':''}" onclick="App._orderFilterUser='cancelled';App.render()">${t('cancelled')} (${counts.cancelled})</div>
        </div>
        ${filtered.length ? filtered.map(o=>Components.orderCard(o)).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'কোনো অর্ডার নেই':'No orders yet'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}
      </div>`;
  },
  wishlist(){
    const ids = Wish.all();
    const list = DB.products.filter(p => ids.includes(p.id));
    return `<div class="page"><div class="section-head"><h2><i class="fa-solid fa-heart" style="color:var(--danger)"></i> ${t('wishlist')}</h2><span class="count-chip">${list.length}</span></div><div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>Wishlist empty</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}</div></div>`;
  },
  profile(){
    const u = Auth.user();
    if(!u) return this.authPage('profile');
    /* ✅ Users only see their own data */
    const mine = Orders.mine();
    const spent = mine.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+o.total,0);
    const balance = Wallet.getBalance(u.id);
    const points = Loyalty.getPoints(u.id);
    const refCode = Referral.generateCode(u.id);
    const isBn = LANG==='bn';
    const joinDate = new Date(u.joined).toLocaleDateString(isBn?'bn-BD':'en-US');
    return `
      <div class="page">
        <div class="profile-hero">
          <div class="profile-cover"><div class="profile-cover-pattern"></div></div>
          <div class="profile-body">
            <div class="profile-avatar-wrap">
              <img class="profile-avatar" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U&background=6366f1&color=fff'">
              <label class="profile-avatar-edit" for="avatarInput"><i class="fa-solid fa-camera"></i></label>
              <input type="file" id="avatarInput" accept="image/*" style="display:none" onchange="Profile.uploadAvatar(this)">
            </div>
            <div class="profile-name-row">
              <h2>${escapeHtml(u.name)}</h2>
              ${u.emailVerified?`<span class="profile-verified"><i class="fa-solid fa-circle-check"></i> ${t('verifiedCustomer')}</span>`:''}
            </div>
            <div class="profile-meta">
              <span><i class="fa-solid fa-envelope"></i> ${escapeHtml(u.email)}</span>
              ${u.phone?`<span><i class="fa-solid fa-phone"></i> ${escapeHtml(u.phone)}</span>`:''}
              <span><i class="fa-solid fa-calendar"></i> ${t('joinedOn')}: ${joinDate}</span>
            </div>
          </div>
        </div>

        <div class="profile-stats">
          <div class="pstat-card"><div class="pstat-icon brand"><i class="fa-solid fa-box"></i></div><div class="pstat-value">${mine.length}</div><div class="pstat-label">${t('orderCount')}</div></div>
          <div class="pstat-card"><div class="pstat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="pstat-value">${mine.filter(o=>o.status==='pending').length}</div><div class="pstat-label">${t('ordersPending')}</div></div>
          <div class="pstat-card"><div class="pstat-icon success"><i class="fa-solid fa-wallet"></i></div><div class="pstat-value">${money(spent)}</div><div class="pstat-label">${t('totalSpent')}</div></div>
          <div class="pstat-card"><div class="pstat-icon pink"><i class="fa-solid fa-gift"></i></div><div class="pstat-value">${points}</div><div class="pstat-label">${t('loyalty')}</div></div>
        </div>

        <div class="wallet-card"><div class="wallet-card-inner"><label>${t('walletBalance')}</label><span class="wallet-amount">${money(balance)}</span><div class="wallet-actions"><button class="btn btn-sm btn-solid" onclick="Wallet.open()"><i class="fa-solid fa-list"></i> ${t('transactions')}</button><button class="btn btn-sm" onclick="Wallet.topUp()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button></div></div></div>

        <div class="referral-card"><div style="font-size:14px;font-weight:700;margin-bottom:8px">${t('inviteFriends')}</div><div class="referral-code"><span>${refCode}</span><button onclick="navigator.clipboard.writeText('${refCode}').then(()=>Toast.show('Copied','success'))"><i class="fa-solid fa-copy"></i></button></div></div>

        <div class="form-card">
          <div class="form-card-head"><i class="fa-solid fa-user-pen"></i><div><h3>${t('personalInfo')}</h3><p>${t('personalInfoDesc')}</p></div></div>
          <div class="form-group"><label>${t('fullName')}</label><input id="pfName" value="${escapeHtml(u.name)}"></div>
          <div class="form-group"><label>${t('phone')}</label><input id="pfPhone" value="${escapeHtml(u.phone||'')}" placeholder="017XXXXXXXX"></div>
          <div class="form-group"><label>${t('address')}</label><textarea id="pfAddress" rows="2">${escapeHtml(u.address||'')}</textarea></div>
          <button class="btn btn-primary" onclick="Profile.saveInfo()"><i class="fa-solid fa-floppy-disk"></i> ${t('saveInfo')}</button>
        </div>

        <div class="form-card">
          <div class="form-card-head"><i class="fa-solid fa-lock" style="background:linear-gradient(135deg,var(--danger),var(--danger-dark))"></i><div><h3>${t('changePassword')}</h3><p>${t('changePasswordDesc')}</p></div></div>
          <div class="form-group"><label>${t('currentPassword')} <span class="req">*</span></label><div class="input-wrap"><i class="fa-solid fa-key input-icon"></i><input type="password" id="pwdCurrent" placeholder="••••••"><button type="button" class="toggle-pass" onclick="Profile.togglePass('pwdCurrent', this)"><i class="fa-solid fa-eye"></i></button></div></div>
          <div class="form-group"><label>${t('newPassword2')} <span class="req">*</span></label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="pwdNew" placeholder="••••••" oninput="AuthUI.checkPwd(this.value)"><button type="button" class="toggle-pass" onclick="Profile.togglePass('pwdNew', this)"><i class="fa-solid fa-eye"></i></button></div><div class="pwd-strength"><div class="pwd-bars"><div class="pwd-bar" id="pwdBar1"></div><div class="pwd-bar" id="pwdBar2"></div><div class="pwd-bar" id="pwdBar3"></div><div class="pwd-bar" id="pwdBar4"></div></div><div class="pwd-text" id="pwdText">Password strength</div></div></div>
          <div class="form-group"><label>${t('confirmPassword')} <span class="req">*</span></label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="pwdNew2" placeholder="••••••"><button type="button" class="toggle-pass" onclick="Profile.togglePass('pwdNew2', this)"><i class="fa-solid fa-eye"></i></button></div><div class="form-error" id="pwdError">${t('passwordMismatch')}</div></div>
          <button class="btn btn-primary" onclick="Profile.changePassword()"><i class="fa-solid fa-shield-halved"></i> ${t('updatePassword')}</button>
        </div>
      </div>`;
  },
  auth(){ return this.authPage(App._authRedirect||'home'); },
  authPage(redirect){
    const tab = App._authTab || 'login';
    return `<div class="auth-page"><div class="auth-card"><div class="auth-logo"><div class="logo-icon"><i class="fa-solid fa-leaf"></i></div><h2>EcoShop<span>Pro</span></h2><p>Premium e-commerce</p></div><div class="auth-tabs"><button class="${tab==='login'?'active':''}" id="tabLogin" onclick="AuthUI.tab('login')">${t('login')}</button><button class="${tab==='reg'?'active':''}" id="tabReg" onclick="AuthUI.tab('reg')">${t('register')}</button></div><div id="authForm">${tab==='login' ? AuthUI.loginForm(redirect) : AuthUI.regForm(redirect)}</div></div></div>`;
  },
  admin(){
    if(!Auth.isAdmin()) return this.authPage('admin');
    if(!DB.isReady()) return loadingHTML();
    const tab = App._adminTab || 'dashboard';
    return `<div class="admin-layout">${Components.adminSidebar(tab)}<div class="admin-main"><div class="admin-header"><button class="admin-sidebar-toggle" onclick="document.querySelector('.admin-sidebar').classList.toggle('active');document.getElementById('backdrop').classList.toggle('active')"><i class="fa-solid fa-bars"></i></button><div class="admin-header-title"><h1>${Admin.titles[tab]||t('dashboard')}</h1><p>EcoShop Pro MAX v13</p></div><div class="admin-header-actions"><button class="btn btn-pink btn-sm" onclick="Admin.openBroadcastModal()"><i class="fa-solid fa-bullhorn"></i><span> Broadcast</span></button><button class="btn btn-outline btn-sm" onclick="App.go('home')"><i class="fa-solid fa-store"></i></button><button class="btn btn-primary btn-sm" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i></button></div></div><div class="admin-content" id="adminContent">${Admin.render(tab)}</div></div></div>`;
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
    const ship = zone==='inside' ? (s.shippingInsideDhaka||100) : (s.shippingOutsideDhaka||120);
    return `<div class="page" style="max-width:760px"><div class="section-head"><h2><i class="fa-solid fa-credit-card"></i> ${t('checkout')}</h2></div>
      <div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">1</div><div><h3>${t('deliveryDetails')}</h3><p>${LANG==='bn'?'নাম, ফোন ও ঠিকানা':'Name, phone and address'}</p></div></div><div class="form-group"><label>${t('fullName')} *</label><input id="coName" value="${escapeHtml(u.name)}"></div><div class="form-row"><div class="form-group"><label>${t('phone')} *</label><input id="coPhone" value="${escapeHtml(u.phone||'')}" placeholder="017XXXXXXXX"></div><div class="form-group"><label>${t('city')}</label><input id="coCity" value="ঢাকা"></div></div><div class="form-group"><label>${t('address')} *</label><textarea id="coAddr" rows="2">${escapeHtml(u.address||'')}</textarea></div></div>
      <div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">2</div><div><h3>${t('deliveryZone')}</h3></div></div><div class="delivery-zones"><div class="delivery-zone ${zone==='inside'?'active':''}" onclick="Checkout.setZone('inside')"><div class="zone-icon"><i class="fa-solid fa-city"></i></div><b>${t('insideDhaka')}</b><div class="zone-price">${money(s.shippingInsideDhaka||100)}</div></div><div class="delivery-zone ${zone==='outside'?'active':''}" onclick="Checkout.setZone('outside')"><div class="zone-icon"><i class="fa-solid fa-mountain-sun"></i></div><b>${t('outsideDhaka')}</b><div class="zone-price">${money(s.shippingOutsideDhaka||120)}</div></div></div></div>
      <div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">3</div><div><h3>${t('paymentMethodStep')}</h3></div></div><div class="payment-methods">${methods.map(m=>`<div class="payment-method ${pay===m.id?'active':''}" onclick="Checkout.setPayment('${m.id}')"><div class="pm-logo ${m.cls}"><i class="fa-solid ${m.icon}"></i></div><b>${m.label}</b></div>`).join('')}</div><div id="paymentDetail">${Checkout.renderPaymentDetail(pay)}</div></div>
      <div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">4</div><div><h3>${t('orderSummary')}</h3></div></div><div class="cart-summary-row"><span>${t('subtotal')}</span><span>${money(Cart.subtotal())}</span></div><div class="cart-summary-row"><span>${t('deliveryCharge')}</span><span>${money(ship)}</span></div><div class="cart-summary-row total"><span>${t('total')}</span><span>${money(Cart.subtotal()+ship)}</span></div><button class="btn btn-primary btn-block btn-lg" style="margin-top:14px" id="coSubmit" onclick="Checkout.place()"><i class="fa-solid fa-check-circle"></i> ${t('placeOrder')}</button></div></div>`;
  }
};

/* ═══ Checkout ═══ */
const Checkout = {
  ensureState(){ if(!App._checkoutState) App._checkoutState = { zone:'inside', payment:'cod' }; return App._checkoutState; },
  setZone(zone){ const s=this.ensureState(); s.zone=zone; App.render(); },
  setPayment(method){
    const s=this.ensureState(); s.payment=method;
    document.querySelectorAll('.payment-method').forEach(el=>el.classList.remove('active'));
    const idx = ['cod','bkash','nagad','rocket'].indexOf(method);
    document.querySelectorAll('.payment-method')[idx]?.classList.add('active');
    const d = document.getElementById('paymentDetail');
    if(d) d.innerHTML = this.renderPaymentDetail(method);
    this.bindScreenshot();
  },
  renderPaymentDetail(method){
    const s = DB.settings;
    if(method === 'cod') return `<div class="payment-info" style="background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.3)"><h4><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> ${t('cod')}</h4><p style="font-size:13.5px;color:var(--text-dim)">${t('codDesc')}</p></div>`;
    const num = method==='bkash'?s.bkashNumber:method==='nagad'?s.nagadNumber:s.rocketNumber;
    const brandName = method==='bkash'?'বিকাশ':method==='nagad'?'নগদ':'রকেট';
    return `<div class="payment-info"><h4><span class="pm-brand" style="background:linear-gradient(135deg,${method==='bkash'?'#e2136e,#c20f5a':method==='nagad'?'#ec1c24,#c4141b':'#8b1e6f,#6d185a'})">${brandName}</span></h4><div class="copy-number-box"><div><small style="font-size:11.5px;color:var(--text-dim);display:block;margin-bottom:4px">${t('paymentNumber')}</small><span class="number">${num}</span></div><button class="copy-btn" onclick="navigator.clipboard.writeText('${num}').then(()=>Toast.show('${t('numberCopied')}','success'));this.classList.add('copied')"><i class="fa-solid fa-copy"></i> ${t('copy')}</button></div><div class="txn-input-group"><label>${t('txnId')} *</label><input id="txnIdInput" placeholder="${t('txnIdPlaceholder')}"></div><div class="txn-input-group"><label>${t('screenshot')} ${t('screenshotOptional')}</label><div class="img-upload" style="margin-top:10px"><div class="img-preview" id="ssPreview"><i class="fa-solid fa-image"></i></div><div class="upload-btn-wrap"><button type="button" class="upload-btn" id="ssUploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> ${t('uploadScreenshot')}</button><input type="file" id="ssFile" accept="image/*" style="display:none"></div></div><input type="hidden" id="ssUrl" value=""></div></div>`;
  },
  bindScreenshot(){
    const btn = document.getElementById('ssUploadBtn'); const file = document.getElementById('ssFile');
    const prev = document.getElementById('ssPreview'); const hidden = document.getElementById('ssUrl');
    if(!btn || btn._bound) return;
    btn._bound = true;
    btn.onclick = ()=> file.click();
    file.onchange = async () => {
      const f = file.files[0]; if(!f) return;
      const r = new FileReader(); r.onload = e => prev.innerHTML = `<img src="${e.target.result}">`; r.readAsDataURL(f);
      try { const res = await ImageUpload.upload(f); hidden.value = res.url; prev.innerHTML = `<img src="${res.url}">`; Toast.show(t('imgUploadSuccess'),'success'); }
      catch(e){ Toast.show(t('imgUploadFailed'),'error'); }
    };
  },
  async place(){
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const address = document.getElementById('coAddr').value.trim();
    if(!name || !phone || !address) return Toast.show(t('fillAllFields'),'error');
    const s = this.ensureState();
    const method = s.payment;
    let txnId=null, screenshot=null;
    if(method !== 'cod'){
      txnId = (document.getElementById('txnIdInput')?.value||'').trim();
      if(!txnId || txnId.length < 6) return Toast.show(t('invalidTxnId'),'error');
      screenshot = document.getElementById('ssUrl')?.value.trim() || '';
    }
    const ship = s.zone==='inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const subtotal = Cart.subtotal();
    const total = subtotal + ship;
    const items = Cart.items().map(i => { const p = DB.products.find(x=>x.id===i.id); return { id:i.id, name:p?.name||'—', price:p?.price||0, qty:i.qty }; });
    const btn = document.getElementById('coSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try {
      const order = await Orders.create({ customer:{ name, phone, city, address }, items, subtotal, deliveryCharge:ship, deliveryZone:s.zone, discount:0, total, paymentMethod:method, paymentNumber:method==='cod'?null:DB.settings[method+'Number'], txnId, screenshot });
      if(Auth.user()) Loyalty.addFromOrder(Auth.user().id, total);
      App._checkoutState = null;
      Toast.show(method==='cod' ? t('orderSuccessCOD') : t('orderSuccessPaid'),'success',4000);
      Modal.open(`<div class="order-success"><div class="order-success-icon"><i class="fa-solid fa-check"></i></div><h3 style="font-size:20px;font-weight:800;margin-bottom:8px">🎉 ${LANG==='bn'?'অর্ডার সফল!':'Order Placed!'}</h3><p style="font-size:14px;color:var(--text-dim);margin-bottom:6px">${LANG==='bn'?'আপনার অর্ডার আইডি':'Order ID'}</p><p style="font-size:22px;font-weight:800;color:var(--brand);font-family:var(--font-en);margin-bottom:20px">${order.id}</p><p style="font-size:13px;color:var(--text-dim);margin-bottom:22px">${LANG==='bn'?'অ্যাডমিন কনফার্ম করলে অর্ডার প্রসেস হবে।':'Admin will confirm your order.'}</p><button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${order.id}'), '${phone}');Modal.close();App.go('orders')"><i class="fa-brands fa-whatsapp"></i> ${t('whatsappSend')}</button><button class="btn btn-outline btn-block" style="margin-top:8px" onclick="Modal.close();App.go('orders')">${t('viewOrder')||'View Order'}</button></div>`,'sm');
    } catch(e){ Toast.show('Failed: '+e.message,'error'); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${t('placeOrder')}`; }
  }
};

/* ═══ Reviews ═══ */
const Reviews = {
  openModal(productId){
    if(!Auth.user()) return Toast.show(t('loginRequired'),'warning');
    const existing = DB.reviews.find(r => r.productId === productId && r.userId === Auth.user().id);
    if(existing) return Toast.show(t('alreadyReviewed'),'warning');
    let rating = 5;
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-star"></i> ${t('writeReview')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('yourRating')}</label><div class="star-picker" id="starPicker">${[1,2,3,4,5].map(i=>`<i class="fa-solid fa-star active" data-star="${i}" onclick="Reviews.setRating(${i})"></i>`).join('')}</div></div><div class="form-group"><label>${t('reviewText')}</label><textarea id="reviewText" rows="4" placeholder="${LANG==='bn'?'আপনার মতামত...':'Your review...'}"></textarea></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="Reviews.submit('${productId}', ${rating})"><i class="fa-solid fa-paper-plane"></i> ${t('submitReview')}</button></div>`);
    window._currentRating = rating;
  },
  setRating(r){
    window._currentRating = r;
    document.querySelectorAll('#starPicker i').forEach(s => s.classList.toggle('active', +s.dataset.star <= r));
  },
  async submit(productId, rating){
    const text = document.getElementById('reviewText').value.trim();
    if(!text) return Toast.show(t('fillAllFields'),'error');
    const u = Auth.user(); if(!u) return;
    rating = window._currentRating || rating;
    try {
      await DB.saveReview({ productId, userId: u.id, userName: u.name, rating, text });
      await DB.addReviewToProduct(productId, rating);
      Modal.close();
      Toast.show(t('reviewSubmitted'),'success');
      App.render();
    } catch(e){ Toast.show('Failed','error'); }
  }
};

/* ═══ Profile ═══ */
const Profile = {
  togglePass(id, btn){
    const input = document.getElementById(id); if(!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${show?'-slash':''}"></i>`;
  },
  async uploadAvatar(input){
    const file = input.files[0]; if(!file) return;
    const u = Auth.user(); if(!u) return;
    if(file.size > 5*1024*1024) return Toast.show('Max 5MB','error');
    Toast.show(LANG==='bn'?'আপলোড হচ্ছে...':'Uploading...','info');
    try {
      const res = await ImageUpload.upload(file);
      await DB.updateUser(u.id, { avatar: res.url });
      Session.set({ ...u, avatar: res.url });
      Toast.show(t('imgUploadSuccess'),'success');
      App.render();
    } catch(e){ Toast.show(t('imgUploadFailed')+': '+e.message,'error'); }
  },
  async saveInfo(){
    const u = Auth.user(); if(!u) return;
    const name = document.getElementById('pfName').value.trim();
    const phone = document.getElementById('pfPhone').value.trim();
    const address = document.getElementById('pfAddress').value.trim();
    if(!name) return Toast.show(t('fillAllFields'),'error');
    try {
      await DB.updateUser(u.id, { name, phone, address });
      Session.set({ ...u, name, phone, address });
      Toast.show(t('profileUpdated'),'success');
      App.render();
    } catch(e){ Toast.show('Failed','error'); }
  },
  async changePassword(){
    const u = Auth.user(); if(!u) return;
    const current = document.getElementById('pwdCurrent').value;
    const p1 = document.getElementById('pwdNew').value;
    const p2 = document.getElementById('pwdNew2').value;
    const err = document.getElementById('pwdError');
    if(!current || !p1 || !p2) return Toast.show(t('fillAllFields'),'error');
    /* ✅ Verify old password */
    if(current !== u.password) return Toast.show(t('wrongCurrentPassword'),'error');
    if(p1.length < 6) return Toast.show(t('weakPassword'),'error');
    if(p1 !== p2){ err.classList.add('show'); return Toast.show(t('passwordMismatch'),'error'); }
    err.classList.remove('show');
    try {
      await DB.updateUser(u.id, { password: p1 });
      Session.set({ ...u, password: p1 });
      Modal.open(`<div class="order-success"><div class="order-success-icon"><i class="fa-solid fa-check"></i></div><h3 style="font-size:19px;font-weight:800;margin-bottom:8px">${t('passwordChanged')}</h3><p style="font-size:13.5px;color:var(--text-dim);margin-bottom:22px">${t('passwordChangedDesc')}</p><button class="btn btn-primary btn-block" onclick="Modal.close()">${t('close')}</button></div>`,'sm');
    } catch(e){ Toast.show(t('updateFailed'),'error'); }
  }
};

/* ═══ Components ═══ */
const Components = {
  productCard(p){
    const name = LANG==='bn' ? p.name : (p.nameEn||p.name);
    const stockCls = p.stock<=0?'out':(p.stock<10?'low':'');
    const stockTxt = p.stock<=0 ? t('outOfStock') : t('inStock');
    const isNew = Date.now() - (p.createdAt||0) < 7*24*60*60*1000;
    let badge = '';
    if(p.discount) badge = `<span class="product-badge">-${p.discount}%</span>`;
    else if(isNew) badge = `<span class="product-badge new">NEW</span>`;
    return `<div class="product-card" onclick="App.go('product','${p.id}')"><div class="product-img-wrap"><img src="${p.img}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300'">${badge}<span class="stock-badge ${stockCls}">${stockTxt}</span><button class="wish-btn ${Wish.has(p.id)?'active':''}" onclick="event.stopPropagation();Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart"></i></button></div><div class="product-body"><span class="product-cat">${LANG==='bn'?p.cat:(p.catEn||p.cat)}</span><h3 class="product-name">${escapeHtml(name)}</h3><div class="rating">${starHTML(p.rating||0,'11px')} <span>${p.reviewCount?`(${p.reviewCount})`:''}</span></div><div class="product-price"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><button class="btn btn-primary btn-block btn-sm" ${p.stock<=0?'disabled':''} onclick="event.stopPropagation();Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${p.stock<=0?t('outOfStock'):t('addToCart')}</button></div></div>`;
  },
  orderCard(o){
    const statusFlow = Orders.STATUS_FLOW;
    const idx = statusFlow.indexOf(o.status);
    const isCancelled = ['cancelled','rejected'].includes(o.status);
    const isBn = LANG==='bn';
    return `<div class="order-card"><div class="order-card-head"><div class="order-id-block"><h4><i class="fa-solid fa-receipt" style="color:var(--brand)"></i> ${o.id}</h4><p><i class="fa-regular fa-calendar"></i> ${new Date(o.date).toLocaleString(isBn?'bn-BD':'en-US')} • ${(o.items||[]).length} ${t('items')}</p></div><div class="order-meta"><span class="order-amount">${money(o.total)}</span><span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.statusIcon(o.status)}"></i> ${Orders.statusLabel(o.status)}</span></div></div>${!isCancelled ? `<div class="order-timeline">${statusFlow.map((s,i)=>`<div class="timeline-step ${i<idx?'done':''} ${i===idx?'current':''}">${i<statusFlow.length-1?'<div class="timeline-line"></div>':''}<div class="dot"><i class="fa-solid ${i<=idx?'fa-check':Orders.statusIcon(s)}"></i></div><div class="label">${Orders.statusLabel(s)}</div></div>`).join('')}</div>` : ''}<div class="invoice-actions"><button class="btn btn-outline btn-sm" onclick="Orders.detail('${o.id}')"><i class="fa-solid fa-eye"></i> ${isBn?'বিস্তারিত':'Details'}</button><button class="btn btn-pdf btn-sm" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button><button class="btn btn-whatsapp btn-sm" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i></button>${['delivered','cancelled','rejected'].includes(o.status)?`<button class="btn btn-outline btn-sm" onclick="Orders.reorder('${o.id}')"><i class="fa-solid fa-rotate-right"></i> ${t('reorder')}</button>`:''}</div></div>`;
  },
  adminSidebar(tab){
    const pending = DB.orders.filter(o => o.status === 'pending').length;
    const items = [
      {sec:'Main', list:[
        {id:'dashboard', icon:'fa-chart-line', label:t('dashboard')},
        {id:'products', icon:'fa-box', label:t('products')},
        {id:'orders', icon:'fa-receipt', label:t('ordersTab'), badge:pending},
        {id:'users', icon:'fa-users', label:t('users')}
      ]},
      {sec:'Extras', list:[
        {id:'reviews', icon:'fa-star', label:t('reviews')},
        {id:'categories', icon:'fa-tags', label:t('categories')},
        {id:'coupons', icon:'fa-ticket', label:t('coupons')},
        {id:'broadcast', icon:'fa-bullhorn', label:t('broadcastNotif')},
        {id:'settings', icon:'fa-gear', label:t('settings')}
      ]}
    ];
    return `<aside class="admin-sidebar" id="adminSidebar"><div class="admin-brand"><div class="logo-icon"><i class="fa-solid fa-leaf"></i></div><span class="logo-text">EcoShop<span style="color:var(--brand)">Pro</span></span><span class="admin-pill">ADMIN</span></div><nav class="admin-nav">${items.map(g=>`<div class="nav-section"><div class="nav-section-title">${g.sec}</div>${g.list.map(i=>`<a class="${tab===i.id?'active':''}" onclick="Admin.switchTab('${i.id}')"><i class="fa-solid ${i.icon}"></i> ${i.label}${i.badge?`<span class="nav-count">${i.badge}</span>`:''}</a>`).join('')}</div>`).join('')}</nav><div class="admin-footer"><button class="admin-exit" onclick="App.go('home')"><i class="fa-solid fa-arrow-left"></i> Back</button></div></aside>`;
  }
};

/* ═══ Admin ═══ */
const Admin = {
  get titles(){ return { dashboard:t('dashboard'), products:t('products'), orders:t('ordersTab'), users:t('users'), reviews:t('reviews'), categories:t('categories'), coupons:t('coupons'), broadcast:t('broadcastNotif'), settings:t('settings') }; },
  switchTab(tab){ App._adminTab = tab; App.closeAllDrawers(); App.render(); },
  render(tab){
    try {
      switch(tab){
        case 'dashboard': return this.dashboard();
        case 'products': return this.products();
        case 'orders': return this.orders();
        case 'users': return this.users();
        case 'reviews': return this.allReviews();
        case 'categories': return this.categories();
        case 'coupons': return this.coupons();
        case 'broadcast': return this.broadcastPage();
        case 'settings': return this.settings();
        default: return this.dashboard();
      }
    } catch(e){ return `<div style="background:rgba(239,68,68,.1);padding:14px;border-radius:10px;color:var(--danger)">${e.message}</div>`; }
  },
  dashboard(){
    const orders = DB.orders, users = DB.users, prods = DB.products;
    const sales = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0);
    const counts = Orders.counts();
    const lowStock = prods.filter(p=>p.stock<10).length;
    return `${Analytics.render()}
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div><div class="stat-info"><p>${t('totalSales')}</p><h3>${money(sales)}</h3></div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-cart-shopping"></i></div><div class="stat-info"><p>${t('totalOrders')}</p><h3>${orders.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div class="stat-info"><p>${t('totalUsers')}</p><h3>${users.length}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-box"></i></div><div class="stat-info"><p>${t('totalProducts')}</p><h3>${prods.length}</h3></div></div>
      </div>
      <div class="stat-grid">
        <div class="stat-card" style="cursor:pointer" onclick="Admin.switchTab('orders'); App._orderFilter.status='pending';"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${t('pendingOrders')}</p><h3>${counts.pending}</h3></div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-info"><p>${t('lowStock')}</p><h3>${lowStock}</h3></div></div>
        <div class="stat-card"><div class="stat-icon info"><i class="fa-solid fa-user-check"></i></div><div class="stat-info"><p>${t('activeUsers')}</p><h3>${users.filter(u=>!u.blocked).length}</h3></div></div>
        <div class="stat-card" style="cursor:pointer" onclick="Admin.openBroadcastModal()"><div class="stat-icon pink"><i class="fa-solid fa-bullhorn"></i></div><div class="stat-info"><p>${t('broadcastNotif')}</p><h3>→</h3></div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> ${t('recentOrders')}</h3><button class="btn btn-outline btn-sm" onclick="Admin.switchTab('orders')">${LANG==='bn'?'সব':'All'}</button></div>
        <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>${t('orderId')}</th><th>Customer</th><th>${t('total')}</th><th>${t('paymentMethod')}</th><th>${t('orderStatus')}</th><th></th></tr></thead><tbody>${orders.slice(0,6).map(o=>`<tr><td><b>${o.id}</b></td><td>${escapeHtml(o.customer?.name||'—')}</td><td>${money(o.total)}</td><td><span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:var(--surface-2)">${(o.paymentMethod||'cod').toUpperCase()}</span></td><td><span class="status-badge status-${o.status}">${Orders.statusLabel(o.status)}</span></td><td><div class="actions">${o.status==='pending'?`<button class="icon-btn-sm success" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>`:''}<button class="icon-btn-sm info" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button><button class="icon-btn-sm" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button></div></td></tr>`).join('')}</tbody></table></div>
      </div>`;
  },
  products(){
    const q = App._pQuery||'';
    const list = DB.products.filter(p => !q || (p.name+(p.nameEn||'')).toLowerCase().includes(q.toLowerCase()));
    return `<div class="admin-toolbar"><input placeholder="${t('productSearch')}" value="${q}" oninput="App._pQuery=this.value;clearTimeout(window._pq);window._pq=setTimeout(()=>Admin.refreshContent(),250)"><button class="btn btn-primary" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> ${t('addProduct')}</button></div><div class="admin-card"><div class="admin-card-head"><h3>${t('totalProducts')} (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th></th><th>${t('productName')}</th><th>${t('category')}</th><th>${t('price')}</th><th>${t('stock')}</th><th></th></tr></thead><tbody>${list.map(p=>`<tr><td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"></td><td><b>${escapeHtml(p.name)}</b></td><td><span class="chip">${escapeHtml(p.cat)}</span></td><td>${money(p.price)}</td><td>${p.stock<=0?`<span class="chip blocked">${t('outOfStock')}</span>`:`<span class="chip active-status">${p.stock}</span>`}</td><td><div class="actions"><button class="icon-btn-sm" onclick="Admin.openProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button><button class="icon-btn-sm danger" onclick="Admin.deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  openProductModal(id){
    const p = id ? DB.products.find(x=>x.id===id) : { name:'', nameEn:'', cat:'', price:'', oldPrice:'', discount:0, stock:'', img:'', desc:'', featured:false };
    const cats = DB.categories.length ? DB.categories : ['ইলেকট্রনিকস','গ্যাজেট','ফ্যাশন'];
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3>${id?t('editProduct'):t('addProduct')}</h3></div><div class="modal-body"><div class="form-row"><div class="form-group"><label>${t('productName')} *</label><input id="pName" value="${escapeHtml(p.name)}"></div><div class="form-group"><label>English Name</label><input id="pNameEn" value="${escapeHtml(p.nameEn||'')}"></div></div><div class="form-row"><div class="form-group"><label>${t('category')}</label><select id="pCat">${cats.map(c=>`<option ${p.cat===c?'selected':''}>${escapeHtml(c)}</option>`).join('')}</select></div><div class="form-group"><label>Category EN</label><input id="pCatEn" value="${escapeHtml(p.catEn||'')}"></div></div><div class="form-group"><label>${t('description')}</label><textarea id="pDesc" rows="3">${escapeHtml(p.desc||'')}</textarea></div><div class="form-group"><label>${t('images')}</label><div class="img-upload"><div class="img-preview" id="imgPreview">${p.img?`<img src="${p.img}">`:`<i class="fa-solid fa-image"></i>`}</div><div class="upload-btn-wrap"><button type="button" class="upload-btn" id="uploadBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Upload</button><input type="file" id="imgFile" accept="image/*" style="display:none"></div></div><input type="hidden" id="pImg" value="${p.img||''}"></div><div class="form-row"><div class="form-group"><label>${t('price')} *</label><input id="pPrice" type="number" value="${p.price}"></div><div class="form-group"><label>${t('oldPrice')}</label><input id="pOld" type="number" value="${p.oldPrice||''}"></div></div><div class="form-row"><div class="form-group"><label>${t('discountPercent')}</label><input id="pDisc" type="number" value="${p.discount||0}"></div><div class="form-group"><label>${t('stock')}</label><input id="pStock" type="number" value="${p.stock}"></div></div><div class="form-group"><label style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" id="pFeatured" ${p.featured?'checked':''} style="width:auto"><span>${t('featured_product')}</span></label></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" id="pSaveBtn" onclick="Admin.saveProduct('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button></div>`);
    const btn = document.getElementById('uploadBtn'), file = document.getElementById('imgFile'), prev = document.getElementById('imgPreview'), hidden = document.getElementById('pImg');
    if(btn){ btn.onclick = ()=>file.click(); file.onchange = async ()=>{ const f=file.files[0]; if(!f) return; const r=new FileReader(); r.onload=e=>prev.innerHTML=`<img src="${e.target.result}">`; r.readAsDataURL(f); try{ const res=await ImageUpload.upload(f); hidden.value=res.url; prev.innerHTML=`<img src="${res.url}">`; Toast.show(t('imgUploadSuccess'),'success'); } catch(e){ Toast.show(t('imgUploadFailed'),'error'); } }; }
  },
  async saveProduct(id){
    const data = { id:id||'', name:document.getElementById('pName').value.trim(), nameEn:document.getElementById('pNameEn').value.trim(), cat:document.getElementById('pCat').value, catEn:document.getElementById('pCatEn').value.trim(), price:+document.getElementById('pPrice').value||0, oldPrice:+document.getElementById('pOld').value||0, discount:+document.getElementById('pDisc').value||0, stock:+document.getElementById('pStock').value||0, img:document.getElementById('pImg').value.trim()||'https://via.placeholder.com/300', desc:document.getElementById('pDesc').value.trim(), featured:document.getElementById('pFeatured').checked };
    if(!data.name || !data.price) return Toast.show(t('fillAllFields'),'error');
    try { await DB.saveProduct(data); Modal.close(); Toast.show(t('saveSuccess'),'success'); }
    catch(e){ Toast.show('Failed','error'); }
  },
  deleteProduct(id){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteProduct(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },
  orders(){
    App._orderFilter = App._orderFilter || { status:'all', payment:'all', search:'', from:'', to:'' };
    App._selectedOrders = App._selectedOrders || [];
    const f = App._orderFilter;
    const counts = Orders.counts();
    let list = DB.orders.slice();
    if(f.status !== 'all') list = list.filter(o=>o.status===f.status);
    if(f.payment !== 'all') list = list.filter(o=>(o.paymentMethod||'cod')===f.payment);
    if(f.search){ const s=f.search.toLowerCase(); list = list.filter(o=>o.id.toLowerCase().includes(s)||(o.customer?.name||'').toLowerCase().includes(s)||(o.customer?.phone||'').includes(f.search)); }
    if(f.from){ const from = new Date(f.from).getTime(); list = list.filter(o=>o.date>=from); }
    if(f.to){ const to = new Date(f.to).getTime()+86400000; list = list.filter(o=>o.date<=to); }
    const selected = App._selectedOrders;
    return `<div class="stat-grid">
        <div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='pending';Admin.refreshContent()"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${Orders.statusLabel('pending')}</p><h3>${counts.pending}</h3></div></div>
        <div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='confirmed';Admin.refreshContent()"><div class="stat-icon brand"><i class="fa-solid fa-check-circle"></i></div><div class="stat-info"><p>${Orders.statusLabel('confirmed')}</p><h3>${counts.confirmed}</h3></div></div>
        <div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='shipped';Admin.refreshContent()"><div class="stat-icon info"><i class="fa-solid fa-truck"></i></div><div class="stat-info"><p>${Orders.statusLabel('shipped')}</p><h3>${counts.shipped}</h3></div></div>
        <div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='delivered';Admin.refreshContent()"><div class="stat-icon success"><i class="fa-solid fa-circle-check"></i></div><div class="stat-info"><p>${Orders.statusLabel('delivered')}</p><h3>${counts.delivered}</h3></div></div>
      </div>
      <div class="order-filter-panel"><div class="order-filter-grid">
        <div><label>${t('filterStatus')}</label><select onchange="App._orderFilter.status=this.value;Admin.refreshContent()"><option value="all">All</option>${Orders.STATUS_ALL.map(s=>`<option value="${s}" ${f.status===s?'selected':''}>${Orders.statusLabel(s)} (${counts[s]||0})</option>`).join('')}</select></div>
        <div><label>${t('filterPayment')}</label><select onchange="App._orderFilter.payment=this.value;Admin.refreshContent()"><option value="all">All</option><option value="cod" ${f.payment==='cod'?'selected':''}>COD</option><option value="bkash" ${f.payment==='bkash'?'selected':''}>bKash</option><option value="nagad" ${f.payment==='nagad'?'selected':''}>Nagad</option></select></div>
        <div><label>${t('filterFrom')}</label><input type="date" value="${f.from}" onchange="App._orderFilter.from=this.value;Admin.refreshContent()"></div>
        <div><label>${t('filterTo')}</label><input type="date" value="${f.to}" onchange="App._orderFilter.to=this.value;Admin.refreshContent()"></div>
        <div><label>${t('filterSearch')}</label><input value="${f.search}" oninput="App._orderFilter.search=this.value;clearTimeout(window._os);window._os=setTimeout(()=>Admin.refreshContent(),300)"></div>
      </div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn btn-outline btn-sm" onclick="App._orderFilter={status:'all',payment:'all',search:'',from:'',to:''};Admin.refreshContent()"><i class="fa-solid fa-rotate-left"></i> ${t('filterReset')}</button><button class="btn btn-primary btn-sm" onclick="Admin.bulkPrint()"><i class="fa-solid fa-print"></i> ${t('bulkPrint')} (${list.length})</button></div></div>
      ${selected.length ? `<div class="bulk-bar"><span>${selected.length} ${t('bulkSelected')}</span><button class="btn btn-sm btn-success" onclick="Admin.bulkConfirm()"><i class="fa-solid fa-check"></i> ${t('bulkConfirm')}</button><button class="btn btn-sm btn-danger" onclick="Admin.bulkCancel()"><i class="fa-solid fa-ban"></i> ${t('bulkCancel')}</button><button class="btn btn-sm btn-outline" onclick="App._selectedOrders=[];Admin.refreshContent()">${t('cancel')}</button></div>` : ''}
      <div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-list"></i> Orders (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th style="width:40px"><input type="checkbox" onchange="Admin.toggleAllOrders(this.checked, ${JSON.stringify(list.map(o=>o.id))})"></th><th>${t('orderId')}</th><th>Customer</th><th>${t('total')}</th><th>${t('paymentMethod')}</th><th>${t('orderStatus')}</th><th>Actions</th></tr></thead><tbody>${list.length ? list.map(o=>`<tr style="${o.status==='pending'?'background:rgba(245,158,11,.05)':''}"><td><input type="checkbox" ${selected.includes(o.id)?'checked':''} onchange="Admin.toggleOrderSelect('${o.id}', this.checked)"></td><td><b>${o.id}</b><br><small style="color:var(--text-dim);font-size:11px">${new Date(o.date).toLocaleDateString()}</small></td><td><b>${escapeHtml(o.customer?.name||'—')}</b><br><small style="color:var(--text-dim);font-size:11px">${escapeHtml(o.customer?.phone||'')}</small></td><td><b>${money(o.total)}</b></td><td><span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:var(--surface-2)">${(o.paymentMethod||'cod').toUpperCase()}</span></td><td><span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.statusIcon(o.status)}"></i> ${Orders.statusLabel(o.status)}</span></td><td><div class="actions">${o.status==='pending'?`<button class="icon-btn-sm success" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>`:''}<button class="icon-btn-sm info" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button><button class="icon-btn-sm" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button><button class="icon-btn-sm" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer?.phone||''}')"><i class="fa-brands fa-whatsapp"></i></button>${!['delivered','cancelled','rejected'].includes(o.status)?`<button class="icon-btn-sm danger" onclick="Admin.quickCancel('${o.id}')"><i class="fa-solid fa-ban"></i></button>`:''}</div></td></tr>`).join('') : `<tr><td colspan="7" class="muted">${t('noData')}</td></tr>`}</tbody></table></div></div>`;
  },
  openOrderModal(id){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const isBn = LANG==='bn';
    const flow = Orders.STATUS_FLOW;
    const idx = flow.indexOf(o.status);
    const isCancelled = ['cancelled','rejected'].includes(o.status);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div><div class="modal-body">
      ${!isCancelled ? `<div class="order-timeline" style="margin-bottom:20px">${flow.map((s,i)=>`<div class="timeline-step ${i<idx?'done':''} ${i===idx?'current':''}">${i<flow.length-1?'<div class="timeline-line"></div>':''}<div class="dot"><i class="fa-solid ${i<=idx?'fa-check':Orders.statusIcon(s)}"></i></div><div class="label">${Orders.statusLabel(s)}</div></div>`).join('')}</div>` : ''}
      <div class="admin-card" style="padding:14px;margin-bottom:14px"><h5 style="font-size:12px;font-weight:800;color:var(--text-dim);text-transform:uppercase;margin-bottom:10px">${t('changeStatus')}</h5><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${Orders.STATUS_ALL.map(s=>`<button style="padding:7px 13px;border-radius:999px;font-size:11.5px;font-weight:700;cursor:pointer;border:${o.status===s?'2px solid var(--brand)':'1px solid var(--border)'};background:${o.status===s?'var(--brand-50)':'var(--surface)'};color:${o.status===s?'var(--brand-dark)':'var(--text-dim)'}" onclick="Admin.setOrderStatus('${o.id}', '${s}')"><i class="fa-solid ${Orders.statusIcon(s)}"></i> ${Orders.statusLabel(s)}</button>`).join('')}</div><div class="form-group" style="margin:0"><label>Comment</label><input id="aoComment" placeholder="..."></div></div>
      <div class="order-detail-grid">
        <div class="order-detail-section"><h5><i class="fa-solid fa-user"></i> ${t('customerInfo')}</h5><div class="detail-row"><span>Name</span><span>${escapeHtml(o.customer.name)}</span></div><div class="detail-row"><span>Phone</span><span>${escapeHtml(o.customer.phone)}</span></div><div class="detail-row"><span>Address</span><span>${escapeHtml(o.customer.address)}</span></div></div>
        <div class="order-detail-section"><h5><i class="fa-solid fa-credit-card"></i> ${t('paymentDetails')}</h5><div class="detail-row"><span>Method</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>${o.txnId?`<div class="detail-row"><span>Txn</span><span>${escapeHtml(o.txnId)}</span></div>`:''}${o.screenshot?`<div style="margin-top:10px"><img src="${o.screenshot}" style="max-width:100%;border-radius:10px;cursor:pointer" onclick="window.open('${o.screenshot}','_blank')"></div>`:''}</div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-money-bill"></i> ${t('amounts')}</h5><div class="form-row"><div class="form-group" style="margin:0"><label>${t('deliveryCharge')}</label><input type="number" id="aoDelivery" value="${o.deliveryCharge||0}"></div><div class="form-group" style="margin:0"><label>${t('discount')}</label><input type="number" id="aoDiscount" value="${o.discount||0}"></div></div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px"><button class="btn btn-outline btn-sm" onclick="Admin.recalcOrder('${o.id}')"><i class="fa-solid fa-calculator"></i> ${t('recalculate')}</button><span style="font-weight:800;font-size:16px;color:var(--brand)">${t('total')}: <span id="aoTotal">${money(o.total)}</span></span></div></div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-truck-fast"></i> Delivery</h5><div class="form-row"><div class="form-group" style="margin:0"><label>${t('courier')}</label><input id="aoCourier" value="${escapeHtml(o.courier||'')}"></div><div class="form-group" style="margin:0"><label>${t('trackingNumber')}</label><input id="aoTracking" value="${escapeHtml(o.trackingNumber||'')}"></div></div><div class="form-group" style="margin-top:10px"><label>${t('eta')}</label><input id="aoEta" value="${escapeHtml(o.eta||'')}"></div></div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-box"></i> ${t('orderItems')}</h5><div class="order-items-list">${(o.items||[]).map(it=>{const p=DB.products.find(x=>x.id===it.id);return `<div class="order-item-row"><img src="${p?p.img:''}" onerror="this.src='https://via.placeholder.com/48'"><div class="order-item-info"><h6>${escapeHtml(it.name)}</h6><p>${it.qty} × ${money(it.price)}</p></div><span class="order-item-price">${money(it.qty*it.price)}</span></div>`;}).join('')}</div></div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-lock"></i> ${t('internalNotes')}</h5>${(o.internalNotes||[]).length?`<div style="margin-bottom:10px">${(o.internalNotes||[]).slice().reverse().map(n=>`<div style="background:var(--surface);padding:10px 12px;border-radius:8px;margin-bottom:6px;border-left:3px solid var(--warning)"><p style="font-size:12.5px">${escapeHtml(n.text)}</p><small style="font-size:10.5px;color:var(--text-soft)">${new Date(n.time).toLocaleString()} • ${n.by||'Admin'}</small></div>`).join('')}</div>`:''}<div style="display:flex;gap:8px"><input id="aoNote" placeholder="${t('writeNote')}" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg)"><button class="btn btn-primary btn-sm" onclick="Admin.addNote('${o.id}')"><i class="fa-solid fa-plus"></i></button></div></div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5><ul class="order-history">${(o.history||[]).slice().reverse().map((h,i)=>`<li class="${i===0?'current':''}"><span class="h-dot"></span><h6>${Orders.statusLabel(h.status)}</h6><small>${new Date(h.time).toLocaleString()}${h.by?' • '+h.by:''}</small>${h.comment?`<div class="h-comment">${escapeHtml(h.comment)}</div>`:''}</li>`).join('')}</ul></div>
      </div></div>
      <div class="modal-foot"><button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button><button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button><button class="btn btn-primary btn-block" onclick="Admin.saveOrderChanges('${o.id}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button></div>`,'lg');
  },
  setOrderStatus(id, status){
    const defaults = { confirmed:t('confirmedByAdmin'), processing:t('processingStarted'), shipped:t('shippedByCourier'), out_for_delivery:t('outForDelivery'), delivered:t('deliveredSuccess'), cancelled:t('cancelledByAdmin'), rejected:t('rejectedByAdmin') };
    const comment = defaults[status] || '';
    Modal.confirm(LANG==='bn'?`"${Orders.statusLabel(status)}" করতে চান?`:`Change to "${Orders.statusLabel(status)}"?`, async ()=>{
      try {
        if(status === 'rejected') await Orders.reject(id, comment);
        else if(status === 'cancelled') await Orders.cancel(id, comment);
        else await Orders.updateStatus(id, status, comment);
        Toast.show(t('saveSuccess'),'success'); Modal.close(); Admin.refreshContent();
      } catch(e){ Toast.show('Failed','error'); }
    });
  },
  async quickConfirm(id){ try { await Orders.updateStatus(id, 'confirmed', t('confirmedByAdmin')); Toast.show('✅ Confirmed','success'); Admin.refreshContent(); } catch(e){ Toast.show('Failed','error'); } },
  quickCancel(id){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-ban"></i> ${t('cancelOrder')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('cancelReason')}</label><textarea id="cancelReason" rows="3" placeholder="${t('writeReason')}"></textarea></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-danger btn-block" onclick="Admin.confirmCancel('${id}')"><i class="fa-solid fa-ban"></i> ${t('confirmCancelAction')}</button></div>`);
  },
  async confirmCancel(id){
    const reason = document.getElementById('cancelReason').value.trim() || t('noReasonGiven');
    try { await Orders.cancel(id, reason); Toast.show(t('saveSuccess'),'success'); Modal.close(); Admin.refreshContent(); } catch(e){}
  },
  toggleOrderSelect(id, checked){ App._selectedOrders = App._selectedOrders||[]; if(checked && !App._selectedOrders.includes(id)) App._selectedOrders.push(id); else if(!checked) App._selectedOrders = App._selectedOrders.filter(x=>x!==id); Admin.refreshContent(); },
  toggleAllOrders(checked, ids){ App._selectedOrders = checked ? [...ids] : []; Admin.refreshContent(); },
  async bulkConfirm(){
    const ids = App._selectedOrders || []; if(!ids.length) return;
    Modal.confirm(`${ids.length} confirm?`, async ()=>{
      try { for(const id of ids) await Orders.updateStatus(id,'confirmed',t('confirmedByAdmin')); Toast.show('✅','success'); App._selectedOrders=[]; Admin.refreshContent(); } catch(e){}
    });
  },
  async bulkCancel(){
    const ids = App._selectedOrders || []; if(!ids.length) return;
    Modal.confirm(`${ids.length} cancel?`, async ()=>{
      try { for(const id of ids) await Orders.cancel(id, t('cancelledByAdmin')); Toast.show('✅','success'); App._selectedOrders=[]; Admin.refreshContent(); } catch(e){}
    });
  },
  bulkPrint(){
    const f = App._orderFilter || {};
    let list = DB.orders.slice();
    if(f.status && f.status!=='all') list = list.filter(o=>o.status===f.status);
    if(!list.length) return Toast.show('No orders','warning');
    const w = window.open('', '_blank', 'width=900,height=1000');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Orders</title><style>body{font-family:sans-serif;padding:20px;color:#0f1021}.h{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:18px;border-radius:12px;margin-bottom:20px}.b{background:#fff;border:1px solid #e5e8f0;border-radius:12px;padding:18px;margin-bottom:16px;page-break-inside:avoid}.bh{display:flex;justify-content:space-between;border-bottom:2px solid #e5e8f0;padding-bottom:10px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #e5e8f0}th{background:#f8f9fd}.t{text-align:right;font-weight:800;color:#6366f1;margin-top:10px}@media print{.bar{display:none}}</style></head><body><div class="h"><h1>Orders (${list.length})</h1></div>${list.map(o=>`<div class="b"><div class="bh"><h3>${o.id}</h3><span>${Orders.statusLabel(o.status)}</span></div><p>${escapeHtml(o.customer.name)} • ${escapeHtml(o.customer.phone)} • ${escapeHtml(o.customer.address)}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${(o.items||[]).map(it=>`<tr><td>${escapeHtml(it.name)}</td><td>${it.qty}</td><td>৳${it.price}</td><td>৳${it.qty*it.price}</td></tr>`).join('')}</tbody></table><div class="t">Total: ৳${o.total}</div></div>`).join('')}</body></html>`);
    w.document.close();
  },
  recalcOrder(id){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const d = +document.getElementById('aoDelivery').value || 0;
    const disc = +document.getElementById('aoDiscount').value || 0;
    document.getElementById('aoTotal').textContent = money((o.subtotal||0)+d-disc);
  },
  async addNote(id){
    const inp = document.getElementById('aoNote'); const text = inp.value.trim(); if(!text) return;
    try { await Orders.addNote(id, text); Toast.show(t('saveSuccess'),'success'); Admin.openOrderModal(id); } catch(e){}
  },
  async saveOrderChanges(id){
    const o = DB.orders.find(x=>x.id===id); if(!o) return;
    const comment = document.getElementById('aoComment')?.value.trim() || '';
    const delivery = +document.getElementById('aoDelivery').value || 0;
    const discount = +document.getElementById('aoDiscount').value || 0;
    const courier = document.getElementById('aoCourier')?.value.trim() || '';
    const tracking = document.getElementById('aoTracking')?.value.trim() || '';
    const eta = document.getElementById('aoEta')?.value.trim() || '';
    try {
      const newTotal = (o.subtotal||0) + delivery - discount;
      const history = (o.history||[]).concat([{ status:o.status, time:Date.now(), comment:comment||t('updatedByAdmin'), by:(Auth.user()&&Auth.user().name)||'Admin' }]);
      await Orders.update(id, { deliveryCharge:delivery, discount, total:newTotal, courier:courier||null, trackingNumber:tracking||null, eta:eta||null, history });
      Toast.show(t('saveSuccess'),'success'); Modal.close(); Admin.refreshContent();
    } catch(e){ Toast.show('Failed','error'); }
  },
  users(){
    const q = (App._uQuery||'').toLowerCase();
    const list = DB.users.filter(u => !q || (u.name+u.email).toLowerCase().includes(q));
    return `<div class="admin-toolbar"><input placeholder="${t('userSearch')}" value="${App._uQuery||''}" oninput="App._uQuery=this.value;clearTimeout(window._uq);window._uq=setTimeout(()=>Admin.refreshContent(),250)"></div><div class="admin-card"><div class="admin-card-head"><h3>${t('totalUsers')} (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th></th><th>${t('fullName')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('active')}</th><th></th></tr></thead><tbody>${list.map(u=>`<tr><td><img class="thumb" style="border-radius:50%" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'"></td><td><b>${escapeHtml(u.name)}</b></td><td>${escapeHtml(u.email)}</td><td><span class="chip ${u.role==='admin'?'active-status':''}">${u.role}</span></td><td>${u.blocked?`<span class="chip blocked">${t('blocked')}</span>`:`<span class="chip active-status">${t('active')}</span>`}</td><td><div class="actions"><button class="icon-btn-sm ${u.blocked?'success':''}" onclick="Admin.toggleBlock('${u.id}')"><i class="fa-solid ${u.blocked?'fa-unlock':'fa-ban'}"></i></button>${u.role!=='admin'?`<button class="icon-btn-sm danger" onclick="Admin.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>`:''}</div></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  async toggleBlock(id){ const u = DB.users.find(x=>x.id===id); if(!u||u.role==='admin') return; try { await DB.updateUser(id, { blocked: !u.blocked }); Toast.show(t('saveSuccess'),'success'); } catch(e){} },
  deleteUser(id){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteUser(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },
  allReviews(){
    const list = DB.reviews.sort((a,b)=>(b.date||0)-(a.date||0));
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-star"></i> ${t('productReviews')} (${list.length})</h3></div>${list.length ? list.map(r=>{
      const p = DB.products.find(x=>x.id===r.productId);
      const u = DB.users.find(x=>x.id===r.userId);
      return `<div style="padding:14px;border-bottom:1px solid var(--border);display:flex;gap:12px">
        <img src="${u?.avatar||'https://ui-avatars.com/api/?name=U'}" style="width:44px;height:44px;border-radius:50%;object-fit:cover" onerror="this.src='https://ui-avatars.com/api/?name=U'">
        <div style="flex:1"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:4px"><b>${escapeHtml(r.userName||'User')}</b><span class="rating">${starHTML(r.rating,'13px')}</span></div><p style="font-size:13px;color:var(--text-dim);line-height:1.6">${escapeHtml(r.text)}</p><small style="font-size:11px;color:var(--text-soft)">${p ? `<i class="fa-solid fa-box"></i> ${escapeHtml(p.name)} • ` : ''}${timeAgo(r.date)}</small></div>
        <button class="icon-btn-sm danger" onclick="Admin.deleteReview('${r.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    }).join('') : `<p class="muted">${t('noData')}</p>`}</div>`;
  },
  deleteReview(id){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await db.ref('reviews/'+id).remove(); Toast.show(t('deleteSuccess'),'success'); Admin.refreshContent(); } catch(e){} }); },
  categories(){
    const keys = Object.entries(DB.catRaw);
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-tags"></i> ${t('categories')}</h3></div><div class="admin-toolbar"><input id="newCat" placeholder="${t('categoryName')}"><button class="btn btn-primary" onclick="Admin.addCat()"><i class="fa-solid fa-plus"></i> ${t('addCategory')}</button></div><div style="display:flex;gap:9px;flex-wrap:wrap">${keys.map(([k,v])=>`<div class="chip" style="padding:9px 15px;font-size:13px">${escapeHtml(v)}<button onclick="Admin.delCat('${k}')" style="border:none;background:none;color:var(--text-dim);margin-left:8px;cursor:pointer"><i class="fa-solid fa-xmark"></i></button></div>`).join('')}</div></div>`;
  },
  async addCat(){ const v = document.getElementById('newCat').value.trim(); if(!v) return; try { await DB.saveCategory(v); Toast.show(t('saveSuccess'),'success'); } catch(e){} },
  delCat(key){ Modal.confirm(t('deleteConfirm'), async ()=>{ try { await DB.deleteCategory(key); } catch(e){} }); },
  coupons(){
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-ticket"></i> ${t('coupons')}</h3></div><div class="admin-toolbar"><input id="cCode" placeholder="${t('couponCode')}"><select id="cType"><option value="percent">${t('percentOff')}</option><option value="flat">${t('flatOff')}</option></select><input id="cVal" type="number" placeholder="${t('price')}"><button class="btn btn-primary" onclick="Admin.addCoupon()"><i class="fa-solid fa-plus"></i> ${t('addCoupon')}</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>${t('couponCode')}</th><th>Type</th><th>Value</th><th></th></tr></thead><tbody>${DB.coupons.map(c=>`<tr><td><b>${escapeHtml(c.code)}</b></td><td><span class="chip">${c.type}</span></td><td>${c.type==='percent'?c.value+'%':money(c.value)}</td><td><button class="icon-btn-sm danger" onclick="Admin.delCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  async addCoupon(){
    const code = document.getElementById('cCode').value.trim().toUpperCase();
    const type = document.getElementById('cType').value;
    const value = +document.getElementById('cVal').value;
    if(!code || !value) return Toast.show(t('fillAllFields'),'error');
    try { await DB.saveCoupon({ code, type, value }); Toast.show(t('saveSuccess'),'success'); } catch(e){}
  },
  async delCoupon(id){ try { await DB.deleteCoupon(id); } catch(e){} },
  broadcastPage(){
    const totalUsers = DB.users.length;
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-bullhorn"></i> ${t('broadcastNotif')}</h3></div><p style="font-size:13px;color:var(--text-dim);margin-bottom:16px">${t('broadcastDesc')}</p><div class="form-group"><label>${t('broadcastTitle')} *</label><input id="broadcastTitle" placeholder="${LANG==='bn'?'যেমন: নতুন অফার!':'e.g. New Offer!'}"></div><div class="form-group"><label>${t('broadcastBody')} *</label><textarea id="broadcastBody" rows="4" placeholder="${LANG==='bn'?'মেসেজ লিখুন...':'Type message...'}"></textarea></div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn btn-pink btn-lg" onclick="Admin.sendBroadcast()"><i class="fa-solid fa-paper-plane"></i> ${t('sendBroadcast')}</button><span style="font-size:13px;color:var(--text-dim)">${t('recipients')}: <b>${totalUsers}</b></span></div></div>`;
  },
  openBroadcastModal(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-bullhorn"></i> ${t('broadcastNotif')}</h3></div><div class="modal-body"><p style="font-size:13px;color:var(--text-dim);margin-bottom:14px">${t('broadcastDesc')}</p><div class="form-group"><label>${t('broadcastTitle')} *</label><input id="broadcastTitleModal" placeholder="${LANG==='bn'?'নতুন অফার!':'New Offer!'}"></div><div class="form-group"><label>${t('broadcastBody')} *</label><textarea id="broadcastBodyModal" rows="4" placeholder="${LANG==='bn'?'মেসেজ লিখুন...':'Type message...'}"></textarea></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-pink btn-block" onclick="Admin.sendBroadcastFromModal()"><i class="fa-solid fa-paper-plane"></i> ${t('sendBroadcast')}</button></div>`);
  },
  async sendBroadcast(){
    const title = document.getElementById('broadcastTitle').value.trim();
    const body = document.getElementById('broadcastBody').value.trim();
    if(!title || !body) return Toast.show(t('fillAllFields'),'error');
    try {
      await DB.broadcastNotif(title, body);
      Toast.show(t('broadcastSent'),'success',4000);
      PushNotif.local(LANG==='bn'?'নতুন নোটিফিকেশন':'New notification', title);
      Admin.refreshContent();
    } catch(e){ Toast.show(t('broadcastFailed'),'error'); }
  },
  async sendBroadcastFromModal(){
    const title = document.getElementById('broadcastTitleModal').value.trim();
    const body = document.getElementById('broadcastBodyModal').value.trim();
    if(!title || !body) return Toast.show(t('fillAllFields'),'error');
    try {
      await DB.broadcastNotif(title, body);
      Modal.close();
      Toast.show(t('broadcastSent'),'success',4000);
    } catch(e){ Toast.show(t('broadcastFailed'),'error'); }
  },
  settings(){
    const s = DB.settings;
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-gear"></i> ${t('settings')}</h3></div><div class="form-group"><label>${t('siteName')}</label><input id="stName" value="${escapeHtml(s.siteName||'')}"></div><div class="form-group"><label>${t('supportPhone')}</label><input id="stPhone" value="${escapeHtml(s.supportPhone||'')}"></div><div class="form-group"><label>WhatsApp</label><input id="stWhatsapp" value="${escapeHtml(s.whatsappNumber||'')}"></div><div class="form-row"><div class="form-group"><label>${t('insideDhaka')} (৳)</label><input id="stShipIn" type="number" value="${s.shippingInsideDhaka||100}"></div><div class="form-group"><label>${t('outsideDhaka')} (৳)</label><input id="stShipOut" type="number" value="${s.shippingOutsideDhaka||120}"></div></div><div class="form-group"><label>${t('bkash')}</label><input id="stBkash" value="${escapeHtml(s.bkashNumber||'')}"></div><div class="form-group"><label>${t('nagad')}</label><input id="stNagad" value="${escapeHtml(s.nagadNumber||'')}"></div><div class="form-group"><label>${t('rocket')}</label><input id="stRocket" value="${escapeHtml(s.rocketNumber||'')}"></div><button class="btn btn-primary" onclick="Admin.saveSettings()"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button></div>`;
  },
  async saveSettings(){
    const settings = { ...DB.settings, siteName:document.getElementById('stName').value.trim(), supportPhone:document.getElementById('stPhone').value.trim(), whatsappNumber:document.getElementById('stWhatsapp').value.trim(), shippingInsideDhaka:+document.getElementById('stShipIn').value||100, shippingOutsideDhaka:+document.getElementById('stShipOut').value||120, bkashNumber:document.getElementById('stBkash').value.trim(), nagadNumber:document.getElementById('stNagad').value.trim(), rocketNumber:document.getElementById('stRocket').value.trim() };
    try { await DB.saveSettings(settings); Toast.show(t('settingsSaved'),'success'); } catch(e){}
  },
  refreshContent(){ const el = document.getElementById('adminContent'); if(el) el.innerHTML = this.render(App._adminTab||'dashboard'); }
};

/* ═══ AuthUI ═══ */
const AuthUI = {
  tab(which){
    App._authTab = which; App._otpStep = null; App._pendingReg = null; OTP.reset();
    document.getElementById('tabLogin').classList.toggle('active', which==='login');
    document.getElementById('tabReg').classList.toggle('active', which==='reg');
    document.getElementById('authForm').innerHTML = which==='login' ? this.loginForm(App._authRedirect||'home') : this.regForm(App._authRedirect||'home');
  },
  loginForm(redirect='home'){
    return `<form onsubmit="AuthUI.doLogin(event, '${redirect}')"><div class="form-group"><label>${t('email')}</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="authEmail" required placeholder="you@example.com"></div></div><div class="form-group"><label>${t('password')}</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="authPass" required placeholder="••••••"><button type="button" class="toggle-pass" onclick="AuthUI.togglePass('authPass', this)"><i class="fa-solid fa-eye"></i></button></div></div><div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button type="button" class="forgot-password-link" onclick="PasswordReset.open()"><i class="fa-solid fa-key"></i> ${t('forgotPassword')}</button></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmit">${t('login')} <i class="fa-solid fa-arrow-right"></i></button></form>`;
  },
  regForm(redirect='home'){
    if(App._otpStep === 'verify' && OTP.currentEmail) return this.otpVerifyForm(redirect);
    return `<form onsubmit="AuthUI.sendOTP(event, '${redirect}')" novalidate><div class="reg-steps"><div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">Info</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div></div><div class="form-group"><label>${t('fullName')} *</label><div class="input-wrap"><i class="fa-solid fa-user input-icon"></i><input id="regName" required></div></div><div class="form-group"><label>${t('email')} *</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="regEmail" required oninput="AuthUI.onEmailInput(this.value)"></div><div class="form-hint" id="emailCheckHint"></div></div><div class="form-group"><label>${t('phone')}</label><div class="input-wrap"><i class="fa-solid fa-phone input-icon"></i><input id="regPhone" placeholder="017XXXXXXXX"></div></div><div class="form-group"><label>${t('password')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="regPass" required minlength="6"><button type="button" class="toggle-pass" onclick="AuthUI.togglePass('regPass', this)"><i class="fa-solid fa-eye"></i></button></div></div><div class="form-group"><label>${t('confirmPassword')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="regPass2" required></div><div class="form-error" id="passError">${t('passwordMismatch')}</div></div><div class="form-group"><label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:12.5px"><input type="checkbox" id="regTerms" required style="width:auto;margin-top:3px"><span>${t('agreeTerms')}</span></label></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="regSendBtn"><i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}</button></form>`;
  },
  otpVerifyForm(redirect='home'){
    return `<form onsubmit="AuthUI.verifyOTP(event, '${redirect}')" novalidate><div class="reg-steps"><div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">Info</span></div><div class="reg-step-line done"></div><div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div></div><div class="otp-header"><div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div><h3>${t('verifyEmail')}</h3><p>${t('weSentCode')}<br><b>${OTP.maskEmail(OTP.currentEmail)}</b></p></div><div class="otp-inputs" id="otpInputs">${[0,1,2,3,4,5].map(i=>`<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">`).join('')}</div><div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="otpVerifyBtn"><i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}</button><div class="otp-actions"><button type="button" class="btn-link" id="otpResendBtn" onclick="AuthUI.resendOTP()" disabled><i class="fa-solid fa-rotate-right"></i> <span id="otpResendText">${t('resendOTP')}</span></button><button type="button" class="btn-link" onclick="AuthUI.backToInfo()"><i class="fa-solid fa-arrow-left"></i> ${t('changeInfo')}</button></div></form>`;
  },
  onEmailInput(email){
    const hint = document.getElementById('emailCheckHint'); if(!hint) return;
    hint.textContent = ''; hint.style.color = '';
    const target = Auth.normalizeEmail(email);
    if(!target || target.length < 5 || !target.includes('@')) return;
    if(!DB.ready.users){ hint.textContent = t('dataLoadingWait'); hint.style.color='var(--text-dim)'; return; }
    const s = Auth.checkEmailStatus(target);
    if(s.status === 'taken'){ hint.textContent = t('emailTaken'); hint.style.color='var(--danger)'; }
    else if(s.status === 'free'){ hint.textContent = t('emailAvailable'); hint.style.color='var(--success)'; }
  },
  otpInput(el){
    const v = el.value.replace(/\D/g,''); el.value = v.slice(0,1);
    el.classList.toggle('filled', !!el.value);
    if(v){ const idx = +el.dataset.idx; const nx = document.querySelector(`.otp-inputs input[data-idx="${idx+1}"]`); nx ? nx.focus() : el.blur(); }
  },
  otpKey(e, el){
    const idx = +el.dataset.idx;
    if(e.key === 'Backspace' && !el.value){ const prev = document.querySelector(`.otp-inputs input[data-idx="${idx-1}"]`); if(prev){ prev.focus(); prev.value=''; prev.classList.remove('filled'); } }
  },
  otpPaste(e){
    e.preventDefault();
    const text = (e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
    const inputs = document.querySelectorAll('.otp-inputs input');
    text.split('').forEach((ch,i)=>{ if(inputs[i]){ inputs[i].value = ch; inputs[i].classList.add('filled'); } });
    (Array.from(inputs).find(i=>!i.value) || inputs[inputs.length-1]).focus();
  },
  getOTPValue(){ return Array.from(document.querySelectorAll('.otp-inputs input')).map(i=>i.value).join(''); },
  clearOTPInputs(){ document.querySelectorAll('.otp-inputs input').forEach(i => { i.value=''; i.classList.remove('filled'); }); },
  async sendOTP(e, redirect){
    if(e) e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = Auth.normalizeEmail(document.getElementById('regEmail').value);
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    const terms = document.getElementById('regTerms').checked;
    const err = document.getElementById('passError');
    if(!name || !email || !pass) return Toast.show(t('fillAllFields'),'error');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Toast.show(t('invalidEmail'),'error');
    if(pass !== pass2){ err.classList.add('show'); return Toast.show(t('passwordMismatch'),'error'); }
    err.classList.remove('show');
    if(pass.length < 6) return Toast.show(t('weakPassword'),'error');
    if(!terms) return Toast.show(t('agreeToTerms'),'warning');
    if(!DB.ready.users) return Toast.show(t('dataLoadingWait'),'warning');
    if(Auth.isEmailTaken(email)){ Toast.show(t('emailExists'),'error',4000); setTimeout(()=>{ App._authTab='login'; App.render(); },600); return; }
    App._pendingReg = { name, email, phone, password: pass };
    const btn = document.getElementById('regSendBtn'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpSending')}`;
    const r = await OTP.send(email, name);
    if(!r.ok){ Toast.show(t('otpFailed')+': '+r.msg,'error',6000); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}`; return; }
    Toast.show(t('otpSent'),'success');
    App._otpStep = 'verify'; App._authRedirect = redirect; App.render();
    setTimeout(()=>{ document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.startResendCooldown(60); }, 300);
  },
  startResendCooldown(sec){
    const btn = document.getElementById('otpResendBtn'); const txt = document.getElementById('otpResendText'); if(!btn||!txt) return;
    btn.disabled = true;
    OTP.startCooldown(sec, r => { txt.textContent = r>0 ? `${t('resendOTP')} (${r}s)` : t('resendOTP'); if(r<=0) btn.disabled = false; });
  },
  async verifyOTP(e, redirect){
    if(e) e.preventDefault();
    const code = this.getOTPValue();
    if(code.length !== 6) return Toast.show(t('enterFullCode'),'warning');
    const btn = document.getElementById('otpVerifyBtn'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    const r = await OTP.verify(code);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`; return; }
    const pending = App._pendingReg;
    if(!pending) return Toast.show('Session lost','error');
    const reg = await Auth.register(pending);
    if(!reg.ok){ Toast.show(reg.msg,'error'); btn.disabled = false; return; }
    OTP.reset(); App._pendingReg = null; App._otpStep = null; App._authRedirect = null;
    Toast.show(t('registrationSuccess')+' '+reg.user.name,'success',4000);
    setTimeout(()=>App.go(redirect && redirect!=='home' ? redirect : 'home'),600);
  },
  async resendOTP(){
    const p = App._pendingReg; if(!p) return;
    const btn = document.getElementById('otpResendBtn'); btn.disabled = true;
    const txt = document.getElementById('otpResendText'); txt.textContent = t('otpSending');
    OTP.attempts = 0;
    const r = await OTP.send(p.email, p.name);
    if(!r.ok){ Toast.show('Failed','error'); btn.disabled = false; txt.textContent = t('resendOTP'); return; }
    Toast.show(t('otpSent'),'success'); this.clearOTPInputs(); this.startResendCooldown(60);
  },
  backToInfo(){ App._otpStep = null; OTP.reset(); App.render(); },
  togglePass(id, btn){
    const input = document.getElementById(id); if(!input) return;
    const show = input.type === 'password'; input.type = show?'text':'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${show?'-slash':''}"></i>`;
  },
  checkPwd(val){
    let score = 0;
    if(val.length >= 6) score++;
    if(val.length >= 10) score++;
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if(/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
    const bars = [1,2,3,4].map(i=>document.getElementById('pwdBar'+i));
    const cls = score<=1?'weak':score<=3?'medium':'strong';
    bars.forEach((b,i)=>{ if(b) b.className = 'pwd-bar' + (i<score?' '+cls:''); });
    const txt = document.getElementById('pwdText');
    if(txt) txt.textContent = score ? cls : 'Password strength';
  },
  async doLogin(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('loginSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    const r = await Auth.login(document.getElementById('authEmail').value, document.getElementById('authPass').value);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `${t('login')} <i class="fa-solid fa-arrow-right"></i>`; return; }
    Toast.show(t('loginSuccess')+', '+r.user.name,'success');
    const target = r.user.role==='admin' ? 'admin' : (redirect && redirect!=='home' ? redirect : 'home');
    App._authRedirect = null; App.go(target);
  }
};

/* ═══ Password Reset ═══ */
const PasswordReset = {
  step: 1, email: null, otpCode: null, otpExpiresAt: 0, otpAttempts: 0, cooldownTimer: null, verified: false,
  open(){ this.reset(); this.step = 1; this.render(); },
  close(){ Modal.close(); this.reset(); if(this.cooldownTimer) clearInterval(this.cooldownTimer); },
  reset(){ this.step = 1; this.email = null; this.otpCode = null; this.otpExpiresAt = 0; this.otpAttempts = 0; this.verified = false; },
  render(){ this.step === 1 ? this.renderStep1() : this.step === 2 ? this.renderStep2() : this.renderStep3(); },
  renderStep1(){
    Modal.open(`<button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-key"></i> ${t('resetPassword')}</h3></div><div class="modal-body"><div class="reg-steps"><div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">${t('stepEmail')}</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">${t('stepOtp')}</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div></div><p style="font-size:13.5px;color:var(--text-dim);text-align:center;margin-bottom:18px">${t('resetPasswordDesc')}</p><div class="form-group"><label>${t('email')}</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="prEmail" placeholder="you@example.com" autofocus></div><div class="form-hint" id="prEmailHint"></div></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="PasswordReset.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="PasswordReset.sendOTP()"><i class="fa-solid fa-paper-plane"></i> ${t('sendCode')}</button></div>`);
  },
  async sendOTP(){
    const email = Auth.normalizeEmail(document.getElementById('prEmail').value);
    const hint = document.getElementById('prEmailHint');
    if(!email) return Toast.show(t('invalidEmail'),'error');
    if(!DB.ready.users) return;
    const user = DB.users.find(u => Auth.normalizeEmail(u.email) === email);
    if(!user){ if(hint){ hint.textContent = t('noAccountWithEmail'); hint.style.color='var(--danger)'; } return; }
    const code = OTP.generate();
    this.email = email; this.otpCode = code;
    this.otpExpiresAt = Date.now() + 10*60*1000; this.otpAttempts = 0; this.verified = false;
    if(!OTP.init()) return;
    try {
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, { to_email:this.email, email:this.email, reply_to:this.email, otp_code:code, code:code, user_name:user.name, site_name:'EcoShop Pro MAX' });
      Toast.show(t('otpSent'),'success');
      this.step = 2; this.render();
      setTimeout(()=>{ document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.startCooldown(60); }, 250);
    } catch(err){ Toast.show(t('otpFailed'),'error',6000); }
  },
  renderStep2(){
    Modal.open(`<button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-shield-halved"></i> ${t('verifyOTP')}</h3></div><div class="modal-body"><div class="reg-steps"><div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepEmail')}</span></div><div class="reg-step-line done"></div><div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">${t('stepOtp')}</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div></div><div class="otp-header"><div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div><h3>${t('verifyEmail')}</h3><p>${t('weSentCode')}<br><b>${OTP.maskEmail(this.email)}</b></p></div><div class="otp-inputs" id="otpInputs">${[0,1,2,3,4,5].map(i=>`<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpInput(this)" onkeydown="AuthUI.otpKey(event, this)" onpaste="AuthUI.otpPaste(event)">`).join('')}</div><div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div></div><div class="modal-foot"><button class="btn btn-outline" style="flex:1" onclick="PasswordReset.back()"><i class="fa-solid fa-arrow-left"></i> ${t('back')}</button><button class="btn btn-outline" style="flex:1" id="prResendBtn" onclick="PasswordReset.resendOTP()" disabled>${t('resendOTP')}</button><button class="btn btn-primary" style="flex:1" onclick="PasswordReset.verify()"><i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}</button></div>`);
  },
  verify(){
    const code = AuthUI.getOTPValue();
    if(code.length !== 6) return Toast.show(t('enterFullCode'),'warning');
    if(Date.now() > this.otpExpiresAt) return Toast.show('Code expired','error');
    if(this.otpAttempts >= 5) return Toast.show('Too many attempts','error');
    if(code !== this.otpCode){ this.otpAttempts++; return Toast.show(`Wrong (${5-this.otpAttempts} left)`,'error'); }
    this.verified = true; Toast.show(t('codeVerified'),'success');
    this.step = 3; this.render();
  },
  startCooldown(sec){
    const btn = document.getElementById('prResendBtn'); if(!btn) return;
    btn.disabled = true;
    if(this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(()=>{ sec--; if(sec<=0){ clearInterval(this.cooldownTimer); this.cooldownTimer=null; btn.disabled=false; btn.textContent = t('resendOTP'); } else btn.textContent = `${t('resendOTP')} (${sec}s)`; }, 1000);
  },
  async resendOTP(){
    if(!this.email) return this.back();
    const code = OTP.generate(); this.otpCode = code; this.otpExpiresAt = Date.now()+10*60*1000; this.otpAttempts = 0;
    try {
      const user = DB.users.find(u => Auth.normalizeEmail(u.email) === this.email);
      await emailjs.send(EmailJSConfig.serviceId, EmailJSConfig.templateId, { to_email:this.email, email:this.email, reply_to:this.email, otp_code:code, code:code, user_name:user?.name||'User', site_name:'EcoShop Pro MAX' });
      Toast.show(t('otpSent'),'success'); AuthUI.clearOTPInputs(); this.startCooldown(60);
    } catch(err){ Toast.show('Failed','error'); }
  },
  back(){ this.step = 1; if(this.cooldownTimer) clearInterval(this.cooldownTimer); this.render(); },
  renderStep3(){
    Modal.open(`<button class="modal-close" onclick="PasswordReset.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-lock"></i> ${t('newPassword2')}</h3></div><div class="modal-body"><div class="reg-steps"><div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepEmail')}</span></div><div class="reg-step-line done"></div><div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">${t('stepOtp')}</span></div><div class="reg-step-line done"></div><div class="reg-step active"><span class="reg-step-num">3</span><span class="reg-step-label">${t('stepNew')}</span></div></div><div class="form-group"><label>${t('newPassword2')}</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="prNewPass" placeholder="••••••"><button type="button" class="toggle-pass" onclick="AuthUI.togglePass('prNewPass', this)"><i class="fa-solid fa-eye"></i></button></div></div><div class="form-group"><label>${t('confirmPassword')}</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="prNewPass2" placeholder="••••••"><button type="button" class="toggle-pass" onclick="AuthUI.togglePass('prNewPass2', this)"><i class="fa-solid fa-eye"></i></button></div><div class="form-error" id="prPassError">${t('passwordMismatch')}</div></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="PasswordReset.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="PasswordReset.update()"><i class="fa-solid fa-floppy-disk"></i> ${t('updatePassword')}</button></div>`);
  },
  async update(){
    const p1 = document.getElementById('prNewPass').value;
    const p2 = document.getElementById('prNewPass2').value;
    const err = document.getElementById('prPassError');
    if(!p1 || !p2) return Toast.show(t('fillAllFields'),'error');
    if(p1.length < 6) return Toast.show(t('weakPassword'),'error');
    if(p1 !== p2){ err.classList.add('show'); return Toast.show(t('passwordMismatch'),'error'); }
    err.classList.remove('show');
    if(!this.verified) return Toast.show(t('verifyCodeFirst'),'error');
    try {
      const user = DB.users.find(u => Auth.normalizeEmail(u.email) === this.email);
      if(!user) throw new Error('User not found');
      await DB.updateUser(user.id, { password: p1 });
      const email = this.email;
      Modal.open(`<div class="order-success"><div class="order-success-icon"><i class="fa-solid fa-check"></i></div><h3 style="font-size:19px;font-weight:800;margin-bottom:8px">${t('passwordUpdated')}</h3><p style="font-size:13.5px;color:var(--text-dim);margin-bottom:22px">${t('passwordUpdatedDesc')}</p><button class="btn btn-primary btn-block" onclick="PasswordReset.finish('${email}')">${t('loginNow')}</button></div>`,'sm');
      this.reset();
    } catch(e){ Toast.show(t('updateFailed'),'error'); }
  },
  finish(email){
    Modal.close();
    App._authTab = 'login'; App._otpStep = null; App._pendingReg = null;
    OTP.reset(); this.reset();
    App.go('auth');
    setTimeout(()=>{ const e = document.getElementById('authEmail'); if(e) e.value = email||''; document.getElementById('authPass')?.focus(); }, 150);
  }
};

/* ═══ Theme/Lang ═══ */
function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('eco_theme', mode);
  document.querySelectorAll('[data-set-theme]').forEach(b => b.classList.toggle('active', b.dataset.setTheme === mode));
  const tb = document.getElementById('themeBtn'); if(tb) tb.innerHTML = `<i class="fa-solid fa-${mode==='dark'?'sun':'moon'}"></i>`;
}
function applyLang(lang){
  LANG = lang; localStorage.setItem('eco_lang', lang);
  document.documentElement.lang = lang;
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = lang.toUpperCase();
  document.querySelectorAll('[data-set-lang]').forEach(b => b.classList.toggle('active', b.dataset.setLang === lang));
  App.render();
  Chatbot.renderQuick();
}
function setFbStatus(ok, text){
  const el = document.getElementById('fbStatus'); if(el) el.style.color = ok ? 'var(--success)' : 'var(--warning)';
  const txt = document.getElementById('fbStatusText'); if(txt) txt.textContent = text;
}

/* ═══ Init ═══ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 EcoShop Pro MAX v13.0 starting...');
  const savedTheme = localStorage.getItem('eco_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  LANG = localStorage.getItem('eco_lang') || 'bn';
  document.documentElement.lang = LANG;
  const lc = document.getElementById('langChip'); if(lc) lc.textContent = LANG.toUpperCase();

  OTP.init(); Chatbot.init();

  /* Splash */
  let p = 0;
  const statuses = ['Firebase-এ সংযুক্ত হচ্ছে...','ডেটা সিঙ্ক হচ্ছে...','প্রায় শেষ...','স্বাগতম!'];
  const timer = setInterval(()=>{ p += 25; const b=document.getElementById('splashBar'); const s=document.getElementById('splashStatus'); if(b) b.style.width=p+'%'; if(s) s.textContent = statuses[Math.min(3, Math.floor(p/25)-1)] || statuses[0]; if(p>=100) clearInterval(timer); }, 350);
  setTimeout(()=>App.hideSplash(), 5000);

  if(fbReady){
    setFbStatus(false, 'Firebase: connecting...');
    try { db.ref('.info/connected').on('value', snap => { setFbStatus(snap.val()===true, snap.val()===true ? 'Firebase: ✅ connected' : 'Firebase: ⚠️ offline'); }); } catch(e){}
    DB.init();
  } else { setFbStatus(false, 'Firebase: ❌ failed'); App.hideSplash(); }

  PWA.registerSW(); PWA.initInstallPrompt(); PushNotif.init();

  /* Offline detection — shows in SIDE MENU, not top of header */
  window.addEventListener('online', ()=>{
    const off = document.getElementById('pmOfflineStatus');
    if(off) off.style.display = 'none';
    Toast.show(LANG==='bn'?'✅ অনলাইনে':'✅ Online','success');
  });
  window.addEventListener('offline', ()=>{
    const off = document.getElementById('pmOfflineStatus');
    if(off) off.style.display = 'flex';
    Toast.show(LANG==='bn'?'⚠️ অফলাইন মোড':'⚠️ Offline mode','warning');
  });
  if(!navigator.onLine){
    const off = document.getElementById('pmOfflineStatus');
    if(off) off.style.display = 'flex';
  }

  /* Scroll */
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if(nb){
      nb.classList.toggle('scrolled', window.scrollY > 10);
      const doc = document.documentElement;
      const pct = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
      const prog = document.getElementById('navbarProgress');
      if(prog) prog.style.width = Math.min(100, pct) + '%';
    }
    const btt = document.getElementById('backToTop'); if(btt) btt.classList.toggle('show', window.scrollY > 400);
  }, { passive:true });
  document.getElementById('backToTop').onclick = ()=> window.scrollTo({ top:0, behavior:'smooth' });

  /* Cursor */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow = document.getElementById('cursorGlow');
    if(glow){
      let mx=0, my=0, cx=0, cy=0;
      document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });
      (function anim(){ cx += (mx-cx)*.12; cy += (my-cy)*.12; glow.style.left = cx+'px'; glow.style.top = cy+'px'; requestAnimationFrame(anim); })();
    }
  }

  /* Nav */
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      const r = a.dataset.nav;
      if(r==='cart'){ App.openCart(); return; }
      if(r==='search'){ openMobileSearch(); return; }
      App.go(r);
    };
  });
  document.querySelectorAll('.nav-menu a').forEach(a => a.onclick = ()=> App.go(a.dataset.nav));

  /* Side menu */
  const openPM = ()=>{ document.getElementById('powerMenu').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; };
  const closePM = ()=>{ document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };
  document.getElementById('menuToggle').onclick = openPM;
  document.getElementById('pmClose').onclick = closePM;
  App.closePM = closePM;

  /* Drawers */
  document.getElementById('cartBtn').onclick = ()=>{ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; };
  document.getElementById('cartClose').onclick = ()=>{ document.getElementById('cartDrawer').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };
  document.getElementById('checkoutBtn').onclick = ()=>{ document.getElementById('cartDrawer').classList.remove('active'); App.go('checkout'); };

  document.getElementById('notifBtn').onclick = ()=>{ document.getElementById('notifPanel').classList.add('active'); document.getElementById('backdrop').classList.add('active'); Notifs.markAllRead(); document.body.style.overflow='hidden'; };
  document.getElementById('notifClose').onclick = ()=>{ document.getElementById('notifPanel').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; };

  document.getElementById('backdrop').onclick = ()=> App.closeAllDrawers();

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ App.closeAllDrawers(); Modal.close(); if(Chatbot.open) Chatbot.close(); }
    if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); document.getElementById('globalSearch')?.focus(); }
  });

  /* Login/logout */
  document.getElementById('loginBtn').onclick = ()=>{ closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; App._pendingReg=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLoginBtn').onclick = ()=>{ closePM(); App._authRedirect='home'; App._authTab='login'; App._otpStep=null; App._pendingReg=null; OTP.reset(); App.go('auth'); };
  document.getElementById('pmLogoutBtn').onclick = ()=>{ closePM(); Auth.logout(); };

  /* Avatar */
  const av = document.getElementById('userAvatarBtn'); const dd = document.getElementById('userDropdown');
  av.onclick = e => { e.stopPropagation(); dd.classList.toggle('active'); };
  document.addEventListener('click', ()=> dd.classList.remove('active'));

  /* Theme/Lang */
  document.getElementById('themeBtn').onclick = ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  document.getElementById('langBtn').onclick = ()=> applyLang(LANG==='bn'?'en':'bn');
  document.querySelectorAll('[data-set-theme]').forEach(b => b.onclick = ()=> applyTheme(b.dataset.setTheme));
  document.querySelectorAll('[data-set-lang]').forEach(b => b.onclick = ()=> applyLang(b.dataset.setLang));

  /* ═══ ADVANCED SEARCH ENGINE ═══ */
  const gs = document.getElementById('globalSearch');
  const suggest = document.getElementById('searchSuggest');
  const sc = document.getElementById('searchClear');

  function renderSuggest(query){
    if(!query.trim()){ suggest.classList.remove('active'); return; }
    const results = SearchEngine.search(query, { limit: 8 });
    if(!results.length){
      suggest.innerHTML = `<div class="suggest-empty"><i class="fa-solid fa-magnifying-glass"></i>${t('noSuggestions')}</div>`;
    } else {
      suggest.innerHTML = `<div class="suggest-section-label">${t('suggestions')} (${results.length})</div>
        ${results.map(r => {
          const p = r.product;
          const matched = r.score >= 60;
          return `<div class="suggest-item" onclick="App.go('product','${p.id}');SearchHide()">
            <img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'">
            <div class="suggest-info">
              <h5>${escapeHtml(LANG==='bn'?p.name:(p.nameEn||p.name))}${matched?`<span class="suggest-match">TOP</span>`:''}</h5>
              <p>${escapeHtml(LANG==='bn'?p.cat:(p.catEn||p.cat))}</p>
            </div>
            <div class="suggest-price">${money(p.price)}</div>
          </div>`;
        }).join('')}
        <div class="suggest-item" style="border-top:1px solid var(--border);margin-top:6px;padding-top:12px" onclick="App._shopQ='${escapeHtml(query)}';App.go('shop');SearchHide()">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--brand-50);display:flex;align-items:center;justify-content:center;color:var(--brand)"><i class="fa-solid fa-arrow-right"></i></div>
          <div class="suggest-info"><h5>${t('searchResults')}: "${escapeHtml(query)}"</h5><p>${results.length} items</p></div>
        </div>`;
    }
    suggest.classList.add('active');
  }

  window.SearchHide = ()=> suggest.classList.remove('active');

  if(gs){
    gs.oninput = e => {
      const q = e.target.value;
      App._shopQ = q;
      if(sc) sc.style.display = q ? 'flex' : 'none';
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(()=> renderSuggest(q), 150);
    };
    gs.onfocus = ()=>{ if(gs.value.trim()) renderSuggest(gs.value); };
    gs.onblur = ()=>{ setTimeout(()=>{ suggest.classList.remove('active'); }, 250); };
  }
  if(sc) sc.onclick = ()=>{ gs.value=''; App._shopQ=''; sc.style.display='none'; suggest.classList.remove('active'); App.render(); gs.focus(); };

  /* Voice search (desktop) */
  const voiceBtn = document.getElementById('voiceSearchBtn');
  if(voiceBtn){
    voiceBtn.onclick = ()=>{
      voiceBtn.classList.add('listening');
      const started = VoiceSearch.init((text)=>{
        gs.value = text; App._shopQ = text;
        renderSuggest(text);
        voiceBtn.classList.remove('listening');
      });
      if(!started){
        voiceBtn.classList.remove('listening');
        Toast.show(LANG==='bn'?'ভয়েস সার্চ সাপোর্ট নেই':'Voice search not supported','warning');
      }
      setTimeout(()=> voiceBtn.classList.remove('listening'), 5000);
    };
  }

  /* Image search (desktop) */
  const imgBtn = document.getElementById('imageSearchBtn');
  const imgInput = document.getElementById('imageSearchInput');
  if(imgBtn && imgInput){
    imgBtn.onclick = ()=> imgInput.click();
    imgInput.onchange = async ()=>{
      const f = imgInput.files[0]; if(!f) return;
      Toast.show(t('searching'),'info');
      const results = await SearchEngine.imageSearch(f);
      if(results.length){
        App._shopQ = ''; App._shopCat='all';
        App.go('shop');
        setTimeout(()=> Toast.show(`${results.length} ${LANG==='bn'?'পণ্য পাওয়া গেছে':'products found'}`,'success'), 200);
      } else {
        Toast.show(t('searchNoResults'),'warning');
      }
      imgInput.value = '';
    };
  }

  /* Mobile search modal */
  const msm = document.getElementById('mobileSearchModal');
  const msmInput = document.getElementById('mobileSearchInput');
  const msmResults = document.getElementById('msmResults');

  function openMobileSearch(){
    msm.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(()=> msmInput?.focus(), 300);
  }
  function closeMobileSearch(){
    msm.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('msmBack').onclick = closeMobileSearch;

  function renderMobileResults(query){
    if(!query.trim()){ msmResults.innerHTML = ''; return; }
    const results = SearchEngine.search(query, { limit: 20 });
    if(!results.length){
      msmResults.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('searchNoResults')}</h3></div>`;
      return;
    }
    msmResults.innerHTML = `<div class="suggest-section-label">${t('searchResults')} (${results.length})</div>
      ${results.map(r => {
        const p = r.product;
        return `<div class="suggest-item" onclick="App.go('product','${p.id}');document.getElementById('mobileSearchModal').classList.remove('active');document.body.style.overflow='';">
          <img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'">
          <div class="suggest-info">
            <h5>${escapeHtml(LANG==='bn'?p.name:(p.nameEn||p.name))}</h5>
            <p>${escapeHtml(LANG==='bn'?p.cat:(p.catEn||p.cat))}</p>
          </div>
          <div class="suggest-price">${money(p.price)}</div>
        </div>`;
      }).join('')}`;
  }

  if(msmInput){
    msmInput.oninput = e => { clearTimeout(window._msmTimer); window._msmTimer = setTimeout(()=> renderMobileResults(e.target.value), 150); };
  }

  /* Mobile voice */
  const msmVoice = document.getElementById('msmVoiceSearch');
  if(msmVoice){
    msmVoice.onclick = ()=>{
      msmVoice.classList.add('listening');
      const started = VoiceSearch.init((text)=>{
        msmInput.value = text;
        renderMobileResults(text);
        msmVoice.classList.remove('listening');
      });
      if(!started){
        msmVoice.classList.remove('listening');
        Toast.show(LANG==='bn'?'ভয়েস সার্চ সাপোর্ট নেই':'Voice search not supported','warning');
      }
      setTimeout(()=> msmVoice.classList.remove('listening'), 5000);
    };
  }

  /* Mobile image */
  const msmImg = document.getElementById('msmImageSearch');
  const msmImgInput = document.getElementById('msmImageInput');
  if(msmImg && msmImgInput){
    msmImg.onclick = ()=> msmImgInput.click();
    msmImgInput.onchange = async ()=>{
      const f = msmImgInput.files[0]; if(!f) return;
      Toast.show(t('searching'),'info');
      const results = await SearchEngine.imageSearch(f);
      if(results.length){
        msmResults.innerHTML = `<div class="suggest-section-label">${t('searchResults')} (${results.length})</div>
          ${results.map(r => { const p = r.product; return `<div class="suggest-item" onclick="App.go('product','${p.id}');closeMobileSearch()"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"><div class="suggest-info"><h5>${escapeHtml(p.name)}</h5><p>${escapeHtml(p.cat)}</p></div><div class="suggest-price">${money(p.price)}</div></div>`; }).join('')}`;
      } else {
        msmResults.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('searchNoResults')}</h3></div>`;
      }
      msmImgInput.value = '';
    };
  }

  /* Swipe to close side menu */
  let touchStartX = 0;
  const pm = document.getElementById('powerMenu');
  pm.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive:true });
  pm.addEventListener('touchend', e => { if(e.changedTouches[0].clientX - touchStartX < -80) closePM(); });

  App.render();
  console.log('✅ App ready v13.0');
});
