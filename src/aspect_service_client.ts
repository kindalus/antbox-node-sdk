import { Aspect } from "./antbox";
import { requestInit } from "./request_utils";
import { ServerOpts } from "./server_opts";

export class AspectServiceClient {
  constructor(private readonly server: ServerOpts) {}

  get(uuid: string): Promise<Aspect> {
    const getEndpoint = this.endpoint("/", uuid);

    const init = requestInit();

    return fetch(getEndpoint, init).then((res) => res.json());
  }

  list(): Promise<Aspect[]> {
    const createEndpoint = this.endpoint();

    const init = requestInit();

    return fetch(createEndpoint, init).then((res) => res.json());
  }

  private endpoint(...path: string[]): string {
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
