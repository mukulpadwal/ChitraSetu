/* eslint-disable @typescript-eslint/no-explicit-any */
class ApiResponse<T = any> {
  message: string;
  data?: T;
  success: boolean;
  constructor(message: string, statusCode: number, data?: T) {
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
