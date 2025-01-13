class ApiResponse {
  message;
  data;
  success;
  constructor(message: string, statusCode: number, data = []) {
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
