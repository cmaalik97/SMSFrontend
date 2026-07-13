# SMS React Frontend — how to run it, and how it talks to your database

## 1. Install and run

```bash
cd sms-react
npm install
cp .env.example .env
# open .env and set VITE_API_BASE_URL to match your running C# API
# (check the port in your API's launchSettings.json, e.g. https://localhost:5001/api or http://localhost:5226/api)
npm run dev
```

Open `http://localhost:5173`. Make sure your C# API is **also running** at
the same time (`dotnet run` in the `SMS.Api` folder) — React calls it over
HTTP, it doesn't work standalone.

## 2. How the connection to the database actually works (full chain)

```
[React component]
      |  e.g. studentsApi.getAll()  in src/api/endpoints.js
      v
[Axios - src/api/client.js]
      |  sends:  GET https://localhost:5001/api/students
      |  header: Authorization: Bearer <jwt token>
      v
[ASP.NET Core - StudentsController.cs]
      |  checks [Authorize], reads the role from the JWT
      v
[StudentRepository.cs]
      |  opens SqlConnection, runs SqlCommand with SELECT ... FROM Students
      v
[SQL Server - StudentManagementSystem database]
      |  returns rows
      v
   ...the same path back up, as JSON, into React's state (useState)
```

**React never has a connection string and never sees SQL.** That's by
design — only the C# layer is allowed to talk to SQL Server. React only
ever talks to the API over HTTP.

## 3. Where each of your requirements lives in this codebase

| You asked for | Where it is |
|---|---|
| `useContext` for global state | `src/context/AuthContext.jsx` (who's logged in, their role) and `src/context/ThemeContext.jsx` (dark mode) — both used everywhere via `useAuth()` / `useTheme()` |
| Routes | `src/App.jsx` — uses `react-router-dom`'s `<Routes>`/`<Route>`, plus `ProtectedRoute.jsx` to guard by role |
| Form validation with `useForm` | `react-hook-form`'s `useForm()` in `SignIn.jsx`, `SignUp.jsx`, and the shared `FormModal.jsx` (used by all 8 admin tables) |
| Responsive | Every layout uses Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) — sidebar collapses to a hamburger menu below `lg`, grids drop from 4 columns to 1 on phones |
| Logout for Teacher/Student | `src/components/DashboardHeader.jsx` — shown at the top of both `TeacherDashboard.jsx` and `StudentDashboard.jsx` |

## 4. Component list (15 total)

`Navbar`, `Footer`, `Sidebar`, `Topbar`, `DashboardHeader`, `StatCard`,
`StatusBadge`, `DataTable`, `FormModal`, `Icon`, `ProtectedRoute`,
`PublicLayout`, `AdminLayout`, `EntityPage` (generic, reused for all 8
tables), plus the 7 page components (`Home`, `About`, `SignIn`, `SignUp`,
`AdminDashboard`, `TeacherDashboard`, `StudentDashboard`).

## 5. One important CORS thing

Your `Program.cs` already allows `http://localhost:5173` (Vite's default
port) — if you change the React dev server port, update the CORS policy
in `Program.cs` to match, or the browser will block every request with a
CORS error.

## 6. Creating a Teacher or Student login (Admin flow)

From the Users table in the Admin dashboard, "Add User" calls
`POST /api/users` with `{ fullName, email, password, role }`. Right now
this creates the login row only — for a complete profile you'd also want
to immediately call `POST /api/students` or `POST /api/teachers` with the
returned `userId` to create their profile row too. That second call isn't
wired up automatically yet; it's a good next feature to add once this is
running.


# System 
* hdvddfvdv 
fbfb