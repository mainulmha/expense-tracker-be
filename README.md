npx nodemon index.js

npm run dev

## 📮 Postman দিয়ে API টেস্ট করার সম্পূর্ণ গাইড

### 1️⃣ প্রথমে Postman খুলুন এবং নিচের সেটআপ করুন

---

## 🔐 Authentication API টেস্ট

### Step 1: Register (নতুন ইউজার তৈরি)

```
Method: POST
URL: http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json

Body (raw JSON):
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
}
```

**Response দেখতে হবে:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "660a1b2c3d4e5f6g7h8i9j0k",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

👉 **এই token টি কপি করে রাখুন!**

---

### Step 2: Login (লগইন)

```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json

Body (raw JSON):
{
    "email": "test@example.com",
    "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "660a1b2c3d4e5f6g7h8i9j0k",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 💰 Expense API টেস্ট (প্রতিটি রিকোয়েস্টে Token প্রয়োজন)

### 🔑如何在 Postman এ Token সেট করবেন?

**পদ্ধতি 1: Headers এ যোগ করুন**

```
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

**পদ্ধতি 2: Authorization ট্যাব ব্যবহার করুন**

```
Authorization Tab → Type: Bearer Token → Token: [আপনার token]
```

---

### Step 3: Add Expense (এক্সপেন্স যোগ করুন)

```
Method: POST
URL: http://localhost:5000/api/expense/add
Headers:
  Authorization: Bearer [আপনার_token]
  Content-Type: application/json

Body (raw JSON):
{
    "description": "Lunch at restaurant",
    "amount": 500,
    "category": "food",
    "type": "expense",
    "date": "2024-04-17"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Transaction added successfully",
    "data": {
        "_id": "...",
        "description": "Lunch at restaurant",
        "amount": 500,
        "category": "food",
        "type": "expense",
        "userId": "660a1b2c3d4e5f6g7h8i9j0k",
        ...
    }
}
```

---

### Step 4: Get Balance (ব্যালেন্স দেখা)

```
Method: GET
URL: http://localhost:5000/api/expense/balance
Headers:
  Authorization: Bearer [আপনার_token]
```

---

### Step 5: Get Day-wise Report

```
Method: GET
URL: http://localhost:5000/api/expense/report/day-wise-report?page=1&limit=10
Headers:
  Authorization: Bearer [আপনার_token]
```

**URL Parameters:**

- `page=1` (পেজ নম্বর)
- `limit=10` (প্রতি পেজে কতটি)
- `type=expense` (অপশনাল: expense/income/investment)

---

### Step 6: Get Category Report

```
Method: GET
URL: http://localhost:5000/api/expense/chart/category?type=expense
Headers:
  Authorization: Bearer [আপনার_token]
```

---

### Step 7: Get Monthly Trend

```
Method: GET
URL: http://localhost:5000/api/expense/report/monthly-trend
Headers:
  Authorization: Bearer [আপনার_token]
```

---

### Step 8: Get All Transactions (পেজিনেশন সহ)

```
Method: GET
URL: http://localhost:5000/api/expense/report/all?page=1&limit=10
Headers:
  Authorization: Bearer [আপনার_token]
```

**Query Parameters:**

- `page=1` (পেজ নম্বর)
- `limit=10` (প্রতি পেজে কতটি)
- `type=expense` (অপশনাল)
- `category=food` (অপশনাল)
- `startDate=2024-01-01` (অপশনাল)
- `endDate=2024-12-31` (অপশনাল)

---

## 📋 Postman Collection (সব API একসাথে)

আপনি চাইলে Postman এ একটি **Collection** তৈরি করে নিতে পারেন:

### 🔥 Environment Variables সেট করুন:

Postman এ **Environment** তৈরি করুন:

```
Variable: token
Value: [আপনার_token]

Variable: baseUrl
Value: http://localhost:5000/api
```

### 📁 Collection Structure:

```
Expense Tracker API
├── Auth
│   ├── POST /auth/register
│   └── POST /auth/login
└── Expense
    ├── POST /expense/add
    ├── GET /expense/balance
    ├── GET /expense/report/day-wise-report
    ├── GET /expense/chart/category
    ├── GET /expense/report/monthly-trend
    └── GET /expense/report/all
```

---

## ✅ টেস্ট করার ধাপ:

```bash
1. Register করুন → token পান
2. Login করুন → token পান
3. সেই token দিয়ে expense যোগ করুন
4. balance চেক করুন
5. বিভিন্ন রিপোর্ট চেক করুন
6. অন্য ইউজার তৈরি করে দেখুন তার ডাটা আলাদা কিনা
```

---

## 🧪 একাধিক ইউজার টেস্ট:

### ইউজার 1:

```json
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456"
}
```

→ ট্রানজেকশন যোগ করুন

### ইউজার 2:

```json
{
  "name": "User Two",
  "email": "user2@example.com",
  "password": "123456"
}
```

→ ট্রানজেকশন যোগ করুন

✅ **চেক করুন:** ইউজার 1 শুধু তার নিজের ডাটা দেখে, ইউজার 2 শুধু তার নিজের ডাটা দেখে

---

## 🎯 Postman টেস্ট চেকলিস্ট:

| API                                 | স্ট্যাটাস | মন্তব্য                |
| ----------------------------------- | --------- | ---------------------- |
| POST /auth/register                 | ✅        | Token পাওয়া গেছে      |
| POST /auth/login                    | ✅        | Token পাওয়া গেছে      |
| POST /expense/add                   | ✅        | Expense যোগ হয়েছে     |
| GET /expense/balance                | ✅        | ব্যালেন্স দেখাচ্ছে     |
| GET /expense/report/day-wise-report | ✅        | ডে-ওয়াইজ রিপোর্ট আসছে |
| GET /expense/chart/category         | ✅        | ক্যাটাগরি রিপোর্ট আসছে |
| GET /expense/report/monthly-trend   | ✅        | মাসিক ট্রেন্ড আসছে     |
| GET /expense/report/all             | ✅        | সব ট্রানজেকশন আসছে     |

এখন **Postman দিয়ে সহজেই টেস্ট করতে পারবেন**! 🎉

1. User signs up
   ↓
2. Gets verification email (valid for 24 hours)
   ↓
   3a. Verifies within 24 hours → ✅ Account activated
   ↓
   3b. Verifies after 24 hours → ❌ Link expired
   ↓
3. User clicks "Resend Verification Email"
   ↓
4. New email sent (valid for another 24 hours)
   ↓
5. User verifies → ✅ Account activated

# 1. Forgot Password (OTP পাঠান)

POST http://localhost:5000/api/auth/forgot-password
{
"email": "user@example.com"
}

# 2. Verify OTP

POST http://localhost:5000/api/auth/verify-otp
{
"email": "user@example.com",
"otp": "123456"
}

# 3. Reset Password

POST http://localhost:5000/api/auth/reset-password
{
"email": "user@example.com",
"otp": "123456",
"newPassword": "newpassword123"
}

হ্যাঁ, আপনার Frontend কোড 100% ঠিক আছে! ✅

✅ আপনার Frontend কোড পারফেক্ট:
অংশ স্ট্যাটাস মন্তব্য
Step 1 (Email) ✅ সঠিক OTP পাঠায়
Step 2 (OTP) ✅ সঠিক OTP ভেরিফাই করে
Step 3 (Reset Password) ✅ সঠিক পাসওয়ার্ড রিসেট করে
Countdown Timer ✅ সঠিক 60 সেকেন্ড রিসেন্ড টাইমার
Error Handling ✅ সঠিক সব error দেখায়
Loading States ✅ সঠিক submitting state
UI Design ✅ সঠিক আপনার থিম অনুযায়ী

### আপনার চমৎকার একটা রোডম্যাপ আছে! আপনি যেহেতু **Web, Android এবং iOS** তিন জায়গাতেই অ্যাপটি নিতে চাচ্ছেন, তাই **Firebase** নিয়ে আপনার কনফিউশন থাকাটা স্বাভাবিক। চলুন আপনার প্রশ্নের উত্তরগুলো সহজভাবে দিই:

### Firebase আসলে কী?

Firebase হলো Google-এর একটি প্ল্যাটফর্ম যা ডেভেলপারদের অ্যাপের ব্যাকেন্ডের ঝামেলা কমিয়ে দেয়। এটাকে একটা "Ready-made Backend" হিসেবে ভাবতে পারেন। এটি আপনাকে ডাটাবেস, নোটিফিকেশন, অথেনটিকেশন এবং হোস্টিং-এর মতো সুবিধাগুলো এক জায়গায় দেয়।

---

### আপনার কেন Firebase লাগবে (নাকি লাগবে না)?

যেহেতু আপনি অলরেডি **MongoDB** এবং **Node.js** দিয়ে ইমেইল ভেরিফিকেশন সিস্টেম বানিয়ে ফেলেছেন, তাই আপনার জন্য Firebase **অপরিহার্য নয়**। তবে কেন মানুষ এটি ব্যবহার করে, তার কারণগুলো নিচে দেওয়া হলো:

**১. মাল্টি-প্ল্যাটফর্ম সুবিধা (Web + Android + iOS):**
আপনি যখন অ্যাপটি Android বা iOS-এ নিবেন, তখন Google বা Apple দিয়ে লগইন করানো Node.js-এ কিছুটা জটিল হতে পারে। Firebase-এর SDK ব্যবহার করলে এই তিন প্ল্যাটফর্মেই OAuth (Google Login) হ্যান্ডেল করা অনেক সহজ হয়ে যায়।

**২. পুশ নোটিফিকেশন (FCM):**
Expense Tracker অ্যাপে বাজেট শেষ হয়ে গেলে বা ডেইলি রিমাইন্ডার দেওয়ার জন্য নোটিফিকেশন পাঠাতে হয়। Android এবং iOS-এ নোটিফিকেশন পাঠানোর সবচেয়ে স্ট্যান্ডার্ড উপায় হলো **Firebase Cloud Messaging (FCM)**। তাই আপনি ব্যাকেন্ডে MongoDB ব্যবহার করলেও নোটিফিকেশনের জন্য আপনাকে শেষ পর্যন্ত Firebase-এর সাহায্য নিতেই হবে।

**৩. সিকিউরিটি এবং ভেরিফিকেশন:**
আপনি ইমেইল ভেরিফিকেশন নিজে কোড করে করেছেন (সম্ভবত Nodemailer দিয়ে)। Firebase এটি মাত্র এক ক্লিকে করে দেয় এবং এদের সিকিউরিটি অনেক বেশি শক্তিশালী।

---

### আপনার বর্তমান পরিস্থিতিতে পরামর্শ

আপনি যেহেতু অলরেডি MongoDB এবং Node.js ব্যবহার করছেন, তাই **এখনই সব কিছু বাদ দিয়ে Firebase-এ যাওয়ার দরকার নেই।** আপনি আপনার বর্তমান স্ট্যাকেই OAuth যোগ করতে পারেন।

#### আপনি যা করতে পারেন:

- **OAuth এর জন্য:** আপনি যদি Firebase ব্যবহার করতে না চান, তবে **Passport.js** ব্যবহার করে আপনার Node.js ব্যাকেন্ডেই Google OAuth সেটআপ করতে পারেন।
- **মোবাইল অ্যাপের জন্য:** পরবর্তীতে যখন React Native বা Flutter দিয়ে Android/iOS অ্যাপ বানাবেন, তখন আপনার এই Node.js API-গুলোই সেখানে ব্যবহার করতে পারবেন।
- **Firebase কখন আনবেন?** যখন আপনার অ্যাপে **Push Notification** দেওয়ার প্রয়োজন হবে, তখন শুধু নোটিফিকেশন পার্টটুকুর জন্য Firebase কানেক্ট করবেন। বাকি ডাটাবেস (MongoDB) আগের মতোই থাকবে।

**সারসংক্ষেপ:** Firebase হলো একটা সহজ সমাধান। কিন্তু আপনি যেহেতু কাস্টম ব্যাকেন্ড (Node.js + MongoDB) শিখছেন এবং অলরেডি অনেক দূর এগিয়েছেন, তাই **Firebase ছাড়াই** নিজের ব্যাকেন্ডে OAuth সেটআপ করা আপনার শেখার জন্য এবং কন্ট্রোলের জন্য বেশি ভালো হবে।
