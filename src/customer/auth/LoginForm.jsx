import { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { login, getUser, clearAuthError } from "../../state/auth/Action";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jwt, user, isLoading, error } = useSelector((state) => state.auth);

  const getRole = (sourceUser) =>
    String(sourceUser?.role || sourceUser?.authorities?.[0]?.authority || "").toUpperCase();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser());
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    if (!jwt || !user) return;
    const role = getRole(user);
    if (role === "ADMIN" || role === "ROLE_ADMIN") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
  }, [jwt, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    dispatch(login(loginData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Secure Sign In
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
        <p className="mt-1 text-sm text-slate-500">Login to continue shopping</p>
      </div>

      <div className="relative">
        <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email Address"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <div className="relative">
        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-10 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-200 transition ${isLoading ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5 hover:shadow-xl"}`}
      >
        {isLoading ? "Logging In..." : "Login"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <span
          onClick={() => {
            dispatch(clearAuthError());
            navigate("/register");
          }}
          className="cursor-pointer font-semibold text-emerald-700 hover:underline"
        >
          Register
        </span>
      </p>
    </form>
  );
}
