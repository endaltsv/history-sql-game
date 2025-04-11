import { api } from './ApiService';
import type { QueryResult } from './ApiService';

export interface ExtendedQueryResult extends QueryResult {
  error?: string;
  isCorrect?: boolean;
  message?: string;
}

class DatabaseService {
  private static instance: DatabaseService;
  private initialized = false;
  private currentCaseId: string | undefined = undefined;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
  }

  async loadCaseDatabase(caseId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    this.currentCaseId = caseId;
  }

  async executeQuery(sql: string): Promise<ExtendedQueryResult> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      const result = await api.executeSql(sql, this.currentCaseId);
      return result;
    } catch (error) {
      console.error("Query execution error:", error);
      return {
        columns: [],
        rows: [],
        error: error instanceof Error ? error.message : 'Ошибка выполнения запроса'
      };
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const db = DatabaseService.getInstance();
