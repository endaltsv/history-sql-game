import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Column {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isForeign?: boolean;
}

export interface TableData {
  tableName: string;
  title: string;
  data: any[];
}

export interface TableSchema {
  tableName: string;
  title: string;
  columns: Column[];
  foreignKeys?: {
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }[];
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  isCorrect?: boolean;
  message?: string;
}

export type CaseData = TableData | { tables: TableData[] };
export type SchemaData = TableSchema | { tables: TableSchema[] };

export const api = {
  getCaseData: async (caseId: string): Promise<CaseData> => {
    try {
      const response = await axios.get(`${API_URL}/case/${caseId}/data`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Кейс ${caseId} не найден`);
        }
        throw new Error(error.response?.data?.detail || 'Ошибка при загрузке данных');
      }
      throw error;
    }
  },
  
  getCaseSchema: async (caseId: string): Promise<SchemaData> => {
    try {
      const response = await axios.get(`${API_URL}/case/${caseId}/schema`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Кейс ${caseId} не найден`);
        }
        throw new Error(error.response?.data?.detail || 'Ошибка при загрузке схемы');
      }
      throw error;
    }
  },
  
  executeSql: async (query: string, caseId?: string): Promise<QueryResult> => {
    try {
      const response = await axios.post(`${API_URL}/execute-sql`, { query, caseId });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Ошибка при выполнении запроса');
      }
      throw error;
    }
  },

  checkSolution: async (query: string, caseId: string): Promise<{ isCorrect: boolean }> => {
    try {
      const response = await axios.post(`${API_URL}/check-solution`, { query, caseId });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Ошибка при проверке решения');
      }
      throw error;
    }
  }
}; 