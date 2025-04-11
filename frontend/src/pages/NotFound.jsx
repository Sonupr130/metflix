import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import notFound from "../assets/notfound.jpg"

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Image */}
        <div className="mb-1 mx-auto max-w-md">
          <img
            src={notFound}
            alt="404 Not Found"
            className="w-full h-auto"
          />
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Centered Button Container */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="
              flex items-center justify-center 
              px-[33px] py-[16px] 
              rounded-[9px] 
              bg-[#d5f365] 
              font-inherit 
              text-center 
              cursor-pointer 
              transition-all 
              duration-200 
              ease-in-out
              hover:shadow-[7px_5px_56px_-14px_#C3D900]
              active:scale-[0.97] 
              active:shadow-[7px_5px_56px_-10px_#C3D900]
              focus:outline-none
              gap-2
            "
          >
            <ArrowLeft className="h-5 w-5" />
            <strong>Go Back Home</strong>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;