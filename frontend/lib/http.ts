export async function http(path: string, options: HttpOptions = {}) {
  const url = `${path}`; // ejemplo: "/api/login"
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  let data: any = null;

  if (isJson) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data ? data.message : null) ??
      res.statusText ??
      `Error ${res.status}`;

    throw {
      name: "HttpError",
      message,
      status: res.status,
      data,
    };
  }

  return data;
}