import React, { useState } from "react";
import ProfileLayout from "@/shared/components/layout/ProfileLayout";

export default function SettingsSection() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);

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

          <div className="space-y-4">
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div>
                <p className="text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive updates and messages via email
                </p>
              </div>
              <button
                onClick={() => setNotifEmail(!notifEmail)}
                className={`relative w-11 h-6 rounded-full ${
                  notifEmail ? "bg-brand-blue" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifEmail ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div>
                <p className="text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">
                  Enable browser notifications
                </p>
              </div>
              <button
                onClick={() => setNotifPush(!notifPush)}
                className={`relative w-11 h-6 rounded-full ${
                  notifPush ? "bg-brand-blue" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifPush ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
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
