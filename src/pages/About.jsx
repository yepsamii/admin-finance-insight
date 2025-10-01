import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const features = [
    { text: 'Fast development with Vite and HMR' },
    { text: 'Client-side routing with React Router DOM' },
    { text: 'Utility-first CSS with Tailwind' },
    { text: 'Data fetching with TanStack Query and Axios' },
    { text: 'SEO optimization with React Helmet Async' },
  ];

  return (
    <>
      <Helmet>
        <title>About - React Boilerplate</title>
        <meta name="description" content="Learn more about this React boilerplate project" />
      </Helmet>
      
      <div className="min-h-screen p-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About This Boilerplate
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A cutting-edge React starter template configured with the latest tools and best practices
              for building scalable, modern web applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">
                Key Features
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-100">
                    <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">
                Getting Started
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    1. Installation
                  </h3>
                  <div className="bg-gray-100 p-4 border border-gray-200">
                    <code className="text-gray-900 font-mono text-sm">npm install</code>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    2. Development
                  </h3>
                  <div className="bg-gray-100 p-4 border border-gray-200">
                    <code className="text-gray-900 font-mono text-sm">npm run dev</code>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    3. Build for Production
                  </h3>
                  <div className="bg-gray-100 p-4 border border-gray-200">
                    <code className="text-gray-900 font-mono text-sm">npm run build</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h3>
            <p className="mb-6 text-gray-300">
              Start creating your next React application with this powerful boilerplate.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;