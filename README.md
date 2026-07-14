# 📚 Student Management System — Frontend (React)
A role-based school management UI built with React + Vite + Tailwind CSS.  
After login, each user sees a different dashboard based on their role.
---
# 🗂 Project Structure
```
sms-react/
├── public/
├── src/
│   ├── api/
│   │   ├── client.js          # Axios instance — adds JWT token to every request
│   │   └── endpoints.js       # One function per API endpoint (students, fees, etc.)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx    # Global login state (who is logged in, their role)
│   │   └── ThemeContext.jsx   # Global dark/light mode toggle
│   │
│   ├── components/
│   │   ├── Icon.jsx           # SVG icon set used throughout the app
│   │   ├── Navbar.jsx         # Public site top navigation bar
│   │   ├── Footer.jsx         # Public site footer
│   │   ├── Sidebar.jsx        # Admin dashboard sidebar with all 9 table links
│   │   ├── Topbar.jsx         # Admin dashboard top bar (export + dark mode)
│   │   ├── DashboardHeader.jsx# Top bar for Teacher and Student dashboards
│   │   ├── ProtectedRoute.jsx # Blocks pages from the wrong role
│   │   ├── StatCard.jsx       # Summary number card used on dashboards
│   │   ├── StatusBadge.jsx    # Coloured pill (Present/Absent/Paid/Unpaid etc.)
│   │   ├── DataTable.jsx      # Reusable search + filter + CRUD table
│   │   └── FormModal.jsx      # Add / Edit modal used by all 8 entity tables
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx   # Wraps Home/About/SignIn/SignUp with Navbar+Footer
│   │   └── AdminLayout.jsx    # Wraps all admin pages with Sidebar+Topbar
│   │
│   ├── pages/
│   │   ├── Home.jsx           # Public landing page
│   │   ├── About.jsx          # Public about page
│   │   ├── SignIn.jsx         # Login form (all roles)
│   │   ├── SignUp.jsx         # Register form (Admin only)
│   │   ├── AdminDashboard.jsx # Admin home — summary cards + recent fees
│   │   ├── EntityPage.jsx     # Generic CRUD page (Students/Teachers/Fees etc.)
│   │   ├── AttendancePage.jsx # Custom attendance workflow page
│   │   ├── TeacherDashboard.jsx # Teacher home — My Info + Attendance tabs
│   │   └── StudentDashboard.jsx # Student home — Overview/Attendance/Results/Fees tabs
│   │
│   ├── config/
│   │   └── entities.js        # Config for all 8 CRUD tables (columns, form fields,
│   │                          #   validation rules, API to call)
│   │
│   ├── App.jsx                # All routes defined here
│   ├── main.jsx               # Entry point — wraps app in Router + Contexts
│   └── index.css              # Tailwind directives + custom animations
│
├── .env                       # VITE_API_BASE_URL (your C# API address)
├── vercel.json                # Vercel deployment config
├── vite.config.js
├── tailwind.config.js
└── package.json
```
---
# ⚙️ Setup & Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Open .env and set:
# VITE_API_BASE_URL=http://localhost:5231/api

# 3. Start the dev server
npm run dev
# Opens at http://localhost:5173
```
> Make sure the C# API is also running before you open the browser.
---
# 🔑 How Login Works
1. User submits email + password on `/signin`
2. React calls `POST /api/auth/login` on the C# API
3. API returns a JWT token + the user's role (Admin / Teacher / Student)
4. React stores the token in `localStorage`
5. Every later API call sends the token in the `Authorization` header
## The role decides which dashboard to show:
- Role	-Redirected to	-Can see
Admin	        `/admin`	        All 9 tables, full edit/delete
Teacher	 `/teacher`	        Own subjects, salary + mark attendance
Student	`/student`	        Own attendance, results, fees only
---

# 📦 Key Dependencies
Package	                   Purpose
`react-router-dom`	       Page routing and navigation
`axios`	                   HTTP requests to the C# API
`react-hook-form`            	Form validation on all Add/Edit forms
`tailwindcss`	             Utility-first CSS styling
---
# 🌐 Environment Variables
Variable	                  Example	                     Description
`VITE_API_BASE_URL`	`http://localhost:5231/api`	Base URL of the C# backend API
For deployment, this changes to your live API URL (e.g. Render.com).
---
# 🚀 Build for Production
```bash
npm run build
# Output goes to /dist folder
# Deploy the /dist folder to Vercel
```
---
# 🎨 Design
* Colors: Orange-600 (brand accent) + Forest Green (sidebar/dark elements)
* Dark Mode: Toggle button in every header — preference saved in localStorage
* Responsive: Mobile-first with Tailwind breakpoints (sm / md / lg)
* Fonts: Sora (headings) + Inter (body text) from Google Fonts
---
# 📋 Pages Summary
- Page	              Route         	    Who can access
1. Home	             `/`	                Everyone (public)
2. About	             `/about`	           Everyone (public)
3. Sign In	            `/signin`	           Everyone (public)
4. Sign Up	            `/signup`        	      Everyone — creates Admin only
5. Admin Dashboard	`/admin`	            Admin only
6. Students	             `/admin/students`	Admin only
7. Teachers	             `/admin/teachers`	Admin only
8. Fees	            `/admin/fees`	      Admin only
9. Classes	             `/admin/classes`   	Admin only
10. Subjects	      `/admin/subjects`  	Admin only
11. Results	             `/admin/results` 	Admin only
12. Attendance	      `/admin/attendance`	Admin only
13. Users	            `/admin/users`	      Admin only
14. Teacher Dashboard	`/teacher`	           Teacher only
15. Student Dashboard	`/student`	           Student only
