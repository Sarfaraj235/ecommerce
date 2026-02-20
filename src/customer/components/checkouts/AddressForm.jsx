import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../../state/order/Action";

const CHECKOUT_ADDRESS_KEY = "checkout_address";

export default function AddressForm({ setStep, setAddress, nextStep = 2, createOrderOnSubmit = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.order);
  const [validationError, setValidationError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setValidationError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateRequiredFields = (selectedAddress) => {
    if (!selectedAddress?.phone?.trim()) return "Mobile number is required.";
    if (!selectedAddress?.street?.trim()) return "Street is required.";
    if (!selectedAddress?.city?.trim()) return "City is required.";
    if (!selectedAddress?.state?.trim()) return "State is required.";
    return "";
  };

  const handleAddressSelection = (selectedAddress) => {
    const validationMessage = validateRequiredFields(selectedAddress);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    localStorage.setItem(CHECKOUT_ADDRESS_KEY, JSON.stringify(selectedAddress));
    setAddress(selectedAddress);
    if (createOrderOnSubmit) {
      dispatch(
        createOrder({
          address: selectedAddress,
          navigate,
        })
      );
      return;
    }
    if (typeof nextStep === "number") {
      setStep(nextStep);
    }
  };

  const submit = () => {
    handleAddressSelection(form);
  };

  const savedAddress = useMemo(() => {
    const value = localStorage.getItem(CHECKOUT_ADDRESS_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      localStorage.removeItem(CHECKOUT_ADDRESS_KEY);
      return null;
    }
  }, []);

  const useSavedAddress = () => {
    if (!savedAddress) return;
    handleAddressSelection(savedAddress);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Saved Address */}
      <div className="bg-white rounded shadow p-5">
        <h3 className="font-semibold mb-3">Saved Address</h3>
        {savedAddress ? (
          <>
            <p className="font-semibold">
              {savedAddress?.firstName} {savedAddress?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {savedAddress?.street}
              {savedAddress?.address ? `, ${savedAddress?.address}` : ""}
              {(savedAddress?.city || savedAddress?.zip) && ", "}
              {savedAddress?.city} {savedAddress?.zip}
            </p>
            <p className="text-sm text-gray-600 mt-1">Phone: {savedAddress?.phone}</p>
            <button
              onClick={useSavedAddress}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {loading ? "Creating Order..." : "Deliver Here"}
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600">No saved address found.</p>
        )}
      </div>

      {/* Address Form */}
      <div className="lg:col-span-2 bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Add New Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" onChange={handleChange} placeholder="First Name" className="input" />
          <input name="lastName" onChange={handleChange} placeholder="Last Name" className="input" />
          <input name="phone" onChange={handleChange} placeholder="Mobile Number *" className="input md:col-span-2" />
          <input name="street" onChange={handleChange} placeholder="Street *" className="input md:col-span-2" />
          <textarea name="address" onChange={handleChange} placeholder="Area / Landmark (Optional)" className="input md:col-span-2 h-24" />
          <input name="city" onChange={handleChange} placeholder="City *" className="input" />
          <input name="state" onChange={handleChange} placeholder="State *" className="input" />
          <input name="zip" onChange={handleChange} placeholder="Zip Code" className="input md:col-span-2" />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700"
        >
          {loading ? "Creating Order..." : "Deliver Here"}
        </button>
        {validationError && <p className="mt-3 text-sm text-red-600">{validationError}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
