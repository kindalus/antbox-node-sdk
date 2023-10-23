import { Either, right } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { ActionNode, Node } from "./antbox";

export class ActionServiceClient {
  constructor(private readonly server: ServerOpts) {}

  get(uuid: string): Promise<Either<AntboxError, ActionNode>> {
    const getEndpoint = this.#endpoint("/", uuid);

    return fetch(getEndpoint, this.#init).then(
      processResponse(toObject<ActionNode>)
    );
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

  createOrReplace(file: File): Promise<Either<AntboxError, Node>> {
    const url = this.server.url.concat("/upload/actions");

    const formData = new FormData();
    formData.append("file", file, file.name);

    const init = requestInit(this.server, "POST", formData);

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  run(
    uuid: string,
    uuids: string[],
    params?: Record<string, string>
  ): Promise<Either<AntboxError, void>> {
    const getEndpoint = this.#endpoint(
      "/",
      uuid,
      "/-/run?uuids=",
      uuids.join(","),
      "&",
      this.#formatParms(params)
    );

    return fetch(getEndpoint, this.#init).then(processResponse(toVoid));
  }

  list(): Promise<Either<AntboxError, ActionNode[]>> {
    const createEndpoint = this.#endpoint();

    return fetch(createEndpoint, this.#init)
      .then(processResponse(toObject<ActionNode[]>))
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

  get #init() {
    return requestInit(this.server);
  }

  #formatParms(params?: Record<string, string>): string {
    if (!params) {
      return "";
    }

    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  #endpoint(...path: string[]): string {
    const endpoint = this.server.url.concat("/", "actions");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function actionServiceClient(
  server: ServerOpts
): ActionServiceClient {
  return new ActionServiceClient(server);
}
