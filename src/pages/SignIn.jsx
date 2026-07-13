import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      const user = await login(email, password);
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      setServerError(err.response?.data || "Invalid email or password.");
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-16 fade-in">
      <div className="bg-white dark:bg-forest-900 rounded-2xl shadow-xl border border-orange-100 dark:border-forest-800 p-8">
        <h1 className="font-display text-2xl font-extrabold text-forest-900 dark:text-white mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to your dashboard.</p>

        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {String(serverError)}
          </p>
        )}

        {/*
          AUTOFILL FIX (#1):
          Two hidden dummy inputs sit BEFORE the real fields.
          Chrome/Firefox autofill the FIRST matching inputs they find,
          which are these hidden ones. The real inputs below stay empty.
        */}
        <div aria-hidden="true" style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, overflow: "hidden" }}>
          <input type="email" name="fake_email_trap" tabIndex={-1} autoComplete="username" readOnly />
          <input type="password" name="fake_password_trap" tabIndex={-1} autoComplete="current-password" readOnly />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@school.com"
              autoComplete="new-password"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold transition">
            {isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-5 text-center">
          No account? <Link to="/signup" className="text-brand-600 font-semibold">Admins can sign up here</Link>
        </p>
      </div>
    </section>
  );
}
