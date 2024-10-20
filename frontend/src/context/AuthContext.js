// src/Context/AuthContext.js

import React, { createContext, useContext, useReducer } from 'react';

// Initial state for authentication
const initialState = {
  user: null,
  isAuthenticated: false,
};

// Authentication actions
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const REGISTER = 'REGISTER'; // New action for registration

// Authentication reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload, isAuthenticated: true };
    case LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    case REGISTER: // Handle user registration
      return { ...state, user: action.payload, isAuthenticated: true };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user) => {
    dispatch({ type: LOGIN, payload: user });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const register = async (firstName, lastName, email, password) => {
    // Here you would call your API to register the user
    // For demonstration, we'll simulate a successful registration
    const user = { firstName, lastName, email }; // Simulated user object

    // Simulate a successful registration with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dispatch the REGISTER action
    dispatch({ type: REGISTER, payload: user });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
