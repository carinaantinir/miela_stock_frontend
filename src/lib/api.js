
let authToken = null;
let onSessionExpired = null;

const API_BASE_URL = "http://127.0.0.1:4000";

export function setAuthToken(token) {
  authToken = token;
}

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

export async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      headers
    }
  );

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "No se recibió JSON. Revisá la conexión con Express."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && authToken) {
      authToken = null;

      if (onSessionExpired) {
        onSessionExpired();
      }

      throw new Error("Tu sesión venció. Iniciá sesión nuevamente.");
    }

    throw new Error(
      data?.message || "No se pudo completar la operación"
    );
  }

  return data;
}
