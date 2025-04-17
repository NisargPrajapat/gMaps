import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      navigate('/navigation');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-blue-100">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-blue-800">Welcome Back</h2>
          <p className="text-base text-blue-600">Log in to your maps dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-blue-400 text-lg" />
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Email address"
              className="pl-10 pr-4 py-2.5 w-full border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-blue-400 text-lg" />
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Password"
              className="pl-10 pr-4 py-2.5 w-full border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-white bg-blue-600 hover:bg-green-500 transition-colors rounded-md text-base font-medium shadow-md"
          >
            Sign in
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-base text-blue-700 hover:text-green-600 hover:underline transition"
            >
              Don’t have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
