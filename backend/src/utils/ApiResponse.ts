class ApiResponse {
  success: boolean;
  data: any;
  message: string;
  count?: number;
  pagination?: any;

  constructor(success: boolean, data: any, message?: string, count?: number, pagination?: any) {
    this.success = success;
    this.data = data;
    this.message = message || '';
    if (count !== undefined) this.count = count;
    if (pagination) this.pagination = pagination;
  }

  static success(data: any, message?: string, count?: number, pagination?: any): ApiResponse {
    return new ApiResponse(true, data, message, count, pagination);
  }

  static created(data: any, message: string = 'Created successfully'): ApiResponse {
    return new ApiResponse(true, data, message);
  }

  static updated(data: any, message: string = 'Updated successfully'): ApiResponse {
    return new ApiResponse(true, data, message);
  }

  static deleted(message: string = 'Deleted successfully'): ApiResponse {
    return new ApiResponse(true, null, message);
  }

  static message(message: string): ApiResponse {
    return new ApiResponse(true, null, message);
  }
}

module.exports = ApiResponse;

export {};
