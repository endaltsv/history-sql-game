import { useState, useEffect } from 'react';
import { db } from '../services/DatabaseService';
import type { QueryResult } from '../services/ApiService';

export function useDatabase(caseId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeDatabase() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize database
        await db.initialize();
        
        // Load the case-specific database
        await db.loadCaseDatabase(caseId);
        
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Не удалось инициализировать базу данных');
          setIsLoading(false);
          setIsInitialized(false);
        }
      }
    }

    if (caseId) {
      initializeDatabase();
    }

    return () => {
      mounted = false;
    };
  }, [caseId]);

  const executeQuery = async (sql: string): Promise<QueryResult> => {
    if (!isInitialized) {
      throw new Error('База данных не инициализирована');
    }

    try {
      const result = await db.executeQuery(sql);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Ошибка выполнения запроса');
    }
  };

  return {
    isLoading,
    error,
    executeQuery,
    isInitialized
  };
}