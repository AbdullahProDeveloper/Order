/* ═══════════════════════════════════════════════════════════════════════
   EcoShop Pro MAX v14.0 — Ultra Professional Fast Edition
   ═══════════════════════════════════════════════════════════════════════ */

/* Firebase Config */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAtxk-3sNl3RSIEcMrZVk4uZeJCOuVLQMk",
  authDomain: "my-fast-projets.firebaseapp.com",
  databaseURL: "https://my-fast-projets-default-rtdb.firebaseio.com",
  projectId: "my-fast-projets",
  storageBucket: "my-fast-projets.firebasestorage.app",
  messagingSenderId: "316176074899",
  appId: "1:316176074899:web:7a7f6c7961778844c02566"
};
const IMGBB_KEY = "811434d9b77765dbedbb9662b98a0f74";
const IMGBB_URL = "https://api.imgbb.com/1/upload";
const EMAILJS = { publicKey:'zuPQJsWL-br59MV3t', serviceId:'service_Abdullah_200', templateId:'template_edu2aen', ready:false };

let db = null, fbReady = false;

try {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.database();
  fbReady = true;
} catch(e){ console.error('Firebase init failed:', e); }

/* Default Settings */
const DEFAULT_SETTINGS = {
  siteName:'EcoShop Pro MAX', shippingInsideDhaka:100, shippingOutsideDhaka:120,
  supportPhone:'+880 1700-000000', supportEmail:'support@ecoshop.pro',
  bkashNumber:'01700000000', nagadNumber:'01700000000', rocketNumber:'01700000000',
  whatsappNumber:'8801700000000',
  enableCOD:true, enableBkash:true, enableNagad:true, enableRocket:true
};

/* ═══ i18n ═══ */
const I18N = {
  bn: {
    home:'হোম',shop:'শপ',orders:'অর্ডার',profile:'প্রোফাইল',admin:'অ্যাডমিন',dashboard:'ড্যাশবোর্ড',
    myOrders:'আমার অর্ডার',wishlist:'উইশলিস্ট',cart:'কার্ট',login:'লগইন',logout:'লগআউট',register:'রেজিস্টার',
    adminPanel:'অ্যাডমিন প্যানেল',notifications:'নোটিফিকেশন',settings:'সেটিংস',theme:'থিম',language:'ভাষা',
    light:'লাইট',dark:'ডার্ক',searchPlaceholder:'পণ্য খুঁজুন...',
    subtotal:'সাবটোটাল',shipping:'ডেলিভারি',discount:'ডিসকাউন্ট',total:'সর্বমোট',checkout:'চেকআউট',
    addToCart:'কার্টে যোগ করুন',outOfStock:'স্টক নেই',inStock:'স্টকে আছে',
    empty:'কোনো পণ্য নেই',allProducts:'সকল পণ্য',featured:'ফিচার্ড পণ্য',newArrivals:'নতুন পণ্য',
    price:'দাম',stock:'স্টক',category:'ক্যাটাগরি',save:'সেভ',cancel:'বাতিল',delete:'ডিলিট',edit:'এডিট',
    yes:'হ্যাঁ',no:'না',close:'বন্ধ',confirmDelete:'আপনি কি নিশ্চিত?',
    pending:'পেন্ডিং',confirmed:'কনফার্মড',processing:'প্রসেসিং',shipped:'শিপড',
    out_for_delivery:'ডেলিভারির পথে',delivered:'ডেলিভারড',cancelled:'বাতিল',rejected:'প্রত্যাখ্যাত',
    loginRequired:'অনুগ্রহ করে লগইন করুন',adminOnly:'শুধুমাত্র অ্যাডমিন',
    fullName:'পূর্ণ নাম',email:'ইমেইল',password:'পাসওয়ার্ড',confirmPassword:'পাসওয়ার্ড নিশ্চিত',
    phone:'ফোন নম্বর',address:'ঠিকানা',city:'শহর',
    agreeTerms:'আমি শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত',
    editProfile:'প্রোফাইল এডিট',newPassword:'নতুন পাসওয়ার্ড',
    orderId:'অর্ডার ID',orderDate:'তারিখ',orderStatus:'স্ট্যাটাস',productName:'পণ্যের নাম',
    description:'বিবরণ',images:'ছবি',oldPrice:'পুরাতন দাম',discountPercent:'ডিসকাউন্ট (%)',
    featured_product:'ফিচার্ড পণ্য',reviews:'রিভিউ',relatedProducts:'সম্পর্কিত পণ্য',
    defaultSort:'ডিফল্ট',priceLowHigh:'কম থেকে বেশি',priceHighLow:'বেশি থেকে কম',newest:'নতুন আগে',popular:'জনপ্রিয়',
    profileUpdated:'প্রোফাইল আপডেট হয়েছে',loginSuccess:'লগইন সফল',registerSuccess:'রেজিস্ট্রেশন সফল',
    logoutSuccess:'লগআউট সফল',saveSuccess:'সেভ হয়েছে',deleteSuccess:'ডিলিট হয়েছে',
    invalidCredentials:'ভুল ইমেইল বা পাসওয়ার্ড',accountBlocked:'অ্যাকাউন্ট ব্লক করা হয়েছে',
    emailExists:'এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন করা হয়েছে',
    passwordMismatch:'পাসওয়ার্ড মিলছে না',weakPassword:'কমপক্ষে ৬ অক্ষর',
    fillAllFields:'সব তথ্য পূরণ করুন',emptyCart:'কার্ট খালি',items:'আইটেম',
    processing:'প্রসেসিং...',loadingData:'ডেটা লোড হচ্ছে...',
    totalProducts:'মোট পণ্য',totalOrders:'মোট অর্ডার',totalUsers:'মোট ইউজার',totalSales:'মোট বিক্রয়',
    pendingOrders:'পেন্ডিং অর্ডার',lowStock:'কম স্টক',activeUsers:'সক্রিয় ইউজার',
    recentOrders:'সাম্প্রতিক অর্ডার',products:'পণ্য',users:'ইউজার',ordersTab:'অর্ডার',
    coupons:'কুপন',categories:'ক্যাটাগরি',addProduct:'নতুন পণ্য',editProduct:'পণ্য এডিট',
    productSearch:'পণ্য সার্চ...',userSearch:'নাম / ইমেইল...',orderSearch:'অর্ডার সার্চ...',
    role:'রোল',customer:'কাস্টমার',adminRole:'অ্যাডমিন',blocked:'ব্লকড',active:'সক্রিয়',
    block:'ব্লক',unblock:'আনব্লক',selected:'নির্বাচিত',categoryName:'ক্যাটাগরি নাম',addCategory:'যোগ',
    couponCode:'কুপন কোড',percentOff:'শতাংশ (%)',flatOff:'ফ্ল্যাট (৳)',addCoupon:'যোগ',
    siteName:'সাইটের নাম',supportPhone:'সাপোর্ট ফোন',noData:'ডেটা নেই',
    installApp:'অ্যাপ ইনস্টল করুন',offlineMode:'অফলাইন',pushNotif:'পুশ',enable:'চালু',pushEnabled:'পুশ চালু',
    paymentMethod:'পেমেন্ট',selectPayment:'পেমেন্ট নির্বাচন',
    cod:'ক্যাশ অন ডেলিভারি',codDesc:'হাতে পেয়ে পেমেন্ট',bkash:'বিকাশ',nagad:'নগদ',rocket:'রকেট',
    paymentNumber:'পেমেন্ট নাম্বার',copy:'কপি',numberCopied:'নাম্বার কপি',
    txnId:'ট্রানজেকশন আইডি',txnIdPlaceholder:'যেমন: 8AB1C2D3E4',
    screenshot:'স্ক্রিনশট',screenshotOptional:'(ঐচ্ছিক)',uploadScreenshot:'আপলোড',
    confirmOrder:'অর্ডার কনফার্ম',orderSuccessCOD:'অর্ডার সফল!',orderSuccessPaid:'অর্ডার সফল! ভেরিফিকেশনে',
    deliveryZone:'ডেলিভারি এলাকা',insideDhaka:'ঢাকার ভিতরে',outsideDhaka:'ঢাকার বাইরে',
    deliveryCharge:'ডেলিভারি চার্জ',adminComment:'কমেন্ট',commentPlaceholder:'কমেন্ট লিখুন...',
    paymentInfo:'পেমেন্ট তথ্য',settingsSaved:'সেভ হয়েছে',invalidTxnId:'সঠিক Txn ID দিন',
    sendOTP:'OTP পাঠান',verifyOTP:'যাচাই',resendOTP:'আবার পাঠান',verifyEmail:'ইমেইল যাচাই',
    weSentCode:'৬-ডিজিটের কোড পাঠিয়েছি',otpValidTime:'১০ মিনিট বৈধ',changeInfo:'তথ্য পরিবর্তন',
    otpSent:'✅ OTP পাঠানো হয়েছে',otpSending:'পাঠানো হচ্ছে...',otpVerifying:'যাচাই...',
    emailAvailable:'✓ ব্যবহারযোগ্য',emailTaken:'❌ আগেই রেজিস্ট্রেশন করা হয়েছে',
    invalidEmail:'সঠিক ইমেইল দিন',agreeToTerms:'শর্তাবলীতে সম্মতি দিন',
    enterFullCode:'৬-ডিজিটের কোড দিন',registrationSuccess:'🎉 রেজিস্ট্রেশন সফল!',
    otpFailed:'ইমেইল পাঠানো যায়নি',dataLoadingWait:'ডেটা লোড হচ্ছে...',
    forgotPassword:'পাসওয়ার্ড ভুলে গেছেন?',resetPassword:'পাসওয়ার্ড রিসেট',
    resetPasswordDesc:'রেজিস্টার্ড ইমেইল দিন',sendCode:'কোড পাঠান',back:'পিছনে',
    newPassword2:'নতুন পাসওয়ার্ড',updatePassword:'আপডেট',
    passwordUpdated:'✅ পাসওয়ার্ড আপডেট',passwordUpdatedDesc:'নতুন পাসওয়ার্ড দিয়ে লগইন করুন',
    loginNow:'লগইন করুন',noAccountWithEmail:'এই ইমেইলে অ্যাকাউন্ট নেই',
    verifyCodeFirst:'আগে কোড যাচাই করুন',updateFailed:'আপডেট ব্যর্থ',codeVerified:'✅ কোড যাচাই সফল',
    stepEmail:'ইমেইল',stepOtp:'OTP',stepNew:'নতুন',
    wallet:'ওয়ালেট',walletBalance:'ওয়ালেট ব্যালেন্স',addMoney:'টাকা যোগ',balance:'ব্যালেন্স',
    transactions:'লেনদেন',noTransactions:'লেনদেন নেই',amount:'পরিমাণ',
    referral:'রেফারেল',inviteFriends:'🎁 বন্ধুদের ইনভাইট করুন',
    loyalty:'লয়্যালটি পয়েন্ট',trackOrder:'অর্ডার ট্র্যাক',track:'ট্র্যাকিং',
    salesTrend:'বিক্রয় ট্রেন্ড',totalSalesLabel:'মোট বিক্রয়',ordersLabel:'অর্ডার',
    whatsappSend:'WhatsApp-এ পাঠান',whatsappDesc:'কাস্টমারকে WhatsApp-এ অর্ডার ডিটেইল পাঠান',
    downloadPDF:'PDF',invoice:'ইনভয়েস',
    botGreeting:'আসসালামু আলাইকুম! আমি EcoBot। কীভাবে সাহায্য করতে পারি?',
    botHelpMessage:'আমি সাহায্য করতে পারি: পণ্য খোঁজা, অর্ডার ট্র্যাক, দাম জিজ্ঞাসা, যোগাযোগ',
    botContact:'যোগাযোগ: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'অর্ডার পাওয়া যায়নি',botOrderStatus:'আপনার অর্ডার স্ট্যাটাস:',
    botThanks:'ধন্যবাদ! আর কোনো সাহায্য লাগলে বলুন।',botFoundProducts:'এই পণ্যগুলো পেয়েছি:',
    botSearchingProducts:'পণ্য খুঁজছি...',botOrderTracking:'অর্ডার আইডি লিখুন (ORD-...)',
    orderDetails:'অর্ডার বিস্তারিত',changeStatus:'স্ট্যাটাস পরিবর্তন',
    courier:'কুরিয়ার',trackingNumber:'ট্র্যাকিং নাম্বার',eta:'সম্ভাব্য ডেলিভারি',
    internalNotes:'ইন্টারনাল নোট (শুধু অ্যাডমিন)',writeNote:'নোট লিখুন...',addNote:'নোট যোগ',
    orderHistory:'অর্ডার হিস্ট্রি',orderItems:'পণ্যসমূহ',
    customerInfo:'কাস্টমার তথ্য',paymentDetails:'পেমেন্ট তথ্য',
    amounts:'অ্যামাউন্ট',recalculate:'রিক্যালকুলেট',
    bulkSelected:'নির্বাচিত',bulkConfirm:'কনফার্ম',bulkCancel:'বাতিল',bulkPrint:'বাল্ক প্রিন্ট',
    filterStatus:'স্ট্যাটাস',filterPayment:'পেমেন্ট',filterFrom:'শুরুর তারিখ',filterTo:'শেষ তারিখ',
    filterSearch:'সার্চ',filterReset:'রিসেট',
    cancelOrder:'অর্ডার বাতিল',cancelReason:'বাতিলের কারণ',writeReason:'কারণ লিখুন...',
    confirmCancelAction:'বাতিল করুন',reorder:'আবার অর্ডার',activeOrders:'চলমান',allOrders:'সব অর্ডার',
    orderReceived:'অর্ডার গ্রহণ করা হয়েছে, অ্যাডমিন কনফার্মেশনের অপেক্ষায়',
    confirmedByAdmin:'অ্যাডমিন অর্ডার কনফার্ম করেছেন',processingStarted:'প্যাকিং শুরু হয়েছে',
    shippedByCourier:'কুরিয়ারে পাঠানো হয়েছে',outForDelivery:'ডেলিভারির পথে',
    deliveredSuccess:'সফলভাবে ডেলিভার করা হয়েছে',cancelledByAdmin:'অ্যাডমিন অর্ডার বাতিল করেছেন',
    rejectedByAdmin:'অ্যাডমিন অর্ডার প্রত্যাখ্যান করেছেন',noReasonGiven:'কারণ উল্লেখ করা হয়নি',
    updatedByAdmin:'অ্যাডমিন আপডেট করেছেন',
    changePassword:'পাসওয়ার্ড পরিবর্তন',currentPassword:'বর্তমান পাসওয়ার্ড',
    changePasswordDesc:'নিরাপত্তার জন্য আগে বর্তমান পাসওয়ার্ড দিন',
    personalInfo:'ব্যক্তিগত তথ্য',personalInfoDesc:'আপনার নাম, ফোন ও ঠিকানা আপডেট করুন',
    wrongCurrentPassword:'বর্তমান পাসওয়ার্ড ভুল',passwordChanged:'✅ পাসওয়ার্ড পরিবর্তন হয়েছে',
    passwordChangedDesc:'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।',
    saveInfo:'তথ্য সেভ করুন',orderCount:'অর্ডার',joinedOn:'যোগদান',verifiedCustomer:'ভেরিফায়েড',
    imgUploadSuccess:'✅ ছবি আপলোড হয়েছে',imgUploadFailed:'আপলোড ব্যর্থ',
    ordersPending:'পেন্ডিং অর্ডার',totalSpent:'মোট খরচ',reviewCart:'কার্ট রিভিউ',
    deliveryDetails:'ডেলিভারি তথ্য',paymentMethodStep:'পেমেন্ট পদ্ধতি',orderSummary:'অর্ডার সারাংশ',
    placeOrder:'অর্ডার নিশ্চিত করুন',searchResults:'সার্চ ফলাফল',suggestions:'পরামর্শ',
    noSuggestions:'কোনো পরামর্শ নেই',broadcastNotif:'ব্রডকাস্ট নোটিফিকেশন',
    broadcastDesc:'সব ইউজারকে একসাথে নোটিফিকেশন পাঠান',
    broadcastTitle:'টাইটেল',broadcastBody:'মেসেজ',sendBroadcast:'সবাইকে পাঠান',
    broadcastSent:'✅ সব ইউজারকে পাঠানো হয়েছে',broadcastFailed:'পাঠানো যায়নি',
    recipients:'প্রাপক',productReviews:'পণ্যের রিভিউ',writeReview:'রিভিউ লিখুন',
    yourRating:'আপনার রেটিং',reviewText:'আপনার মতামত',submitReview:'রিভিউ জমা দিন',
    reviewSubmitted:'✅ রিভিউ জমা হয়েছে',noReviews:'এখনো কোনো রিভিউ নেই',beFirstReview:'প্রথম রিভিউ দিন',
    alreadyReviewed:'আপনি ইতিমধ্যে রিভিউ দিয়েছেন',cannotViewOthers:'অন্য কারো তথ্য দেখতে পারবেন না',
    accessDenied:'অ্যাক্সেস নেই',voiceSearch:'ভয়েস সার্চ',listening:'শুনছি...',
    imageSearch:'ছবি দিয়ে খুঁজুন',searchByImage:'ছবি আপলোড করে খুঁজুন',
    searchNoResults:'কিছু পাওয়া যায়নি',searching:'খোঁজা হচ্ছে...'
  },
  en: {
    home:'Home',shop:'Shop',orders:'Orders',profile:'Profile',admin:'Admin',dashboard:'Dashboard',
    myOrders:'My Orders',wishlist:'Wishlist',cart:'Cart',login:'Login',logout:'Logout',register:'Register',
    adminPanel:'Admin Panel',notifications:'Notifications',settings:'Settings',theme:'Theme',language:'Language',
    light:'Light',dark:'Dark',searchPlaceholder:'Search products...',
    subtotal:'Subtotal',shipping:'Shipping',discount:'Discount',total:'Total',checkout:'Checkout',
    addToCart:'Add to Cart',outOfStock:'Out of Stock',inStock:'In Stock',
    empty:'No products found',allProducts:'All Products',featured:'Featured Products',newArrivals:'New Arrivals',
    price:'Price',stock:'Stock',category:'Category',save:'Save',cancel:'Cancel',delete:'Delete',edit:'Edit',
    yes:'Yes',no:'No',close:'Close',confirmDelete:'Are you sure?',
    pending:'Pending',confirmed:'Confirmed',processing:'Processing',shipped:'Shipped',
    out_for_delivery:'Out for Delivery',delivered:'Delivered',cancelled:'Cancelled',rejected:'Rejected',
    loginRequired:'Please login first',adminOnly:'Admin only',
    fullName:'Full Name',email:'Email',password:'Password',confirmPassword:'Confirm Password',
    phone:'Phone',address:'Address',city:'City',
    agreeTerms:'I agree to the Terms & Privacy Policy',
    editProfile:'Edit Profile',newPassword:'New Password',
    orderId:'Order ID',orderDate:'Date',orderStatus:'Status',productName:'Product Name',
    description:'Description',images:'Images',oldPrice:'Old Price',discountPercent:'Discount (%)',
    featured_product:'Featured Product',reviews:'Reviews',relatedProducts:'Related Products',
    defaultSort:'Default',priceLowHigh:'Low to High',priceHighLow:'High to Low',newest:'Newest',popular:'Popular',
    profileUpdated:'Profile updated',loginSuccess:'Login successful',registerSuccess:'Registration successful',
    logoutSuccess:'Logged out',saveSuccess:'Saved',deleteSuccess:'Deleted',
    invalidCredentials:'Invalid credentials',accountBlocked:'Account blocked',
    emailExists:'This email is already registered',
    passwordMismatch:'Passwords do not match',weakPassword:'Min 6 characters',
    fillAllFields:'Please fill all fields',emptyCart:'Cart empty',items:'items',
    processing:'Processing...',loadingData:'Loading...',
    totalProducts:'Total Products',totalOrders:'Total Orders',totalUsers:'Total Users',totalSales:'Total Sales',
    pendingOrders:'Pending Orders',lowStock:'Low Stock',activeUsers:'Active Users',
    recentOrders:'Recent Orders',products:'Products',users:'Users',ordersTab:'Orders',
    coupons:'Coupons',categories:'Categories',addProduct:'Add Product',editProduct:'Edit Product',
    productSearch:'Search products...',userSearch:'Search name / email...',orderSearch:'Search orders...',
    role:'Role',customer:'Customer',adminRole:'Admin',blocked:'Blocked',active:'Active',
    block:'Block',unblock:'Unblock',selected:'selected',categoryName:'Category Name',addCategory:'Add',
    couponCode:'Coupon Code',percentOff:'Percent (%)',flatOff:'Flat (৳)',addCoupon:'Add',
    siteName:'Site Name',supportPhone:'Support Phone',noData:'No data',
    installApp:'Install App',offlineMode:'Offline',pushNotif:'Push',enable:'Enable',pushEnabled:'Push enabled',
    paymentMethod:'Payment',selectPayment:'Select payment',
    cod:'Cash on Delivery',codDesc:'Pay when you receive',bkash:'bKash',nagad:'Nagad',rocket:'Rocket',
    paymentNumber:'Payment Number',copy:'Copy',numberCopied:'Number copied',
    txnId:'Transaction ID',txnIdPlaceholder:'e.g. 8AB1C2D3E4',
    screenshot:'Screenshot',screenshotOptional:'(optional)',uploadScreenshot:'Upload',
    confirmOrder:'Confirm Order',orderSuccessCOD:'Order placed!',orderSuccessPaid:'Order placed! Verifying',
    deliveryZone:'Delivery Zone',insideDhaka:'Inside Dhaka',outsideDhaka:'Outside Dhaka',
    deliveryCharge:'Delivery Charge',adminComment:'Comment',commentPlaceholder:'Write comment...',
    paymentInfo:'Payment Info',settingsSaved:'Saved',invalidTxnId:'Enter valid Txn ID',
    sendOTP:'Send OTP',verifyOTP:'Verify',resendOTP:'Resend',verifyEmail:'Verify Email',
    weSentCode:'We sent a 6-digit code to',otpValidTime:'Valid 10 minutes',changeInfo:'Change info',
    otpSent:'✅ OTP sent',otpSending:'Sending...',otpVerifying:'Verifying...',
    emailAvailable:'✓ Available',emailTaken:'❌ Already registered',
    invalidEmail:'Enter valid email',agreeToTerms:'Agree to terms',
    enterFullCode:'Enter 6-digit code',registrationSuccess:'🎉 Registration successful!',
    otpFailed:'Failed to send email',dataLoadingWait:'Loading...',
    forgotPassword:'Forgot Password?',resetPassword:'Reset Password',
    resetPasswordDesc:'Enter your registered email',sendCode:'Send Code',back:'Back',
    newPassword2:'New Password',updatePassword:'Update',
    passwordUpdated:'✅ Password Updated',passwordUpdatedDesc:'Login with your new password',
    loginNow:'Login Now',noAccountWithEmail:'No account with this email',
    verifyCodeFirst:'Verify code first',updateFailed:'Update failed',codeVerified:'✅ Code verified',
    stepEmail:'Email',stepOtp:'OTP',stepNew:'New',
    wallet:'Wallet',walletBalance:'Wallet Balance',addMoney:'Add Money',balance:'Balance',
    transactions:'Transactions',noTransactions:'No transactions',amount:'Amount',
    referral:'Referral',inviteFriends:'🎁 Invite Friends',
    loyalty:'Loyalty Points',trackOrder:'Track Order',track:'Tracking',
    salesTrend:'Sales Trend',totalSalesLabel:'Total Sales',ordersLabel:'Orders',
    whatsappSend:'Send via WhatsApp',whatsappDesc:'Send order details via WhatsApp',
    downloadPDF:'PDF',invoice:'Invoice',
    botGreeting:'Hello! I am EcoBot. How can I help you?',
    botHelpMessage:'I can help with: find products, track orders, price inquiry, contact',
    botContact:'Contact: +880 1700-000000 | support@ecoshop.pro',
    botInvalidOrder:'Order not found',botOrderStatus:'Your order status:',
    botThanks:'Thanks! Let me know if you need more help.',botFoundProducts:'I found these products:',
    botSearchingProducts:'Searching products...',botOrderTracking:'Enter order ID (ORD-...)',
    orderDetails:'Order Details',changeStatus:'Change Status',
    courier:'Courier',trackingNumber:'Tracking Number',eta:'Expected Delivery',
    internalNotes:'Internal Notes (admin only)',writeNote:'Write note...',addNote:'Add Note',
    orderHistory:'Order History',orderItems:'Items',
    customerInfo:'Customer Info',paymentDetails:'Payment Details',
    amounts:'Amounts',recalculate:'Recalculate',
    bulkSelected:'selected',bulkConfirm:'Confirm',bulkCancel:'Cancel',bulkPrint:'Bulk Print',
    filterStatus:'Status',filterPayment:'Payment',filterFrom:'From',filterTo:'To',
    filterSearch:'Search',filterReset:'Reset',
    cancelOrder:'Cancel Order',cancelReason:'Reason for cancellation',writeReason:'Write reason...',
    confirmCancelAction:'Cancel Order',reorder:'Reorder',activeOrders:'Active',allOrders:'All Orders',
    orderReceived:'Order received, awaiting admin confirmation',
    confirmedByAdmin:'Order confirmed by admin',processingStarted:'Processing started',
    shippedByCourier:'Shipped via courier',outForDelivery:'Out for delivery',
    deliveredSuccess:'Delivered successfully',cancelledByAdmin:'Cancelled by admin',
    rejectedByAdmin:'Rejected by admin',noReasonGiven:'No reason given',
    updatedByAdmin:'Updated by admin',
    changePassword:'Change Password',currentPassword:'Current Password',
    changePasswordDesc:'Enter current password for security',
    personalInfo:'Personal Info',personalInfoDesc:'Update your name, phone and address',
    wrongCurrentPassword:'Current password is wrong',passwordChanged:'✅ Password changed',
    passwordChangedDesc:'Your password has been changed successfully.',
    saveInfo:'Save Info',orderCount:'Orders',joinedOn:'Joined',verifiedCustomer:'Verified',
    imgUploadSuccess:'✅ Image uploaded',imgUploadFailed:'Upload failed',
    ordersPending:'Pending Orders',totalSpent:'Total Spent',reviewCart:'Review Cart',
    deliveryDetails:'Delivery Details',paymentMethodStep:'Payment Method',orderSummary:'Order Summary',
    placeOrder:'Place Order',searchResults:'Search Results',suggestions:'Suggestions',
    noSuggestions:'No suggestions',broadcastNotif:'Broadcast Notification',
    broadcastDesc:'Send notification to all users at once',
    broadcastTitle:'Title',broadcastBody:'Message',sendBroadcast:'Send to All',
    broadcastSent:'✅ Sent to all users',broadcastFailed:'Failed to send',
    recipients:'Recipients',productReviews:'Product Reviews',writeReview:'Write Review',
    yourRating:'Your Rating',reviewText:'Your Review',submitReview:'Submit Review',
    reviewSubmitted:'✅ Review submitted',noReviews:'No reviews yet',beFirstReview:'Be the first',
    alreadyReviewed:'Already reviewed',cannotViewOthers:'Cannot view others\' info',
    accessDenied:'Access denied',voiceSearch:'Voice Search',listening:'Listening...',
    imageSearch:'Search by Image',searchByImage:'Upload image to search',
    searchNoResults:'No results found',searching:'Searching...'
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

/* ═══ DB Layer (FAST) ═══ */
const DB = {
  products:[], users:[], orders:[], categories:[], coupons:[], notifs:[], reviews:[],
  settings:{ ...DEFAULT_SETTINGS }, catRaw:{},
  ready:{ products:false, users:false, orders:false, categories:false, coupons:false, notifs:false, reviews:false },
  seeded:false, error:null,

  init(){
    if(!fbReady){ this.error = 'Firebase not initialized'; return; }
    this.watch('products', d => { this.products = this._arr(d); this._ready('products'); });
    this.watch('users', d => { this.users = this._arr(d); this._ready('users'); });
    this.watch('orders', d => { this.orders = this._arr(d).sort((a,b)=>(b.date||0)-(a.date||0)); this._ready('orders'); });
    this.watch('categories', d => { this.catRaw = d||{}; this.categories = Object.values(this.catRaw).filter(v=>typeof v==='string'); this._ready('categories'); });
    this.watch('coupons', d => { this.coupons = this._arr(d); this._ready('coupons'); });
    this.watch('notifications', d => { this.notifs = this._arr(d).sort((a,b)=>(b.time||0)-(a.time||0)); this._ready('notifs'); });
    this.watch('reviews', d => { this.reviews = this._arr(d).sort((a,b)=>(b.date||0)-(a.date||0)); this._ready('reviews'); });
    this.watch('settings', d => { this.settings = { ...DEFAULT_SETTINGS, ...(d||{}) }; });

    setTimeout(()=>{ if(!this.ready.products) { this.ready.products = true; App.hideSplash(); } }, 3000);
    setTimeout(()=> this.trySeed(), 2000);
  },

  watch(path, cb){
    try {
      db.ref(path).on('value',
        s => { try { cb(s.val()); } catch(e){ console.error(path, e); } },
        err => { this.error = err.message; console.error('DB error', path, err.message); }
      );
    } catch(e){ console.error(e); }
  },

  _arr(data){
    if(!data) return [];
    if(Array.isArray(data)) return data.filter(Boolean);
    return Object.entries(data).map(([k,v]) => typeof v==='object' && v!==null ? { ...v, id: v.id || k } : { id:k, value:v });
  },

  _ready(w){
    this.ready[w] = true;
    if(this.ready.products && this.ready.users && this.ready.orders){
      App.hideSplash();
      if(!App._firstRender){ App._firstRender = true; App.render(); }
      else App.rerenderIfVisible();
    }
  },

  async trySeed(){
    if(this.seeded || !this.ready.products || this.products.length > 0) return;
    this.seeded = true;
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
        this.ready.users ? null : db.ref('users').set(users),
        db.ref('categories').set(cats),
        db.ref('coupons').set(coupons),
        db.ref('notifications').set(notifs),
        db.ref('settings').set(DEFAULT_SETTINGS)
      ]);
    } catch(e){ console.error('Seed failed:', e); }
  },

  saveProduct(p){ const id = p.id || 'p_'+Date.now(); p.id = id; p.updatedAt = Date.now(); if(!p.createdAt) p.createdAt = Date.now(); return db.ref('products/'+id).set(p); },
  deleteProduct(id){ return db.ref('products/'+id).remove(); },
  saveUser(u){ const id = u.id || 'u_'+Date.now(); u.id = id; if(!u.joined) u.joined = Date.now(); return db.ref('users/'+id).set(u); },
  deleteUser(id){ return db.ref('users/'+id).remove(); },
  updateUser(id, patch){ return db.ref('users/'+id).update(patch); },
  saveOrder(o){ const id = o.id || 'ORD-'+Date.now().toString().slice(-8); o.id = id; return db.ref('orders/'+id).set(o).then(()=>o); },
  updateOrder(id, patch){ return db.ref('orders/'+id).update(patch); },
  deleteOrder(id){ return db.ref('orders/'+id).remove(); },
  saveCategory(name){ return db.ref('categories/c_'+Date.now()).set(name); },
  deleteCategory(key){ return db.ref('categories/'+key).remove(); },
  saveCoupon(c){ const id = c.id || 'cp_'+Date.now(); c.id = id; return db.ref('coupons/'+id).set(c); },
  deleteCoupon(id){ return db.ref('coupons/'+id).remove(); },
  pushNotif(n){ const id = 'n_'+Date.now(); n.id = id; n.time = Date.now(); n.read = false; return db.ref('notifications/'+id).set(n); },
  broadcastNotif(title, body){ const id = 'n_bc_'+Date.now(); return db.ref('notifications/'+id).set({ id, title, body, time:Date.now(), read:false, type:'broadcast', broadcast:true }); },
  saveReview(r){ const id = 'r_'+Date.now(); r.id = id; r.date = Date.now(); return db.ref('reviews/'+id).set(r); },
  removeReview(id){ return db.ref('reviews/'+id).remove(); },

  isReady(){ return this.ready.products; },
  updateStock(pid, n){ return db.ref('products/'+pid+'/stock').set(n); },
  getReviews(pid){ return this.reviews.filter(r => r.productId === pid); },
  async addReviewRating(pid, rating){
    const p = this.products.find(x => x.id === pid); if(!p) return;
    const cnt = (p.reviewCount||0) + 1;
    const oldT = (p.rating||0) * (p.reviewCount||0);
    const newR = (oldT + rating) / cnt;
    return db.ref('products/'+pid).update({ rating: parseFloat(newR.toFixed(2)), reviewCount: cnt });
  },
  saveSettings(s){ return db.ref('settings').set(s); }
};

/* ═══ Image Upload ═══ */
const ImageUpload = {
  async upload(file){
    if(!file) throw new Error('No file');
    if(file.size > 5*1024*1024) throw new Error('Max 5MB');
    if(!file.type.startsWith('image/')) throw new Error('Images only');
    const form = new FormData();
    form.append('key', IMGBB_KEY);
    form.append('image', file);
    const res = await fetch(IMGBB_URL, { method:'POST', body: form });
    const json = await res.json();
    if(!json.success) throw new Error(json.error?.message || 'Upload failed');
    return { url: json.data.url };
  }
};

/* ═══ EmailJS OTP ═══ */
const OTP = {
  code:null, email:null, expires:0, attempts:0, verified:false, timer:null,
  init(){ if(typeof emailjs === 'undefined') return false; if(!EMAILJS.ready){ try { emailjs.init({ publicKey:EMAILJS.publicKey }); EMAILJS.ready = true; return true; } catch(e){ return false; } } return true; },
  gen(){ return String(Math.floor(100000 + Math.random() * 900000)); },
  async send(email, name){
    if(!this.init()) return { ok:false, msg:'EmailJS not loaded' };
    const code = this.gen();
    this.email = Auth.norm(email); this.code = code;
    this.expires = Date.now() + 10*60*1000; this.attempts = 0; this.verified = false;
    try {
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        to_email:this.email, email:this.email, reply_to:this.email,
        otp_code:code, code:code, user_name:name||'User', site_name:'EcoShop Pro MAX'
      });
      return { ok:true };
    } catch(e){ return { ok:false, msg: e?.text || e?.message || 'Failed' }; }
  },
  async verify(input){
    if(!this.code) return { ok:false, msg:'Send code first' };
    if(Date.now() > this.expires) return { ok:false, msg:'Code expired' };
    if(this.attempts >= 5) return { ok:false, msg:'Too many attempts' };
    if(String(input).trim() !== this.code){ this.attempts++; return { ok:false, msg:`Wrong (${5-this.attempts} left)` }; }
    this.verified = true; return { ok:true };
  },
  reset(){ this.code=null; this.email=null; this.expires=0; this.attempts=0; this.verified=false; if(this.timer){ clearInterval(this.timer); this.timer=null; } },
  cooldown(sec, cb){ if(this.timer) clearInterval(this.timer); this.timer = setInterval(()=>{ sec--; if(cb) cb(sec); if(sec <= 0){ clearInterval(this.timer); this.timer = null; } }, 1000); },
  mask(email){ if(!email) return ''; const [u,d] = email.split('@'); if(!d) return email; return `${u.slice(0, Math.min(3, u.length))}${'*'.repeat(Math.max(2, u.length-3))}@${d}`; }
};

/* ═══ Auth ═══ */
const Auth = {
  user(){ return Session.get(); },
  isAdmin(){ const u = this.user(); return u && u.role === 'admin'; },
  norm(email){ return email ? String(email).trim().toLowerCase() : ''; },
  emailStatus(email){
    const target = this.norm(email);
    if(!target) return 'free';
    if(!DB.ready.users) return 'unknown';
    return DB.users.some(u => this.norm(u.email) === target) ? 'taken' : 'free';
  },
  isTaken(email){ return this.emailStatus(email) === 'taken'; },
  async login(email, password){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.norm(email);
    const u = DB.users.find(x => this.norm(x.email) === target && x.password === password);
    if(!u) return { ok:false, msg:t('invalidCredentials') };
    if(u.blocked) return { ok:false, msg:t('accountBlocked') };
    Session.set(u);
    return { ok:true, user:u };
  },
  async register(data){
    if(!DB.ready.users) return { ok:false, msg:t('loadingData') };
    const target = this.norm(data.email);
    if(this.isTaken(target)) return { ok:false, msg:t('emailExists') };
    const u = {
      id:'u_'+Date.now()+'_'+Math.floor(Math.random()*1000),
      name:data.name, email:target, password:data.password,
      phone:data.phone||'', address:data.address||'',
      role:'customer', blocked:false, joined:Date.now(), emailVerified:true,
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
    };
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
    const items = this.items();
    const f = items.find(i => i.id === id);
    const p = DB.products.find(x => x.id === id); if(!p) return;
    if(p.stock < qty) return Toast.show(t('outOfStock'),'error');
    if(f){ if(f.qty + qty > p.stock) return Toast.show(t('outOfStock'),'error'); f.qty += qty; }
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
  count(){ return this.items().reduce((s,i) => s + i.qty, 0); },
  subtotal(){ return this.items().reduce((s,i) => { const p = DB.products.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
  shipping(zone){ if(this.count() <= 0) return 0; return (zone === 'outside') ? (DB.settings.shippingOutsideDhaka||120) : (DB.settings.shippingInsideDhaka||100); },
  refresh(){
    const c = this.count();
    const setT = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    const b = document.getElementById('cartBadge'); if(b) b.textContent = c > 0 ? c : '';
    const mc = document.getElementById('pmCartCount'); if(mc) mc.textContent = c;
    setT('cartCount', `${c} ${t('items')}`);
    setT('cartSubtotal', money(this.subtotal()));
    setT('cartShipping', money(this.shipping('inside')));
    setT('cartTotal', money(this.subtotal() + this.shipping('inside')));
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
      return `<div class="cart-item"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/70'"><div class="cart-item-info"><h5>${LANG==='bn'?p.name:(p.nameEn||p.name)}</h5><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="price" style="font-size:13.5px">${money(p.price)}</span><button class="icon-btn-sm danger" onclick="Cart.remove('${p.id}')"><i class="fa-solid fa-trash"></i></button></div><div class="qty-ctrl"><button onclick="Cart.setQty('${p.id}', ${i.qty-1})">−</button><span>${i.qty}</span><button onclick="Cart.setQty('${p.id}', ${i.qty+1})">+</button></div></div></div>`;
    }).join('');
  }
};

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

/* ═══ Orders ═══ */
const Orders = {
  FLOW:['pending','confirmed','processing','shipped','out_for_delivery','delivered'],
  ALL:['pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','rejected'],
  all(){ return DB.orders; },
  mine(){ const u = Auth.user(); if(!u) return []; return DB.orders.filter(o => o.userId === u.id); },
  async create(data){
    const u = Auth.user();
    const order = {
      id:'ORD-'+Date.now().toString().slice(-8),
      userId:u?u.id:0, customer:data.customer, items:data.items,
      subtotal:data.subtotal, deliveryCharge:data.deliveryCharge, deliveryZone:data.deliveryZone,
      discount:data.discount||0, total:data.total, coupon:data.coupon||null,
      paymentMethod:data.paymentMethod, paymentNumber:data.paymentNumber||null,
      txnId:data.txnId||null, screenshot:data.screenshot||null,
      status:'pending', paymentStatus:data.paymentMethod==='cod'?'cod_pending':'awaiting_verification',
      courier:null, trackingNumber:null, eta:null, internalNotes:[],
      date:Date.now(),
      history:[{ status:'pending', time:Date.now(), comment:t('orderReceived'), by:'Customer' }]
    };
    const saved = await DB.saveOrder(order);
    data.items.forEach(async i => {
      const p = DB.products.find(x => x.id === i.id);
      if(p) try { await DB.updateStock(p.id, Math.max(0, p.stock - i.qty)); } catch(e){}
    });
    try { await DB.pushNotif({ title:LANG==='bn'?'🛒 নতুন অর্ডার!':'🛒 New Order!', body:`${data.customer.name} — ${money(data.total)}`, type:'order' }); } catch(e){}
    Cart.save([]);
    return saved;
  },
  async updateStatus(id, status, comment, extra){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const history = (o.history||[]).concat([{ status, time:Date.now(), comment:comment||'', by:(Auth.user()&&Auth.user().name)||'System' }]);
    const patch = { status, history };
    if(extra) Object.assign(patch, extra);
    return DB.updateOrder(id, patch);
  },
  update(id, patch){ return DB.updateOrder(id, patch); },
  async addNote(id, note){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const notes = (o.internalNotes||[]).concat([{ text:note, time:Date.now(), by:(Auth.user()&&Auth.user().name)||'Admin' }]);
    return DB.updateOrder(id, { internalNotes:notes });
  },
  cancel(id, reason){ return this.updateStatus(id, 'cancelled', reason||t('cancelledByAdmin')); },
  async reject(id, reason){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    (o.items||[]).forEach(async item => {
      const p = DB.products.find(x => x.id === item.id);
      if(p) try { await DB.updateStock(p.id, p.stock + item.qty); } catch(e){}
    });
    return this.updateStatus(id, 'rejected', reason||t('rejectedByAdmin'), { paymentStatus:'rejected' });
  },
  remove(id){ return DB.deleteOrder(id); },
  counts(){ const c = { pending:0, confirmed:0, processing:0, shipped:0, out_for_delivery:0, delivered:0, cancelled:0, rejected:0 }; DB.orders.forEach(o => { c[o.status] = (c[o.status]||0)+1; }); return c; },
  label(s){ return t(s) || s; },
  icon(s){
    const m = { pending:'fa-clock', confirmed:'fa-check-circle', processing:'fa-gears', shipped:'fa-truck', out_for_delivery:'fa-motorcycle', delivered:'fa-circle-check', cancelled:'fa-xmark-circle', rejected:'fa-ban' };
    return m[s] || 'fa-circle';
  },
  detail(orderId){
    const o = DB.orders.find(x => x.id === orderId); if(!o) return;
    const u = Auth.user();
    if(!Auth.isAdmin() && (!u || o.userId !== u.id)) return Toast.show(t('cannotViewOthers'),'error');
    const isBn = LANG==='bn';
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div><div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap"><span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.icon(o.status)}"></i> ${Orders.label(o.status)}</span><span class="order-amount">${money(o.total)}</span></div>
      <div class="order-detail-grid">
        <div class="order-detail-section"><h5><i class="fa-solid fa-user"></i> ${t('customerInfo')}</h5><div class="detail-row"><span>${isBn?'নাম':'Name'}</span><span>${o.customer.name}</span></div><div class="detail-row"><span>${isBn?'ফোন':'Phone'}</span><span>${o.customer.phone}</span></div><div class="detail-row"><span>${isBn?'ঠিকানা':'Address'}</span><span>${o.customer.address}</span></div></div>
        <div class="order-detail-section"><h5><i class="fa-solid fa-credit-card"></i> ${t('paymentDetails')}</h5><div class="detail-row"><span>Method</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>${o.txnId?`<div class="detail-row"><span>Txn ID</span><span>${o.txnId}</span></div>`:''}</div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-box"></i> ${t('orderItems')}</h5><div>${(o.items||[]).map(it => { const p = DB.products.find(x => x.id === it.id); return `<div class="order-item-row"><img src="${p?p.img:''}" onerror="this.src='https://via.placeholder.com/48'"><div class="order-item-info"><h6>${it.name}</h6><p>${it.qty} × ${money(it.price)}</p></div><span class="order-item-price">${money(it.qty*it.price)}</span></div>`; }).join('')}</div>
        <div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"><div class="detail-row"><span>${t('subtotal')}</span><span>${money(o.subtotal||0)}</span></div><div class="detail-row"><span>${t('deliveryCharge')}</span><span>${money(o.deliveryCharge||0)}</span></div>${o.discount?`<div class="detail-row"><span>${t('discount')}</span><span>-${money(o.discount)}</span></div>`:''}<div class="detail-row" style="border-top:2px solid var(--border);margin-top:6px;padding-top:10px"><span><b>${t('total')}</b></span><span style="color:var(--brand);font-size:16px;font-weight:800">${money(o.total)}</span></div></div></div>
        <div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5><ul class="order-history">${(o.history||[]).slice().reverse().map((h,i) => `<li class="${i===0?'current':''}"><span class="h-dot"></span><h6>${Orders.label(h.status)}</h6><small>${new Date(h.time).toLocaleString(isBn?'bn-BD':'en-US')}${h.by?' • '+h.by:''}</small>${h.comment?`<div class="h-comment">${h.comment}</div>`:''}</li>`).join('')}</ul></div>
      </div>
    </div><div class="modal-foot"><button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i> PDF</button><button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`,'lg');
  },
  reorder(orderId){
    const o = DB.orders.find(x => x.id === orderId); if(!o) return;
    let added = 0;
    (o.items||[]).forEach(it => { const p = DB.products.find(x => x.id === it.id); if(p && p.stock > 0){ Cart.add(p.id, Math.min(it.qty, p.stock)); added++; } });
    if(added){ Toast.show(LANG==='bn'?`${added}টি পণ্য কার্টে যোগ হয়েছে`:`${added} items added`,'success'); App.openCart(); }
    else Toast.show(t('outOfStock'),'error');
  }
};

/* ═══ Notifs ═══ */
const Notifs = {
  all(){ return DB.notifs; },
  unread(){ return this.all().filter(n => !n.read).length; },
  markAllRead(){ this.all().forEach(n => { if(!n.read) db.ref('notifications/'+n.id+'/read').set(true).catch(()=>{}); }); },
  refresh(){
    const b = document.getElementById('notifBadge'); if(b) b.textContent = this.unread() || '';
    const c = document.getElementById('notifCount'); if(c) c.textContent = `${this.unread()}`;
    const list = document.getElementById('notifList'); if(!list) return;
    const arr = this.all();
    list.innerHTML = arr.length ? arr.map(n => `<div class="notif-item ${n.read?'':'unread'}"><div class="notif-icon"><i class="fa-solid ${n.type==='broadcast'?'fa-bullhorn':'fa-bell'}"></i></div><div><h5>${n.title}</h5><p>${n.body}</p><small>${timeAgo(n.time)}</small></div></div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-bell-slash"></i><h3>${LANG==='bn'?'নোটিফিকেশন নেই':'No notifications'}</h3></div>`;
  }
};

/* ═══ Search Engine ═══ */
const Search = {
  lev(a, b){
    if(a.length === 0) return b.length;
    if(b.length === 0) return a.length;
    const m = [];
    for(let i=0;i<=b.length;i++) m[i] = [i];
    for(let j=0;j<=a.length;j++) m[0][j] = j;
    for(let i=1;i<=b.length;i++){
      for(let j=1;j<=a.length;j++){
        if(b.charAt(i-1) === a.charAt(j-1)) m[i][j] = m[i-1][j-1];
        else m[i][j] = Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
      }
    }
    return m[b.length][a.length];
  },
  score(p, q){
    q = q.toLowerCase().trim(); if(!q) return 0;
    const name = (p.name||'').toLowerCase();
    const nameEn = (p.nameEn||'').toLowerCase();
    const cat = (p.cat||'').toLowerCase();
    const desc = (p.desc||'').toLowerCase();
    const all = `${name} ${nameEn} ${cat} ${desc}`;
    let s = 0;
    if(name === q || nameEn === q) s += 100;
    else if(name.startsWith(q) || nameEn.startsWith(q)) s += 80;
    else if(name.includes(q) || nameEn.includes(q)) s += 60;
    if(cat.includes(q)) s += 40;
    if(desc.includes(q)) s += 20;
    const words = q.split(/\s+/).filter(w => w.length > 1);
    if(words.length > 1){
      words.forEach(w => {
        if(all.includes(w)) s += 15;
        else {
          const cw = all.split(/\s+/);
          for(const w2 of cw){ if(w2.length > 2 && this.lev(w, w2) <= 1){ s += 8; break; } }
        }
      });
    }
    return s;
  },
  find(q, limit=20){
    if(!q || !q.trim()) return [];
    return DB.products.map(p => ({ product:p, score:this.score(p, q) }))
      .filter(x => x.score > 0)
      .sort((a,b) => b.score - a.score)
      .slice(0, limit);
  },
  async byImage(file){
    if(!file) return [];
    const kw = file.name.replace(/\.[^.]+$/, '').split(/[-_\s]+/).filter(w => w.length > 2);
    if(!kw.length) return DB.products.slice(0, 6).map(p => ({ product:p, score:1 }));
    const results = [];
    kw.forEach(k => { this.find(k, 6).forEach(r => { if(!results.find(x => x.product.id === r.product.id)) results.push(r); }); });
    return results.slice(0, 12);
  }
};

const Voice = {
  init(cb){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return false;
    const rec = new SR();
    rec.lang = LANG === 'bn' ? 'bn-BD' : 'en-US';
    rec.continuous = false;
    rec.onresult = e => cb(e.results[0][0].transcript);
    rec.onerror = () => Toast.show(LANG==='bn'?'ভয়েস শোনা যায়নি':'Voice not recognized','error');
    try { rec.start(); return true; } catch(e){ return false; }
  }
};

/* ═══ Wallet / Referral / Loyalty ═══ */
const Wallet = {
  get(uid){ if(!uid) return 0; try{ const d = JSON.parse(localStorage.getItem('eco_wallet')||'{}'); return d[uid]||0; }catch(e){ return 0; } },
  set(uid, v){ try{ const d = JSON.parse(localStorage.getItem('eco_wallet')||'{}'); d[uid] = v; localStorage.setItem('eco_wallet', JSON.stringify(d)); }catch(e){} },
  add(uid, amt, reason){
    if(!uid) return; const cur = this.get(uid); const nb = Math.max(0, cur + amt);
    this.set(uid, nb);
    try{ const all = JSON.parse(localStorage.getItem('eco_wallet_tx')||'{}'); if(!all[uid]) all[uid] = []; all[uid].unshift({ amount:amt, type:amt>0?'credit':'debit', reason:reason||'Txn', time:Date.now(), id:'tx_'+Date.now() }); all[uid] = all[uid].slice(0, 50); localStorage.setItem('eco_wallet_tx', JSON.stringify(all)); }catch(e){}
    return nb;
  },
  txs(uid){ try{ const all = JSON.parse(localStorage.getItem('eco_wallet_tx')||'{}'); return all[uid]||[]; }catch(e){ return []; } },
  open(){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const bal = this.get(u.id); const tx = this.txs(u.id);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-wallet"></i> ${t('wallet')}</h3></div><div class="modal-body"><div class="wallet-card"><div class="wallet-card-inner"><label>${t('balance')}</label><span class="wallet-amount">${money(bal)}</span><div class="wallet-actions"><button class="btn btn-sm btn-solid" onclick="Wallet.topUp()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button></div></div></div><h4 style="font-size:13.5px;font-weight:800;margin:18px 0 10px"><i class="fa-solid fa-list"></i> ${t('transactions')}</h4>${tx.length ? tx.map(x => `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center"><div style="width:38px;height:38px;border-radius:50%;background:${x.type==='credit'?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)'};color:${x.type==='credit'?'var(--success)':'var(--danger)'};display:flex;align-items:center;justify-content:center;font-size:15px"><i class="fa-solid fa-${x.type==='credit'?'arrow-down':'arrow-up'}"></i></div><div style="flex:1"><b style="font-size:13px">${x.reason}</b><p style="font-size:11.5px;color:var(--text-dim);margin-top:2px">${new Date(x.time).toLocaleString()}</p></div><span style="font-weight:800;font-family:var(--font-en);color:${x.type==='credit'?'var(--success)':'var(--danger)'}">${x.type==='credit'?'+':''}${money(x.amount)}</span></div>`).join('') : `<p class="muted">${t('noTransactions')}</p>`}</div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`);
  },
  topUp(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-plus"></i> ${t('addMoney')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('amount')} (৳)</label><input type="number" id="wtAmt" min="50" step="50" value="500" autofocus></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="Wallet.doTU()">${t('save')}</button></div>`);
  },
  doTU(){
    const amt = +document.getElementById('wtAmt').value;
    if(!amt || amt < 50) return Toast.show('Min ৳50','error');
    const u = Auth.user(); if(!u) return;
    Wallet.add(u.id, amt, 'Top up'); Modal.close(); Toast.show(`${money(amt)} added`,'success'); App.render();
  }
};
const Referral = {
  BONUS: 50,
  code(uid){ return uid ? ('ECO'+uid.slice(-5).toUpperCase()).replace(/[^A-Z0-9]/g,'').slice(0,10) : 'ECO000'; },
  async apply(code){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const cc = (code||'').trim().toUpperCase(); if(!cc) return;
    if(cc === this.code(u.id)) return Toast.show('Own code','error');
    if(u.referralApplied) return Toast.show('Already applied','warning');
    const ref = DB.users.find(x => this.code(x.id) === cc);
    if(!ref) return Toast.show('Invalid code','error');
    Wallet.add(u.id, this.BONUS, 'Referral'); Wallet.add(ref.id, this.BONUS, 'Referral');
    Session.set({ ...u, referralApplied:true, referralCode:cc });
    await DB.updateUser(u.id, { referralApplied:true, referralCode:cc });
    Toast.show(`🎉 ৳${this.BONUS} for both!`,'success',5000);
    App.render();
  },
  open(){
    const u = Auth.user(); if(!u) return Toast.show(t('loginRequired'),'warning');
    const code = this.code(u.id);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-users"></i> ${t('referral')}</h3></div><div class="modal-body"><div class="referral-card"><div style="font-size:13.5px;font-weight:700;margin-bottom:8px">${t('inviteFriends')}</div><div class="referral-code"><span>${code}</span><button onclick="navigator.clipboard.writeText('${code}').then(()=>Toast.show('Copied','success'))"><i class="fa-solid fa-copy"></i></button></div></div><div class="form-group" style="margin-top:18px"><label>Apply Code</label><div style="display:flex;gap:8px"><input id="refInp" placeholder="ECO..." style="flex:1"><button class="btn btn-primary" onclick="Referral.apply(document.getElementById('refInp').value)"><i class="fa-solid fa-check"></i></button></div></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`);
  }
};
const Loyalty = {
  RATE: 0.01,
  get(uid){ if(!uid) return 0; try{ const d = JSON.parse(localStorage.getItem('eco_loyalty')||'{}'); return d[uid]||0; }catch(e){ return 0; } },
  set(uid, p){ try{ const d = JSON.parse(localStorage.getItem('eco_loyalty')||'{}'); d[uid] = p; localStorage.setItem('eco_loyalty', JSON.stringify(d)); }catch(e){} },
  addOrder(uid, total){ if(!uid) return 0; const pts = Math.floor(total*this.RATE); this.set(uid, this.get(uid)+pts); return pts; }
};

/* ═══ WhatsApp / PDF / Tracking ═══ */
const WhatsApp = {
  fmt(n){ let s = String(n||'').replace(/\D/g,''); if(s.startsWith('0')) s = '88'+s; else if(!s.startsWith('88')) s = '880'+s.replace(/^0+/,''); return s; },
  build(o){
    const items = (o.items||[]).map((it,i) => `${i+1}. ${it.name}\n   ${it.qty} × ৳${it.price} = ৳${it.qty*it.price}`).join('\n\n');
    const isBn = LANG==='bn';
    return isBn ? `🛒 *EcoShop Pro MAX*\n\n👤 ${o.customer.name}\n📞 ${o.customer.phone}\n📍 ${o.customer.address}\n\n📦 *পণ্য:*\n${items}\n\n💰 সাবটোটাল: ৳${o.subtotal||0}\n🚚 ডেলিভারি: ৳${o.deliveryCharge||0}\n✅ *সর্বমোট: ৳${o.total}*\n\n🆔 ${o.id}\n📊 ${Orders.label(o.status)}` : `🛒 *EcoShop Pro MAX*\n\n👤 ${o.customer.name}\n📞 ${o.customer.phone}\n📍 ${o.customer.address}\n\n📦 *Items:*\n${items}\n\n💰 Subtotal: ৳${o.subtotal||0}\n🚚 Delivery: ৳${o.deliveryCharge||0}\n✅ *Total: ৳${o.total}*\n\n🆔 ${o.id}\n📊 ${Orders.label(o.status)}`;
  },
  send(o, phone){
    if(!o) return;
    const p = this.fmt(phone || o.customer.phone);
    if(!p) return Toast.show('Invalid phone','error');
    window.open(`https://wa.me/${p}?text=${encodeURIComponent(this.build(o))}`, '_blank');
  }
};
const PDFInvoice = {
  generate(orderId){
    const o = DB.orders.find(x => x.id === orderId); if(!o) return;
    const isBn = LANG === 'bn';
    const w = window.open('', '_blank', 'width=900,height=1000');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${o.id}</title><link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'${isBn?'Hind Siliguri':'Plus Jakarta Sans'}',sans-serif;background:#f5f6fa;padding:24px;color:#0f1021}.inv{max-width:760px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(15,16,33,.08)}.h{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:28px 32px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}.h h1{font-size:22px;font-weight:800}.h h1 span{color:#ffe49a}.h .meta{text-align:right;font-size:13px}.h .meta h2{font-size:24px;font-weight:800;margin-bottom:6px}.parties{padding:24px 32px;border-bottom:1px dashed #e5e8f0;display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:13px}.pl{font-size:10.5px;font-weight:800;color:#94a3b8;text-transform:uppercase;margin-bottom:6px}.pn{font-size:15px;font-weight:800;margin-bottom:6px}.pd{color:#64748b;line-height:1.6}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:12px;text-align:left;border-bottom:1px solid #e5e8f0;font-size:13px}th{background:#f8f9fd;font-size:11px;text-transform:uppercase;color:#64748b}td:nth-child(2),td:nth-child(3),td:nth-child(4){text-align:right}.totals{padding:0 32px 24px;display:flex;justify-content:flex-end}.tb{width:100%;max-width:320px}.tr{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;color:#64748b}.tr.g{border-top:2px solid #e5e8f0;margin-top:8px;padding-top:14px;font-size:18px;font-weight:800;color:#6366f1}.f{padding:20px 32px;background:#f8f9fd;text-align:center;font-size:12px;color:#64748b}.bar{position:fixed;top:20px;right:20px;display:flex;gap:8px}.bar button{padding:12px 20px;background:#6366f1;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer}@media print{.bar{display:none}}</style></head><body><div class="bar"><button onclick="window.print()">🖨️ Print</button><button style="background:#fff;color:#64748b" onclick="window.close()">✕</button></div><div class="inv"><div class="h"><div><h1>EcoShop<span>Pro</span></h1><p style="font-size:12px;opacity:.9;margin-top:4px">${DB.settings.supportPhone||''}</p></div><div class="meta"><h2>${isBn?'ইনভয়েস':'INVOICE'}</h2><div>${o.id}</div><div>${new Date(o.date).toLocaleDateString(isBn?'bn-BD':'en-US')}</div></div></div><div class="parties"><div><div class="pl">${isBn?'প্রেরক':'From'}</div><div class="pn">${DB.settings.siteName}</div><div class="pd">${DB.settings.supportEmail}<br>${DB.settings.supportPhone}</div></div><div><div class="pl">${isBn?'প্রাপক':'Bill To'}</div><div class="pn">${o.customer.name}</div><div class="pd">${o.customer.phone}<br>${o.customer.address}</div></div></div><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${(o.items||[]).map(it => `<tr><td>${it.name}</td><td>${it.qty}</td><td>৳${it.price}</td><td>৳${it.qty*it.price}</td></tr>`).join('')}</tbody></table><div class="totals"><div class="tb"><div class="tr"><span>${t('subtotal')}</span><span>৳${o.subtotal||0}</span></div><div class="tr"><span>${t('deliveryCharge')}</span><span>৳${o.deliveryCharge||0}</span></div>${o.discount?`<div class="tr"><span>${t('discount')}</span><span>-৳${o.discount}</span></div>`:''}<div class="tr g"><span>${t('total')}</span><span>৳${o.total}</span></div></div></div><div class="f">${isBn?'ধন্যবাদ!':'Thank you!'} — ${DB.settings.siteName} © ${new Date().getFullYear()}</div></div></body></html>`);
    w.document.close();
  }
};
const Tracking = {
  open(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-truck-fast"></i> ${t('trackOrder')}</h3></div><div class="modal-body"><div class="form-group"><label>Order ID</label><input id="trackId" placeholder="ORD-XXXXXXXX"></div><div id="trackRes"></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button><button class="btn btn-primary btn-block" onclick="Tracking.lookup()">${t('track')}</button></div>`);
    setTimeout(()=>document.getElementById('trackId')?.focus(), 100);
  },
  lookup(){
    const id = (document.getElementById('trackId')?.value||'').trim().toUpperCase();
    const res = document.getElementById('trackRes'); if(!id || !res) return;
    const o = DB.orders.find(x => x.id.toUpperCase() === id);
    if(!o){ res.innerHTML = `<div style="background:rgba(239,68,68,.1);border-left:3px solid var(--danger);padding:12px;border-radius:8px;margin-top:14px;color:var(--danger);font-size:13px">${t('botInvalidOrder')}</div>`; return; }
    const flow = Orders.FLOW; const idx = flow.indexOf(o.status);
    res.innerHTML = `<div style="margin-top:16px;background:var(--surface-2);padding:16px;border-radius:12px"><b>${o.id}</b><br><span class="status-badge status-${o.status}" style="margin-top:8px;display:inline-block">${Orders.label(o.status)}</span>${!['cancelled','rejected'].includes(o.status)?`<div class="order-timeline" style="margin-top:12px">${flow.map((s,i)=>`<div class="timeline-step ${i<idx?'done':''} ${i===idx?'current':''}">${i<flow.length-1?'<div class="timeline-line"></div>':''}<div class="dot"><i class="fa-solid ${i<=idx?'fa-check':Orders.icon(s)}"></i></div><div class="label">${Orders.label(s)}</div></div>`).join('')}</div>`:''}</div>`;
  }
};

/* ═══ Toast / Modal / Helpers ═══ */
const Toast = {
  show(msg, type='info', ms=2400){
    const box = document.getElementById('toastContainer'); if(!box) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { info:'fa-circle-info', success:'fa-circle-check', error:'fa-circle-exclamation', warning:'fa-triangle-exclamation' };
    el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i><span>${msg}</span>`;
    box.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(40px)'; setTimeout(() => el.remove(), 250); }, ms);
  }
};
const Modal = {
  open(html, cls=''){ document.getElementById('modalRoot').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)Modal.close()"><div class="modal-box ${cls}">${html}</div></div>`; document.body.style.overflow = 'hidden'; },
  close(){ document.getElementById('modalRoot').innerHTML=''; document.body.style.overflow=''; },
  confirm(msg, onYes){
    this.open(`<div class="confirm-box"><i class="fa-solid fa-triangle-exclamation"></i><p>${msg}</p><div class="confirm-actions"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-danger btn-block" id="mcy">${t('yes')}</button></div></div>`,'sm');
    document.getElementById('mcy').onclick = () => { Modal.close(); onYes && onYes(); };
  }
};
function loadingHTML(){ return `<div class="loading-state"><div class="spinner"></div><p>${t('loadingData')}</p></div>`; }
function money(n){ return '৳' + (Number(n)||0).toLocaleString(LANG==='bn'?'bn-BD':'en-US'); }
function timeAgo(ts){
  const d = Date.now() - ts; const s = Math.floor(d/1000);
  if(s < 60) return LANG==='bn'?'এইমাত্র':'Just now';
  const m = Math.floor(s/60); if(m < 60) return LANG==='bn'?`${m}m আগে`:`${m}m ago`;
  const h = Math.floor(m/60); if(h < 24) return LANG==='bn'?`${h}h আগে`:`${h}h ago`;
  const dy = Math.floor(h/24); if(dy < 30) return LANG==='bn'?`${dy}d আগে`:`${dy}d ago`;
  return new Date(ts).toLocaleDateString(LANG==='bn'?'bn-BD':'en-US');
}
function starHTML(rating, size){
  const full = Math.floor(rating||0); const half = rating - full >= .5;
  let s = '';
  for(let i=0;i<5;i++){
    if(i < full) s += '<i class="fa-solid fa-star"></i>';
    else if(i === full && half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
    else s += '<i class="fa-regular fa-star"></i>';
  }
  return `<span class="stars" style="${size?`font-size:${size}`:''}">${s}</span>`;
}
function esc(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ═══ PWA / Push ═══ */
const PWA = {
  prompt:null,
  registerSW(){ if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}); },
  init(){
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault(); this.prompt = e;
      const s = document.getElementById('pmInstallStatus'); if(s) s.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => {
      const s = document.getElementById('pmInstallStatus'); if(s) s.style.display = 'none';
      Toast.show(LANG==='bn'?'✅ অ্যাপ ইনস্টল হয়েছে':'✅ App installed','success');
    });
  },
  async triggerInstall(){
    if(!this.prompt) return Toast.show(LANG==='bn'?'ইনস্টল সাপোর্ট নেই':'Not supported','info');
    this.prompt.prompt();
    const { outcome } = await this.prompt.userChoice;
    this.prompt = null;
    if(outcome === 'accepted'){ const s = document.getElementById('pmInstallStatus'); if(s) s.style.display = 'none'; }
  }
};
const Push = {
  async request(){ if(!('Notification' in window)) return false; const p = await Notification.requestPermission(); if(p === 'granted'){ Toast.show(t('pushEnabled'),'success'); return true; } return false; },
  init(){ const b = document.getElementById('pushNotifBtn'); if(b) b.onclick = async () => { if(await this.request()) b.textContent = '✓'; }; }
};

/* ═══ App Router ═══ */
const App = {
  route:'home',
  _shopCat:'all', _shopSort:'default', _shopQ:'',
  _adminTab:'dashboard', _pQuery:'', _uQuery:'',
  _orderFilter:{ status:'all', payment:'all', search:'', from:'', to:'' },
  _selectedOrders:[], _orderFilterUser:'all',
  _authTab:'login', _authRedirect:null, _param:null,
  _otpStep:null, _pendingReg:null, _checkoutState:null,
  _firstRender:false,

  hideSplash(){
    const s = document.getElementById('splash');
    if(s && !s.classList.contains('hidden')){
      const b = document.getElementById('splashBar'); if(b) b.style.width = '100%';
      setTimeout(() => s.classList.add('hidden'), 200);
    }
  },
  rerenderIfVisible(){
    if(['home','shop','admin','orders','wishlist','profile','auth','product','checkout'].includes(this.route)) this.render();
    else { Cart.refresh(); Notifs.refresh(); this.syncUI(); }
  },
  go(route, param){
    if(['orders','profile','checkout'].includes(route) && !Auth.user()){
      Toast.show(t('loginRequired'),'warning'); this._authRedirect = route; this.route = 'auth';
    } else if(route === 'admin' && !Auth.isAdmin()){
      Toast.show(t('adminOnly'),'warning'); this._authRedirect = 'admin'; this.route = 'auth';
    } else {
      this.route = route; if(param) this._param = param;
    }
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === this.route));
    this.render();
    window.scrollTo({ top:0, behavior:'smooth' });
  },
  render(){
    const el = document.getElementById('app'); if(!el) return;
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
    } catch(e){ console.error(e); html = `<div class="page"><div style="background:rgba(239,68,68,.1);border-left:4px solid var(--danger);padding:16px;border-radius:12px;color:var(--danger)">${esc(e.message)}</div></div>`; }
    el.innerHTML = html;
    this.syncUI(); Cart.refresh(); Notifs.refresh(); this.bindPage();
  },
  bindPage(){
    document.querySelectorAll('.detail-thumb').forEach(t => {
      t.onclick = () => {
        const src = t.querySelector('img').src;
        const m = document.querySelector('.detail-main-img img');
        if(m) m.src = src;
        document.querySelectorAll('.detail-thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      };
    });
  },
  syncUI(){
    const u = Auth.user();
    const lb = document.getElementById('loginBtn'); const ab = document.getElementById('userAvatarBtn');
    if(!lb || !ab) return;
    const al = document.querySelector('.nav-admin-link');
    if(u){
      lb.style.display='none'; ab.classList.add('show');
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
      document.getElementById('pmWishCount').textContent = Wish.all().length;
      if(al) al.style.display = u.role==='admin'?'flex':'none';
    } else {
      lb.style.display='inline-flex'; ab.classList.remove('show');
      document.getElementById('pmName').textContent = LANG==='bn'?'অতিথি':'Guest';
      document.getElementById('pmEmail').textContent = LANG==='bn'?'লগইন করুন':'Login';
      document.getElementById('pmAvatar').src = 'https://ui-avatars.com/api/?name=G&background=6366f1&color=fff';
      document.getElementById('pmRole').textContent = 'GUEST';
      document.getElementById('pmStats').style.display = 'none';
      document.getElementById('pmAdminSection').style.display='none';
      document.getElementById('pmLoginBtn').style.display='flex';
      document.getElementById('pmLogoutBtn').style.display='none';
      if(al) al.style.display = 'flex';
    }
  },
  openCart(){ document.getElementById('cartDrawer').classList.add('active'); document.getElementById('backdrop').classList.add('active'); document.body.style.overflow='hidden'; },
  closePM(){ document.getElementById('powerMenu').classList.remove('active'); document.getElementById('backdrop').classList.remove('active'); document.body.style.overflow=''; },
  closeAll(){
    ['powerMenu','cartDrawer','notifPanel','mobileSearchModal'].forEach(id => document.getElementById(id)?.classList.remove('active'));
    document.querySelector('.admin-sidebar')?.classList.remove('active');
    document.getElementById('backdrop').classList.remove('active');
    document.body.style.overflow='';
  }
};

/* ═══ Pages ═══ */
const Pages = {
  home(){
    if(!DB.ready.products) return loadingHTML();
    const feat = DB.products.filter(p => p.featured).slice(0, 6);
    const newArr = [...DB.products].sort((a,b) => (b.createdAt||0) - (a.createdAt||0)).slice(0, 8);
    return `<section class="hero"><div class="hero-inner"><div class="hero-content"><div class="hero-badge"><i class="fa-solid fa-bolt"></i> Premium 2026</div><h1 class="hero-title">${LANG==='bn'?'সেরা <span class="grad">প্রিমিয়াম</span> পণ্য<br>এখন হাতের মুঠোয়':'Best <span class="grad">Premium</span> products<br>at your fingertips'}</h1><p class="hero-sub">${LANG==='bn'?'দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট, ১০০% অরিজিনাল।':'Fast delivery, secure payment, 100% original.'}</p><div class="hero-btns"><button class="btn btn-primary btn-lg" onclick="App.go('shop')"><i class="fa-solid fa-store"></i> ${t('shop')}</button><button class="btn btn-outline btn-lg" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:#fff" onclick="App.go('orders')"><i class="fa-solid fa-box"></i> ${t('myOrders')}</button></div></div></div></section><div class="page"><div class="section-head"><h2><i class="fa-solid fa-fire" style="color:var(--accent)"></i> ${t('featured')}</h2><span class="count-chip">${feat.length} ${t('items')}</span></div><div class="product-grid">${feat.length ? feat.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${t('empty')}</h3></div>`}</div><div class="section-head" style="margin-top:30px"><h2><i class="fa-solid fa-star" style="color:var(--brand)"></i> ${t('newArrivals')}</h2><button class="btn btn-outline btn-sm" onclick="App.go('shop')">${LANG==='bn'?'সব দেখুন':'View All'} <i class="fa-solid fa-arrow-right"></i></button></div><div class="product-grid">${newArr.map(Components.productCard).join('')}</div></div>`;
  },
  shop(){
    if(!DB.ready.products) return loadingHTML();
    let list = DB.products.slice();
    if(App._shopCat && App._shopCat !== 'all') list = list.filter(p => p.cat === App._shopCat);
    if(App._shopQ){ list = Search.find(App._shopQ, 100).map(r => r.product); }
    if(App._shopSort === 'low') list.sort((a,b) => a.price - b.price);
    else if(App._shopSort === 'high') list.sort((a,b) => b.price - a.price);
    else if(App._shopSort === 'new') list.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    else if(App._shopSort === 'popular') list.sort((a,b) => (b.reviewCount||0) - (a.reviewCount||0));
    return `<div class="page"><div class="section-head"><h2><i class="fa-solid fa-store"></i> ${t('allProducts')}</h2><span class="count-chip">${list.length} ${t('items')}</span></div><div class="filter-chips"><div class="filter-chip ${App._shopCat==='all'?'active':''}" onclick="App._shopCat='all';App.render()">${LANG==='bn'?'সব':'All'}</div>${DB.categories.map(c => `<div class="filter-chip ${App._shopCat===c?'active':''}" onclick="App._shopCat='${esc(c)}';App.render()">${esc(c)}</div>`).join('')}</div><div class="filters-bar"><select onchange="App._shopSort=this.value;App.render()"><option value="default">${t('defaultSort')}</option><option value="new" ${App._shopSort==='new'?'selected':''}>${t('newest')}</option><option value="popular" ${App._shopSort==='popular'?'selected':''}>${t('popular')}</option><option value="low" ${App._shopSort==='low'?'selected':''}>${t('priceLowHigh')}</option><option value="high" ${App._shopSort==='high'?'selected':''}>${t('priceHighLow')}</option></select></div>${App._shopQ?`<div class="section-head" style="margin-bottom:12px"><span class="count-chip">${t('searchResults')}: "${esc(App._shopQ)}" (${list.length})</span><button class="btn btn-outline btn-sm" onclick="App._shopQ='';App.render()"><i class="fa-solid fa-xmark"></i> ${LANG==='bn'?'মুছুন':'Clear'}</button></div>`:''}<div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>${t('empty')}</h3><p>${t('searchNoResults')}</p></div>`}</div></div>`;
  },
  productDetail(id){
    if(!DB.ready.products) return loadingHTML();
    const p = DB.products.find(x => x.id === id);
    if(!p) return `<div class="page"><div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'পণ্য পাওয়া যায়নি':'Not found'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div></div>`;
    const imgs = p.images && p.images.length ? p.images : [p.img];
    const related = DB.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const reviews = DB.getReviews(p.id);
    const sc = p.stock <= 0 ? 'out' : (p.stock < 10 ? 'low' : '');
    return `<div class="page"><button class="btn btn-outline btn-sm" onclick="App.go('shop')" style="margin-bottom:12px"><i class="fa-solid fa-arrow-left"></i> ${t('shop')}</button><div class="product-detail"><div class="detail-gallery"><div class="detail-main-img"><img id="mainImg" src="${imgs[0]}" onerror="this.src='https://via.placeholder.com/500'"></div>${imgs.length>1?`<div class="detail-thumbs">${imgs.map((u,i) => `<div class="detail-thumb ${i===0?'active':''}"><img src="${u}"></div>`).join('')}</div>`:''}</div><div class="detail-info"><span class="product-cat">${esc(LANG==='bn'?p.cat:(p.catEn||p.cat))}</span><h1>${esc(LANG==='bn'?p.name:(p.nameEn||p.name))}</h1><div class="rating">${starHTML(p.rating||0)} <span>${p.rating?(p.rating).toFixed(1):'0'} (${p.reviewCount||0})</span></div><div class="detail-price"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}${p.discount?`<span class="status-badge" style="background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:#fff">-${p.discount}%</span>`:''}</div><p class="detail-desc">${esc(LANG==='bn'?p.desc:(p.descEn||p.desc||''))}</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px"><span class="chip ${sc==='out'?'blocked':'active-status'}"><i class="fa-solid fa-box"></i> ${p.stock<=0?t('outOfStock'):`${t('stock')}: ${p.stock}`}</span></div><div class="detail-actions"><button class="btn btn-primary btn-lg" ${p.stock<=0?'disabled':''} onclick="Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}</button><button class="btn btn-outline btn-lg" onclick="Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart" style="${Wish.has(p.id)?'color:var(--danger)':''}"></i></button></div></div></div><div class="admin-card" style="margin-top:20px"><div class="admin-card-head"><h3><i class="fa-solid fa-star"></i> ${t('productReviews')} (${reviews.length})</h3>${Auth.user()?`<button class="btn btn-primary btn-sm" onclick="Reviews.openModal('${p.id}')"><i class="fa-solid fa-pen"></i> ${t('writeReview')}</button>`:''}</div>${reviews.length ? reviews.map(r => { const u = DB.users.find(x => x.id === r.userId); return `<div class="review-item"><img class="review-avatar" src="${u?.avatar||'https://ui-avatars.com/api/?name=U'}" onerror="this.src='https://ui-avatars.com/api/?name=U'"><div class="review-body"><div class="review-head"><h5>${esc(r.userName||'User')}</h5><span class="rating">${starHTML(r.rating,'13px')}</span></div><p>${esc(r.text)}</p><small style="font-size:11px;color:var(--text-soft);display:block;margin-top:5px">${timeAgo(r.date)}</small></div></div>`; }).join('') : `<p class="muted">${t('beFirstReview')}</p>`}</div>${related.length?`<div class="section-head" style="margin-top:22px"><h2><i class="fa-solid fa-layer-group"></i> ${t('relatedProducts')}</h2></div><div class="product-grid">${related.map(Components.productCard).join('')}</div>`:''}</div>`;
  },
  orders(){
    if(!Auth.user()) return this.authPage('orders');
    const mine = Orders.mine();
    const cnt = { all:mine.length, active:mine.filter(o=>['pending','confirmed','processing','shipped','out_for_delivery'].includes(o.status)).length, delivered:mine.filter(o=>o.status==='delivered').length, cancelled:mine.filter(o=>['cancelled','rejected'].includes(o.status)).length };
    const f = App._orderFilterUser || 'all';
    const list = f==='all' ? mine : f==='active' ? mine.filter(o=>['pending','confirmed','processing','shipped','out_for_delivery'].includes(o.status)) : f==='delivered' ? mine.filter(o=>o.status==='delivered') : mine.filter(o=>['cancelled','rejected'].includes(o.status));
    return `<div class="page"><div class="section-head"><h2><i class="fa-solid fa-box"></i> ${t('myOrders')}</h2><span class="count-chip">${mine.length}</span></div><div class="filter-chips"><div class="filter-chip ${f==='all'?'active':''}" onclick="App._orderFilterUser='all';App.render()">${t('allOrders')} (${cnt.all})</div><div class="filter-chip ${f==='active'?'active':''}" onclick="App._orderFilterUser='active';App.render()">${t('activeOrders')} (${cnt.active})</div><div class="filter-chip ${f==='delivered'?'active':''}" onclick="App._orderFilterUser='delivered';App.render()">${t('delivered')} (${cnt.delivered})</div><div class="filter-chip ${f==='cancelled'?'active':''}" onclick="App._orderFilterUser='cancelled';App.render()">${t('cancelled')} (${cnt.cancelled})</div></div>${list.length ? list.map(o => Components.orderCard(o)).join('') : `<div class="empty-state"><i class="fa-solid fa-box-open"></i><h3>${LANG==='bn'?'কোনো অর্ডার নেই':'No orders yet'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}</div>`;
  },
  wishlist(){
    const ids = Wish.all();
    const list = DB.products.filter(p => ids.includes(p.id));
    return `<div class="page"><div class="section-head"><h2><i class="fa-solid fa-heart" style="color:var(--danger)"></i> ${t('wishlist')}</h2><span class="count-chip">${list.length}</span></div><div class="product-grid">${list.length ? list.map(Components.productCard).join('') : `<div class="empty-state"><i class="fa-regular fa-heart"></i><h3>${LANG==='bn'?'উইশলিস্ট খালি':'Wishlist empty'}</h3><button class="btn btn-primary" onclick="App.go('shop')">${t('shop')}</button></div>`}</div></div>`;
  },
  profile(){
    const u = Auth.user();
    if(!u) return this.authPage('profile');
    const mine = Orders.mine();
    const spent = mine.filter(o => o.status !== 'cancelled').reduce((s,o) => s + o.total, 0);
    const bal = Wallet.get(u.id); const pts = Loyalty.get(u.id); const ref = Referral.code(u.id);
    const isBn = LANG==='bn';
    return `<div class="page"><div class="profile-hero"><div class="profile-cover"></div><div class="profile-body"><div class="profile-avatar-wrap"><img class="profile-avatar" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U&background=6366f1&color=fff'"><label class="profile-avatar-edit" for="avatarInput"><i class="fa-solid fa-camera"></i></label><input type="file" id="avatarInput" accept="image/*" style="display:none" onchange="Profile.uploadAvatar(this)"></div><div class="profile-name-row"><h2>${esc(u.name)}</h2>${u.emailVerified?`<span class="profile-verified"><i class="fa-solid fa-circle-check"></i> ${t('verifiedCustomer')}</span>`:''}</div><div class="profile-meta"><span><i class="fa-solid fa-envelope"></i> ${esc(u.email)}</span>${u.phone?`<span><i class="fa-solid fa-phone"></i> ${esc(u.phone)}</span>`:''}<span><i class="fa-solid fa-calendar"></i> ${t('joinedOn')}: ${new Date(u.joined).toLocaleDateString(isBn?'bn-BD':'en-US')}</span></div></div></div><div class="profile-stats"><div class="pstat-card"><div class="pstat-icon brand"><i class="fa-solid fa-box"></i></div><div class="pstat-value">${mine.length}</div><div class="pstat-label">${t('orderCount')}</div></div><div class="pstat-card"><div class="pstat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="pstat-value">${mine.filter(o=>o.status==='pending').length}</div><div class="pstat-label">${t('ordersPending')}</div></div><div class="pstat-card"><div class="pstat-icon success"><i class="fa-solid fa-wallet"></i></div><div class="pstat-value">${money(spent)}</div><div class="pstat-label">${t('totalSpent')}</div></div><div class="pstat-card"><div class="pstat-icon pink"><i class="fa-solid fa-gift"></i></div><div class="pstat-value">${pts}</div><div class="pstat-label">${t('loyalty')}</div></div></div><div class="wallet-card"><div class="wallet-card-inner"><label>${t('walletBalance')}</label><span class="wallet-amount">${money(bal)}</span><div class="wallet-actions"><button class="btn btn-sm btn-solid" onclick="Wallet.open()"><i class="fa-solid fa-list"></i> ${t('transactions')}</button><button class="btn btn-sm" onclick="Wallet.topUp()"><i class="fa-solid fa-plus"></i> ${t('addMoney')}</button></div></div></div><div class="referral-card"><div style="font-size:13.5px;font-weight:700;margin-bottom:8px">${t('inviteFriends')}</div><div class="referral-code"><span>${ref}</span><button onclick="navigator.clipboard.writeText('${ref}').then(()=>Toast.show('Copied','success'))"><i class="fa-solid fa-copy"></i></button></div></div><div class="form-card"><div class="form-card-head"><i class="fa-solid fa-user-pen"></i><div><h3>${t('personalInfo')}</h3><p>${t('personalInfoDesc')}</p></div></div><div class="form-group"><label>${t('fullName')}</label><input id="pfName" value="${esc(u.name)}"></div><div class="form-group"><label>${t('phone')}</label><input id="pfPhone" value="${esc(u.phone||'')}" placeholder="017XXXXXXXX"></div><div class="form-group"><label>${t('address')}</label><textarea id="pfAddr" rows="2">${esc(u.address||'')}</textarea></div><button class="btn btn-primary" onclick="Profile.saveInfo()"><i class="fa-solid fa-floppy-disk"></i> ${t('saveInfo')}</button></div><div class="form-card"><div class="form-card-head"><i class="fa-solid fa-lock" style="background:linear-gradient(135deg,var(--danger),var(--danger-dark))"></i><div><h3>${t('changePassword')}</h3><p>${t('changePasswordDesc')}</p></div></div><div class="form-group"><label>${t('currentPassword')} *</label><div class="input-wrap"><i class="fa-solid fa-key input-icon"></i><input type="password" id="pwCur" placeholder="••••••"><button type="button" class="toggle-pass" onclick="Profile.toggle('pwCur', this)"><i class="fa-solid fa-eye"></i></button></div></div><div class="form-group"><label>${t('newPassword2')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="pwNew" placeholder="••••••" oninput="AuthUI.pwd(this.value)"><button type="button" class="toggle-pass" onclick="Profile.toggle('pwNew', this)"><i class="fa-solid fa-eye"></i></button></div><div class="pwd-strength"><div class="pwd-bars"><div class="pwd-bar" id="pwdBar1"></div><div class="pwd-bar" id="pwdBar2"></div><div class="pwd-bar" id="pwdBar3"></div><div class="pwd-bar" id="pwdBar4"></div></div><div class="pwd-text" id="pwdText">Strength</div></div></div><div class="form-group"><label>${t('confirmPassword')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="pwNew2" placeholder="••••••"><button type="button" class="toggle-pass" onclick="Profile.toggle('pwNew2', this)"><i class="fa-solid fa-eye"></i></button></div><div class="form-error" id="pwErr">${t('passwordMismatch')}</div></div><button class="btn btn-primary" onclick="Profile.changePassword()"><i class="fa-solid fa-shield-halved"></i> ${t('updatePassword')}</button></div></div>`;
  },
  auth(){ return this.authPage(App._authRedirect || 'home'); },
  authPage(redirect){
    const tab = App._authTab || 'login';
    return `<div class="auth-page"><div class="auth-card"><div class="auth-logo"><div class="logo-icon"><i class="fa-solid fa-leaf"></i></div><h2>EcoShop<span>Pro</span></h2><p>${t('splashTagline')||'Premium e-commerce'}</p></div><div class="auth-tabs"><button class="${tab==='login'?'active':''}" id="tabL" onclick="AuthUI.tab('login')">${t('login')}</button><button class="${tab==='reg'?'active':''}" id="tabR" onclick="AuthUI.tab('reg')">${t('register')}</button></div><div id="authForm">${tab==='login' ? AuthUI.loginForm(redirect) : AuthUI.regForm(redirect)}</div></div></div>`;
  },
  admin(){
    if(!Auth.isAdmin()) return this.authPage('admin');
    if(!DB.ready.products) return loadingHTML();
    const tab = App._adminTab || 'dashboard';
    return `<div class="admin-layout">${Components.adminSidebar(tab)}<div class="admin-main"><div class="admin-header"><button class="admin-sidebar-toggle" onclick="document.querySelector('.admin-sidebar').classList.toggle('active');document.getElementById('backdrop').classList.toggle('active')"><i class="fa-solid fa-bars"></i></button><div class="admin-header-title"><h1>${Admin.titles[tab]||t('dashboard')}</h1><p>EcoShop Pro MAX v14</p></div><div class="admin-header-actions"><button class="btn btn-pink btn-sm" onclick="Admin.openBroadcastModal()"><i class="fa-solid fa-bullhorn"></i></button><button class="btn btn-outline btn-sm" onclick="App.go('home')"><i class="fa-solid fa-store"></i></button><button class="btn btn-primary btn-sm" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i></button></div></div><div class="admin-content" id="adminContent">${Admin.render(tab)}</div></div></div>`;
  },
  checkout(){
    const u = Auth.user(); if(!u) return this.authPage('checkout');
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
    return `<div class="page" style="max-width:720px"><div class="section-head"><h2><i class="fa-solid fa-credit-card"></i> ${t('checkout')}</h2></div><div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">1</div><div><h3>${t('deliveryDetails')}</h3></div></div><div class="form-group"><label>${t('fullName')} *</label><input id="coName" value="${esc(u.name)}"></div><div class="form-row"><div class="form-group"><label>${t('phone')} *</label><input id="coPhone" value="${esc(u.phone||'')}" placeholder="017XXXXXXXX"></div><div class="form-group"><label>${t('city')}</label><input id="coCity" value="ঢাকা"></div></div><div class="form-group"><label>${t('address')} *</label><textarea id="coAddr" rows="2">${esc(u.address||'')}</textarea></div></div><div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">2</div><div><h3>${t('deliveryZone')}</h3></div></div><div class="delivery-zones"><div class="delivery-zone ${zone==='inside'?'active':''}" onclick="Checkout.setZone('inside')"><div class="zone-icon"><i class="fa-solid fa-city"></i></div><b>${t('insideDhaka')}</b><div class="zone-price">${money(s.shippingInsideDhaka||100)}</div></div><div class="delivery-zone ${zone==='outside'?'active':''}" onclick="Checkout.setZone('outside')"><div class="zone-icon"><i class="fa-solid fa-mountain-sun"></i></div><b>${t('outsideDhaka')}</b><div class="zone-price">${money(s.shippingOutsideDhaka||120)}</div></div></div></div><div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">3</div><div><h3>${t('paymentMethodStep')}</h3></div></div><div class="payment-methods">${methods.map(m => `<div class="payment-method ${pay===m.id?'active':''}" onclick="Checkout.setPayment('${m.id}')"><div class="pm-logo ${m.cls}"><i class="fa-solid ${m.icon}"></i></div><b>${m.label}</b></div>`).join('')}</div><div id="payDetail">${Checkout.renderPay(pay)}</div></div><div class="checkout-step"><div class="checkout-step-head"><div class="checkout-step-num">4</div><div><h3>${t('orderSummary')}</h3></div></div><div class="cart-summary-row"><span>${t('subtotal')}</span><span>${money(Cart.subtotal())}</span></div><div class="cart-summary-row"><span>${t('deliveryCharge')}</span><span>${money(ship)}</span></div><div class="cart-summary-row total"><span>${t('total')}</span><span>${money(Cart.subtotal()+ship)}</span></div><button class="btn btn-primary btn-block btn-lg" style="margin-top:14px" id="coSubmit" onclick="Checkout.place()"><i class="fa-solid fa-check-circle"></i> ${t('placeOrder')}</button></div></div>`;
  }
};

const Checkout = {
  state(){ if(!App._checkoutState) App._checkoutState = { zone:'inside', payment:'cod' }; return App._checkoutState; },
  setZone(z){ this.state().zone = z; App.render(); },
  setPayment(m){
    this.state().payment = m;
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    const idx = ['cod','bkash','nagad','rocket'].indexOf(m);
    document.querySelectorAll('.payment-method')[idx]?.classList.add('active');
    const d = document.getElementById('payDetail'); if(d) d.innerHTML = this.renderPay(m);
    this.bindUpload();
  },
  renderPay(m){
    const s = DB.settings;
    if(m === 'cod') return `<div class="payment-info" style="background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.3)"><h4><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> ${t('cod')}</h4><p style="font-size:13px;color:var(--text-dim)">${t('codDesc')}</p></div>`;
    const num = m==='bkash'?s.bkashNumber:m==='nagad'?s.nagadNumber:s.rocketNumber;
    const brandName = m==='bkash'?'বিকাশ':m==='nagad'?'নগদ':'রকেট';
    return `<div class="payment-info"><h4>${brandName}</h4><div class="copy-number-box"><div><small style="font-size:11px;color:var(--text-dim);display:block;margin-bottom:4px">${t('paymentNumber')}</small><span class="number">${num}</span></div><button class="copy-btn" onclick="navigator.clipboard.writeText('${num}').then(()=>Toast.show('${t('numberCopied')}','success'));this.classList.add('copied')"><i class="fa-solid fa-copy"></i> ${t('copy')}</button></div><div class="txn-input-group"><label>${t('txnId')} *</label><input id="txnId" placeholder="${t('txnIdPlaceholder')}"></div><div class="txn-input-group"><label>${t('screenshot')} ${t('screenshotOptional')}</label><div class="img-upload" style="margin-top:10px"><div class="img-preview" id="ssPrev"><i class="fa-solid fa-image"></i></div><div class="upload-btn-wrap"><button type="button" class="upload-btn" id="ssUp"><i class="fa-solid fa-cloud-arrow-up"></i> ${t('uploadScreenshot')}</button><input type="file" id="ssFile" accept="image/*" style="display:none"></div></div><input type="hidden" id="ssUrl" value=""></div></div>`;
  },
  bindUpload(){
    const b = document.getElementById('ssUp'); const f = document.getElementById('ssFile');
    const p = document.getElementById('ssPrev'); const h = document.getElementById('ssUrl');
    if(!b || b._b) return; b._b = true;
    b.onclick = () => f.click();
    f.onchange = async () => {
      const file = f.files[0]; if(!file) return;
      const r = new FileReader(); r.onload = e => p.innerHTML = `<img src="${e.target.result}">`; r.readAsDataURL(file);
      try { const res = await ImageUpload.upload(file); h.value = res.url; p.innerHTML = `<img src="${res.url}">`; Toast.show(t('imgUploadSuccess'),'success'); }
      catch(e){ Toast.show(t('imgUploadFailed'),'error'); }
    };
  },
  async place(){
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const addr = document.getElementById('coAddr').value.trim();
    if(!name || !phone || !addr) return Toast.show(t('fillAllFields'),'error');
    const s = this.state();
    const m = s.payment;
    let txn = null, ss = null;
    if(m !== 'cod'){
      txn = (document.getElementById('txnId')?.value||'').trim();
      if(!txn || txn.length < 6) return Toast.show(t('invalidTxnId'),'error');
      ss = document.getElementById('ssUrl')?.value.trim() || '';
    }
    const ship = s.zone === 'inside' ? (DB.settings.shippingInsideDhaka||100) : (DB.settings.shippingOutsideDhaka||120);
    const sub = Cart.subtotal();
    const total = sub + ship;
    const items = Cart.items().map(i => { const p = DB.products.find(x => x.id === i.id); return { id:i.id, name:p?.name||'—', price:p?.price||0, qty:i.qty }; });
    const btn = document.getElementById('coSubmit'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('processing')}`;
    try {
      const order = await Orders.create({ customer:{ name, phone, city, address:addr }, items, subtotal:sub, deliveryCharge:ship, deliveryZone:s.zone, discount:0, total, paymentMethod:m, paymentNumber:m==='cod'?null:DB.settings[m+'Number'], txnId:txn, screenshot:ss });
      if(Auth.user()) Loyalty.addOrder(Auth.user().id, total);
      App._checkoutState = null;
      Toast.show(m==='cod'?t('orderSuccessCOD'):t('orderSuccessPaid'),'success',4000);
      Modal.open(`<div class="order-success"><div class="order-success-icon"><i class="fa-solid fa-check"></i></div><h3 style="font-size:19px;font-weight:800;margin-bottom:8px">🎉 ${LANG==='bn'?'অর্ডার সফল!':'Order Placed!'}</h3><p style="font-size:13.5px;color:var(--text-dim);margin-bottom:6px">${LANG==='bn'?'অর্ডার আইডি':'Order ID'}</p><p style="font-size:20px;font-weight:800;color:var(--brand);font-family:var(--font-en);margin-bottom:18px">${order.id}</p><button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${order.id}'), '${phone}');Modal.close();App.go('orders')"><i class="fa-brands fa-whatsapp"></i> ${t('whatsappSend')}</button><button class="btn btn-outline btn-block" style="margin-top:8px" onclick="Modal.close();App.go('orders')">${t('close')}</button></div>`,'sm');
    } catch(e){ Toast.show('Failed: '+e.message,'error'); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${t('placeOrder')}`; }
  }
};

const Reviews = {
  openModal(pid){
    if(!Auth.user()) return Toast.show(t('loginRequired'),'warning');
    if(DB.reviews.find(r => r.productId === pid && r.userId === Auth.user().id)) return Toast.show(t('alreadyReviewed'),'warning');
    window._rating = 5;
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-star"></i> ${t('writeReview')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('yourRating')}</label><div class="star-picker" id="sPicker">${[1,2,3,4,5].map(i => `<i class="fa-solid fa-star active" data-s="${i}" onclick="Reviews.set(${i})"></i>`).join('')}</div></div><div class="form-group"><label>${t('reviewText')}</label><textarea id="revText" rows="4" placeholder="${LANG==='bn'?'আপনার মতামত...':'Your review...'}"></textarea></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="Reviews.submit('${pid}')">${t('submitReview')}</button></div>`);
  },
  set(r){ window._rating = r; document.querySelectorAll('#sPicker i').forEach(s => s.classList.toggle('active', +s.dataset.s <= r)); },
  async submit(pid){
    const text = document.getElementById('revText').value.trim(); if(!text) return Toast.show(t('fillAllFields'),'error');
    const u = Auth.user(); if(!u) return;
    try {
      await DB.saveReview({ productId:pid, userId:u.id, userName:u.name, rating:window._rating||5, text });
      await DB.addReviewRating(pid, window._rating||5);
      Modal.close(); Toast.show(t('reviewSubmitted'),'success'); App.render();
    } catch(e){ Toast.show('Failed','error'); }
  }
};

const Profile = {
  toggle(id, btn){
    const input = document.getElementById(id); if(!input) return;
    const show = input.type === 'password'; input.type = show?'text':'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${show?'-slash':''}"></i>`;
  },
  async uploadAvatar(input){
    const file = input.files[0]; if(!file) return;
    const u = Auth.user(); if(!u) return;
    if(file.size > 5*1024*1024) return Toast.show('Max 5MB','error');
    Toast.show(LANG==='bn'?'আপলোড হচ্ছে...':'Uploading...','info');
    try {
      const res = await ImageUpload.upload(file);
      await DB.updateUser(u.id, { avatar:res.url });
      Session.set({ ...u, avatar:res.url });
      Toast.show(t('imgUploadSuccess'),'success'); App.render();
    } catch(e){ Toast.show(t('imgUploadFailed'),'error'); }
  },
  async saveInfo(){
    const u = Auth.user(); if(!u) return;
    const name = document.getElementById('pfName').value.trim();
    const phone = document.getElementById('pfPhone').value.trim();
    const address = document.getElementById('pfAddr').value.trim();
    if(!name) return Toast.show(t('fillAllFields'),'error');
    try {
      await DB.updateUser(u.id, { name, phone, address });
      Session.set({ ...u, name, phone, address });
      Toast.show(t('profileUpdated'),'success'); App.render();
    } catch(e){ Toast.show('Failed','error'); }
  },
  async changePassword(){
    const u = Auth.user(); if(!u) return;
    const cur = document.getElementById('pwCur').value;
    const n1 = document.getElementById('pwNew').value;
    const n2 = document.getElementById('pwNew2').value;
    const err = document.getElementById('pwErr');
    if(!cur || !n1 || !n2) return Toast.show(t('fillAllFields'),'error');
    if(cur !== u.password) return Toast.show(t('wrongCurrentPassword'),'error');
    if(n1.length < 6) return Toast.show(t('weakPassword'),'error');
    if(n1 !== n2){ err.classList.add('show'); return Toast.show(t('passwordMismatch'),'error'); }
    err.classList.remove('show');
    try {
      await DB.updateUser(u.id, { password:n1 });
      Session.set({ ...u, password:n1 });
      Modal.open(`<div class="order-success"><div class="order-success-icon"><i class="fa-solid fa-check"></i></div><h3 style="font-size:18px;font-weight:800;margin-bottom:8px">${t('passwordChanged')}</h3><p style="font-size:13px;color:var(--text-dim);margin-bottom:20px">${t('passwordChangedDesc')}</p><button class="btn btn-primary btn-block" onclick="Modal.close()">${t('close')}</button></div>`,'sm');
    } catch(e){ Toast.show(t('updateFailed'),'error'); }
  }
};

const Components = {
  productCard(p){
    const name = LANG==='bn' ? p.name : (p.nameEn||p.name);
    const sc = p.stock <= 0 ? 'out' : (p.stock < 10 ? 'low' : '');
    const st = p.stock <= 0 ? t('outOfStock') : t('inStock');
    const isNew = Date.now() - (p.createdAt||0) < 7*24*60*60*1000;
    let badge = '';
    if(p.discount) badge = `<span class="product-badge">-${p.discount}%</span>`;
    else if(isNew) badge = `<span class="product-badge new">NEW</span>`;
    return `<div class="product-card" onclick="App.go('product','${p.id}')"><div class="product-img-wrap"><img src="${p.img}" alt="${esc(name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300'">${badge}<span class="stock-badge ${sc}">${st}</span><button class="wish-btn ${Wish.has(p.id)?'active':''}" onclick="event.stopPropagation();Wish.toggle('${p.id}')"><i class="fa-${Wish.has(p.id)?'solid':'regular'} fa-heart"></i></button></div><div class="product-body"><span class="product-cat">${esc(LANG==='bn'?p.cat:(p.catEn||p.cat))}</span><h3 class="product-name">${esc(name)}</h3><div class="rating">${starHTML(p.rating||0,'11px')} <span>${p.reviewCount?`(${p.reviewCount})`:''}</span></div><div class="product-price"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><button class="btn btn-primary btn-block btn-sm" ${p.stock<=0?'disabled':''} onclick="event.stopPropagation();Cart.add('${p.id}')"><i class="fa-solid fa-cart-plus"></i> ${p.stock<=0?t('outOfStock'):t('addToCart')}</button></div></div>`;
  },
  orderCard(o){
    const flow = Orders.FLOW; const idx = flow.indexOf(o.status);
    const cancelled = ['cancelled','rejected'].includes(o.status);
    return `<div class="order-card"><div class="order-card-head"><div class="order-id-block"><h4><i class="fa-solid fa-receipt" style="color:var(--brand)"></i> ${o.id}</h4><p><i class="fa-regular fa-calendar"></i> ${new Date(o.date).toLocaleString(LANG==='bn'?'bn-BD':'en-US')} • ${(o.items||[]).length} ${t('items')}</p></div><div class="order-meta"><span class="order-amount">${money(o.total)}</span><span class="status-badge status-${o.status}"><i class="fa-solid ${Orders.icon(o.status)}"></i> ${Orders.label(o.status)}</span></div></div>${!cancelled?`<div class="order-timeline">${flow.map((s,i) => `<div class="timeline-step ${i<idx?'done':''} ${i===idx?'current':''}">${i<flow.length-1?'<div class="timeline-line"></div>':''}<div class="dot"><i class="fa-solid ${i<=idx?'fa-check':Orders.icon(s)}"></i></div><div class="label">${Orders.label(s)}</div></div>`).join('')}</div>`:''}<div class="invoice-actions"><button class="btn btn-outline btn-sm" onclick="Orders.detail('${o.id}')"><i class="fa-solid fa-eye"></i></button><button class="btn btn-pdf btn-sm" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button><button class="btn btn-whatsapp btn-sm" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i></button>${['delivered','cancelled','rejected'].includes(o.status)?`<button class="btn btn-outline btn-sm" onclick="Orders.reorder('${o.id}')"><i class="fa-solid fa-rotate-right"></i></button>`:''}</div></div>`;
  },
  adminSidebar(tab){
    const p = DB.orders.filter(o => o.status === 'pending').length;
    const items = [
      { sec:'Main', list:[
        { id:'dashboard', icon:'fa-chart-line', label:t('dashboard') },
        { id:'products', icon:'fa-box', label:t('products') },
        { id:'orders', icon:'fa-receipt', label:t('ordersTab'), badge:p },
        { id:'users', icon:'fa-users', label:t('users') }
      ]},
      { sec:'Extras', list:[
        { id:'reviews', icon:'fa-star', label:t('reviews') },
        { id:'categories', icon:'fa-tags', label:t('categories') },
        { id:'coupons', icon:'fa-ticket', label:t('coupons') },
        { id:'broadcast', icon:'fa-bullhorn', label:t('broadcastNotif') },
        { id:'settings', icon:'fa-gear', label:t('settings') }
      ]}
    ];
    return `<aside class="admin-sidebar"><div class="admin-brand"><div class="logo-icon"><i class="fa-solid fa-leaf"></i></div><span class="logo-text">EcoShop<span style="color:var(--brand)">Pro</span></span><span class="admin-pill">ADMIN</span></div><nav class="admin-nav">${items.map(g => `<div class="nav-section"><div class="nav-section-title">${g.sec}</div>${g.list.map(i => `<a class="${tab===i.id?'active':''}" onclick="Admin.switchTab('${i.id}')"><i class="fa-solid ${i.icon}"></i> ${i.label}${i.badge?`<span class="nav-count">${i.badge}</span>`:''}</a>`).join('')}</div>`).join('')}</nav><div class="admin-footer"><button class="admin-exit" onclick="App.go('home')"><i class="fa-solid fa-arrow-left"></i> Back</button></div></aside>`;
  }
};

const Admin = {
  titles:{ dashboard:'ড্যাশবোর্ড', products:'পণ্য', orders:'অর্ডার', users:'ইউজার', reviews:'রিভিউ', categories:'ক্যাটাগরি', coupons:'কুপন', broadcast:'ব্রডকাস্ট', settings:'সেটিংস' },
  switchTab(tab){ App._adminTab = tab; App.closeAll(); App.render(); },
  render(tab){
    try {
      switch(tab){
        case 'dashboard': return this.dashboard();
        case 'products': return this.products();
        case 'orders': return this.orders();
        case 'users': return this.users();
        case 'reviews': return this.reviews();
        case 'categories': return this.categories();
        case 'coupons': return this.coupons();
        case 'broadcast': return this.broadcast();
        case 'settings': return this.settings();
        default: return this.dashboard();
      }
    } catch(e){ return `<div style="background:rgba(239,68,68,.1);padding:14px;border-radius:10px;color:var(--danger)">${esc(e.message)}</div>`; }
  },
  dashboard(){
    const orders = DB.orders, users = DB.users, prods = DB.products;
    const sales = orders.filter(o => o.status !== 'cancelled').reduce((s,o) => s + (o.total||0), 0);
    const cnt = Orders.counts();
    const low = prods.filter(p => p.stock < 10).length;
    const days = 7; const pts = [];
    for(let i=days-1;i>=0;i--){
      const ds = new Date(); ds.setHours(0,0,0,0); ds.setDate(ds.getDate()-i);
      const de = new Date(ds); de.setDate(de.getDate()+1);
      const dayO = orders.filter(o => o.date >= ds.getTime() && o.date < de.getTime() && o.status !== 'cancelled');
      pts.push({ label:ds.toLocaleDateString(LANG==='bn'?'bn-BD':'en-US',{weekday:'short'}), sales:dayO.reduce((s,o)=>s+(o.total||0),0) });
    }
    const maxS = Math.max(...pts.map(d => d.sales), 100);
    const W = 600, H = 180, PAD = 20;
    const bars = pts.map((d,i) => {
      const x = PAD + i*((W-PAD*2)/pts.length) + ((W-PAD*2)/pts.length)*.15;
      const h = (d.sales/maxS)*(H-PAD*2);
      const y = H - PAD - h;
      const w = ((W-PAD*2)/pts.length)*.7;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#bg)"/>`;
    }).join('');
    return `<div class="chart-wrap"><div class="chart-header"><h3><i class="fa-solid fa-chart-line"></i> ${t('salesTrend')}</h3></div><svg class="chart-svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--brand)"/><stop offset="100%" stop-color="var(--brand-light)"/></linearGradient></defs>${bars}</svg><div class="chart-legend"><span>${t('totalSalesLabel')}: ${money(pts.reduce((s,d)=>s+d.sales,0))}</span></div></div><div class="stat-grid"><div class="stat-card"><div class="stat-icon brand"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div><div class="stat-info"><p>${t('totalSales')}</p><h3>${money(sales)}</h3></div></div><div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-cart-shopping"></i></div><div class="stat-info"><p>${t('totalOrders')}</p><h3>${orders.length}</h3></div></div><div class="stat-card"><div class="stat-icon warning"><i class="fa-solid fa-users"></i></div><div class="stat-info"><p>${t('totalUsers')}</p><h3>${users.length}</h3></div></div><div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-box"></i></div><div class="stat-info"><p>${t('totalProducts')}</p><h3>${prods.length}</h3></div></div></div><div class="stat-grid"><div class="stat-card" style="cursor:pointer" onclick="App._adminTab='orders';App._orderFilter.status='pending';App.render()"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${t('pendingOrders')}</p><h3>${cnt.pending}</h3></div></div><div class="stat-card"><div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="stat-info"><p>${t('lowStock')}</p><h3>${low}</h3></div></div><div class="stat-card"><div class="stat-icon info"><i class="fa-solid fa-user-check"></i></div><div class="stat-info"><p>${t('activeUsers')}</p><h3>${users.filter(u=>!u.blocked).length}</h3></div></div></div><div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-receipt"></i> ${t('recentOrders')}</h3><button class="btn btn-outline btn-sm" onclick="App._adminTab='orders';App.render()">${t('ordersTab')}</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>${t('orderId')}</th><th>Customer</th><th>${t('total')}</th><th>${t('orderStatus')}</th><th></th></tr></thead><tbody>${orders.slice(0,6).map(o => `<tr><td><b>${o.id}</b></td><td>${esc(o.customer?.name||'—')}</td><td>${money(o.total)}</td><td><span class="status-badge status-${o.status}">${Orders.label(o.status)}</span></td><td><div class="actions">${o.status==='pending'?`<button class="icon-btn-sm success" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>`:''}<button class="icon-btn-sm info" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button></div></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  products(){
    const q = App._pQuery || '';
    const list = DB.products.filter(p => !q || (p.name+(p.nameEn||'')).toLowerCase().includes(q.toLowerCase()));
    return `<div class="admin-toolbar"><input placeholder="${t('productSearch')}" value="${esc(q)}" oninput="App._pQuery=this.value;clearTimeout(window._pq);window._pq=setTimeout(()=>Admin.refreshContent(),250)"><button class="btn btn-primary" onclick="Admin.openProductModal()"><i class="fa-solid fa-plus"></i> ${t('addProduct')}</button></div><div class="admin-card"><div class="admin-card-head"><h3>${t('totalProducts')} (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th></th><th>${t('productName')}</th><th>${t('category')}</th><th>${t('price')}</th><th>${t('stock')}</th><th></th></tr></thead><tbody>${list.map(p => `<tr><td><img class="thumb" src="${p.img}" onerror="this.src='https://via.placeholder.com/44'"></td><td><b>${esc(p.name)}</b></td><td><span class="chip">${esc(p.cat)}</span></td><td>${money(p.price)}</td><td>${p.stock<=0?`<span class="chip blocked">${t('outOfStock')}</span>`:`<span class="chip active-status">${p.stock}</span>`}</td><td><div class="actions"><button class="icon-btn-sm" onclick="Admin.openProductModal('${p.id}')"><i class="fa-solid fa-pen"></i></button><button class="icon-btn-sm danger" onclick="Admin.deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  openProductModal(id){
    const p = id ? DB.products.find(x => x.id === id) : { name:'', nameEn:'', cat:'', price:'', oldPrice:'', discount:0, stock:'', img:'', desc:'', featured:false };
    const cats = DB.categories.length ? DB.categories : ['ইলেকট্রনিকস','গ্যাজেট','ফ্যাশন'];
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3>${id?t('editProduct'):t('addProduct')}</h3></div><div class="modal-body"><div class="form-row"><div class="form-group"><label>${t('productName')} *</label><input id="pName" value="${esc(p.name)}"></div><div class="form-group"><label>English Name</label><input id="pNameEn" value="${esc(p.nameEn||'')}"></div></div><div class="form-row"><div class="form-group"><label>${t('category')}</label><select id="pCat">${cats.map(c => `<option ${p.cat===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div><div class="form-group"><label>Category EN</label><input id="pCatEn" value="${esc(p.catEn||'')}"></div></div><div class="form-group"><label>${t('description')}</label><textarea id="pDesc" rows="3">${esc(p.desc||'')}</textarea></div><div class="form-group"><label>${t('images')}</label><div class="img-upload"><div class="img-preview" id="pImgPrev">${p.img?`<img src="${p.img}">`:`<i class="fa-solid fa-image"></i>`}</div><div class="upload-btn-wrap"><button type="button" class="upload-btn" id="pUpBtn"><i class="fa-solid fa-cloud-arrow-up"></i> Upload</button><input type="file" id="pFile" accept="image/*" style="display:none"></div></div><input type="hidden" id="pImg" value="${p.img||''}"></div><div class="form-row"><div class="form-group"><label>${t('price')} *</label><input id="pPrice" type="number" value="${p.price}"></div><div class="form-group"><label>${t('oldPrice')}</label><input id="pOld" type="number" value="${p.oldPrice||''}"></div></div><div class="form-row"><div class="form-group"><label>${t('discountPercent')}</label><input id="pDisc" type="number" value="${p.discount||0}"></div><div class="form-group"><label>${t('stock')}</label><input id="pStock" type="number" value="${p.stock}"></div></div><div class="form-group"><label style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" id="pFeat" ${p.featured?'checked':''} style="width:auto"><span>${t('featured_product')}</span></label></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" id="pSaveBtn" onclick="Admin.saveProduct('${id||''}')"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button></div>`);
    const b = document.getElementById('pUpBtn'); const f = document.getElementById('pFile');
    const pv = document.getElementById('pImgPrev'); const h = document.getElementById('pImg');
    if(b){ b.onclick = () => f.click(); f.onchange = async () => {
      const file = f.files[0]; if(!file) return;
      const r = new FileReader(); r.onload = e => pv.innerHTML = `<img src="${e.target.result}">`; r.readAsDataURL(file);
      try { const res = await ImageUpload.upload(file); h.value = res.url; pv.innerHTML = `<img src="${res.url}">`; Toast.show(t('imgUploadSuccess'),'success'); }
      catch(e){ Toast.show(t('imgUploadFailed'),'error'); }
    }; }
  },
  async saveProduct(id){
    const data = {
      id:id||'', name:document.getElementById('pName').value.trim(), nameEn:document.getElementById('pNameEn').value.trim(),
      cat:document.getElementById('pCat').value, catEn:document.getElementById('pCatEn').value.trim(),
      price:+document.getElementById('pPrice').value||0, oldPrice:+document.getElementById('pOld').value||0,
      discount:+document.getElementById('pDisc').value||0, stock:+document.getElementById('pStock').value||0,
      img:document.getElementById('pImg').value.trim()||'https://via.placeholder.com/300',
      desc:document.getElementById('pDesc').value.trim(), featured:document.getElementById('pFeat').checked
    };
    if(!data.name || !data.price) return Toast.show(t('fillAllFields'),'error');
    try { await DB.saveProduct(data); Modal.close(); Toast.show(t('saveSuccess'),'success'); }
    catch(e){ Toast.show('Failed','error'); }
  },
  deleteProduct(id){ Modal.confirm(t('confirmDelete'), async () => { try { await DB.deleteProduct(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },
  orders(){
    App._orderFilter = App._orderFilter || { status:'all', payment:'all', search:'', from:'', to:'' };
    App._selectedOrders = App._selectedOrders || [];
    const f = App._orderFilter;
    const cnt = Orders.counts();
    let list = DB.orders.slice();
    if(f.status !== 'all') list = list.filter(o => o.status === f.status);
    if(f.payment !== 'all') list = list.filter(o => (o.paymentMethod||'cod') === f.payment);
    if(f.search){ const s = f.search.toLowerCase(); list = list.filter(o => o.id.toLowerCase().includes(s) || (o.customer?.name||'').toLowerCase().includes(s) || (o.customer?.phone||'').includes(f.search)); }
    const sel = App._selectedOrders;
    return `<div class="stat-grid"><div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='pending';Admin.refreshContent()"><div class="stat-icon warning"><i class="fa-solid fa-clock"></i></div><div class="stat-info"><p>${Orders.label('pending')}</p><h3>${cnt.pending}</h3></div></div><div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='confirmed';Admin.refreshContent()"><div class="stat-icon brand"><i class="fa-solid fa-check-circle"></i></div><div class="stat-info"><p>${Orders.label('confirmed')}</p><h3>${cnt.confirmed}</h3></div></div><div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='shipped';Admin.refreshContent()"><div class="stat-icon info"><i class="fa-solid fa-truck"></i></div><div class="stat-info"><p>${Orders.label('shipped')}</p><h3>${cnt.shipped}</h3></div></div><div class="stat-card" style="cursor:pointer" onclick="App._orderFilter.status='delivered';Admin.refreshContent()"><div class="stat-icon success"><i class="fa-solid fa-circle-check"></i></div><div class="stat-info"><p>${Orders.label('delivered')}</p><h3>${cnt.delivered}</h3></div></div></div><div class="order-filter-panel"><div class="order-filter-grid"><div><label>${t('filterStatus')}</label><select onchange="App._orderFilter.status=this.value;Admin.refreshContent()"><option value="all">All</option>${Orders.ALL.map(s => `<option value="${s}" ${f.status===s?'selected':''}>${Orders.label(s)} (${cnt[s]||0})</option>`).join('')}</select></div><div><label>${t('filterSearch')}</label><input value="${esc(f.search)}" oninput="App._orderFilter.search=this.value;clearTimeout(window._os);window._os=setTimeout(()=>Admin.refreshContent(),250)"></div></div><div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="App._orderFilter={status:'all',payment:'all',search:'',from:'',to:''};Admin.refreshContent()">${t('filterReset')}</button></div></div>${sel.length?`<div class="bulk-bar"><span>${sel.length} ${t('bulkSelected')}</span><button class="btn btn-sm btn-success" onclick="Admin.bulkConfirm()"><i class="fa-solid fa-check"></i></button><button class="btn btn-sm btn-danger" onclick="Admin.bulkCancel()"><i class="fa-solid fa-ban"></i></button><button class="btn btn-sm btn-outline" onclick="App._selectedOrders=[];Admin.refreshContent()">${t('cancel')}</button></div>`:''}<div class="admin-card"><div class="admin-card-head"><h3>${t('ordersTab')} (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th style="width:40px"><input type="checkbox" onchange="Admin.toggleAllOrders(this.checked, ${JSON.stringify(list.map(o=>o.id))})"></th><th>ID</th><th>Customer</th><th>${t('total')}</th><th>${t('orderStatus')}</th><th></th></tr></thead><tbody>${list.length ? list.map(o => `<tr style="${o.status==='pending'?'background:rgba(245,158,11,.05)':''}"><td><input type="checkbox" ${sel.includes(o.id)?'checked':''} onchange="Admin.toggleSelect('${o.id}', this.checked)"></td><td><b>${o.id}</b><br><small style="color:var(--text-dim);font-size:11px">${new Date(o.date).toLocaleDateString()}</small></td><td><b>${esc(o.customer?.name||'—')}</b></td><td><b>${money(o.total)}</b></td><td><span class="status-badge status-${o.status}">${Orders.label(o.status)}</span></td><td><div class="actions">${o.status==='pending'?`<button class="icon-btn-sm success" onclick="Admin.quickConfirm('${o.id}')"><i class="fa-solid fa-check"></i></button>`:''}<button class="icon-btn-sm info" onclick="Admin.openOrderModal('${o.id}')"><i class="fa-solid fa-eye"></i></button><button class="icon-btn-sm danger" onclick="Admin.deleteOrder('${o.id}')"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('') : `<tr><td colspan="6" class="muted">${t('noData')}</td></tr>`}</tbody></table></div></div>`;
  },
  openOrderModal(id){
    const o = DB.orders.find(x => x.id === id); if(!o) return;
    const flow = Orders.FLOW; const idx = flow.indexOf(o.status);
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-receipt"></i> ${o.id}</h3></div><div class="modal-body"><div class="admin-card" style="padding:12px;margin-bottom:12px"><h5 style="font-size:11.5px;font-weight:800;color:var(--text-dim);text-transform:uppercase;margin-bottom:8px">${t('changeStatus')}</h5><div style="display:flex;gap:5px;flex-wrap:wrap">${Orders.ALL.map(s => `<button class="chip" style="cursor:pointer;border:${o.status===s?'2px solid var(--brand)':'1px solid var(--border)'};background:${o.status===s?'var(--brand-50)':'var(--surface)'}" onclick="Admin.setStatus('${o.id}', '${s}')"><i class="fa-solid ${Orders.icon(s)}"></i> ${Orders.label(s)}</button>`).join('')}</div></div><div class="order-detail-grid"><div class="order-detail-section"><h5><i class="fa-solid fa-user"></i> ${t('customerInfo')}</h5><div class="detail-row"><span>Name</span><span>${esc(o.customer.name)}</span></div><div class="detail-row"><span>Phone</span><span>${esc(o.customer.phone)}</span></div><div class="detail-row"><span>Address</span><span>${esc(o.customer.address)}</span></div></div><div class="order-detail-section"><h5><i class="fa-solid fa-credit-card"></i> ${t('paymentDetails')}</h5><div class="detail-row"><span>Method</span><span>${(o.paymentMethod||'cod').toUpperCase()}</span></div>${o.txnId?`<div class="detail-row"><span>Txn</span><span>${esc(o.txnId)}</span></div>`:''}</div><div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-box"></i> Items</h5>${(o.items||[]).map(it => `<div class="order-item-row"><div class="order-item-info"><h6>${esc(it.name)}</h6><p>${it.qty} × ${money(it.price)}</p></div><span class="order-item-price">${money(it.qty*it.price)}</span></div>`).join('')}</div><div class="order-detail-section" style="grid-column:1/-1"><h5><i class="fa-solid fa-clock-rotate-left"></i> ${t('orderHistory')}</h5><ul class="order-history">${(o.history||[]).slice().reverse().map((h,i) => `<li class="${i===0?'current':''}"><span class="h-dot"></span><h6>${Orders.label(h.status)}</h6><small>${new Date(h.time).toLocaleString()}${h.by?' • '+h.by:''}</small>${h.comment?`<div class="h-comment">${esc(h.comment)}</div>`:''}</li>`).join('')}</ul></div></div></div><div class="modal-foot"><button class="btn btn-pdf btn-block" onclick="PDFInvoice.generate('${o.id}')"><i class="fa-solid fa-file-pdf"></i></button><button class="btn btn-whatsapp btn-block" onclick="WhatsApp.send(DB.orders.find(x=>x.id==='${o.id}'), '${o.customer.phone}')"><i class="fa-brands fa-whatsapp"></i></button><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('close')}</button></div>`,'lg');
  },
  setStatus(id, status){
    const cmt = { confirmed:t('confirmedByAdmin'), processing:t('processingStarted'), shipped:t('shippedByCourier'), out_for_delivery:t('outForDelivery'), delivered:t('deliveredSuccess'), cancelled:t('cancelledByAdmin'), rejected:t('rejectedByAdmin') };
    Modal.confirm(LANG==='bn'?`"${Orders.label(status)}" করতে চান?`:`Change to "${Orders.label(status)}"?`, async () => {
      try {
        if(status === 'rejected') await Orders.reject(id, cmt[status]);
        else if(status === 'cancelled') await Orders.cancel(id, cmt[status]);
        else await Orders.updateStatus(id, status, cmt[status]);
        Toast.show(t('saveSuccess'),'success'); Modal.close(); Admin.refreshContent();
      } catch(e){ Toast.show('Failed','error'); }
    });
  },
  async quickConfirm(id){ try { await Orders.updateStatus(id, 'confirmed', t('confirmedByAdmin')); Toast.show('✅','success'); Admin.refreshContent(); } catch(e){} },
  toggleSelect(id, c){ App._selectedOrders = App._selectedOrders || []; if(c && !App._selectedOrders.includes(id)) App._selectedOrders.push(id); else if(!c) App._selectedOrders = App._selectedOrders.filter(x => x !== id); Admin.refreshContent(); },
  toggleAllOrders(c, ids){ App._selectedOrders = c ? [...ids] : []; Admin.refreshContent(); },
  async bulkConfirm(){ const ids = App._selectedOrders || []; if(!ids.length) return; Modal.confirm(`${ids.length} confirm?`, async () => { try { for(const id of ids) await Orders.updateStatus(id, 'confirmed', t('confirmedByAdmin')); Toast.show('✅','success'); App._selectedOrders = []; Admin.refreshContent(); } catch(e){} }); },
  async bulkCancel(){ const ids = App._selectedOrders || []; if(!ids.length) return; Modal.confirm(`${ids.length} cancel?`, async () => { try { for(const id of ids) await Orders.cancel(id, t('cancelledByAdmin')); Toast.show('✅','success'); App._selectedOrders = []; Admin.refreshContent(); } catch(e){} }); },
  deleteOrder(id){ Modal.confirm(t('confirmDelete'), async () => { try { await Orders.remove(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },
  users(){
    const q = (App._uQuery||'').toLowerCase();
    const list = DB.users.filter(u => !q || (u.name+u.email).toLowerCase().includes(q));
    return `<div class="admin-toolbar"><input placeholder="${t('userSearch')}" value="${esc(App._uQuery||'')}" oninput="App._uQuery=this.value;clearTimeout(window._uq);window._uq=setTimeout(()=>Admin.refreshContent(),250)"></div><div class="admin-card"><div class="admin-card-head"><h3>${t('totalUsers')} (${list.length})</h3></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th></th><th>${t('fullName')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('active')}</th><th></th></tr></thead><tbody>${list.map(u => `<tr><td><img class="thumb" style="border-radius:50%" src="${u.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=U'"></td><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td><span class="chip ${u.role==='admin'?'active-status':''}">${u.role}</span></td><td>${u.blocked?`<span class="chip blocked">${t('blocked')}</span>`:`<span class="chip active-status">${t('active')}</span>`}</td><td><div class="actions"><button class="icon-btn-sm ${u.blocked?'success':''}" onclick="Admin.toggleBlock('${u.id}')"><i class="fa-solid ${u.blocked?'fa-unlock':'fa-ban'}"></i></button>${u.role!=='admin'?`<button class="icon-btn-sm danger" onclick="Admin.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>`:''}</div></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  async toggleBlock(id){ const u = DB.users.find(x => x.id === id); if(!u || u.role === 'admin') return; try { await DB.updateUser(id, { blocked: !u.blocked }); Toast.show(t('saveSuccess'),'success'); } catch(e){} },
  deleteUser(id){ Modal.confirm(t('confirmDelete'), async () => { try { await DB.deleteUser(id); Toast.show(t('deleteSuccess'),'success'); } catch(e){} }); },
  reviews(){
    const list = DB.reviews.sort((a,b) => (b.date||0) - (a.date||0));
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-star"></i> ${t('productReviews')} (${list.length})</h3></div>${list.length ? list.map(r => { const p = DB.products.find(x => x.id === r.productId); const u = DB.users.find(x => x.id === r.userId); return `<div style="padding:12px;border-bottom:1px solid var(--border);display:flex;gap:12px"><img src="${u?.avatar||'https://ui-avatars.com/api/?name=U'}" style="width:42px;height:42px;border-radius:50%;object-fit:cover"><div style="flex:1"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:4px"><b>${esc(r.userName||'User')}</b><span class="rating">${starHTML(r.rating,'12px')}</span></div><p style="font-size:12.5px;color:var(--text-dim);line-height:1.5">${esc(r.text)}</p><small style="font-size:11px;color:var(--text-soft)">${p?`<i class="fa-solid fa-box"></i> ${esc(p.name)} • `:''}${timeAgo(r.date)}</small></div><button class="icon-btn-sm danger" onclick="Admin.deleteReview('${r.id}')"><i class="fa-solid fa-trash"></i></button></div>`; }).join('') : `<p class="muted">${t('noData')}</p>`}</div>`;
  },
  deleteReview(id){ Modal.confirm(t('confirmDelete'), async () => { try { await DB.removeReview(id); Toast.show(t('deleteSuccess'),'success'); Admin.refreshContent(); } catch(e){} }); },
  categories(){
    const keys = Object.entries(DB.catRaw);
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-tags"></i> ${t('categories')}</h3></div><div class="admin-toolbar"><input id="newCat" placeholder="${t('categoryName')}"><button class="btn btn-primary" onclick="Admin.addCat()"><i class="fa-solid fa-plus"></i> ${t('addCategory')}</button></div><div style="display:flex;gap:9px;flex-wrap:wrap">${keys.map(([k,v]) => `<div class="chip" style="padding:9px 15px;font-size:13px">${esc(v)}<button onclick="Admin.delCat('${k}')" style="border:none;background:none;color:var(--text-dim);margin-left:8px;cursor:pointer"><i class="fa-solid fa-xmark"></i></button></div>`).join('')}</div></div>`;
  },
  async addCat(){ const v = document.getElementById('newCat').value.trim(); if(!v) return; try { await DB.saveCategory(v); Toast.show(t('saveSuccess'),'success'); } catch(e){} },
  delCat(k){ Modal.confirm(t('confirmDelete'), async () => { try { await DB.deleteCategory(k); } catch(e){} }); },
  coupons(){
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-ticket"></i> ${t('coupons')}</h3></div><div class="admin-toolbar"><input id="cCode" placeholder="${t('couponCode')}"><select id="cType"><option value="percent">${t('percentOff')}</option><option value="flat">${t('flatOff')}</option></select><input id="cVal" type="number" placeholder="${t('price')}"><button class="btn btn-primary" onclick="Admin.addCoupon()"><i class="fa-solid fa-plus"></i> ${t('addCoupon')}</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>${t('couponCode')}</th><th>Type</th><th>Value</th><th></th></tr></thead><tbody>${DB.coupons.map(c => `<tr><td><b>${esc(c.code)}</b></td><td><span class="chip">${c.type}</span></td><td>${c.type==='percent'?c.value+'%':money(c.value)}</td><td><button class="icon-btn-sm danger" onclick="Admin.delCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div></div>`;
  },
  async addCoupon(){ const code = document.getElementById('cCode').value.trim().toUpperCase(); const type = document.getElementById('cType').value; const value = +document.getElementById('cVal').value; if(!code || !value) return Toast.show(t('fillAllFields'),'error'); try { await DB.saveCoupon({ code, type, value }); Toast.show(t('saveSuccess'),'success'); } catch(e){} },
  async delCoupon(id){ try { await DB.deleteCoupon(id); } catch(e){} },
  broadcast(){
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-bullhorn"></i> ${t('broadcastNotif')}</h3></div><p style="font-size:13px;color:var(--text-dim);margin-bottom:14px">${t('broadcastDesc')}</p><div class="form-group"><label>${t('broadcastTitle')} *</label><input id="bcTitle" placeholder="${LANG==='bn'?'যেমন: নতুন অফার!':'e.g. New Offer!'}"></div><div class="form-group"><label>${t('broadcastBody')} *</label><textarea id="bcBody" rows="4" placeholder="${LANG==='bn'?'মেসেজ লিখুন...':'Write message...'}"></textarea></div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn btn-pink btn-lg" onclick="Admin.sendBroadcast()"><i class="fa-solid fa-paper-plane"></i> ${t('sendBroadcast')}</button><span style="font-size:13px;color:var(--text-dim)">${t('recipients')}: <b>${DB.users.length}</b></span></div></div>`;
  },
  openBroadcastModal(){
    Modal.open(`<button class="modal-close" onclick="Modal.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-bullhorn"></i> ${t('broadcastNotif')}</h3></div><div class="modal-body"><div class="form-group"><label>${t('broadcastTitle')} *</label><input id="bcTitleModal" placeholder="${LANG==='bn'?'নতুন অফার!':'New Offer!'}"></div><div class="form-group"><label>${t('broadcastBody')} *</label><textarea id="bcBodyModal" rows="4" placeholder="${LANG==='bn'?'মেসেজ...':'Message...'}"></textarea></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="Modal.close()">${t('cancel')}</button><button class="btn btn-pink btn-block" onclick="Admin.sendBCModal()"><i class="fa-solid fa-paper-plane"></i> ${t('sendBroadcast')}</button></div>`);
  },
  async sendBroadcast(){
    const title = document.getElementById('bcTitle').value.trim();
    const body = document.getElementById('bcBody').value.trim();
    if(!title || !body) return Toast.show(t('fillAllFields'),'error');
    try { await DB.broadcastNotif(title, body); Toast.show(t('broadcastSent'),'success',4000); Admin.refreshContent(); }
    catch(e){ Toast.show(t('broadcastFailed'),'error'); }
  },
  async sendBCModal(){
    const title = document.getElementById('bcTitleModal').value.trim();
    const body = document.getElementById('bcBodyModal').value.trim();
    if(!title || !body) return Toast.show(t('fillAllFields'),'error');
    try { await DB.broadcastNotif(title, body); Modal.close(); Toast.show(t('broadcastSent'),'success',4000); }
    catch(e){ Toast.show(t('broadcastFailed'),'error'); }
  },
  settings(){
    const s = DB.settings;
    return `<div class="admin-card"><div class="admin-card-head"><h3><i class="fa-solid fa-gear"></i> ${t('settings')}</h3></div><div class="form-group"><label>${t('siteName')}</label><input id="stName" value="${esc(s.siteName||'')}"></div><div class="form-group"><label>${t('supportPhone')}</label><input id="stPhone" value="${esc(s.supportPhone||'')}"></div><div class="form-group"><label>WhatsApp</label><input id="stWa" value="${esc(s.whatsappNumber||'')}"></div><div class="form-row"><div class="form-group"><label>${t('insideDhaka')} (৳)</label><input id="stIn" type="number" value="${s.shippingInsideDhaka||100}"></div><div class="form-group"><label>${t('outsideDhaka')} (৳)</label><input id="stOut" type="number" value="${s.shippingOutsideDhaka||120}"></div></div><div class="form-group"><label>${t('bkash')}</label><input id="stB" value="${esc(s.bkashNumber||'')}"></div><div class="form-group"><label>${t('nagad')}</label><input id="stN" value="${esc(s.nagadNumber||'')}"></div><div class="form-group"><label>${t('rocket')}</label><input id="stR" value="${esc(s.rocketNumber||'')}"></div><button class="btn btn-primary" onclick="Admin.saveSettings()"><i class="fa-solid fa-floppy-disk"></i> ${t('save')}</button></div>`;
  },
  async saveSettings(){
    const settings = { ...DB.settings, siteName:document.getElementById('stName').value.trim(), supportPhone:document.getElementById('stPhone').value.trim(), whatsappNumber:document.getElementById('stWa').value.trim(), shippingInsideDhaka:+document.getElementById('stIn').value||100, shippingOutsideDhaka:+document.getElementById('stOut').value||120, bkashNumber:document.getElementById('stB').value.trim(), nagadNumber:document.getElementById('stN').value.trim(), rocketNumber:document.getElementById('stR').value.trim() };
    try { await DB.saveSettings(settings); Toast.show(t('settingsSaved'),'success'); } catch(e){ Toast.show('Failed','error'); }
  },
  refreshContent(){ const el = document.getElementById('adminContent'); if(el) el.innerHTML = this.render(App._adminTab||'dashboard'); }
};

const AuthUI = {
  tab(w){
    App._authTab = w; App._otpStep = null; App._pendingReg = null; OTP.reset();
    document.getElementById('tabL').classList.toggle('active', w === 'login');
    document.getElementById('tabR').classList.toggle('active', w === 'reg');
    document.getElementById('authForm').innerHTML = w === 'login' ? this.loginForm(App._authRedirect||'home') : this.regForm(App._authRedirect||'home');
  },
  loginForm(redirect='home'){
    return `<form onsubmit="AuthUI.doLogin(event, '${redirect}')"><div class="form-group"><label>${t('email')}</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="aEmail" required placeholder="you@example.com"></div></div><div class="form-group"><label>${t('password')}</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="aPass" required placeholder="••••••"><button type="button" class="toggle-pass" onclick="AuthUI.toggle('aPass', this)"><i class="fa-solid fa-eye"></i></button></div></div><div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button type="button" class="forgot-password-link" onclick="PwdReset.open()"><i class="fa-solid fa-key"></i> ${t('forgotPassword')}</button></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSub">${t('login')} <i class="fa-solid fa-arrow-right"></i></button></form>`;
  },
  regForm(redirect='home'){
    if(App._otpStep === 'verify' && OTP.email) return this.otpForm(redirect);
    return `<form onsubmit="AuthUI.sendOTP(event, '${redirect}')" novalidate><div class="reg-steps"><div class="reg-step active"><span class="reg-step-num">1</span><span class="reg-step-label">Info</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div></div><div class="form-group"><label>${t('fullName')} *</label><div class="input-wrap"><i class="fa-solid fa-user input-icon"></i><input id="rName" required></div></div><div class="form-group"><label>${t('email')} *</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="rEmail" required oninput="AuthUI.checkEmail(this.value)"></div><div class="form-hint" id="emailHint"></div></div><div class="form-group"><label>${t('phone')}</label><div class="input-wrap"><i class="fa-solid fa-phone input-icon"></i><input id="rPhone" placeholder="017XXXXXXXX"></div></div><div class="form-group"><label>${t('password')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="rPass" required minlength="6"><button type="button" class="toggle-pass" onclick="AuthUI.toggle('rPass', this)"><i class="fa-solid fa-eye"></i></button></div></div><div class="form-group"><label>${t('confirmPassword')} *</label><div class="input-wrap"><i class="fa-solid fa-lock input-icon"></i><input type="password" id="rPass2" required></div><div class="form-error" id="passErr">${t('passwordMismatch')}</div></div><div class="form-group"><label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:12.5px"><input type="checkbox" id="rTerms" required style="width:auto;margin-top:3px"><span>${t('agreeTerms')}</span></label></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="rSendBtn"><i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}</button></form>`;
  },
  otpForm(redirect='home'){
    return `<form onsubmit="AuthUI.verify(event, '${redirect}')" novalidate><div class="reg-steps"><div class="reg-step done"><span class="reg-step-num"><i class="fa-solid fa-check"></i></span><span class="reg-step-label">Info</span></div><div class="reg-step-line done"></div><div class="reg-step active"><span class="reg-step-num">2</span><span class="reg-step-label">OTP</span></div><div class="reg-step-line"></div><div class="reg-step"><span class="reg-step-num">3</span><span class="reg-step-label">Done</span></div></div><div class="otp-header"><div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div><h3>${t('verifyEmail')}</h3><p>${t('weSentCode')}<br><b>${OTP.mask(OTP.email)}</b></p></div><div class="otp-inputs" id="otpInputs">${[0,1,2,3,4,5].map(i => `<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpIn(this)" onkeydown="AuthUI.otpKey(event,this)" onpaste="AuthUI.otpPaste(event)">`).join('')}</div><div class="otp-timer"><i class="fa-solid fa-clock"></i><span>${t('otpValidTime')}</span></div><button type="submit" class="btn btn-primary btn-block btn-lg" id="otpBtn"><i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}</button><div class="otp-actions"><button type="button" class="btn-link" id="otpResend" onclick="AuthUI.resend()" disabled><i class="fa-solid fa-rotate-right"></i> <span id="otpResendText">${t('resendOTP')}</span></button><button type="button" class="btn-link" onclick="AuthUI.back()"><i class="fa-solid fa-arrow-left"></i> ${t('changeInfo')}</button></div></form>`;
  },
  checkEmail(email){
    const h = document.getElementById('emailHint'); if(!h) return;
    h.textContent = ''; h.style.color = '';
    const target = Auth.norm(email);
    if(!target || target.length < 5 || !target.includes('@')) return;
    if(!DB.ready.users){ h.textContent = t('dataLoadingWait'); h.style.color='var(--text-dim)'; return; }
    const s = Auth.emailStatus(target);
    if(s === 'taken'){ h.textContent = t('emailTaken'); h.style.color = 'var(--danger)'; }
    else if(s === 'free'){ h.textContent = t('emailAvailable'); h.style.color = 'var(--success)'; }
  },
  otpIn(el){ const v = el.value.replace(/\D/g,''); el.value = v.slice(0,1); el.classList.toggle('filled', !!el.value); if(v){ const i = +el.dataset.idx; const nx = document.querySelector(`.otp-inputs input[data-idx="${i+1}"]`); nx ? nx.focus() : el.blur(); } },
  otpKey(e, el){ const i = +el.dataset.idx; if(e.key === 'Backspace' && !el.value){ const p = document.querySelector(`.otp-inputs input[data-idx="${i-1}"]`); if(p){ p.focus(); p.value = ''; p.classList.remove('filled'); } } },
  otpPaste(e){ e.preventDefault(); const text = (e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6); const inps = document.querySelectorAll('.otp-inputs input'); text.split('').forEach((ch,i) => { if(inps[i]){ inps[i].value = ch; inps[i].classList.add('filled'); } }); (Array.from(inps).find(i => !i.value) || inps[inps.length-1]).focus(); },
  getOTP(){ return Array.from(document.querySelectorAll('.otp-inputs input')).map(i => i.value).join(''); },
  clearOTP(){ document.querySelectorAll('.otp-inputs input').forEach(i => { i.value = ''; i.classList.remove('filled'); }); },
  async sendOTP(e, redirect){
    if(e) e.preventDefault();
    const name = document.getElementById('rName').value.trim();
    const email = Auth.norm(document.getElementById('rEmail').value);
    const phone = document.getElementById('rPhone').value.trim();
    const pass = document.getElementById('rPass').value;
    const pass2 = document.getElementById('rPass2').value;
    const terms = document.getElementById('rTerms').checked;
    const err = document.getElementById('passErr');
    if(!name || !email || !pass) return Toast.show(t('fillAllFields'),'error');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Toast.show(t('invalidEmail'),'error');
    if(pass !== pass2){ err.classList.add('show'); return Toast.show(t('passwordMismatch'),'error'); }
    err.classList.remove('show');
    if(pass.length < 6) return Toast.show(t('weakPassword'),'error');
    if(!terms) return Toast.show(t('agreeToTerms'),'warning');
    if(!DB.ready.users) return Toast.show(t('dataLoadingWait'),'warning');
    if(Auth.isTaken(email)){ Toast.show(t('emailExists'),'error',4000); setTimeout(() => { App._authTab = 'login'; App.render(); }, 600); return; }
    App._pendingReg = { name, email, phone, password: pass };
    const btn = document.getElementById('rSendBtn'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i> ${t('otpSending')}`;
    const r = await OTP.send(email, name);
    if(!r.ok){ Toast.show(t('otpFailed') + ': ' + r.msg,'error',6000); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('sendOTP')}`; return; }
    Toast.show(t('otpSent'),'success');
    App._otpStep = 'verify'; App._authRedirect = redirect; App.render();
    setTimeout(() => { document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.cd(60); }, 300);
  },
  cd(sec){
    const b = document.getElementById('otpResend'); const txt = document.getElementById('otpResendText'); if(!b || !txt) return;
    b.disabled = true;
    OTP.cooldown(sec, r => { txt.textContent = r > 0 ? `${t('resendOTP')} (${r}s)` : t('resendOTP'); if(r <= 0) b.disabled = false; });
  },
  async verify(e, redirect){
    if(e) e.preventDefault();
    const code = this.getOTP();
    if(code.length !== 6) return Toast.show(t('enterFullCode'),'warning');
    const btn = document.getElementById('otpBtn'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    const r = await OTP.verify(code);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('verifyOTP')}`; return; }
    const p = App._pendingReg;
    if(!p) return Toast.show('Session lost','error');
    const reg = await Auth.register(p);
    if(!reg.ok){ Toast.show(reg.msg,'error'); btn.disabled = false; return; }
    OTP.reset(); App._pendingReg = null; App._otpStep = null; App._authRedirect = null;
    Toast.show(t('registrationSuccess') + ' ' + reg.user.name,'success',4000);
    setTimeout(() => App.go(redirect && redirect !== 'home' ? redirect : 'home'), 600);
  },
  async resend(){
    const p = App._pendingReg; if(!p) return;
    const b = document.getElementById('otpResend'); b.disabled = true;
    const txt = document.getElementById('otpResendText'); txt.textContent = t('otpSending');
    OTP.attempts = 0;
    const r = await OTP.send(p.email, p.name);
    if(!r.ok){ Toast.show('Failed','error'); b.disabled = false; txt.textContent = t('resendOTP'); return; }
    Toast.show(t('otpSent'),'success'); this.clearOTP(); this.cd(60);
  },
  back(){ App._otpStep = null; OTP.reset(); App.render(); },
  toggle(id, btn){
    const input = document.getElementById(id); if(!input) return;
    const show = input.type === 'password'; input.type = show ? 'text' : 'password';
    btn.innerHTML = `<i class="fa-solid fa-eye${show?'-slash':''}"></i>`;
  },
  pwd(val){
    let s = 0;
    if(val.length >= 6) s++;
    if(val.length >= 10) s++;
    if(/[A-Z]/.test(val) && /[a-z]/.test(val)) s++;
    if(/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) s++;
    const bars = [1,2,3,4].map(i => document.getElementById('pwdBar'+i));
    const cls = s <= 1 ? 'weak' : s <= 3 ? 'medium' : 'strong';
    bars.forEach((b,i) => { if(b) b.className = 'pwd-bar' + (i < s ? ' ' + cls : ''); });
    const txt = document.getElementById('pwdText');
    if(txt) txt.textContent = s ? cls : 'Strength';
  },
  async doLogin(e, redirect){
    e.preventDefault();
    const btn = document.getElementById('loginSub'); btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    const r = await Auth.login(document.getElementById('aEmail').value, document.getElementById('aPass').value);
    if(!r.ok){ Toast.show(r.msg,'error'); btn.disabled = false; btn.innerHTML = `${t('login')} <i class="fa-solid fa-arrow-right"></i>`; return; }
    Toast.show(t('loginSuccess') + ', ' + r.user.name,'success');
    const target = r.user.role === 'admin' ? 'admin' : (redirect && redirect !== 'home' ? redirect : 'home');
    App._authRedirect = null; App.go(target);
  }
};

const PwdReset = {
  step:1, email:null, code:null, exp:0, att:0, timer:null, verified:false,
  open(){ this.reset(); this.step = 1; this.render(); },
  close(){ Modal.close(); this.reset(); if(this.timer) clearInterval(this.timer); },
  reset(){ this.step = 1; this.email = null; this.code = null; this.exp = 0; this.att = 0; this.verified = false; },
  render(){ this.step === 1 ? this.r1() : this.step === 2 ? this.r2() : this.r3(); },
  r1(){
    Modal.open(`<button class="modal-close" onclick="PwdReset.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-key"></i> ${t('resetPassword')}</h3></div><div class="modal-body"><p style="font-size:13px;color:var(--text-dim);text-align:center;margin-bottom:14px">${t('resetPasswordDesc')}</p><div class="form-group"><label>${t('email')}</label><div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i><input type="email" id="prEmail" placeholder="you@example.com" autofocus></div><div class="form-hint" id="prHint"></div></div></div><div class="modal-foot"><button class="btn btn-outline btn-block" onclick="PwdReset.close()">${t('cancel')}</button><button class="btn btn-primary btn-block" onclick="PwdReset.send()"><i class="fa-solid fa-paper-plane"></i> ${t('sendCode')}</button></div>`);
  },
  async send(){
    const email = Auth.norm(document.getElementById('prEmail').value);
    const h = document.getElementById('prHint');
    if(!email) return Toast.show(t('invalidEmail'),'error');
    if(!DB.ready.users) return;
    const u = DB.users.find(x => Auth.norm(x.email) === email);
    if(!u){ if(h){ h.textContent = t('noAccountWithEmail'); h.style.color='var(--danger)'; } return; }
    const code = OTP.gen();
    this.email = email; this.code = code; this.exp = Date.now() + 10*60*1000; this.att = 0; this.verified = false;
    if(!OTP.init()) return;
    try {
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { to_email:email, email, reply_to:email, otp_code:code, code, user_name:u.name, site_name:'EcoShop Pro MAX' });
      Toast.show(t('otpSent'),'success');
      this.step = 2; this.render();
      setTimeout(() => { document.querySelector('.otp-inputs input[data-idx="0"]')?.focus(); this.cd(60); }, 250);
    } catch(e){ Toast.show(t('otpFailed'),'error',6000); }
  },
  r2(){
    Modal.open(`<button class="modal-close" onclick="PwdReset.close()"><i class="fa-solid fa-xmark"></i></button><div class="modal-head"><h3><i class="fa-solid fa-shield-halved"></i> ${t('verifyOTP')}</h3></div><div class="modal-body"><div class="otp-header"><div class="otp-icon"><i class="fa-solid fa-envelope-circle-check"></i></div><h3>${t('verifyEmail')}</h3><p>${t('weSentCode')}<br><b>${OTP.mask(this.email)}</b></p></div><div class="otp-inputs" id="otpInputs">${[0,1,2,3,4,5].map(i => `<input type="text" inputmode="numeric" maxlength="1" data-idx="${i}" oninput="AuthUI.otpIn(this)" onkeydown="AuthUI.otpKey(event,this)" onpaste="AuthUI.otpPaste(event)">`).join('')}</div></div><div class="modal-foot"><button class="btn btn-outline" style="flex:1" onclick="PwdReset.step=1;PwdReset.render()">${t('back')}</button><button class="btn btn-outline" style="flex:1" id="prResend" onclick="PwdReset.resend()" disabled>${t('resendOTP')}</button><button class="btn btn-primary" style="flex:1" onclick="PwdReset.verify()">${t('verifyOTP')}</button></div>`);
  },
  verify(){
    const code = AuthUI.getOTP();
    if(code.length !== 6) return Toast.show(t('enterFullCode'),'warning');
    if(Date.now() > this.exp) return Toast.show('Expired','error');
    if(this.att >= 5) return Toast.show('Too many attempts','error');
    if(code !== this.code){ this.att++; return Toast.show(`Wrong (${5-this.att} left)`,'error'); }
    this.verified = true; Toast.show(t('codeVerified'),'success'); this.step = 3; this.render();
  },
  cd(sec){
    const b = document.getElementById('prResend'); if(!b) return; b.disabled = true;
    if(this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => { sec--; if(sec <= 0
                                               
