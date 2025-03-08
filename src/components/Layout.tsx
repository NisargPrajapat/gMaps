// // import React from 'react';
// // import { Outlet, Link, useNavigate } from 'react-router-dom';
// // import { Map, Navigation, Home, MapPin, User, LogOut } from 'lucide-react';

// // export default function Layout() {
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     navigate('/login');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <nav className="bg-white shadow-lg sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="flex justify-between h-16">
// //             <div className="flex space-x-8">
// //               <Link
// //                 to="/"
// //                 className="flex items-center space-x-2 text-gray-900 hover:text-blue-600"
// //               >
// //                 <Home size={24} />
// //                 <span className="font-semibold">Home</span>
// //               </Link>
// //               <Link
// //                 to="/navigation"
// //                 className="flex items-center space-x-2 text-gray-900 hover:text-blue-600"
// //               >
// //                 <Navigation size={24} />
// //                 <span className="font-semibold">Navigate</span>
// //               </Link>
// //               <Link
// //                 to="/nearby"
// //                 className="flex items-center space-x-2 text-gray-900 hover:text-blue-600"
// //               >
// //                 <MapPin size={24} />
// //                 <span className="font-semibold">Nearby</span>
// //               </Link>
// //               <Link
// //                 to="/summary"
// //                 className="flex items-center space-x-2 text-gray-900 hover:text-blue-600"
// //               >
// //                 <Map size={24} />
// //                 <span className="font-semibold">Summary</span>
// //               </Link>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <Link
// //                 to="/profile"
// //                 className="flex items-center space-x-2 text-gray-900 hover:text-blue-600"
// //               >
// //                 <User size={24} />
// //                 <span className="font-semibold">Profile</span>
// //               </Link>
// //               <button
// //                 onClick={handleLogout}
// //                 className="flex items-center space-x-2 text-red-600 hover:text-red-700"
// //               >
// //                 <LogOut size={24} />
// //                 <span className="font-semibold">Logout</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </nav>
// //       <main className="max-w-7xl mx-auto px-4 py-6">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }

// import React from 'react';
// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { Map, Navigation, Home, MapPin, User, LogOut, Menu, X } from 'lucide-react';

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const NavLink = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
//     const isActive = location.pathname === to;
//     return (
//       <Link
//         to={to}
//         onClick={() => setIsMenuOpen(false)}
//         className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
//           isActive 
//             ? 'bg-blue-100 text-blue-700' 
//             : 'text-gray-700 hover:bg-gray-100'
//         }`}
//       >
//         <Icon size={20} />
//         <span className="font-medium">{label}</span>
//       </Link>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile Header */}
//       <header className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
//         <div className="flex items-center justify-between p-4">
//           <Link to="/" className="flex items-center space-x-2">
//             <Home size={24} />
//             <span className="font-semibold">Route Planner</span>
//           </Link>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16">
//           <nav className="p-4 space-y-2">
//             <NavLink to="/navigation" icon={Navigation} label="Navigate" />
//             <NavLink to="/nearby" icon={MapPin} label="Nearby" />
//             <NavLink to="/summary" icon={Map} label="Summary" />
//             <NavLink to="/profile" icon={User} label="Profile" />
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
//             >
//               <LogOut size={20} />
//               <span className="font-medium">Logout</span>
//             </button>
//           </nav>
//         </div>
//       )}

//       {/* Desktop Navigation */}
//       <nav className="hidden lg:block bg-white shadow-lg fixed w-full z-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-between h-16">
//             <div className="flex space-x-8">
//               <NavLink to="/navigation" icon={Navigation} label="Navigate" />
//               <NavLink to="/nearby" icon={MapPin} label="Nearby" />
//               <NavLink to="/summary" icon={Map} label="Summary" />
//             </div>
//             <div className="flex items-center space-x-4">
//               <NavLink to="/profile" icon={User} label="Profile" />
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 text-red-600 hover:text-red-700 p-3"
//               >
//                 <LogOut size={20} />
//                 <span className="font-medium">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="pt-16 lg:pt-20 pb-6 px-4">
//         <div className="max-w-7xl mx-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, Navigation, Home, MapPin, User, LogOut, Info, Phone, Compass, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/navigation', icon: Navigation, label: 'Navigate' },
    { path: '/nearby', icon: MapPin, label: 'Nearby' },
    { path: '/summary', icon: Map, label: 'Summary' },
    { path: '/location', icon: Compass, label: 'Location' },
    { path: '/about', icon: Info, label: 'About' },
    { path: '/contact', icon: Phone, label: 'Contact' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle and Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} className="text-yellow-400" />}
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`
        fixed top-0 left-0 w-full h-full md:h-auto md:relative
        bg-white dark:bg-gray-800 shadow-lg z-40
        transform transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="md:flex md:justify-between md:h-16">
            {/* Menu Items */}
            <div className="flex flex-col md:flex-row md:space-x-8 pt-16 md:pt-0">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 md:py-0 rounded-lg
                    transition-colors duration-200
                    ${isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon size={24} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-3 md:py-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <LogOut size={24} />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}