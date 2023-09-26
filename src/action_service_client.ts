import { Either } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { Action } from "./antbox";

export class ActionServiceClient {
  constructor(private readonly server: ServerOpts) {}

  get(uuid: string): Promise<Action> {
    const getEndpoint = this.endpoint("/", uuid);

    return fetch(getEndpoint, this.#init).then((res) => res.json());
  }

  run(
    uuid: string,
    uuids: string[],
    params?: Record<string, string>
  ): Promise<Either<AntboxError, void>> {
    const getEndpoint = this.endpoint(
      "/",
      uuid,
      "/-/run?uuids=",
      uuids.join(","),
      "&",
      this.formatParms(params)
    );

    return fetch(getEndpoint, this.#init).then(processResponse(toVoid));
  }

  list(): Promise<Action[]> {
    const createEndpoint = this.endpoint();

    return fetch(createEndpoint, this.#init)
      .then((res) => res.json() as unknown as Action[])
      .then((actions) =>
        actions.sort((a, b) => a.title.localeCompare(b.title))
      );
  }

  get #init() {
    return requestInit(this.server);
  }

  private formatParms(params?: Record<string, string>): string {
    if (!params) {
      return "";
    }

    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  private endpoint(...path: string[]): string {
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
