# 🎓 Smart University Management System (SUMS)

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A comprehensive, modern, and highly scalable **University Management System** designed to streamline academic, administrative, and financial operations.Built with a premium UI/UX experience and robust backend architecture.

---

## 🚀 Key Features (Implemented)

### 👨‍💼 Admin Powerhouse
*   **Dynamic Dashboard**: Real-time stats for students, teachers, and staff.
*   **Academic Control**: Full CRUD for Classes, Courses, Sections, and Routines.
*   **Attendance Hub**: Advanced attendance policies, holiday management, and automated reporting.
*   **Marks & Transcripts**: Batch marks upload, dynamic transcript generation, and report card management.
*   **User Management**: Secure role-based management for Teachers, Staff, Students, and Parents.
*   **Announcements**: Global announcement system with category-based filtering.

### 👨‍🎓 Student Portal
*   **Personal Dashboard**: Overview of attendance, results, and upcoming routines.
*   **Academic Tracking**: View routines, course materials, and detailed results.
*   **Financial Tracking**: Manage fees, view invoices, and track payment history.
*   **Profile Management**: Update personal info and view academic progress.
*   **Digital Library & Downloads**: Access to university resources and official documents.

### 👩‍🏫 Teacher Portal
*   **My Courses & Class Routine**: Courses, sections and weekly schedule assigned to the teacher.
*   **Lectures**: Upload lecture files (PDF / DOC / DOCX, up to 10 MB) per course; students of that course's section can view and download them.
*   **Attendance & Marks Entry**, **Announcements**, **Messaging** and **Online Classes (Meetings)**.

### 📨 Requests & Inquiries
*   Every "Contact / Apply / Register / Subscribe / Request" button on the public site opens a form that is stored for the administration in **Admin → User Management → Requests & Inquiries** (status, notes, reset password, deactivate student).
*   Students can submit leave requests and account-deactivation requests; anyone can request a password reset from `/forgot-password`.

### 🤖 SUMS Assistant (chatbot)
*   A floating chat button on the public site and the student/teacher portals. Anyone can ask about admission, scholarships, library hours, halls, transport, health insurance, the academic calendar and contact details.
*   Signed-in students can also ask about **their own** attendance, fees and fines, schedule, courses, borrowed books and announcements (real data from the database, nobody else's).
*   Works in Arabic and English. With `ANTHROPIC_API_KEY` in `.env.local` it answers with Claude (model `claude-opus-5-5`, change with `CHATBOT_MODEL`); without a key it still answers from built-in data.

### 💰 Financial Management
*   **Invoice Generation**: Automated invoicing for tuition and other fees.
*   **Payment Integration**: Tracking payments, waivers, and fines.
*   **Financial Reports**: Comprehensive reports for administrative audit.

### 🏫 Administration & Research
*   **Office Portals**: Dedicated sections for VC, Registrar, Deans, and Chairmen.
*   **Admission System**: Comprehensive modules for Undergraduate to PhD admissions.
*   **Research Hub**: Management of journals, publications, and funded projects.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (for animations)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📂 Project Structure

```text
smart-university-management-system/
├── 📁 app/                     # Next.js App Router (Main Application Logic)
│   ├── 📁 admin/               # Admin Portal (Dashboard, Academic, Attendance, Financial)
│   │   ├── 📁 academic/        # Courses, Routines, Sections management
│   │   ├── 📁 attendance/      # Attendance policies & records
│   │   └── 📁 marks/           # Transcripts, Uploads, Grades
│   ├── 📁 api/                 # Backend API Routes (Server-side logic)
│   │   └── 📁 admin/           # Admin specialized endpoints
│   ├── 📁 (auth)/              # Authentication & Authorization routes
│   ├── 📁 student/             # Student Dashboard (Attendance, Results, Routine)
│   ├── 📁 admission/           # Admission procedures (Undergrad, Grad, PhD)
│   ├── 📁 research/            # Academic research, journals & publications
│   ├── 📄 layout.tsx           # Root application layout
│   └── 📄 page.tsx             # Homepage / Landing page
├── 📁 components/              # Reusable React Components
│   ├── 📁 dashboard/           # Sidebar, Navbar, Layouts for Dashboards
│   └── 📁 ui/                  # Atomic components (Hero, Footer, Navbar, Sections)
├── 📁 models/                  # Mongoose Schemas (Database Models)
│   ├── 📄 Student.ts           # Student data structure
│   ├── 📄 Teacher.ts           # Teacher data structure
│   ├── 📄 Course.ts            # Course data structure
│   └── 📄 User.ts              # Authentication user schema
├── 📁 lib/                     # Utilities & Configurations
│   ├── 📄 db.ts                # MongoDB connection & configuration
│   └── 📄 utils.ts             # Global utility functions (cn, etc.)
├── 📁 public/                  # Static Assets & Media
│   ├── 📁 news/                # Dynamic news & event images
│   └── 📁 students/            # Student-related banners & assets
├── 📄 middleware.ts            # Route protection & Security middleware
├── 📄 next.config.ts           # Next.js Framework configuration
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 package.json             # Project dependencies & Scripts
```

---

## 🔌 API Endpoints (Core)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/stats` | Get overview stats for dashboard |
| **POST** | `/api/admin/students` | Register a new student |
| **GET** | `/api/admin/attendance/reports` | Fetch attendance reports |
| **POST** | `/api/admin/marks/upload` | Batch upload student marks |
| **GET** | `/api/admin/marks/transcript/[stuId]` | Generate student transcript |
| **POST** | `/api/admin/announcements` | Create new university announcement |
| **GET** | `/api/admin/routines` | Fetch academic routines |
| **PUT** | `/api/admin/courses/[id]` | Update course details |

---

## 🔮 Upcoming Features (Roadmap)

- [ ] **Real-time Notifications**: WebSocket integration for instant alerts.
- [ ] **LMS Integration**: Full Learning Management System with assignment submissions.
- [ ] **Mobile App**: Cross-platform mobile application for Students and Teachers.
- [ ] **Alumni Portal**: Networking platform for graduated students.
- [ ] **Online Examination**: Secure portal for conducting online quizzes and exams.
- [ ] **AI Chatbot**: Intelligent assistant for student queries.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 20+
- MongoDB instance (Local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-university-management-system.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and set `MONGODB_URI`.
4. Seed the database with demo data (admin, teachers, students, courses, routines):
   ```bash
   npm run seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. (For messaging and online classes) in a second terminal run the socket server:
   ```bash
   npm run chat
   ```

### Production build
```bash
npm run build && npm start
```

### Deploy to Vercel (website + API)
1. Push the repository to GitHub (`.env.local`, `accounts.json` and other secrets are git-ignored).
2. In Vercel choose **Add New > Project**, import the repository (framework: Next.js, nothing else to change; `vercel.json` is included).
3. Add the environment variables from `.env.example` (at least `MONGODB_URI`; optionally `GEMINI_API_KEY`, `AI_MODEL_NAME`, `NEXT_PUBLIC_SOCKET_URL`, the TURN variables) for Production and Preview, then deploy.
4. MongoDB Atlas: **Network Access > Add IP address > 0.0.0.0/0** (Vercel uses changing IPs). Seed the database once from your computer with `npm run seed`.

Limits on Vercel: uploads (lecture files and student documents) are capped at **4 MB** because serverless request bodies are limited to 4.5 MB.

### Deploy the chat / online-class socket server
Vercel cannot run a WebSocket server, so `socket-server.js` is hosted separately (Render, Railway, Fly.io ...):
- Start command: `npm run chat`, with the environment variables `MONGODB_URI`, `ALLOWED_ORIGIN` (your Vercel URL) and optionally `PORT`.
- Then set `NEXT_PUBLIC_SOCKET_URL` on Vercel to the socket server's public `https://` URL and redeploy.
- Without it, the website works normally; only messaging and live classes are unavailable.

### Logins
- Admin: `/login/employee` with the admin email
- Teacher: `/login/employee` with the teacher ID (e.g. `T-001`)
- Student: `/login/student` with the student ID (e.g. `CSE2024001`)

Demo passwords are created by the seed script (see `scripts/seed.cjs`).


---
Developed with ❤️ by **MD Amdad Islam**
