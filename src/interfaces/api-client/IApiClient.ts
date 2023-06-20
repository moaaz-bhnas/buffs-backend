import { Result } from "neverthrow";
import { RequestConfig } from "./RequestConfig";
import { ApiError } from "./ApiError";

export interface IApiClient {
  get<TResponse>(
    path: string,
    config?: RequestConfig
  ): Promise<Result<TResponse, ApiError>>;
  post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig
  ): Promise<Result<TResponse, ApiError>>;
  put<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<Result<TResponse, ApiError>>;
}
