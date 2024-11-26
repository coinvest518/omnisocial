import { useRouter } from 'next/router'; // Import useRouter here
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Facebook, Github,} from "lucide-react"; // Password visibility icons
import { FiTwitter } from "react-icons/fi";
import Layout from '../components/Layout';


import { signIn } from "next-auth/react"; // Import useSession

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false); // New state to toggle between login and signup
  const router = useRouter(); // Correct use of `useRouter` inside a page component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

   

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error); // Type assertion to string
      }

      // Redirect to dashboard after successful login
      router.push('/');
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google", { redirect: true, callbackUrl: '/' }); // Redirect to Google login
  };

  return (
    <Layout title="" onLogout={() => {/* Handle logout */ }}>

    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4 md:p-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Illustration */}
        <div className="relative hidden md:flex items-center justify-center bg-gray-50 p-8">
  <div className="absolute top-8 left-8 z-10">
    <Link href="/" passHref>
      <h2 className="text-xl font-semibold cursor-pointer">Omni Social</h2>
    </Link>
  </div>


          {/* Stats Cards */}
          <div className="absolute top-24 left-12 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="text-sm text-gray-600">Total Growth</div>
            <div className="text-2xl font-bold">155k</div>
            <div className="text-xs text-green-500">+22%</div>
          </div>

          <div className="absolute top-8 right-12 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="text-sm text-gray-600">New Users</div>
            <div className="text-2xl font-bold">8,458</div>
            <div className="text-xs text-blue-500">+3.4%</div>
          </div>

          <div className="relative z-10 w-96 h-96 animate-wobble rounded-md">
            <Image
              src="/images/social.jpg"
              layout="fill"
              objectFit="contain"
              alt="3D character illustration"
            />
          </div>

          <div className="absolute bottom-24 right-12 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="text-sm text-gray-600">Sessions</div>
            <div className="text-2xl font-bold">$42.5k</div>
            <div className="text-xs text-green-500">+63%</div>
          </div>
        </div>

        {/* Right side - Login / Signup Form */}
        <div className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">{isSignupMode ? "Create an Account" : "Welcome to Omni Social!"}</h1>
            <p className="text-sm text-gray-600">
              {isSignupMode ? "Please sign up to create your account" : "Please sign in to your account and start the adventure"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isSignupMode && (
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              {!isSignupMode && (
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (isSignupMode ? "Creating account..." : "Signing in...") : (isSignupMode ? "Sign up" : "Sign in")}
            </button>
          </form>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign in with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <Facebook className="h-5 w-5" />
            </button>
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <FiTwitter className="h-5 w-5" />
            </button>
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <Github className="h-5 w-5" />
            </button>
          </div>
         

          <p className="text-center text-sm text-gray-600">
            {isSignupMode ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignupMode(false)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New on our platform?{" "}
                <button
                  onClick={() => setIsSignupMode(true)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
    </Layout>
  );
}
