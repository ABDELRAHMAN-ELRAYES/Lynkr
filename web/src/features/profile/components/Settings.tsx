import { useState } from "react";

export default function SettingsSection() {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h1 className="text-xl text-gray-900 mb-6">Settings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Display Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              defaultValue="Dr. Amina Khalid"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Language
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
            </select>
          </div>
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600">
          Save Settings
        </button>
      </div>
    </div>
  );
}
