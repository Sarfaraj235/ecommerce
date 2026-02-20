import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Stepper from "./Stepper";
import AddressForm from "./AddressForm";
import OrderSummary from "./OrderSummary";
import Payment from "./Payment";
import { getCart } from "../../../state/cart/Action";

const CHECKOUT_ADDRESS_KEY = "checkout_address";

const clampStep = (value) => {
  const step = Number(value);
  if (!Number.isFinite(step)) return 1;
  return Math.min(4, Math.max(1, step));
};

export default function CheckOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jwt } = useSelector((state) => state.auth);
  const orderId = searchParams.get("order_id");

  const queryStep = useMemo(() => clampStep(searchParams.get("step")), [searchParams]);
  const [step, setStep] = useState(queryStep);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem(CHECKOUT_ADDRESS_KEY);
    if (!savedAddress) return;
    try {
      setAddress(JSON.parse(savedAddress));
    } catch {
      localStorage.removeItem(CHECKOUT_ADDRESS_KEY);
    }
  }, []);

  useEffect(() => {
    setStep(queryStep);
  }, [queryStep]);

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      return;
    }
    dispatch(getCart());
  }, [dispatch, jwt, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Stepper step={step} />

        <div className="mt-6">
          {step === 1 && <AddressForm setStep={setStep} setAddress={setAddress} />}
          {step === 2 && (
            <AddressForm
              setStep={setStep}
              setAddress={setAddress}
              nextStep={3}
              createOrderOnSubmit
            />
          )}
          {step === 3 && <OrderSummary setStep={setStep} address={address} orderId={orderId} />}
          {step === 4 && <Payment setStep={setStep} orderId={orderId} address={address} />}
        </div>
      </div>
    </div>
  );
}
