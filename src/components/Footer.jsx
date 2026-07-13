import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-200 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">SM</span>
            </div>
            <p className="font-display font-bold text-white text-[15px]">Student Management System</p>
          </div>
          <p className="text-sm text-forest-400 mt-4 leading-relaxed">
            Role-aware school management — built for admins, teachers and students alike.
          </p>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Navigate</p>
          <div className="flex flex-col gap-2 text-sm text-forest-400">
            <Link to="/" className="hover:text-brand-400 transition">Home</Link>
            <Link to="/about" className="hover:text-brand-400 transition">About</Link>
            <Link to="/signin" className="hover:text-brand-400 transition">Sign In</Link>
            <Link to="/signup" className="hover:text-brand-400 transition">Sign Up</Link>
          </div>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Contact</p>
          <div className="flex flex-col gap-2.5 text-sm text-forest-400">
            <span className="flex items-center gap-2"><Icon name="info" className="w-4 h-4 text-brand-400" /> hello@studentms.com</span>
            <span className="flex items-center gap-2"><Icon name="info" className="w-4 h-4 text-brand-400" /> +252 61 7971076</span>
            <span className="flex items-center gap-2"><Icon name="info" className="w-4 h-4 text-brand-400" /> Mogadishu, Somalia</span>
          </div>
        </div>

        <div>
          <p className="font-display font-bold text-white mb-3 text-sm">Stay updated</p>
          <p className="text-sm text-forest-400 mb-3">Product news, occasionally.</p>
          <div className="flex gap-2">
            <input placeholder="you@email.com" className="flex-1 px-3 py-2 rounded-lg bg-forest-900 border border-forest-800 text-sm text-white placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <button className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-forest-900 py-5 text-center text-xs text-forest-500">
        © 2026 Student Management System. All rights reserved.
      </div>
    </footer>
  );
}
