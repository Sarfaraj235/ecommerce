import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthModal({ open, handleClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeForm = location.pathname === "/register" ? "register" : "login";

  if (!open) return null;

  const closeModal = () => {
    handleClose();
    navigate("/", { replace: true });
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white to-slate-50 p-6 shadow-2xl shadow-slate-900/10">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
              {/* Tabs */}
              <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    activeForm === "login"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  LOGIN
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    activeForm === "register"
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  REGISTER
                </button>
              </div>

              {activeForm === "login" ? (
                <LoginForm />
              ) : (
                <RegisterForm />
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
