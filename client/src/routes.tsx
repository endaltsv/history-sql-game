import { createBrowserRouter, useNavigate, useParams, Navigate } from 'react-router-dom';
import App from './App';
import { Dashboard } from './components/Dashboard';
import { CaseSolver } from './components/CaseSolver';
import { Home } from './components/Home';
import { allCases } from './cases';

const DashboardWrapper = () => {
  const navigate = useNavigate();

  const handleCaseSelect = (caseData: any) => {
    navigate(`/case/${caseData.id}`);
  };

  return <Dashboard onCaseSelect={handleCaseSelect} />;
};

const CaseSolverWrapper = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const caseData = allCases.find(c => c.id === caseId);

  if (!caseData) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <CaseSolver
      key={caseId}
      caseData={caseData}
      onBack={() => navigate('/dashboard')}
      onSolve={() => {
        const currentIndex = allCases.findIndex(c => c.id === caseId);
        if (currentIndex < allCases.length - 1) {
          navigate(`/case/${allCases[currentIndex + 1].id}`, { 
            replace: true
          });
        } else {
          navigate('/dashboard');
        }
      }}
    />
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: <DashboardWrapper />,
      },
      {
        path: 'case/:caseId',
        element: <CaseSolverWrapper />,
      },
    ],
  },
]); 