import { Link } from 'react-router-dom';
import { Home, Search, Mail } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">


      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-8xl font-bold text-[#7682e8] mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Oops! The page you're looking for seems to have taken a freelance gig elsewhere.
              Let's get you back to finding amazing talent or projects.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="bg-[#7682e8] text-white  px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                style={{ color: "white" }}
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
              <Link
                to="/discover"
                className="border px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center"
                style={{ color: "#7682e8", borderColor: "#7682e8" }}
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Talent
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-indigo-200 rounded-full flex items-center justify-center">
                <svg className="w-48 h-48 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M12 3V5M18 12H20M5 12H7M12 19V21M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Need help?</p>
                    <p className="text-indigo-600 font-semibold">support@lynkr.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default NotFoundPage;