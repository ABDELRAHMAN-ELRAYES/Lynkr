import React from "react";
import ProfileLayout from "@/shared/components/layout/ProfileLayout";
import { Plus, DollarSign, Package, Calendar, FileText } from "lucide-react";

export default function ServicesPricing() {
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-gray-900">Services & Pricing</h1>
          <button className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Create New Service
          </button>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-medium">Service</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Delivery</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  name: "CFD Simulation (Steady-state)",
                  type: "Fixed",
                  price: "$1200",
                  delivery: "7 days",
                },
                {
                  name: "Thermal Analysis Consultation",
                  type: "Hourly",
                  price: "$85/hr",
                  delivery: "—",
                },
              ].map((s) => (
                <tr key={s.name} className="text-gray-700">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.type}</td>
                  <td className="p-3">{s.price}</td>
                  <td className="p-3">{s.delivery}</td>
                  <td className="p-3 text-right space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Pricing Rules
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Hourly minimum billable time: 1h</li>
            <li>Rush fee: +25% for delivery &lt; 72h</li>
            <li>Weekend work: +15%</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center">
            <Package className="w-4 h-4 mr-2" /> Packages
          </h2>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Starter CFD Package</p>
                  <p className="text-sm text-gray-600">
                    Mesh + steady-state results
                  </p>
                </div>
                <span className="text-gray-900 font-medium">$750</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Advanced Thermal Study</p>
                  <p className="text-sm text-gray-600">
                    Transient + design iteration
                  </p>
                </div>
                <span className="text-gray-900 font-medium">$2,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
