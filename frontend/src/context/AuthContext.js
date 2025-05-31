import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create and export AuthContext
export const AuthContext = createContext();

// Define your API base URL here.
// IMPORTANT: Replace 'http://localhost:5000' with the actual URL and port where your backend is running.
const API_BASE_URL = 'http://localhost:5000'; // Adjust this to your actual backend URL

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set Authorization header for API instance for subsequent requests
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await API.get('/api/auth/me'); // No need to pass headers again if set on instance
          setUser(res.data.data); // Assuming your /api/auth/me returns { success: true, data: user }
        }
      } catch (err) {
        console.error("Error checking auth status:", err.response?.data?.error || err.message);
        // If token is invalid or expired, clear it and log out user
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (email, password) => {
    try {
      const res = await API.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); // Assuming login response also sends user data
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; // Set header for future requests
      return res.data;
    } catch (err) {
      // Extract specific error message from backend if available, otherwise use generic
      const errorMessage = err.response && err.response.data && err.response.data.error
                           ? err.response.data.error
                           : err.message || "Login failed. Please try again.";
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage); // Re-throw a new Error with the specific message
    }
  };

  const register = async (formData) => {
    try {
      const res = await API.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); // Assuming register response also sends user data
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; // Set header for future requests
      return res.data;
    } catch (err) {
      // --- CORRECTED CATCH BLOCK FOR REGISTRATION ---
      // Extract specific error message from backend if available, otherwise use generic
      const errorMessage = err.response && err.response.data && err.response.data.error
                           ? err.response.data.error
                           : err.message || "Registration failed. Please try again.";
      console.error("Registration failed:", errorMessage);
      throw new Error(errorMessage); // Re-throw a new Error with the specific message
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization']; // Remove Authorization header
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthProvider
export { AuthProvider };


































// // import React, { createContext, useState, useEffect } from 'react';
// // import axios from 'axios';

// // const AuthContext = createContext();

// // const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         if (token) {
// //           const res = await axios.get('/api/auth/me', {
// //             headers: { Authorization: `Bearer ${token}` }
// //           });
// //           setUser(res.data);
// //         }
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     checkAuth();
// //   }, []);

// //   const login = async (email, password) => {
// //     const res = await axios.post('/api/auth/login', { email, password });
// //     localStorage.setItem('token', res.data.token);
// //     setUser(res.data.user);
// //   };

// //   const register = async (formData) => {
// //     const res = await axios.post('/api/auth/register', formData);
// //     localStorage.setItem('token', res.data.token);
// //     setUser(res.data.user);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export { AuthContext, AuthProvider };


// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // 1. Export AuthContext when it's created
// export const AuthContext = createContext(); // <--- Change this line to include 'export' here

// // Define your API base URL here.
// // IMPORTANT: Replace 'http://localhost:5000' with the actual URL and port where your backend is running.
// // If your backend routes are prefixed with something like /api/v1, you can include that here as well.
// const API_BASE_URL = 'http://localhost:5000'; // Adjust this to your actual backend URL

// const API = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const res = await API.get('/api/auth/me', {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           setUser(res.data);
//         }
//       } catch (err) {
//         console.error("Error checking auth status:", err.response?.data?.message || err.message);
//         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//              localStorage.removeItem('token');
//              setUser(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await API.post('/api/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       return res.data;
//     } catch (err) {
//       console.error("Login failed:", err.response?.data?.message || err.message);
//       throw err;
//     }
//   };

//   const register = async (formData) => {
//     try {
//       const res = await API.post('/api/auth/register', formData);
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       return res.data;
//     } catch (err) {
//       console.error("Registration failed:", err.response?.data?.message || err.message);
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 2. Only export AuthProvider here. AuthContext is already exported above.
// export { AuthProvider }; // <--- Change this line to only export AuthProvider