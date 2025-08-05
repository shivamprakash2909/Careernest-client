import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertCircle, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/validate-reset-token', { token });

      if (response.status === 200) {
        setIsValidToken(true);
        setUserRole(response.data.userRole);
      } else {
        setError(response.data.error || 'Invalid or expired reset token');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/auth/reset-password', { 
        token, 
        newPassword: formData.newPassword 
      });

      if (response.status === 200) {
        setSuccess('Password reset successfully! Redirecting to login...');
        // Redirect based on user role
        const redirectPath = response.data.userRole === 'recruiter' ? '/p/recruiterauth' : '/p/studentauth';
        setTimeout(() => navigate(redirectPath), 2000);
      } else {
        setError(response.data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating reset token...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl">
            <CardContent className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate(userRole === 'recruiter' ? '/p/recruiterauth' : '/p/studentauth')} className="bg-blue-600 hover:bg-blue-700">
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2" />
              Set New Password
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate(userRole === 'recruiter' ? '/p/recruiterauth' : '/p/studentauth')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center mx-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 