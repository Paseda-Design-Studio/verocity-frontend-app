// Standard API response format
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
  }
  
  // Paginated response format
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // API error format
  export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  }
  
  // Request parameters for pagination
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }
  
  // Filter parameters (generic)
  export interface FilterParams {
    [key: string]: string | number | boolean | null | undefined;
  }
  
  // Combined query parameters
  export type QueryParams = PaginationParams & FilterParams;
  
  // HTTP methods
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  // Request options
  export interface RequestOptions {
    headers?: Record<string, string>;
    params?: QueryParams;
    withCredentials?: boolean;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
    timeout?: number;
  }
  