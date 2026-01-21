import { useState } from "react";
import { Star, EyeOff, Bold, Italic, List, Link, Plus } from "lucide-react";

export default function Profile() {
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <>
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/6268682ad9d29eae98db9d5430565c52e74a3b10?width=192"
              alt="Dr. Amina Khalid"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Dr. Amina Khalid
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                Thermal & CFD Specialist
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold">4.9</span>
                  <span className="ml-1">
                    (<span className="font-bold">127</span> reviews)
                  </span>
                </div>
                <span>|</span>
                <span>
                  <span className="font-bold">98</span>% response rate
                </span>
                <span>|</span>
                <span>English, Arabic, French</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <button className="cursor-pointer text-nowrap flex items-center h-[2.5rem] px-6 py-2 text-white text-xs rounded-lg bg-[#7682e8]">
                Edit profile
              </button>
              <button className="cursor-pointer h-[2.5rem] p-2 border border-gray-600 rounded-lg flex gap-4 items-center">
                <p className="text-xs text-gray-600 text-center">Anonymize</p>

                <EyeOff className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <button className="cursor-pointer px-6 py-2 border border-gray-600 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
              Preview Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            85<span className="text-xs text-gray-500">$</span>
          </div>
          <div className="text-sm text-gray-500">Avg hourly</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            2<span className="text-xs text-gray-500">h</span>
          </div>
          <div className="text-xs text-gray-500">Response time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">7</div>
          <div className="text-xs text-gray-500">Active jobs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            12,450<span className="text-xs text-gray-500">$</span>
          </div>
          <div className="text-xs text-gray-500">
            Earnings (<span className="font-bold">30</span>d)
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            96<span className="text-xs text-gray-500">%</span>
          </div>
          <div className="text-xs text-gray-500">Completion rate</div>
        </div>
      </div>

      {/* Public Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-gray-900">Public Profile Information</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Public Profile</span>
            <button
              onClick={() => setPublicProfile(!publicProfile)}
              className={`relative w-11 h-6 rounded-full transition-colors ${publicProfile ? "bg-brand-blue" : "bg-gray-300"
                }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${publicProfile ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Professional Bio */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">
            Professional Bio
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bold className="w-3 h-3 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Italic className="w-3 h-3 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <List className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Link className="w-5 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">
              PhD in Mechanical Engineering with 8+ years of experience in
              computational fluid dynamics and thermal analysis. Specialized in
              ANSYS Fluent, OpenFOAM, and custom CFD solutions for aerospace and
              automotive applications...
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-700">Education</label>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
              <Plus className="w-3 h-3 mr-1" />
              Add Degree
            </button>
          </div>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="font-normal text-gray-900">
                  PhD in Mechanical Engineering
                </h4>
                <p className="text-gray-600">MIT • 2018</p>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Edit
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="font-normal text-gray-900">
                  MSc in Aerospace Engineering
                </h4>
                <p className="text-gray-600">Stanford University • 2014</p>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Research Interests */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-3">
            Research Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Computational Fluid Dynamics
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Heat Transfer
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Turbulence Modeling
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Aerospace Applications
            </span>
          </div>
          <input
            type="text"
            placeholder="Add research interest..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        {/* Academic & Social Links */}
        <div className="mb-8">
          <label className="block text-sm text-gray-700 mb-3">
            Academic & Social Links
          </label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="https://orcid.org/0000-0002-1825-0097"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <input
              type="text"
              placeholder="Google Scholar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <input
              type="text"
              placeholder="LinkedIn Profile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
          <div className="flex space-x-3">
            <button className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
              Preview Public Profile
            </button>
            <button className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
              Download CV
            </button>
          </div>
          <div className="flex space-x-3">
            <button className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button className="cursor-pointer px-4 py-2 bg-[#7682e8] text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
