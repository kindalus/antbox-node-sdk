import { ServerOpts } from "./server_opts";

export function requestInit(
	opts?: ServerOpts,
	method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
	body?: string | FormData,
	contentType?: "application/json" | "text/plain",
): RequestInit {
	const headers = new Headers();

	if (opts?.accessToken) {
		headers.append("X-Access-Token", opts?.accessToken);
	}

	if (opts?.tenant) {
		headers.append("X-Tenant", opts?.tenant);
	}

	if (contentType) {
		headers.append("Content-Type", contentType);
	}

	if (!body) {
		return { method, headers };
	}

	return { method, credentials: "same-origin", headers, body };
}
