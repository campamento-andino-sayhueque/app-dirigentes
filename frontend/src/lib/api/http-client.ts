import { auth } from "@/lib/firebase";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "./errors";
import { HateoasResource, HateoasLink } from "./types";

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
  links?: Record<string, HateoasLink | HateoasLink[]>;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

export type TokenProvider = () => Promise<string | null>;

export class HttpClient {
  constructor(protected baseUrl: string, protected getToken?: TokenProvider) {}

  protected async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error obteniendo token: ", error);
      return null;
    }
  }

  protected resolveUrl(url: string): string {
    if (url.startsWith("http://") || url.startsWith("http://")) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith("/") ? url : "/" + url}`;
  }

  async request<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResult<T>> {
    const { body, requireAuth = true, ...fetchOptions } = options;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...((fetchOptions.headers as Record<string, string>) || {}),
      };

      if (this.getToken && options.requireAuth !== false) {
        const token = await this.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn(
            `[HttpClient] WARNING: Request to ${url} requieres auth but not tokem found`
          );
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[API] ${fetchOptions.method || "GET"} ${url}`);
      }

      const response = await fetch(this.resolveUrl(url), {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleHttpError(response.status, errorData);
      }

      const data = (await response.json()) as T;

      const links = (data as unknown as HateoasResource)._links;

      return { data, links };
    } catch (error) {
      if (error instanceof ApiError) return { error };
      return {
        error: new ApiError(
          error instanceof Error ? error.message : "Error desconocido"
        ),
      };
    }
  }

  protected handleHttpError(status: number, errorData: any): never {
    switch (status) {
      case 401:
        throw new AuthenticationError(errorData.message);
      case 403:
        throw new ForbiddenError(errorData.message);
      case 404:
        throw new NotFoundError(errorData.message);
      default:
        throw new ApiError(
          errorData.message || `Error ${status}`,
          status,
          errorData
        );
    }
  }

  async get<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "GET" });
  }
  async post<T>(url: string, body: unknown, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "POST", body });
  }
  async put<T>(url: string, body: unknown, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "PUT", body });
  }
  async patch<T>(url: string, body: unknown, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "PATCH", body });
  }
  async delete<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}
