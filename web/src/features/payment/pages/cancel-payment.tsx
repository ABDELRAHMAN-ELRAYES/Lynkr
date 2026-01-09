import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "C2zqLWZoPwHU0R8x9Zc7iSXftRK4yvzTXPfpz3CC1LPTu2NrSio79XF1d5k4vfVQK00OARtmivg"
);

const CancelPayment: React.FC = () => {
  return (
    <h1 className="text-7xl text-rose-400">Payment is canceled</h1>
  );
};

export default CancelPayment;
