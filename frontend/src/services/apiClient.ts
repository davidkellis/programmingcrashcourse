/**
 * API client for communicating with the backend services
 */

import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  TutorialSection,
  CodeSnippet,
  Language,
  ExecutionResult,
  APIResponse,
  REPLExecutionRequest,
  REPLSessionRequest
} from '../types';
import { API_BASE_URL, ERROR_MESSAGES } from '../constants';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error);

        if (error.code === 'ECONNABORTED') {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }

        if (error.response?.status === 404) {
          throw new Error(error.response.data?.error || 'Resource not found');
        }

        if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }

        throw new Error(error.response?.data?.error || ERROR_MESSAGES.NETWORK_ERROR);
      }
    );
  }

  // Content API methods
  async getSupportedLanguages(): Promise<APIResponse<Language[]>> {
    const response: AxiosResponse<APIResponse<Language[]>> = await this.client.get('/api/content/languages');
    return response.data;
  }

  async getAllSections(language: string): Promise<APIResponse<TutorialSection[]>> {
    const response: AxiosResponse<APIResponse<TutorialSection[]>> = await this.client.get('/api/content/sections', {
      params: { language }
    });
    return response.data;
  }

  async getSection(sectionId: string, language: string): Promise<APIResponse<TutorialSection>> {
    const response: AxiosResponse<APIResponse<TutorialSection>> = await this.client.get(`/api/content/sections/${sectionId}`, {
      params: { language }
    });
    return response.data;
  }

  async getCodeSnippets(sectionId: string, language: string): Promise<APIResponse<CodeSnippet[]>> {
    const response: AxiosResponse<APIResponse<CodeSnippet[]>> = await this.client.get(`/api/content/sections/${sectionId}/snippets`, {
      params: { language }
    });
    return response.data;
  }

  async getContentMetadata(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.get('/api/content/metadata');
    return response.data;
  }

  async refreshContent(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.post('/api/content/refresh');
    return response.data;
  }

  // REPL API methods
  async createREPLSession(language: string, userId?: string): Promise<APIResponse<{ sessionId: string; language: string }>> {
    const request: REPLSessionRequest = { language, userId };
    const response: AxiosResponse<APIResponse<{ sessionId: string; language: string }>> = await this.client.post('/api/repl/sessions', request);
    return response.data;
  }

  async executeCode(sessionId: string, code: string, language: string): Promise<APIResponse<ExecutionResult>> {
    const request: REPLExecutionRequest = { sessionId, code, language };
    const response: AxiosResponse<APIResponse<ExecutionResult>> = await this.client.post('/api/repl/execute', request);
    return response.data;
  }

  async getSessionState(sessionId: string): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.get(`/api/repl/sessions/${sessionId}`);
    return response.data;
  }

  async resetSession(sessionId: string): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.post(`/api/repl/sessions/${sessionId}/reset`);
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.delete(`/api/repl/sessions/${sessionId}`);
    return response.data;
  }

  async getREPLStats(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.get('/api/repl/stats');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<APIResponse<any>> {
    const response: AxiosResponse<APIResponse<any>> = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new APIClient();
