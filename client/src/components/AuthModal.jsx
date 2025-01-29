import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, CircleUserRound } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

export function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden
        bg-white/90 dark:bg-dark-100/90 backdrop-blur-md shadow-2xl 
        border border-gray-200/50 dark:border-gray-700/50 
        animate-in fade-in duration-200">
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent 
          dark:from-primary-400/5" />
        
        <div className="relative p-6 sm:p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full 
              hover:bg-gray-100/50 dark:hover:bg-dark-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 
              dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {isSignUp 
                ? 'Join us to unlock all features' 
                : 'Sign in to access your account'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50/50 dark:bg-red-900/20 
              border border-red-100 dark:border-red-800/30
              text-red-600 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium 
                text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                  text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                    bg-white/50 dark:bg-dark-200/50 
                    border border-gray-200 dark:border-gray-700
                    focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-300 
                    focus:border-transparent transition-colors
                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium 
                text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                  text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                    bg-white/50 dark:bg-dark-200/50 
                    border border-gray-200 dark:border-gray-700
                    focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-300 
                    focus:border-transparent transition-colors
                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
                bg-primary-500 hover:bg-primary-600 
                dark:bg-primary-600 dark:hover:bg-primary-700 
                text-white font-medium transition-colors"
            >
              {isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/90 dark:bg-dark-100/90 
                  text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
                bg-white hover:bg-gray-50 
                dark:bg-dark-200 dark:hover:bg-dark-300 
                text-gray-700 dark:text-gray-200 font-medium 
                border border-gray-200 dark:border-gray-700
                transition-colors"
            >
              <CircleUserRound className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}