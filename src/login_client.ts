import { Either } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse } from "./process_response";
import { requestInit } from "./request_utils";

export default function (server: ServerOpts): LoginClient {
  return new LoginClient(server);
}

export class LoginClient {
  private readonly baseUrl: string;

  static sha256(pwd: string): Promise<string> {
    return crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(pwd))
      .then((hash) =>
        Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );
  }

  constructor(server: ServerOpts) {
    this.baseUrl = server.url.concat("/login");
  }

  async loginRoot(pwd: string): Promise<Either<AntboxError, { jwt: string }>> {
    const url = this.baseUrl.concat("/root");

    const secret = await LoginClient.sha256(pwd);

    return fetch(
      url,
      requestInit(undefined, "POST", secret, "text/plain")
    ).then(processResponse((res) => res.json()));
  }
}
