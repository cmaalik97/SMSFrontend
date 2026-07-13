import client from "./client";

/*
  One function per Controller endpoint you already built in C#.
  Every page/component calls these - never axios directly - so if
  the API URL shape ever changes, you only fix it here.
*/

export const authApi = {
  login: (email, password) => client.post("/auth/login", { email, password }),
  registerAdmin: (fullName, email, password) =>
    client.post("/auth/register-admin", { fullName, email, password }),
};

export const dashboardApi = {
  summary: () => client.get("/dashboard/summary"),
};

// A generic factory - since every one of your 8 tables uses the exact
// same REST shape (GET all, GET one, POST, PUT, DELETE), we build the
// functions once and reuse them for every entity instead of repeating
// this block 8 times.
function buildCrudApi(resource) {
  return {
    getAll: (params) => client.get(`/${resource}`, { params }),
    getOne: (id) => client.get(`/${resource}/${id}`),
    create: (data) => client.post(`/${resource}`, data),
    update: (id, data) => client.put(`/${resource}/${id}`, data),
    remove: (id) => client.delete(`/${resource}/${id}`),
  };
}

export const studentsApi = buildCrudApi("students");
export const teachersApi = buildCrudApi("teachers");
export const classesApi = buildCrudApi("classes");
export const subjectsApi = buildCrudApi("subjects");
export const attendanceApi = buildCrudApi("attendance");
export const feesApi = buildCrudApi("fees");
export const resultsApi = buildCrudApi("results");
export const usersApi = buildCrudApi("users");
