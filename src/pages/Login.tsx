import React, { useEffect } from 'react';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Firebase Auth State:', auth.currentUser);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      console.log('Login successful:', result.user);
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to Social Feed</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
