import { ServerOpts } from "./server_opts";
import { requestInit } from "./request_utils";
import { WebContent } from "./antbox";

export default function (server: ServerOpts): WebContentServiceClient {
  return new WebContentServiceClient(server);
}

export class WebContentServiceClient {
  readonly #server: ServerOpts;

  constructor(server: ServerOpts) {
    this.#server = server;
  }

  #makeUrl(uuid: string, lang?: string): string {
    const parts = [this.#server.url, "web-contents", uuid];
    if (lang) {
      parts.push(lang);
    }

    return parts.join("/");
  }

  async get(uuid: string, lang?: string): Promise<string | WebContent> {
    const url = this.#makeUrl(uuid, lang);
    const init = requestInit(this.#server);

    const res = await fetch(url, init);

    if (lang) {
      return await res.text();
    }

    return await res.json();
  }
}
