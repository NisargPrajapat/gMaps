// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Eye, EyeOff } from 'lucide-react';

// interface FormData {
//   email: string;
//   password: string;
//   confirmPassword: string;
//   name: string;
//   phone: string;
//   address: string;
// }

// interface ValidationErrors {
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
//   name?: string;
//   phone?: string;
//   address?: string;
// }

// export default function Register() {
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     phone: '',
//     address: '',
//   });

//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};

//     // Name validation - only letters and spaces allowed
//     if (!formData.name) {
//       newErrors.name = 'Name is required';
//     } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
//       newErrors.name = 'Name can only contain letters and spaces';
//     } else if (formData.name.length < 2) {
//       newErrors.name = 'Name must be at least 2 characters long';
//     }

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters long';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
//     }

//     // Confirm password validation
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     // Phone validation
//     if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
//       newErrors.phone = 'Invalid phone number format';
//     }

//     // Address validation
//     if (!formData.address) {
//       newErrors.address = 'Address is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error('Please fix the errors in the form');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//           name: formData.name.trim(),
//           phone: formData.phone,
//           address: formData.address,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       localStorage.setItem('token', data.token);
//       toast.success('Registration successful!');
//       navigate('/navigation');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Registration failed');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // For name field, prevent non-letter characters from being entered
//     if (name === 'name' && value && !/^[A-Za-z\s]*$/.test(value)) {
//       return;
//     }

//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name as keyof ValidationErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//             Create your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             {/* Name Field */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Full Name
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                   errors.name ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                 placeholder="John Doe"
//               />
//               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                   errors.email ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                 placeholder="you@example.com"
//               />
//               {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//             </div>

//             {/* Phone Field */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Phone Number
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                   errors.phone ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                 placeholder="+1 (555) 123-4567"
//               />
//               {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
//             </div>

//             {/* Address Field */}
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Address
//               </label>
//               <textarea
//                 id="address"
//                 name="address"
//                 required
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows={3}
//                 className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                   errors.address ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                 placeholder="Enter your address"
//               />
//               {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                     errors.password ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`appearance-none rounded relative block w-full px-3 py-2 border ${
//                     errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Sign up
//             </button>
//           </div>

//           <div className="text-center">
//             <button
//               type="button"
//               onClick={() => navigate('/login')}
//               className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
//             >
//               Already have an account? Sign in
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  address: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  address?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) newErrors.name = 'Only letters allowed';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name.trim(),
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      navigate('/navigation');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-50 via-blue-100 to-sky-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Text Inputs */}
          {[
            { id: 'name', type: 'text', placeholder: 'Full Name' },
            { id: 'email', type: 'email', placeholder: 'Email Address' },
            { id: 'phone', type: 'tel', placeholder: 'Phone Number' }
          ].map(({ id, type, placeholder }) => (
            <div key={id}>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={formData[id as keyof FormData]}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 text-[15px] border ${
                  errors[id as keyof ValidationErrors] ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-400`}
              />
              {errors[id as keyof ValidationErrors] && (
                <p className="text-sm text-red-600 mt-1">{errors[id as keyof ValidationErrors]}</p>
              )}
            </div>
          ))}

          {/* Address */}
          <div>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-[15px] border ${
                errors.address ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-green-400`}
            />
            {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
          </div>

          {/* Passwords */}
          {[
            { id: 'password', show: showPassword, toggle: setShowPassword },
            { id: 'confirmPassword', show: showConfirmPassword, toggle: setShowConfirmPassword }
          ].map(({ id, show, toggle }) => (
            <div className="relative" key={id}>
              <input
                id={id}
                name={id}
                type={show ? 'text' : 'password'}
                placeholder={id === 'password' ? 'Password' : 'Confirm Password'}
                value={formData[id as keyof FormData]}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-[15px] border ${
                  errors[id as keyof ValidationErrors] ? 'border-red-400' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-green-400`}
              />
              <button
                type="button"
                onClick={() => toggle(!show)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors[id as keyof ValidationErrors] && (
                <p className="text-sm text-red-600 mt-1">{errors[id as keyof ValidationErrors]}</p>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
