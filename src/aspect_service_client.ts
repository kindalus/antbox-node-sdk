import { Either, AntboxError } from ".";
import { AspectNode } from "./antbox";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { ServerOpts } from "./server_opts";

export class AspectServiceClient {
  constructor(private readonly server: ServerOpts) {}

  get(uuid: string): Promise<Either<AntboxError, AspectNode>> {
    const url = this.#endpoint("/", uuid);

    const init = requestInit();

    return fetch(url, init).then(processResponse(toObject<AspectNode>));
  }

  list(): Promise<Either<AntboxError, AspectNode[]>> {
    const url = this.#endpoint();

    const init = requestInit();

    return fetch(url, init).then(processResponse(toObject<AspectNode[]>));
  }

  export(uuid: string): Promise<Either<AntboxError, Blob>> {
    const url = this.#endpoint("/", uuid, "/-/export");
    const init = requestInit(this.server);

    return fetch(url, init).then(processResponse((res) => res.blob()));
  }

  delete(uuid: string): Promise<Either<AntboxError, void>> {
    const url = this.#endpoint("/", uuid);
    const init = requestInit(this.server, "DELETE");

    return fetch(url, init).then(processResponse(toVoid));
  }

  createOrReplace(
    metadata: Partial<AspectNode>
  ): Promise<Either<AntboxError, AspectNode>> {
    const url = this.#endpoint();

    const init = requestInit(
      this.server,
      "POST",
      JSON.stringify(metadata),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toObject<AspectNode>));
  }

  #endpoint(...path: string[]): string {
    const endpoint = this.server.url.concat("/", "aspects");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function (server: ServerOpts): AspectServiceClient {
  return new AspectServiceClient(server);
}
