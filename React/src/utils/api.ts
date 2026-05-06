const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("auth_token");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      throw new ApiError("Sesi lu habis cuy, login lagi ya!", 401);
    }

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || "Ada yang salah nih sama servernya.",
        response.status,
      );
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    let errorMessage = "Terjadi kesalahan jaringan, coba lagi nanti.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
};
