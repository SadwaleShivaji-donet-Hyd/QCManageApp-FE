import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labImage from '../assets/lab-equipment.jpg';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Enable authentication check when development is complete
    // if (!username || !password) {
    //   setError('Please enter your username and password.');
    //   return;
    // }
    setIsLoading(true);
    setError('');
    try {
      // await login(username, password);
      // For development: bypass authentication and redirect
      navigate('/batches', { replace: true });
    } catch (err: unknown) {
      setError((err as Error).message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — lab image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${labImage})` }}
      >
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(88,28,135,0.8) 0%, rgba(88,28,135,0.5) 50%, rgba(88,28,135,0.2) 100%)',
        }} />
        <div className="relative flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Precision Workflow Management</h1>
          <p className="text-lg opacity-90">
            Track biopsy samples through every step of the process with confidence and clarity.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="QuantumCyte"
              className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] h-auto" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">Sign in to access the workflow dashboard.</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  id="username" type="text" value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="you@quantumcyte.com"
                  autoComplete="username" autoFocus
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      <path d="M15.171 13.576l1.414 1.414A10.025 10.025 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.96 9.96 0 00-3.79.76l1.415 1.414a8 8 0 0110.076 10.076z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-8 flex items-center justify-center gap-2">
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"/>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"/>
          </div>

          <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.08 5.919l.898-4.487m0 0a6 6 0 10-6.967 6.967l.898-4.487"/>
            </svg>
            Sign in with Keycard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;