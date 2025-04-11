import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allCases } from "../cases";

export function Home() {
  const navigate = useNavigate();
  const firstCase = allCases.find((c) => c.id === "case-001") || allCases[0];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f9f4e8] overflow-hidden">
      {/* Фон: пергаментная текстура */}
      <div className="absolute inset-0 bg-[url('/images/parchment-texture.jpg')] bg-cover bg-center opacity-70 pointer-events-none" />

      {/* Эффект ambient света */}
      <div className="absolute -top-1/3 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-amber-100 opacity-20 blur-3xl rounded-full pointer-events-none animate-pulse" />

      {/* Плавающие частицы */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/images/particles.png')] bg-cover bg-center opacity-10 animate-slow-float" />

      {/* Световые лучи */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/10 via-transparent to-transparent pointer-events-none" />

      {/* Добавляем параллакс-эффект при движении мыши */}
      <motion.div 
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/parchment-texture.jpg')",
          backgroundSize: "cover",
        }}
        whileHover={{ scale: 1.05 }}
      />

      {/* Добавляем анимированный градиентный бордер */}
      <div className="absolute inset-[1px] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 opacity-20 animate-gradient-x" />

      {/* Добавляем эффект мерцающих звёзд */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Контент */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.02 }}
        className="text-center space-y-14 relative z-10 px-6 backdrop-blur-sm bg-white/5 rounded-3xl p-10 border border-white/10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-4xl md:text-7xl font-serif font-bold tracking-tight text-[#4a3b27] drop-shadow-md"
        >
          Добро пожаловать
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl text-[#7a5e36] max-w-xl mx-auto"
        >
          Раскройте забытые тайны прошлого и восстановите истину с помощью языка данных — SQL.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(252, 211, 77, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          onClick={() => navigate(`/case/${firstCase.id}`)}
          className="group bg-[#7a5e36] hover:bg-[#5c4523] text-[#f7f1e1] px-12 py-5 rounded-xl 
                     text-xl md:text-2xl font-semibold transition-all transform flex items-center justify-center mx-auto shadow-2xl
                     focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
        >
          Начать расследование
          <ChevronRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
}
