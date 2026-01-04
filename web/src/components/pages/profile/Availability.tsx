import React from "react";
import ProfileLayout from "@/components/layout/ProfileLayout";

export default function Availability() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl text-gray-900 mb-4">Availability</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Timezone: UTC</option>
            <option>GMT+1</option>
            <option>GMT-5</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Minimum session: 1h</option>
            <option>2h</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Start hour: 09:00</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>End hour: 18:00</option>
          </select>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Day</th>
                <th className="p-3">Available</th>
                <th className="p-3">Working Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {days.map((d) => (
                <tr key={d}>
                  <td className="p-3 text-gray-900">{d}</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      defaultChecked={[
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                      ].includes(d)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <input
                        className="border border-gray-300 rounded-lg px-3 py-1 w-24"
                        defaultValue="09:00"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        className="border border-gray-300 rounded-lg px-3 py-1 w-24"
                        defaultValue="18:00"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600">
            Save Availability
          </button>
        </div>
      </div>
  );
}
