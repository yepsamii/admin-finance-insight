import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';

const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

const Users = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <>
      <Helmet>
        <title>Users - React Boilerplate</title>
        <meta name="description" content="View list of users" />
      </Helmet>
      
      <div className="min-h-screen p-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Users Directory
            </h1>
            <p className="text-lg text-gray-600">
              Explore our community of users from around the world
            </p>
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading users...</div>
            </div>
          )}
          
          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
                <p className="text-red-600">{error.message}</p>
              </div>
            </div>
          )}
          
          {users && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center text-2xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-600">
                        {user.company?.name || 'Freelancer'}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-600">
                        {user.address?.city}, {user.address?.zipcode}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-600">
                        {user.website}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {users && users.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No users found</p>
              <p className="text-gray-400 mt-2">Check back later for new members</p>
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;