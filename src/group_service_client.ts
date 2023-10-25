import { Either, right } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { GroupNode, Node } from "./antbox";

export class GroupServiceClient {
  constructor(private readonly server: ServerOpts) {}

  create(group: Partial<GroupNode>): Promise<Either<AntboxError, Node>> {
    const url = this.#endpoint();

    const init = requestInit(
      this.server,
      "POST",
      JSON.stringify(group),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  get(uuid: string): Promise<Either<AntboxError, GroupNode>> {
    const getEndpoint = this.#endpoint("/", uuid);

    return fetch(getEndpoint, this.#init).then(
      processResponse(toObject<GroupNode>)
    );
  }

  list(): Promise<Either<AntboxError, GroupNode[]>> {
    const createEndpoint = this.#endpoint();

    return fetch(createEndpoint, this.#init)
      .then(processResponse(toObject<GroupNode[]>))
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

  update(
    uuid: string,
    group: Partial<GroupNode>
  ): Promise<Either<AntboxError, void>> {
    const url = this.#endpoint("/", uuid);

    const init = requestInit(
      this.server,
      "PATCH",
      JSON.stringify(group),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toVoid));
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
    const endpoint = this.server.url.concat("/", "groups");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function groupServiceClient(
  server: ServerOpts
): GroupServiceClient {
  return new GroupServiceClient(server);
}
