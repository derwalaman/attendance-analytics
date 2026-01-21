# 📊 Attendance Analytics Portal

A modern, smart, and scalable **attendance management & analytics system** built using **Next.js App Router**, **MongoDB**, and **NextAuth**.

This platform helps students track attendance, analyze subject-wise performance, calculate real attendance using bunk-aware logic, and visually monitor attendance through analytics dashboards and calendar views.

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth login (NextAuth)
- Secure session-based authentication
- Protected portal routes
- Automatic profile creation

---

### 📚 Subject Management
- Add / edit / delete subjects
- Subject code support
- Minimum attendance percentage per subject
- Subject-wise attendance tracking

---

### 🧾 Attendance Management
- Mark attendance as:
  - ✅ Present
  - ❌ Absent
  - 💤 Bunk
  - 🚫 Cancelled
- Date-based attendance system
- Duplicate prevention
- Leap year support (Feb 29 included)

---

### 🧠 Smart Attendance Calculation

Supports **three calculation modes**:

| Mode | Description |
|------|------------|
| `bunk_present` | Bunk counted as present |
| `bunk_absent` | Bunk counted as absent |
| `bunk_ignore` | Bunks ignored completely |

Users can switch modes instantly from the dashboard.

---

### 📊 Attendance Analytics Dashboard

#### Overall Analytics
- Total subjects
- Total classes
- Actual present
- Actual absent
- Total bunks
- Attendance percentage
- Overall attendance status

#### Attendance Status Levels
- 🟢 **Safe**
- 🟡 **Risk**
- 🔴 **Danger**

---

### 📘 Subject-wise Analytics
- Total classes
- Present / Absent count
- Bunks & cancelled classes
- Attendance percentage
- Progress bars
- Subject health indicator
- Best performing subject
- Worst performing subject

---

### 🗓 Attendance Calendar
- Monthly calendar view
- Slide between months
- Real-world calendar structure
- Leap year compatible
- Color indicators:
  - Green → Present
  - Red → Absent
  - Yellow → Bunk
  - Gray → Cancelled

---

### 👤 Profile Management
- Google profile sync
- Editable personal details
- Semester & college info
- Profile completion indicator

---

### 🎨 Modern UI / UX
- Fully responsive design
- Mobile / tablet / desktop friendly
- Sidebar navigation
- Skeleton loaders
- Global loader component
- Glassmorphism UI
- Smooth animations

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**
- **Recharts**

---

### Backend
- **Next.js API Routes**
- **Node.js**
- **MongoDB**
- **Mongoose**

---

### Authentication
- **NextAuth.js**
- Google OAuth Provider

---

## 📁 Project Structure
attendance-analytics-portal/
│
├── app/
│ ├── api/
│ │ ├── auth/
│ │ ├── subjects/
│ │ ├── attendance/
│ │ ├── dashboard/
│ │ └── profile/
│ │
│ ├── portal/
│ │ ├── dashboard/
│ │ ├── subjects/
│ │ ├── attendance/
│ │ ├── analytics/
│ │ ├── calendar/
│ │ ├── settings/
│ │ ├── contact/
│ │ └── profile/
│ │
│ └── layout.tsx
│
├── components/
│ ├── sidebar/
│ ├── ui/
│ ├── loaders/
│ └── charts/
│
├── models/
│ ├── User.ts
│ ├── Subject.ts
│ └── Attendance.ts
│
├── lib/
│ ├── db.ts
│ ├── auth-options.ts
│ └── utils.ts
│
├── public/
│ ├── images/
│ └── icons/
│
├── README.md
└── package.json

---

## 🧮 Attendance Status Logic
- If attendance < minAttendance → Danger
- If attendance < minAttendance + 5 → Risk
- Else → Safe

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

---

## ▶️ Run Locally

```code
npm install
npm run dev
```

```open
http://localhost:3000
```

---

## 📊 Example Dashboard Metrics

- Overall attendance %
- Actual vs raw attendance
- Subject-wise performance
- Total bunks
- Risk prediction
- Attendance trend analysis

---

## 🎯 Use Cases

- College students

- University attendance tracking

- Smart bunk planning

- Academic analytics

- Semester / final year project

---

## 👨‍💻 Author

Aman Derwal
- GitHub: https://github.com/derwalaman
- LinkedIn: https://linkedin.com/in/amanderwal

---

## 📜 License
This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project:
- ⭐ Star the repository
- 🍵 Share with friends
- 💡 Suggest improvements
