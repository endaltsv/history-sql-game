import { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';

interface DatabaseSelectorProps {
  caseId: string;
  onDatabaseLoad: () => void;
}

export function DatabaseSelector({ caseId, onDatabaseLoad }: DatabaseSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campLogs, setCampLogs] = useState<Array<{
    shift: string;
    guard_name: string;
    action: string;
    log_id: number;
    date: string;
    notes: string;
    time: string;
  }>>([]);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        setLoading(true);
        setError(null);
        await db.loadCaseDatabase(caseId);
        const logs = db.getCampLogsData();
        setCampLogs(logs);
        onDatabaseLoad();
      } catch (err) {
        console.error("Error loading database:", err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке базы данных');
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, [caseId, onDatabaseLoad]);

  if (loading) {
    return <div className="text-gray-600">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Журнал охраны лагеря</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Смена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Охранник</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действие</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заметки</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campLogs.map((log) => (
              <tr key={log.log_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.log_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.shift}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.guard_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 