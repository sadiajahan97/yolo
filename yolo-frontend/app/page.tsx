"use client";

import { useState } from "react";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  const authTitle = activeTab === 0 ? "Welcome Back" : "Create Account";
  const authSubtitle =
    activeTab === 0
      ? "Enter your credentials to access your account"
      : "Sign up to start analyzing images with AI";

  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  const handleToggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSwitchTab = (tab: 0 | 1) => setActiveTab(tab);

  return (
    <div className="flex max-w-[1100px] w-full bg-white rounded-[16px] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.24)] [@media(max-width:968px)]:flex-col [@media(max-width:480px)]:rounded-none">
      <div className="relative flex-1 flex flex-col justify-between text-white bg-gradient-[165deg,#2563eb_0%,#1e40af_100%] overflow-hidden [@media(max-width:968px)]:p-[40px_30px] [@media(max-width:480px)]:p-[30px_20px] p-[60px_50px]">
        <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-white/8 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] bg-white/6 rounded-full pointer-events-none" />

        <div className="relative z-1">
          <h1 className="text-[28px] font-bold mb-3 tracking-[-0.5px] [@media(max-width:480px)]:text-[24px]">
            AI Vision Platform
          </h1>
          <p className="text-[15px] opacity-[0.92] leading-[1.6] font-light">
            Advanced object detection and intelligent analysis powered by
            state-of-the-art machine learning models
          </p>
        </div>

        <div className="relative z-1 mt-10 [@media(max-width:968px)]:mt-[30px]">
          <div className="flex items-start mb-[28px] [@media(max-width:968px)]:mb-[20px]">
            <div className="w-[44px] h-[44px] bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] shrink-0 backdrop-blur-[10px]">
              <svg
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] stroke-white stroke-2 fill-none"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div className="feature-content">
              <h3 className="text-[16px] font-semibold mb-[6px]">
                YOLO Object Detection
              </h3>
              <p className="text-[14px] opacity-[0.88] leading-1.5 font-light">
                Real-time object detection with industry-leading accuracy and
                performance metrics
              </p>
            </div>
          </div>

          <div className="flex items-start mb-[28px] [@media(max-width:968px)]:mb-[20px]">
            <div className="w-[44px] h-[44px] bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] shrink-0 backdrop-blur-[10px]">
              <svg
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] stroke-white stroke-2 fill-none"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div className="feature-content">
              <h3 className="text-[16px] font-semibold mb-[6px]">
                AI-Powered Q&A
              </h3>
              <p className="text-[14px] opacity-[0.88] leading-1.5 font-light">
                Ask questions about detected objects using Gemini&apos;s
                advanced natural language understanding
              </p>
            </div>
          </div>

          <div className="flex items-start mb-[28px] [@media(max-width:968px)]:mb-[20px]">
            <div className="w-[44px] h-[44px] bg-white/15 rounded-[10px] flex items-center justify-center mr-[18px] shrink-0 backdrop-blur-[10px]">
              <svg
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] stroke-white stroke-2 fill-none"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="feature-content">
              <h3 className="text-[16px] font-semibold mb-[6px]">
                Interactive Analysis
              </h3>
              <p className="text-[14px] opacity-[0.88] leading-1.5 font-light">
                Sortable results with detailed confidence scores and bounding
                box coordinates
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center p-[60px_50px] [@media(max-width:968px)]:p-[40px_30px] [@media(max-width:480px)]:p-[30px_20px]">
        <div className="mb-[36px]">
          <h2 className="text-[32px] font-bold text-[#0f172a] mb-2 tracking-[-0.8px] [@media(max-width:480px)]:text-[26px]">
            {authTitle}
          </h2>
          <p className="text-[15px] text-[#64748b] font-normal">
            {authSubtitle}
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-[#f1f5f9] p-1.5 rounded-[10px]">
          <button
            className={`flex-1 px-6 py-3 bg-transparent border-none text-[#64748b] text-[15px] font-semibold rounded-[7px] cursor-pointer transition-all duration-300 ease-in-out font-inter${
              activeTab === 0
                ? " bg-white text-[#2563eb] shadow-[0_2px_8px_rgba(37,99,235,0.12)]"
                : ""
            }`}
            onClick={() => handleSwitchTab(0)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 px-6 py-3 bg-transparent border-none text-[#64748b] text-[15px] font-semibold rounded-[7px] cursor-pointer transition-all duration-300 ease-in-out font-inter${
              activeTab === 1
                ? " bg-white text-[#2563eb] shadow-[0_2px_8px_rgba(37,99,235,0.12)]"
                : ""
            }`}
            onClick={() => handleSwitchTab(1)}
          >
            Sign Up
          </button>
        </div>

        <form className={activeTab === 0 ? "block" : "hidden"}>
          <div className="mb-[22px]">
            <label
              htmlFor="login-email"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
            </div>
          </div>

          <div className="mb-[22px]">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="Enter your password"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
              <button
                onClick={handleToggleShowPassword}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-slate-400 stroke-2 fill-none"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-[18px] h-[18px] mr-2 cursor-pointer accent-[#2563eb] focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
              <label
                htmlFor="remember"
                className="text-[14px] text-slate-600 cursor-pointer m-0 font-medium"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-[14px] text-[#2563eb] font-semibold no-underline transition-colors duration-300 ease-in-out hover:text-[#1e40af]"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] w-full p-[15px] bg-linear-to-br from-[#2563eb] to-[#1e40af] text-white border-0 rounded-[10px] text-[16px] font-semibold cursor-pointer transition-all duration-300 ease-in-out font-inter shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
          >
            Sign In
          </button>

          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="px-4 text-[13px] text-[#94a3b8] font-medium">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          <button
            type="button"
            className="w-full py-3.5 px-3.5 bg-white text-slate-800 border-[1.5px] border-slate-200 rounded-xl text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-in-out font-inter flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </form>

        <form className={activeTab === 1 ? "block" : "hidden"}>
          <div className="mb-[22px]">
            <label
              htmlFor="signup-name"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="signup-name"
                placeholder="John Doe"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
            </div>
          </div>

          <div className="mb-[22px]">
            <label
              htmlFor="signup-email"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                id="signup-email"
                placeholder="you@example.com"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
            </div>
          </div>

          <div className="mb-[22px]">
            <label
              htmlFor="signup-password"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="signup-password"
                placeholder="Create a password"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
              <button
                onClick={handleToggleShowPassword}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-slate-400 stroke-2 fill-none"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-[22px]">
            <label
              htmlFor="signup-confirm"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[#94a3b8] stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="signup-confirm"
                placeholder="Confirm your password"
                required
                className="focus:outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] w-full py-[14px] pr-4 pl-12 border-[1.5px] border-[#e2e8f0] rounded-[10px] text-[15px] font-inter transition-all duration-300 ease-in-out text-[#0f172a]"
              />
              <button
                onClick={handleToggleShowConfirmPassword}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 stroke-slate-400 stroke-2 fill-none"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] w-full p-[15px] bg-linear-to-br from-[#2563eb] to-[#1e40af] text-white border-0 rounded-[10px] text-[16px] font-semibold cursor-pointer transition-all duration-300 ease-in-out font-inter shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
          >
            Create Account
          </button>

          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="px-4 text-[13px] text-[#94a3b8] font-medium">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          <button
            type="button"
            className="w-full py-3.5 px-3.5 bg-white text-slate-800 border-[1.5px] border-slate-200 rounded-xl text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-in-out font-inter flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}
