
"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NavigationData from "./NavigationData";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "../../auth/AuthModel";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../state/auth/Action";

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const pickFirstName = (user, jwt) => {
  const fromUser =
    user?.firstName ||
    user?.firstname ||
    user?.first_name ||
    user?.givenName ||
    user?.given_name ||
    user?.name?.split(" ")?.[0] ||
    user?.fullName?.split(" ")?.[0] ||
    user?.full_name?.split(" ")?.[0] ||
    user?.email?.split("@")?.[0];
  if (fromUser) return fromUser;

  const jwtPayload = decodeJwtPayload(jwt);
  return (
    jwtPayload?.firstName ||
    jwtPayload?.firstname ||
    jwtPayload?.first_name ||
    jwtPayload?.given_name ||
    jwtPayload?.name?.split(" ")?.[0] ||
    jwtPayload?.email?.split("@")?.[0] ||
    "User"
  );
};

function Navigation() {
  const [open, setOpen] = useState(false); // mobile menu
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------------------------------
     🔐 TEMP AUTH STATE
  ------------------------------------------------------- */
  const { user, jwt } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(user || jwt);
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const showAuthModal = isAuthRoute && !isLoggedIn;
  const firstName = pickFirstName(user, jwt);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    firstName
  )}&background=random`;

  useEffect(() => {
    if (jwt && !user) {
      dispatch(getUser());
    }
  }, [jwt, user, dispatch]);

  useEffect(() => {
    if (isAuthRoute && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isAuthRoute, isLoggedIn, navigate]);

  /* -------------------------------------------------------
     🔧 HELPERS
  ------------------------------------------------------- */
  const handleOpenLogin = () => {
    navigate("/login");
  };

  const handleOpenRegister = () => {
    navigate("/register");
  };

  const handleCloseAuth = () => {
    if (isAuthRoute) {
      navigate("/", { replace: true });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setOpen(false);
  };

  const slugify = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

  const handleCategoryClick = (category, section, item, close) => {
    const categorySlug = item.slug || slugify(item.name);
    navigate(`/${category.id}/${section.id}/${categorySlug}`);
    if (close) close();
  };

  const goTo = (path, close) => {
    navigate(path);
    if (close) close();
  };

  
  return (
    <div className="bg-white">
      {/* =====================================================
         📱 MOBILE MENU
      ===================================================== */}
      {open && (
        <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
            {/* ---------- Close button ---------- */}
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="size-6" />
              </button>
            </div>

            {/* ---------- Category Tabs ---------- */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {NavigationData.categories.map((category) => (
                    <Tab
                      key={category.id}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels as={Fragment}>
                {NavigationData.categories.map((category) => (
                  <TabPanel
                    key={category.id}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    {/* ---------- Featured cards ---------- */}
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item, i) => (
                        <div key={i} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <button
                            onClick={() => goTo(`/${category.id}`, setOpen)}
                            className="mt-6 block w-full text-left font-medium text-gray-900"
                          >
                            {item.name}
                          </button>
                          <p className="mt-1 text-gray-500">Shop now</p>
                        </div>
                      ))}
                    </div>

                    {/* ---------- Sections ---------- */}
                    {category.sections.map((section) => (
                      <div key={section.id}>
                        <p className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul className="mt-6 flex flex-col space-y-6">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <button
                                onClick={() =>
                                  handleCategoryClick(
                                    category,
                                    section,
                                    item,
                                    setOpen
                                  )
                                }
                                className="block w-full text-left text-gray-500 hover:text-gray-800"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* ---------- Static pages ---------- */}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {NavigationData.pages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => goTo(page.href, setOpen)}
                  className="block w-full text-left font-medium text-gray-900"
                >
                  {page.name}
                </button>
              ))}
            </div>

            {/* ---------- Mobile Auth ---------- */}
            <div className="border-t border-gray-200 px-4 py-6 space-y-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      handleOpenLogin();
                      setOpen(false);
                    }}
                    className="block w-full text-left font-medium text-gray-900"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => {
                      handleOpenRegister();
                      setOpen(false);
                    }}
                    className="block w-full text-left font-medium text-gray-900"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      className="h-9 w-9 rounded-full"
                      alt="User"
                    />
                    <p className="font-medium text-gray-900">{firstName}</p>
                  </div>

                  <button
                    onClick={() => goTo("/profile", setOpen)}
                    className="block w-full text-left text-gray-600 hover:text-gray-900"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => goTo("/orders", setOpen)}
                    className="block w-full text-left text-gray-600 hover:text-gray-900"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => goTo("/account/payments", setOpen)}
                    className="block w-full text-left text-gray-600 hover:text-gray-900"
                  >
                    Payment History
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      {/* =====================================================
         💻 DESKTOP HEADER
      ===================================================== */}
      <header className="relative bg-white">
        {/* Top banner */}
        <p className="flex h-10 items-center justify-center bg-indigo-500 px-4 text-sm font-medium text-white">
          Get free delivery on orders over $100
        </p>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* ---------- Mobile menu button ---------- */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="size-6" />
              </button>

              {/* ---------- Logo ---------- */}
              <div className="ml-4 flex lg:ml-0">
                <button onClick={() => navigate("/")}>
                  <img
                    alt="Logo"
                    src="https://t3.ftcdn.net/jpg/16/63/69/14/240_F_1663691440_c1nKHInif12j2LrgdIufPHG0hBoB3SyB.jpg"
                    className="h-10 w-auto"
                  />
                </button>
              </div>

              {/* ---------- Desktop Categories ---------- */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {NavigationData.categories.map((category) => (
                    <Popover key={category.id} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-800 data-open:text-indigo-600">
                          {category.name}
                          <span className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition group-data-open:bg-indigo-600" />
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0"
                      >
                        {({ close }) => (
                          <>
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 top-1/2 bg-white shadow-sm"
                            />
                            <div className="relative bg-white">
                              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                  {/* Featured */}
                                  <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                    {category.featured.map((item, i) => (
                                      <div
                                        key={i}
                                        className="group relative text-base sm:text-sm"
                                      >
                                        <img
                                          alt={item.imageAlt}
                                          src={item.imageSrc}
                                          className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                        />
                                        <button
                                          onClick={() => {
                                            goTo(`/${category.id}`);
                                            close();
                                          }}
                                          className="mt-6 block text-left font-medium text-gray-900"
                                        >
                                          {item.name}
                                        </button>
                                        <p className="mt-1">Shop now</p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Sections */}
                                  <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                    {category.sections.map((section) => (
                                      <div key={section.id}>
                                        <p className="font-medium text-gray-900">
                                          {section.name}
                                        </p>
                                        <ul className="mt-6 space-y-4">
                                          {section.items.map((item) => (
                                            <li key={item.name}>
                                              <button
                                                onClick={() =>
                                                  handleCategoryClick(
                                                    category,
                                                    section,
                                                    item,
                                                    close
                                                  )
                                                }
                                                className="hover:text-gray-800"
                                              >
                                                {item.name}
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {/* ---------- Static pages ---------- */}
                  {NavigationData.pages.map((page) => (
                    <button
                      key={page.name}
                      onClick={() => goTo(page.href)}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </button>
                  ))}
                </div>
              </PopoverGroup>

              {/* =================================================
                 👉 RIGHT SIDE (Search, User, Cart)
              ================================================= */}
              <div className="ml-auto flex items-center">
                {/* ---------- User / Auth ---------- */}
                <div className="hidden lg:flex lg:items-center lg:space-x-6">
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={handleOpenLogin}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </button>
                      <span className="h-6 w-px bg-gray-200" />
                      <button
                        onClick={handleOpenRegister}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <Popover className="relative">
                      <PopoverButton className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200">
                        <img
                          src={avatarUrl}
                          alt="User"
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span>{firstName}</span>
                      </PopoverButton>

                      <PopoverPanel className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                        {({ close }) => (
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate("/account/profile");
                                close();
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Profile
                            </button>

                            <button
                              onClick={() => {
                                navigate("/account/order");
                                close();
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              My Orders
                            </button>

                            <button
                              onClick={() => {
                                navigate("/account/payments");
                                close();
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Payment History
                            </button>

                            <button
                              onClick={() => {
                                handleLogout();
                                close();
                              }}
                              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                              Logout
                            </button>
                          </div>
                        )}
                      </PopoverPanel>
                    </Popover>
                  )}
                </div>

                {/* ---------- Search ---------- */}
                <div className="flex lg:ml-6">
                  <button
                    onClick={() => navigate("/search")}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <MagnifyingGlassIcon className="size-6" />
                  </button>
                </div>

                {/* ---------- Cart ---------- */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    onClick={() => navigate("/cart")}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* =====================================================
         🔐 AUTH MODAL
      ===================================================== */}
      <AuthModal open={showAuthModal} handleClose={handleCloseAuth} />
    </div>
  );
}

export default Navigation;
