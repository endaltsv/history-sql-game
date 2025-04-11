import { useNavigate } from "react-router-dom";
import { allCases } from "../cases";

export default function Home() {
  const navigate = useNavigate();

  const startInvestigation = () => {
    navigate('/case/001');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col items-center justify-center gap-12">
      {/* Detective Icon */}
      <div className="w-32 h-32 transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={startInvestigation}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#8B4513]">
          <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 15c19.3 0 35 15.7 35 35S69.3 85 50 85 15 69.3 15 50s15.7-35 35-35z"/>
          <rect x="25" y="40" width="50" height="10" rx="5"/>
          <path d="M25 25h50v10H25z"/>
        </svg>
      </div>

      {/* CTA Button */}
      <button
        onClick={startInvestigation}
        className="group relative px-12 py-4 text-2xl font-serif text-[#FAF6F1] overflow-hidden"
      >
        <span className="relative z-10">Start Investigation</span>
        <div className="absolute inset-0 bg-[#8B4513] transform transition-transform duration-300 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B4513] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#8B4513] opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
} 