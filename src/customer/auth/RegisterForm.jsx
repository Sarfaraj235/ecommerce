import { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { register, getUser, clearAuthError } from "../../state/auth/Action";
import { useNavigate } from "react-router-dom";

const fields = [
  { name: "firstName", type: "text", placeholder: "First Name" },
  { name: "lastName", type: "text", placeholder: "Last Name" },
  { name: "email", type: "email", placeholder: "Email Address" },
];

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jwt, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser());
      navigate("/");
    }
  }, [jwt, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    dispatch(register(userData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          Create Account
        </div>
        <h2 className="text-2xl font-bold tracking-normal text-slate-900">Start Shopping With Us</h2>
        <p className="mt-1 text-sm text-slate-500">Set up your account in a minute</p>
      </div>

      {fields.map((field) => (
        <div key={field.name} className="relative">
          {field.name === "email" ? (
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          ) : (
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          )}
          <input
            type={field.type}
            name={field.name}
            required
            placeholder={field.placeholder}
            autoComplete={field.name}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>
      ))}

      <div className="relative">
        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          autoComplete="new-password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-10 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
        className={`w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-sky-200 transition ${isLoading ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5 hover:shadow-xl"}`}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <span
          onClick={() => {
            dispatch(clearAuthError());
            navigate("/login");
          }}
          className="cursor-pointer font-semibold text-sky-700 hover:underline"
        >
          Login
        </span>
      </p>
    </form>
  );
}
