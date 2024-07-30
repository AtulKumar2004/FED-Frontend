import React, { createContext, useState, useEffect } from 'react';
import SendOtp from '../authentication/Login/ForgotPassword/SendOtp';
import OTPInput from '../authentication/Login/ForgotPassword/OTPInput';


export const RecoveryContext = createContext();

const componentMap = {
  SendOtp: SendOtp,
  otp: OTPInput,
};

const initialContext = {
  // page: 'SendOtp', // Initial page to render
  email: '',
  otp: '',
};

const RecoveryContextProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedEmail = localStorage.getItem('recoveryEmail') || '';
    const storedOTP = localStorage.getItem('recoveryOTP') || '';
    // const storedPage = localStorage.getItem('recoveryPage') ;
    return {
      ...initialContext,
      email: storedEmail,
      otp: storedOTP,
      // page: storedPage,
    };
  });

  // const setPage = (newPage) => {
  //   localStorage.setItem('recoveryPage', newPage);
  //   setState(prevState => ({ ...prevState, page: newPage }));
  // };

  const setEmail = (newEmail) => {
    localStorage.setItem('recoveryEmail', newEmail);
    setState(prevState => ({ ...prevState, email: newEmail }));
  };

  const setOTP = (newOTP) => {
    localStorage.setItem('recoveryOTP', newOTP);
    setState(prevState => ({ ...prevState, otp: newOTP }));
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('recoveryEmail');
      localStorage.removeItem('recoveryOTP');
      // localStorage.removeItem('recoveryPage');
    };
  }, []);

  return (
    <RecoveryContext.Provider value={{ ...state, setEmail, setOTP }}>
      {children}
    </RecoveryContext.Provider>
  );
};

export default RecoveryContextProvider;