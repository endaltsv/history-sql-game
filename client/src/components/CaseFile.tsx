import { motion } from "framer-motion";
import { Case } from "../types";

interface CaseFileProps {
  caseData: Case;
  onClick: () => void;
  isSolved: boolean;
}

export function CaseFile({ caseData, onClick, isSolved }: CaseFileProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative paper-texture p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-900/20 bg-amber-50/80 backdrop-blur-sm"
    >
      {caseData.isNew && !isSolved && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-0 -right-2 z-20"
        >
          <div className="relative">
            <div
              className="bg-red-800 text-amber-50 px-4 py-1 rounded-sm font-detective 
                       border-2 border-double border-red-900 shadow-lg
                       flex items-center justify-center transform rotate-12"
              style={{
                textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                boxShadow:
                  "2px 2px 4px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.1) inset",
              }}
            >
              <span className="text-sm tracking-wider">NEW</span>
            </div>
          </div>
        </motion.div>
      )}
      {isSolved && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div
            className="bg-red-800/90 text-amber-50 px-8 py-4 rounded-sm font-detective 
                     border-4 border-double border-red-900 shadow-lg transform -rotate-12 
                     flex flex-col items-center backdrop-blur-sm"
            style={{
              textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
              boxShadow:
                "4px 4px 8px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,0.1) inset",
            }}
          >
            <div className="text-2xl tracking-[0.2em] font-bold">РЕШЕНО</div>
          </div>
        </motion.div>
      )}
      <h3 className="font-detective text-2xl mb-3 text-amber-900 group-hover:text-amber-800 transition-colors">
        {caseData.title}
      </h3>
      <p className="text-amber-800/80 text-sm mb-4 line-clamp-3">{caseData.description}</p>
      <div className="flex items-center gap-2 text-amber-700/80 text-sm">
        <span className="px-3 py-1 bg-amber-100/50 rounded-full">
          Сложность: {caseData.difficulty}
        </span>
      </div>
    </motion.div>
  );
}
