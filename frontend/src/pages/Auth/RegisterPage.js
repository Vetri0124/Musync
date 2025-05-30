// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import  Button  from '../../components/Button/Button';
// import { FormContainer, FormGroup, FormInput, FormLabel } from './RegisterPage.styles';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const { register } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       await register(formData);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <FormContainer>
//       <h2>Register</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <FormGroup>
//           <FormLabel>Name</FormLabel>
//           <FormInput
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </FormGroup>
//         <FormGroup>
//           <FormLabel>Email</FormLabel>
//           <FormInput
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </FormGroup>
//         <FormGroup>
//           <FormLabel>Password</FormLabel>
//           <FormInput
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </FormGroup>
//         <FormGroup>
//           <FormLabel>Confirm Password</FormLabel>
//           <FormInput
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         </FormGroup>
//         <Button type="submit">Register</Button>
//       </form>
//       <p>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </FormContainer>
//   );
// };

// export default RegisterPage;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import { FormContainer, FormGroup, FormInput, FormLabel } from './RegisterPage.styles';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '', // Changed 'name' to 'username' to match backend schema
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Log the formData being sent
    console.log('Registering with data:', formData);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      // Log the full error response from the backend
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <FormContainer>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Username</FormLabel> {/* Changed label from 'Name' to 'Username' */}
          <FormInput
            type="text"
            name="username" // Changed name attribute to 'username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit">Register</Button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </FormContainer>
  );
};

export default RegisterPage;
