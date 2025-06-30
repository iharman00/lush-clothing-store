# 🛍️ Lush Clothing – Full-Stack eCommerce Platform

![Homepage Screenshot](/public/screenshots/homepage.png)

This is a full-stack clothing eCommerce website built from the ground up for my portfolio, inspired by brands like Calvin Klein and H&M. It features dynamic product pages, variant management, cart functionality, Stripe integration, and a fully responsive UI.

**🌐 Live Site:** [Visit Website](https://lush-clothing-store.vercel.app/)

---

## 🧠 What I Built

A fully responsive, production-grade eCommerce platform with:

- 🔄 Complex product schemas support (colors, sizes, fits, description, materials etc.)
- 🛒 Dynamic shopping cart and checkout
- 🔐 OTP-based authentication system
- 💳 Secure Stripe payment integration (with post-order confirmation emails)
- 🖼️ Sanity CMS integration for easy product/content management
- ⚡ SEO optimization and fast performance via edge caching

---

## 🛠️ Tech Stack & Tools

| Area           | Tools Used                                                          |
| -------------- | ------------------------------------------------------------------- |
| **Frontend**   | React (Next.js App Router), Tailwind CSS, ShadCN UI                 |
| **State**      | React Hook Form, Zustand, browser storage APIs                      |
| **Backend**    | Next.js API routes (TypeScript), Stripe SDK                         |
| **CMS**        | Sanity.io (with custom schemas for product variants and categories) |
| **Testing**    | Vitest (unit & integration testing)                                 |
| **Deployment** | Vercel (frontend + backend), Sanity Studio (hosted on the same url) |

---

## 💡 What I Learned

- 🔐 Built and tested a secure **OTP-based auth system** from scratch using cookies and server side sessions
- 🧩 Developed scalable UI components with **accessibility** and reusability in mind
- 🛠️ Managed complex product data across the **frontend, backend, and CMS**
- 💳 Integrated **Stripe checkout** with support for post-purchase notification emails
- 📦 Sharpened skills in **TypeScript**, debugging, form validation, and modular code architecture

---

## 📈 Project Highlights

- ✅ Secure and user-friendly login/signup flow
- 📱 Fully responsive design across all screen sizes
- ⚡ SEO-friendly routes with dynamic Open Graph tags
- 🚀 Blazing-fast performance using **Next.js edge functions**
- 🧪 Clean, tested components with **Vitest**

---

## 🧪 Running the Project Locally

1. **Clone the repo:**

   ```bash
   git clone https://github.com/yourusername/lush-clothing.git
   cd lush-clothing
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env.development` with:**

   ```env
   DATABASE_URL=your_db_url
   STRIPE_SECRET_KEY=your_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   RESEND_API_KEY=your_resend_api_key
   RESEND_EMAIL=your_sender_email
   NEXT_PUBLIC_SANITY_API_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_API_DATASET=production
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
   ```

4. **Run development server:**

   ```bash
   npm run dev
   ```

---

## 🤝 Let’s Connect

If you're working on similar projects or hiring for full-stack or frontend developer roles, feel free to mail me at [harmanwork124@gmail.com](mailto:harmanwork124@gmail.com) or reach out on [LinkedIn](https://www.linkedin.com/in/iharman00/)!

---

## 📸 Screenshots

![Recently Added Screenshot](/public/screenshots/recently-added.png)

![Women's category page Screenshot](/public/screenshots/women-category.png)

![Women's pants page Screenshot](/public/screenshots/pants.png)

![Checkout page Screenshot](/public/screenshots/checkout.png)
