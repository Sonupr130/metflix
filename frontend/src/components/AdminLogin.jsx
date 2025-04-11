// import React, { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
//         email,
//         password
//       });

//       // Store token in localStorage or cookies
//       localStorage.setItem('adminToken', response.data.token);

//       // Show success message
//       toast.success('Login successful!');

//       // Redirect to admin dashboard
//       navigate('/admin-dashboard');
//     } catch (error) {
//       let errorMessage = 'Login failed';
//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       }
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background Image with Overlay */}
//       <div className="absolute inset-0 z-0">
//         <img 
//           src="https://wallpapers.com/images/featured/movie-9pvmdtvz4cb0xl37.jpg" 
//           alt="Movie Background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/80"></div>
//       </div>

//       {/* Glass Form Container */}
//       <div className="w-full max-w-md z-10">
//         {/* Logo */}
//         <div className="flex justify-center mb-8">
//           <div className="text-3xl font-bold text-white">
//             <span className="text-red-500">METFLIX</span> Admin
//           </div>
//         </div>

//         {/* Glass Form */}
//         <form 
//           onSubmit={handleSubmit}
//           className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-xl p-8"
//         >
//           <div className="mb-6">
//             <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg py-3 px-4 focus:outline-none focus:border-transparent"
//               id="email"
//               type="email"
//               placeholder="admin@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-8">
//             <label className="block text-white text-sm font-medium mb-2" htmlFor="password">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:border-transparent"
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <Eye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <button
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
//             type="submit"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Signing In...
//               </>
//             ) : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center text-white/70 text-sm mt-6">
//           &copy;{new Date().getFullYear()} Metflix | <span className='cursor-pointer hover:text-blue-500' onClick={() =>navigate('/')}>Back to Home</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;











import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password
      });

      localStorage.setItem('adminToken', response.data.token);
      toast.success('Login successful!');
      navigate('/admin-dashboard');
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Prevent scrolling on mobile */}
      <style jsx global>{`
        html, body {
          overflow: hidden;
          height: 100%;
        }
      `}</style>

      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://wallpapers.com/images/featured/movie-9pvmdtvz4cb0xl37.jpg" 
          alt="Movie Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Glass Form Container */}
      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-3xl font-bold text-white">
            <span className="text-red-500">METFLIX</span> Admin
          </div>
        </div>

        {/* Glass Form */}
        <form 
          onSubmit={handleSubmit}
          className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-xl p-8"
        >
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg py-3 px-4 focus:outline-none focus:border-transparent"
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-white text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:border-transparent"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          &copy;{new Date().getFullYear()} Metflix | <span className='cursor-pointer hover:text-blue-500' onClick={() =>navigate('/')}>Back to Home</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;