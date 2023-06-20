import { ApiConfiguration } from "@/interfaces/api-client/ApiConfiguration";
import { ApiError } from "@/interfaces/api-client/ApiError";
import { IApiClient } from "@/interfaces/api-client/IApiClient";
import { RequestConfig } from "@/interfaces/api-client/RequestConfig";
import axios, { AxiosInstance } from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";
import { Result, ok } from "neverthrow";
import handleApiError from "./handleApiError";

export default class ApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(apiConfiguration: ApiConfiguration) {
    this.client = this.createAxiosClient(apiConfiguration);
  }

  private createAxiosClient(apiConfiguration: ApiConfiguration): AxiosInstance {
    const axiosClient = axios.create({
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        ...(apiConfiguration.accessToken && {
          Authorization: `Token ${apiConfiguration.accessToken}`,
        }),
      },
      timeout: 10 * 1000,
    });

    this.setRetryConfiguration(axiosClient);

    return axiosClient;
  }

  private setRetryConfiguration(apiClient: AxiosInstance): void {
    const retryConfig: IAxiosRetryConfig = {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        if (error.response) {
          if (error.response.status === 500) {
            return true;
          }
        }

        return axiosRetry.isNetworkOrIdempotentRequestError(error);
      },
    };

    axiosRetry(apiClient, retryConfig);
  }

  async get<TResponse>(
    path: string,
    config: RequestConfig = { headers: {} }
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const response = await this.client.get<TResponse>(path, config);
      return ok(response.data);
    } catch (error: any) {
      return handleApiError<TResponse>(error);
    }
  }

  async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config: RequestConfig = { headers: {} }
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const response = await this.client.post<TResponse>(path, payload, config);
      return ok(response.data);
    } catch (error) {
      return handleApiError<TResponse>(error);
    }
  }

  async put<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<Result<TResponse, ApiError>> {
    try {
      const response = await this.client.put<TResponse>(path, payload);
      return ok(response.data);
    } catch (error) {
      return handleApiError<TResponse>(error);
    }
  }
}
