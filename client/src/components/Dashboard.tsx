import { CaseFile } from "./CaseFile";
import { allCases } from "../cases";
import { Trophy, Star, Zap, ChevronDown, ChevronRight, Scroll, Shield, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface DashboardProps {
  onCaseSelect: (caseData: any) => void;
}

export function Dashboard({ onCaseSelect }: DashboardProps) {
  const currentXP = 0;
  const solvedCases: string[] = [];
  const totalCases = allCases.length;
  const progress = (solvedCases.length / totalCases) * 100;
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const mainCase = allCases[0];
  const subCases = mainCase.subCases?.map(id => {
    const foundCase = allCases.find(c => c.id === id);
    console.log('Looking for subcase:', id, 'Found:', foundCase);
    return foundCase;
  }).filter((c): c is NonNullable<typeof c> => c !== undefined) || [];

  console.log('Main case:', mainCase);
  console.log('Subcases found:', subCases);

  return (
    <div className="min-h-screen bg-[url('/parchment-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen backdrop-blur-sm bg-gradient-to-b from-amber-50/80 to-amber-100/90">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Верхняя секция */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-16"
          >
            <div className="absolute inset-0 bg-amber-100/50 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/50 -z-10" />
            
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 mb-8">
                <div className="space-y-3">
                  <h2 className="font-detective text-5xl text-amber-900 drop-shadow-sm">Досье дел</h2>
                  <p className="text-amber-800/80 text-lg">Выберите дело для расследования</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-amber-50/90 to-amber-100/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-amber-200/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-200/50 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="text-sm text-amber-800/80">Опыт</div>
                        <div className="font-mono text-amber-900 text-xl">
                          {currentXP} XP
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-amber-50/90 to-amber-100/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg border border-amber-200/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-200/50 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="text-sm text-amber-800/80">Прогресс</div>
                        <div className="font-mono text-amber-900 text-xl">
                          {solvedCases.length}/{totalCases}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative">
                <div className="h-3 bg-gradient-to-r from-amber-200/30 to-amber-300/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-sm"
                  />
                </div>
                <div className="mt-2 text-right text-sm text-amber-800/60">
                  {Math.round(progress)}% завершено
                </div>
              </div>
            </div>
          </motion.div>

          {/* Основной контент */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-8"
          >
            {/* Главный кейс */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-amber-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 transition-all duration-300 group-hover:shadow-2xl" />
                
                <div 
                  className="relative p-8 cursor-pointer"
                  onClick={() => {
                    console.log('Clicking main case:', mainCase.id);
                    setExpandedCase(expandedCase === mainCase.id ? null : mainCase.id);
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-amber-200/70 to-amber-300/70 p-4 rounded-xl">
                      <Shield className="w-8 h-8 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-detective text-3xl text-amber-900 mb-3">{mainCase.title}</h3>
                        <motion.div
                          animate={{ rotate: expandedCase === mainCase.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-amber-700" />
                        </motion.div>
                      </div>
                      <p className="text-amber-800/80 text-lg leading-relaxed">{mainCase.description}</p>
                      
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-amber-700">
                          <Scroll className="w-4 h-4" />
                          <span className="text-sm">{mainCase.objectives.length} заданий</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-700">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{mainCase.difficulty} уровень сложности</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Подквесты */}
              {expandedCase === mainCase.id && subCases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 pl-12 space-y-4"
                >
                  {subCases.map((subCase, index) => (
                    <motion.div
                      key={subCase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <div 
                        className="relative bg-gradient-to-br from-white/70 to-amber-50/70 backdrop-blur-sm rounded-xl border border-amber-200/50 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
                        onClick={() => onCaseSelect(subCase)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-amber-100/70 to-amber-200/70 p-3 rounded-lg">
                              <Scroll className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                              <h4 className="font-detective text-xl text-amber-900 mb-2">{subCase.title}</h4>
                              <p className="text-amber-800/80">{subCase.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-amber-700 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Нижняя секция */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <motion.a
              href="https://github.com/endaltsv/history-sql-game"
              target="_blank"
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-amber-100/70 to-amber-50/70 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200/50 cursor-pointer"
            >
              <Github className="w-5 h-5 text-amber-700" />
              <p className="text-xl font-detective text-amber-800">
                GitHub
              </p>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

