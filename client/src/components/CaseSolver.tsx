import React, { useState, useMemo, useEffect } from "react";
import {
  Book,
  Code,
  ArrowLeft,
  Columns,
  LayoutGrid,
} from "lucide-react";
import { CaseBrief } from "./case-study/CaseBrief";
import { SQLWorkspace } from "./case-study/SQLWorkspace";
import type { Case } from "../types";
import { TypewriterText } from "./TypewriterText";

const tabs = [
  { id: "brief", label: "Сюжет", icon: Book },
  { id: "workspace", label: "Рабочая область", icon: Code },
];

interface CaseSolverProps {
  caseData: Case;
  onBack: () => void;
  onSolve: () => void;
}

export function CaseSolver({ caseData, onBack, onSolve }: CaseSolverProps) {
  const [activeTab, setActiveTab] = useState("brief");
  const [isSolved, setIsSolved] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(true);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [hasShownWorkspace, setHasShownWorkspace] = useState(false);
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(false);

  // Вычисляем общее время анимации
  const totalAnimationTime = React.useMemo(() => {
    return (caseData.title.length * 70) + // время печатания заголовка
           (caseData.brief.length * 30) + // время печатания brief
           2000 + // задержка для появления целей
           800; // дополнительная задержка после появления целей
  }, [caseData.title.length, caseData.brief.length]);

  // Показываем рабочую область после завершения всех анимаций
  useEffect(() => {
    if (skipAnimation) {
      // При пропуске начинаем анимацию появления рабочей области сразу
      setTimeout(() => {
        setShowWorkspace(true);
        setHasShownWorkspace(true);
        setHasAnimationPlayed(true);
      }, 100);
      return;
    }

    const timer = setTimeout(() => {
      setShowWorkspace(true);
      setHasShownWorkspace(true);
      setHasAnimationPlayed(true);
    }, totalAnimationTime);
    return () => clearTimeout(timer);
  }, [totalAnimationTime, skipAnimation]);

  // Обработчик пропуска анимации
  const handleSkipAnimation = () => {
    setSkipAnimation(true);
  };

  // Function to handle side-by-side toggle
  const handleSideBySideToggle = () => {
    setIsSideBySide(!isSideBySide);
    if (!isSideBySide) {
      // При переходе в режим разделения, если активна рабочая область,
      // делаем активной вкладкой сюжет для лучшего UX
      if (activeTab === "workspace") {
        setActiveTab("brief");
      }
    }
  };

  const handleCaseSolved = () => {
    setIsSolved(true);
    onSolve();
  };

  // Create all components once
  const briefComponent = useMemo(
    () => <CaseBrief 
      caseData={caseData} 
      onSkipAnimation={handleSkipAnimation}
      skipInitialAnimation={hasAnimationPlayed}
    />,
    [caseData, hasAnimationPlayed]
  );

  const workspaceComponent = useMemo(
    () => <SQLWorkspace caseId={caseData.id} />,
    [caseData.id]
  );

  const tabComponents = useMemo(
    () => ({
      brief: briefComponent,
      workspace: workspaceComponent,
    }),
    [briefComponent, workspaceComponent]
  );

  // Получаем ID противоположной вкладки
  const getOppositeTabId = (currentTabId: string) => {
    return currentTabId === "brief" ? "workspace" : "brief";
  };

  // Компонент вкладки
  const TabButton = ({ tabId, isActive, onClick }: { tabId: string; isActive: boolean; onClick: () => void }) => {
    const tab = tabs.find(t => t.id === tabId)!;
    const Icon = tab.icon;
    
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center px-6 py-4 font-detective text-sm focus:outline-none
          ${
            isActive
              ? "bg-amber-100 text-amber-900 border-b-2 border-amber-900"
              : "text-amber-700 hover:bg-amber-100/50"
          }
        `}
      >
        <Icon className="w-4 h-4 mr-2" />
        {tab.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                     text-amber-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-detective">Назад к делам</span>
          </button>
          {hasShownWorkspace && (
            <button
              onClick={handleSideBySideToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 
                       text-amber-900 transition-colors duration-200"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="font-detective">{isSideBySide ? "Объединить экран" : "Разделить экран"}</span>
            </button>
          )}
        </div>
        
        <div className="bg-amber-50 rounded-lg shadow-lg border border-amber-900/10">
          {!isSideBySide ? (
            <>
              <div className="border-b border-amber-900/10">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      tabId={tab.id}
                      isActive={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))}
                </div>
              </div>
              <div className="p-6">
                {tabComponents[activeTab as keyof typeof tabComponents]}
              </div>
            </>
          ) : (
            <div className={`grid transition-all duration-1000 min-h-[calc(100vh-12rem)] ${
              !hasShownWorkspace ? (showWorkspace ? 'grid-cols-[2fr_3fr]' : 'grid-cols-[1fr_0fr]') : 'grid-cols-[2fr_3fr]'
            }`}>
              <div className={`transition-all duration-1000 ${hasShownWorkspace || showWorkspace ? 'border-r' : ''} border-amber-900/10`}>
                <div className="border-b border-amber-900/10 flex">
                  <TabButton
                    tabId="brief"
                    isActive={true}
                    onClick={() => {}}
                  />
                </div>
                <div className="p-6 overflow-auto">
                  {tabComponents.brief}
                </div>
              </div>
              <div className={`transition-all duration-1000 ${
                !hasShownWorkspace ? (showWorkspace ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden') : 'opacity-100 w-full'
              }`}>
                <div className="border-b border-amber-900/10 flex">
                  <TabButton
                    tabId="workspace"
                    isActive={true}
                    onClick={() => {}}
                  />
                </div>
                <div className="p-6 overflow-auto">
                  {tabComponents.workspace}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
