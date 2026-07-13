import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({ fullName, email, password }) => {
    setServerError("");
    try {
      await registerAdmin(fullName, email, password); // -> POST /api/auth/register-admin in C#
      navigate("/admin");
    } catch (err) {
      setServerError(err.response?.data || "Could not create the account.");
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-16 fade-in">
      <div className="bg-white dark:bg-forest-900 rounded-2xl shadow-xl border border-orange-100 dark:border-forest-800 p-8">
        <h1 className="font-display text-2xl font-extrabold text-forest-900 dark:text-white mb-1">Create an admin account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Sign up is for school administrators. Teacher and student logins are created by an admin from inside the dashboard.
        </p>

        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {String(serverError)}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              {...register("fullName", { required: "Full name is required" })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-orange-50/40 dark:bg-forest-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@school.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
              })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-orange-50/40 dark:bg-forest-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-orange-50/40 dark:bg-forest-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 bg-orange-50/40 dark:bg-forest-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold transition">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-5 text-center">
          Already have an account? <Link to="/signin" className="text-brand-600 font-semibold">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
