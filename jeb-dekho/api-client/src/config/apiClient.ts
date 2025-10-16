import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse, ApiError as ApiErrorType } from '@jeb-dekho/common';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  private constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<ApiResponse<any>>) => {
        if (error.response?.data?.error) {
          const apiError: ApiErrorType = {
            code: error.response.data.error.code || error.response.status?.toString() || 'UNKNOWN',
            message: error.response.data.error.message || 'An error occurred',
            details: error.response.data.error.details
          };
          return Promise.reject(apiError);
        }
        return Promise.reject({
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred'
        });
      }
    );
  }

  static getInstance(baseURL = 'http://localhost:5000/api/v1'): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseURL);
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('jeb_dekho_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('jeb_dekho_token');
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('jeb_dekho_token');
    }
    return this.token;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.get<any, ApiResponse<T>>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.post<any, ApiResponse<T>>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.put<any, ApiResponse<T>>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.delete<any, ApiResponse<T>>(url, config);
  }
}