import { Either, right } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { ApiKeyNode, Node } from "./antbox";

export class ApiKeyServiceClient {
  constructor(private readonly server: ServerOpts) {}

  create(apiKey: Partial<ApiKeyNode>): Promise<Either<AntboxError, Node>> {
    const url = this.#endpoint();

    const init = requestInit(
      this.server,
      "POST",
      JSON.stringify(apiKey),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  list(): Promise<Either<AntboxError, ApiKeyNode[]>> {
    const createEndpoint = this.#endpoint();

    return fetch(createEndpoint, this.#init)
      .then(processResponse(toObject<ApiKeyNode[]>))
      .then((actionsOrErr) => {
        if (actionsOrErr.isLeft()) {
          return actionsOrErr;
        }

        const sorted = actionsOrErr.value.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        return right(sorted);
      });
  }

  delete(uuid: string): Promise<Either<AntboxError, void>> {
    const url = this.#endpoint("/", uuid);
    const init = requestInit(this.server, "DELETE");

    return fetch(url, init).then(processResponse(toVoid));
  }

  get #init() {
    return requestInit(this.server);
  }

  #endpoint(...path: string[]): string {
    const endpoint = this.server.url.concat("/", "api-keys");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function apiKeyServiceClient(
  server: ServerOpts
): ApiKeyServiceClient {
  return new ApiKeyServiceClient(server);
}
