import React, { useState } from "react";
import {
  FileText,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  FastForward,
} from "lucide-react";
import { TypewriterText } from "../TypewriterText";
import type { Case } from "../../types";

interface CaseBriefProps {
  caseData: Case;
  onSkipAnimation: () => void;
  skipInitialAnimation?: boolean;
}

export function CaseBrief({ caseData, onSkipAnimation, skipInitialAnimation = false }: CaseBriefProps) {
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(skipInitialAnimation);

  // Показываем цели после того как напечатался текст
  React.useEffect(() => {
    if (skipAnimation || skipInitialAnimation) {
      setShowObjectives(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowObjectives(true);
    }, (caseData.title.length * 70) + (caseData.brief.length * 30) + 500 + 1000);
    return () => clearTimeout(timer);
  }, [caseData.title.length, caseData.brief.length, skipAnimation, skipInitialAnimation]);

  const handleSkip = () => {
    setSkipAnimation(true);
    onSkipAnimation();
  };

  return (
    <div className="space-y-8">
      <div className="bg-amber-100/50 p-6 rounded-lg border border-amber-900/10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-detective text-2xl text-amber-900 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            <TypewriterText 
              text={caseData.title} 
              speed={70} 
              skip={skipAnimation || skipInitialAnimation}
            />
          </h2>
          {!skipInitialAnimation && (
            <button
              onClick={handleSkip}
              className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 
                       transition-colors duration-200 flex items-center gap-2 text-sm font-detective"
            >
              <FastForward className="w-4 h-4" />
              Пропустить
            </button>
          )}
        </div>
        <div className="prose text-amber-800 whitespace-pre-line">
          <TypewriterText 
            text={caseData.brief}
            speed={30} 
            delay={skipAnimation || skipInitialAnimation ? 0 : caseData.title.length * 70 + 500}
            skip={skipAnimation || skipInitialAnimation}
          />
        </div>
      </div>

      {(showObjectives || skipAnimation || skipInitialAnimation) && (
        <div className="bg-amber-100/50 p-6 rounded-lg border border-amber-900/10">
          <h3 className="font-detective text-xl text-amber-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Цель:
          </h3>
          <ul className="space-y-3 text-amber-800">
            {caseData.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="font-mono mr-2">{index + 1}.</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <div className="bg-amber-100/50 rounded-lg border border-amber-900/10">
        <button
          onClick={() => setIsHintsOpen(!isHintsOpen)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-amber-100/80 transition-colors"
        >
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-700" />
            <h3 className="font-detective text-xl text-amber-900">Hints & Tips</h3>
          </div>
          {isHintsOpen ? (
            <ChevronUp className="w-5 h-5 text-amber-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-700" />
          )}
        </button>
        
        {isHintsOpen && (
          <div className="px-6 pb-6">
            <ul className="space-y-4">
              {[
                {
                  title: 'Check for NULL Values',
                  description: 'Use IS NULL to find records with missing information in critical fields.',
                  example: 'SELECT * FROM Orders WHERE ShipDate IS NULL;'
                },
                {
                  title: 'Join Multiple Tables',
                  description: 'Connect orders with customer information using JOIN operations.',
                  example: 'SELECT o.*, c.CompanyName FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID;'
                },
                {
                  title: 'Filter by Date Range',
                  description: 'Use BETWEEN operator to find orders within specific dates.',
                  example: "SELECT * FROM Orders WHERE OrderDate BETWEEN '1998-03-01' AND '1998-04-30';"
                }
              ].map((tip, index) => (
                <li key={index} className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-detective text-amber-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-amber-700" />
                    {tip.title}
                  </h4>
                  <p className="text-amber-800 mb-2 text-sm">{tip.description}</p>
                  <pre className="bg-amber-50 p-2 rounded font-mono text-xs text-amber-800">
                    {tip.example}
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
}
