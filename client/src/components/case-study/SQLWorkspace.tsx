import React, { useState, useEffect } from "react";
import {
  Play,
  AlertCircle,
  Loader2,
  Command,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Table2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SQLEditor } from "./SQLEditor";
import { useDatabase } from "../../hooks/useDatabase";
import DatabaseSchema from "./DatabaseSchema";
import { ExtendedQueryResult } from "../../services/DatabaseService";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Case } from "../../types";
import { allCases } from "../../cases";

interface SQLWorkspaceProps {
  caseId: string;
}

export function SQLWorkspace({ caseId }: SQLWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtendedQueryResult | null>(null);
  const [isResultsVisible, setIsResultsVisible] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoading, error: dbError, executeQuery } = useDatabase(caseId);
  const navigate = useNavigate();

  const handleExecute = async () => {
    try {
      setIsExecuting(true);
      const result = await executeQuery(query);
      setResult(result);
      setIsResultsVisible(true);
      if (result.isCorrect) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setResult({
        columns: [],
        rows: [],
        isCorrect: false,
        message: 'Произошла ошибка при выполнении запроса',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleQueryChange = (value: string) => {
    if (!hasInteracted && value.length > 0) {
      setHasInteracted(true);
    }
    setQuery(value);
  };

  const renderTable = () => {
    if (!result) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-fit divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {result.columns.map((column: string, index: number) => (
                <th
                  key={index}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {result.columns.map((column: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-amber-700 animate-spin" />
        <span className="ml-2 text-amber-900">Loading database...</span>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded">
        <p className="font-bold">Failed to load database</p>
        <p className="text-sm">{dbError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-900 rounded-lg overflow-hidden">
        <div className="bg-amber-800 px-4 py-2 flex justify-between items-center">
          <span className="text-amber-100 font-detective">SQL Query</span>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`flex items-center px-4 py-1 rounded text-sm transition-colors ${
              isExecuting
                ? "bg-amber-800 text-amber-300 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-600 text-amber-100"
            }`}
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            Execute
            <span className="hidden md:flex items-center ml-2 text-xs opacity-75">
              <Command className="w-3 h-3 mr-1" />
              Enter
            </span>
          </button>
        </div>
        <div className="bg-amber-950">
          <SQLEditor
            value={query}
            onChange={handleQueryChange}
            onExecute={handleExecute}
            placeholder="SELECT * FROM some_table WHERE..."
            caseId={caseId}
          />
        </div>
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${hasInteracted ? 'opacity-100' : 'opacity-0'}`}>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error in query</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="fixed top-4 right-4 z-50 w-96"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 rounded-full p-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-lg">Отличная работа!</p>
                  <p className="text-sm opacity-75">Вы нашли правильное решение</p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => {
                    const currentIndex = allCases.findIndex((c: Case) => c.id === caseId);
                    if (currentIndex < allCases.length - 1) {
                      navigate(`/case/${allCases[currentIndex + 1].id}`, { 
                        replace: true 
                      });
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border-2 border-amber-300/30"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Перейти к следующему кейсу</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-amber-900/10 shadow-sm"
          >
            <button
              onClick={() => setIsResultsVisible(!isResultsVisible)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-amber-900/10 hover:bg-amber-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-1.5 rounded-lg">
                  {isExecuting ? (
                    <Loader2 className="w-4 h-4 text-amber-700 animate-spin" />
                  ) : (
                    <Table2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-detective text-base text-amber-900 flex items-center">Результаты запроса</h3>
                  <span className="text-sm text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-full flex items-center">
                    {result.rows.length} {result.rows.length === 1 ? 'запись' : 'записей'}
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isResultsVisible ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4 text-amber-700" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isResultsVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
                    {renderTable()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {isExecuting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-100/50 p-4 rounded-lg flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-amber-700 animate-spin" />
            <span className="text-amber-900">Выполнение запроса...</span>
          </motion.div>
        )}
      </div>

      <DatabaseSchema caseId={caseId} />
    </div>
  );
}
