"use client";

import { apiClient } from "@/client/api-client";
import { useEffect, useState } from "react";

interface HourlyRateStepProps {
  hourlyRate: string;
  onUpdate: (hourlyRate: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function HourlyRateStep({
  hourlyRate,
  onUpdate,
  onNext,
  onBack,
}: HourlyRateStepProps) {
  const [commissionRate, setCommissionRate] = useState(15);
  const [rate, setRate] = useState(0);
  const [youllGet, setYoullGet] = useState(0);

  const handleOnChange = (e: any) => {
    const newRate = parseFloat(e.target.value) || 0;
    onUpdate(e.target.value);
    setRate(newRate);
    setYoullGet(newRate - newRate * (commissionRate / 100));
  };
  useEffect(() => {
    apiClient({ url: "/settings", options: { method: "GET" } }).then(
      (response) => {
        setCommissionRate(response.commission_rate);
      }
    );
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Now, let's set your hourly rate.
      </h2>
      <p className="text-gray-600 mb-8">
        Clients will see this rate on your profile and in search results once
        you publish your profile. You can adjust your rate every time you submit
        a proposal.
      </p>

      <div className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly rate
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Total amount the client will see
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={hourlyRate}
              onChange={handleOnChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              /hr
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium text-gray-900">Service fee</p>
              <button className="text-sm text-[#768de8] hover:underline">
                Learn more
              </button>
            </div>
            <p className="text-lg font-medium text-gray-900">
              ${commissionRate.toFixed(2)}{" "}
              <span className="text-gray-500">/hr</span>
            </p>
          </div>
          <p className="text-sm text-gray-600">
            This helps us run the platform and provide services like payment
            protection and customer support. Fees vary and are shown before
            contract acceptance.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">You'll get</p>
              <p className="text-sm text-gray-500">
                The estimated amount you'll receive after service fees
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${youllGet.toFixed(2)}{" "}
              <span className="text-gray-500 text-lg">/hr</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!hourlyRate || rate <= 0}
          className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#768de8]-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next: write your bio
        </button>
      </div>
    </div>
  );
}
