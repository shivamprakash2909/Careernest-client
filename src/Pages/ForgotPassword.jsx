import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      
      if (response.status === 200) {
        setSuccess(response.data.message);
        setEmailSent(true);
      } else {
        setError(response.data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Network error. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive password reset instructions</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Mail className="w-6 h-6 mr-2" />
              Reset Your Password
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-green-700 mb-4">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-green-600">
                    Please check your inbox and follow the link to reset your password.
                  </p>
                </div>
                
                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 