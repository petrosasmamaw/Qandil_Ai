import RegisterForm from "./Form";
import { FiCpu, FiArrowUpRight } from "react-icons/fi";

export default function RegisterPage() {
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
                Welcome to Qandil!
              </div>
              <div className="bg-white text-blue-900 px-6 py-3 rounded-2xl rounded-br-none max-w-xs font-semibold shadow-lg ml-auto flex items-center gap-2 ml-auto">
                Let's get started <FiArrowUpRight size={20} className="inline" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 text-center lg:text-left">
            Join <span className="text-blue-200">Qandil AI</span>
          </h1>
          <p className="text-blue-100 text-center lg:text-left mb-8">Create your account to get started with AI learning</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
