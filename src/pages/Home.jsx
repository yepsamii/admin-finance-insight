import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          React Boilerplate
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          A modern starter kit for your next web application
        </p>
        
        <div className="bg-white border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Technologies Included
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">React</h3>
              <p className="text-sm text-gray-600 mt-1">UI Library</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Vite</h3>
              <p className="text-sm text-gray-600 mt-1">Build Tool</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">React Router</h3>
              <p className="text-sm text-gray-600 mt-1">Routing</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-sm text-gray-600 mt-1">Styling</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Axios</h3>
              <p className="text-sm text-gray-600 mt-1">HTTP Client</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">TanStack Query</h3>
              <p className="text-sm text-gray-600 mt-1">Data Fetching</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/about"
            className="px-6 py-3 bg-gray-900 text-white font-medium text-center hover:bg-gray-800 transition-colors"
          >
            Explore About
          </Link>
          
          <Link
            to="/users"
            className="px-6 py-3 bg-white text-gray-900 border border-gray-200 font-medium text-center hover:bg-gray-50 transition-colors"
          >
            View Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;