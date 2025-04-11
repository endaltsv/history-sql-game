import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-amber-50/50">
      <Outlet />
    </div>
  );
}
