import { studentsApi, teachersApi, classesApi, subjectsApi, attendanceApi, feesApi, resultsApi, usersApi } from "../api/endpoints";

const required = (label) => ({ required: `${label} is required` });
const emailRules = { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } };
const numberMin0 = (label) => ({ required: `${label} is required`, min: { value: 0, message: `${label} can't be negative` } });

export const ENTITY_CONFIG = {
  students: {
    title: "Students", singular: "Student", idKey: "studentId", api: studentsApi,
    columns: [["fullName", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["gender", "Gender"], ["className", "Class"], ["parentName", "Parent"]],
    fields: [
      { key: "userId", label: "Linked Login Account", type: "userSelect", role: "Student", profileApi: studentsApi, profileIdKey: "userId", rules: required("A login account") },
      { key: "fullName", label: "Full Name", type: "text", rules: required("Full name") },
      { key: "email", label: "Email", type: "email", rules: emailRules },
      { key: "phone", label: "Phone", type: "text", rules: required("Phone") },
      { key: "dob", label: "Date of Birth", type: "date", rules: required("Date of birth") },
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { key: "classId", label: "Class", type: "remoteSelect", optionsApi: classesApi, valueKey: "classId", labelFn: (c) => `${c.className} - ${c.section}`, rules: required("Class") },
      { key: "parentName", label: "Parent / Guardian", type: "text", rules: required("Parent name") },
      { key: "parentPhone", label: "Parent Phone", type: "text", rules: required("Parent phone") },
      { key: "address", label: "Address", type: "text", rules: required("Address") },
    ],
    filterKey: "className",
  },
  teachers: {
    title: "Teachers", singular: "Teacher", idKey: "teacherId", api: teachersApi,
    columns: [["fullName", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["qualification", "Qualification"], ["salary", "Salary ($)"]],
    fields: [
      { key: "userId", label: "Linked Login Account", type: "userSelect", role: "Teacher", profileApi: teachersApi, profileIdKey: "userId", rules: required("A login account") },
      { key: "fullName", label: "Full Name", type: "text", rules: required("Full name") },
      { key: "email", label: "Email", type: "email", rules: emailRules },
      { key: "phone", label: "Phone", type: "text", rules: required("Phone") },
      { key: "qualification", label: "Qualification", type: "text", rules: required("Qualification") },
      { key: "salary", label: "Salary ($)", type: "number", rules: numberMin0("Salary") },
      { key: "joiningDate", label: "Joining Date", type: "date", rules: required("Joining date") },
      { key: "address", label: "Address", type: "text", rules: required("Address") },
    ],
    filterKey: null,
  },
  classes: {
    title: "Classes", singular: "Class", idKey: "classId", api: classesApi,
    columns: [["className", "Class"], ["section", "Section"], ["roomNo", "Room No"], ["classTeacherName", "Class Teacher"]],
    fields: [
      { key: "className", label: "Class Name", type: "text", rules: required("Class name") },
      { key: "section", label: "Section (max 10 characters, e.g. A)", type: "text", rules: { required: "Section is required", maxLength: { value: 10, message: "Keep this under 10 characters, e.g. 'A' or 'CS-1'" } } },
      { key: "roomNo", label: "Room No.", type: "text", rules: required("Room number") },
      { key: "classTeacherId", label: "Class Teacher", type: "remoteSelect", optionsApi: teachersApi, valueKey: "teacherId", labelFn: (t) => t.fullName, placeholder: "— No class teacher assigned —" },
    ],
    filterKey: null,
  },
  subjects: {
    title: "Subjects", singular: "Subject", idKey: "subjectId", api: subjectsApi,
    columns: [["subjectName", "Subject"], ["subjectCode", "Code"], ["className", "Class"], ["teacherName", "Teacher"]],
    fields: [
      { key: "subjectName", label: "Subject Name", type: "text", rules: required("Subject name") },
      { key: "subjectCode", label: "Subject Code", type: "text", rules: required("Subject code") },
      { key: "classId", label: "Class", type: "remoteSelect", optionsApi: classesApi, valueKey: "classId", labelFn: (c) => `${c.className} - ${c.section}`, rules: required("Class") },
      { key: "teacherId", label: "Teacher", type: "remoteSelect", optionsApi: teachersApi, valueKey: "teacherId", labelFn: (t) => t.fullName, rules: required("Teacher") },
    ],
    filterKey: "className",
  },
  attendance: {
    title: "Attendance", singular: "Attendance Record", idKey: "attendanceId", api: attendanceApi,
    columns: [["studentName", "Student"], ["className", "Class"], ["attendanceDate", "Date"], ["status", "Status"]],
    fields: [
      { key: "studentId", label: "Student", type: "remoteSelect", optionsApi: studentsApi, valueKey: "studentId", labelFn: (s) => s.fullName, rules: required("Student"), autoFillTarget: { classId: "classId" } },
      { key: "classId", label: "Class (auto-filled when student selected)", type: "remoteSelect", optionsApi: classesApi, valueKey: "classId", labelFn: (c) => `${c.className} - ${c.section}`, rules: required("Class"), readOnly: false },
      { key: "attendanceDate", label: "Date", type: "date", rules: required("Date") },
      { key: "status", label: "Status", type: "select", options: ["Present", "Absent", "Late"] },
    ],
    filterKey: "status",
    filterOptions: ["All", "Present", "Absent", "Late"],
  },
  fees: {
    title: "Fees", singular: "Fee Record", idKey: "feeId", api: feesApi,
    columns: [["studentName", "Student"], ["feeType", "Type"], ["amountDue", "Due ($)"], ["amountPaid", "Paid ($)"], ["status", "Status"]],
    fields: [
      { key: "studentId", label: "Student", type: "remoteSelect", optionsApi: studentsApi, valueKey: "studentId", labelFn: (s) => s.fullName, rules: required("Student") },
      { key: "feeType", label: "Fee Type", type: "select", options: ["Tuition", "Transport", "Library", "Exam", "Other"] },
      { key: "amountDue", label: "Amount Due ($)", type: "number", rules: numberMin0("Amount due") },
      { key: "amountPaid", label: "Amount Paid ($) — enter 0 if not yet paid", type: "number", rules: numberMin0("Amount paid") },
      { key: "dueDate", label: "Due Date", type: "date", rules: required("Due date") },
      // Status is NOT in the form — it is calculated automatically by the C# backend:
      // 0 paid → Unpaid | 0 < paid < due → Partial | paid >= due → Paid
    ],
    filterKey: "status",
    filterOptions: ["All", "Paid", "Unpaid", "Partial"],
  },
  results: {
    title: "Results", singular: "Result", idKey: "resultId", api: resultsApi,
    columns: [["studentName", "Student"], ["subjectName", "Subject"], ["examType", "Exam"], ["marks", "Marks"], ["maxMarks", "Max"], ["grade", "Grade"]],
    fields: [
      { key: "studentId", label: "Student", type: "remoteSelect", optionsApi: studentsApi, valueKey: "studentId", labelFn: (s) => s.fullName, rules: required("Student") },
      { key: "subjectId", label: "Subject", type: "remoteSelect", optionsApi: subjectsApi, valueKey: "subjectId", labelFn: (s) => s.subjectName, rules: required("Subject") },
      { key: "examType", label: "Exam Type", type: "select", options: ["Quiz", "Midterm", "Final"] },
      { key: "maxMarks", label: "Max Marks (auto-set by exam type)", type: "number", readOnly: true, rules: numberMin0("Max marks") },
      { key: "marks", label: "Marks", type: "number", rules: {
          ...numberMin0("Marks"),
          validate: (v, formValues) => Number(v) <= Number(formValues.maxMarks || 100) || `Marks (${v}) cannot exceed Max Marks (${formValues.maxMarks})`
        }
      },
      { key: "grade", label: "Grade", type: "text", readOnly: true, rules: required("Grade") },
      { key: "examDate", label: "Exam Date", type: "date", rules: required("Exam date") },
    ],
    filterKey: "examType",
    filterOptions: ["All", "Quiz", "Midterm", "Final"],
  },
  users: {
    title: "Users", singular: "User", idKey: "userId", api: usersApi,
    columns: [["fullName", "Full Name"], ["email", "Email"], ["roleName", "Role"], ["isActive", "Active"]],
    fields: [
      { key: "fullName", label: "Full Name", type: "text", rules: required("Full name") },
      { key: "email", label: "Email", type: "email", rules: emailRules },
      { key: "password", label: "Password", type: "password", rules: { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } } },
      { key: "role", label: "Role", type: "select", options: ["Admin", "Teacher", "Student"] },
    ],
    filterKey: "roleName",
    filterOptions: ["All", "Admin", "Teacher", "Student"],
  },
};
