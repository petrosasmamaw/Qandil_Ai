import LoginForm from "./Form";
import { FiCpu, FiArrowUpRight } from "react-icons/fi";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Robot Mascot Section */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="text-center">
            {/* Robot Character */}
            <div className="text-8xl mb-6 drop-shadow-lg animate-bounce text-blue-400">
              <FiCpu size={80} />
            </div>
            {/* Chat Bubbles */}
            <div className="space-y-4">
              <div className="bg-blue-300 text-blue-900 px-6 py-3 rounded-2xl rounded-tl-none max-w-xs font-semibold shadow-lg">
                Welcome back!
              </div>
              <div className="bg-white text-blue-900 px-6 py-3 rounded-2xl rounded-br-none max-w-xs font-semibold shadow-lg ml-auto">
                Let's continue learning
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 text-center lg:text-left">
            Welcome to <span className="text-blue-200">Qandil</span>
          </h1>
          <p className="text-blue-100 text-center lg:text-left mb-8">Sign in to your account and continue learning</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
