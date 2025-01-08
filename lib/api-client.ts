/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from "@/models/products.models";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify(body),
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<IProduct[]>("/api/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/api/products/${id}`);
  }
}

const apiClient = new ApiClient();
export default apiClient;
