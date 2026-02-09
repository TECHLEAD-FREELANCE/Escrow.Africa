import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, login, loading } = useAuthStore();
  const [step, setStep] = useState('form'); // form, email-otp, phone-otp, success
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otpValues, setOtpValues] = useState({
    email: ['', '', '', ''],
    phone: ['', '', '', ''],
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    // Move to email OTP
    setStep('email-otp');
    toast.success('Verification code sent to your email');
    
    // Auto-fill OTP after 2 seconds (simulation)
    setTimeout(() => {
      setOtpValues((prev) => ({ ...prev, email: ['1', '2', '3', '4'] }));
    }, 2000);
  };
  
  const verifyEmailOTP = () => {
    setStep('phone-otp');
    toast.success('Verification code sent to your phone');
    
    // Auto-fill phone OTP after 2 seconds (simulation)
    setTimeout(() => {
      setOtpValues((prev) => ({ ...prev, phone: ['5', '6', '7', '8'] }));
    }, 2000);
  };
  
  const verifyPhoneOTP = async () => {
    try {
      // Create user account - insert directly into profiles table
      const result = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      });
      
      if (!result.success) {
        toast.error(result.error || 'Signup failed');
        return;
      }
      
      // Auto login after successful signup
      await login(formData.email, formData.password);
      
      setStep('success');
      toast.success('Account created successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    }
  };
  
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (step === 'email-otp' || step === 'phone-otp') {
    const isEmail = step === 'email-otp';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-4xl">{isEmail ? '📧' : '📱'}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEmail ? 'Verify Email' : 'Verify Phone'}
            </h2>
            <p className="text-gray-600">
              Enter the code sent to {isEmail ? formData.email : formData.phone}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            {otpValues[isEmail ? 'email' : 'phone'].map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                readOnly
                className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            ))}
          </div>
          
          <button
            onClick={isEmail ? verifyEmailOTP : verifyPhoneOTP}
            className="w-full bg-[#0d9488] text-white py-3 rounded-xl font-semibold hover:bg-[#0f766e] transition-colors"
          >
            Verify & Continue
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join Escrow Africa in seconds</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254 712 345 678"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#0d9488] text-white py-3 rounded-xl font-semibold hover:bg-[#0f766e] active:scale-[0.98] transition-all shadow-lg"
          >
            Create Account
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
