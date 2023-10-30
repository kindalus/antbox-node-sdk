import { Either, right } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { UserNode, Node } from "./antbox";

export class UserServiceClient {
  constructor(private readonly server: ServerOpts) {}

  create(user: Partial<UserNode>): Promise<Either<AntboxError, Node>> {
    const url = this.#endpoint();

    const init = requestInit(
      this.server,
      "POST",
      JSON.stringify(user),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  get(uuid: string): Promise<Either<AntboxError, UserNode>> {
    const getEndpoint = this.#endpoint("/", uuid);

    return fetch(getEndpoint, this.#init).then(
      processResponse(toObject<UserNode>)
    );
  }

  list(): Promise<Either<AntboxError, UserNode[]>> {
    const createEndpoint = this.#endpoint();

    return fetch(createEndpoint, this.#init)
      .then(processResponse(toObject<UserNode[]>))
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
    user: Partial<UserNode>
  ): Promise<Either<AntboxError, void>> {
    const url = this.#endpoint("/", uuid);

    const init = requestInit(
      this.server,
      "PATCH",
      JSON.stringify(user),
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
    const endpoint = this.server.url.concat("/", "users");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function userServiceClient(
  server: ServerOpts
): UserServiceClient {
  return new UserServiceClient(server);
}
