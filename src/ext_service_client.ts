import { Either, right } from "./either";
import { ServerOpts } from "./server_opts";
import { AntboxError } from "./antbox_error";
import { processResponse, toObject, toVoid } from "./process_response";
import { requestInit } from "./request_utils";
import { Node } from "./antbox";

export class ExtServiceClient {
  constructor(private readonly server: ServerOpts) {}

  get(uuid: string): Promise<Either<AntboxError, Node>> {
    const getEndpoint = this.endpoint("/", uuid);

    return fetch(getEndpoint, this.#init).then(processResponse(toObject<Node>));
  }

  export(uuid: string): Promise<Either<AntboxError, Blob>> {
    const url = this.endpoint("/", uuid, "/-/export");
    const init = requestInit(this.server);

    return fetch(url, init).then(processResponse((res) => res.blob()));
  }

  delete(uuid: string): Promise<Either<AntboxError, void>> {
    const url = this.endpoint("/", uuid);
    const init = requestInit(this.server, "DELETE");

    return fetch(url, init).then(processResponse(toVoid));
  }

  update(uuid: string, metadata: Partial<Node>) {
    const url = this.endpoint("/", uuid);
    const init = requestInit(
      this.server,
      "PATCH",
      JSON.stringify(metadata),
      "application/json"
    );

    return fetch(url, init).then(processResponse(toVoid));
  }

  createOrReplace(
    file: File,
    metadata: Partial<Node>
  ): Promise<Either<AntboxError, Node>> {
    const url = this.server.url.concat("/upload/ext");

    const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", {
      type: "application/json",
    });

    const formData = new FormData();

    formData.append("file", file, file.name);
    formData.append("metadata", metadataFile);

    const init = requestInit(this.server, "POST", formData);

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  list(): Promise<Either<AntboxError, Node[]>> {
    const createEndpoint = this.endpoint();

    return fetch(createEndpoint, this.#init)
      .then(processResponse(toObject<Node[]>))
      .then((extsOrErr) => {
        if (extsOrErr.isLeft()) {
          return extsOrErr;
        }

        const sorted = extsOrErr.value.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        return right(sorted);
      });
  }

  get #init() {
    return requestInit(this.server);
  }

  private endpoint(...path: string[]): string {
    const endpoint = this.server.url.concat("/", "ext");

    if (!path.length) {
      return endpoint;
    }

    return endpoint.concat(...path);
  }
}

export default function extServiceClient(server: ServerOpts): ExtServiceClient {
  return new ExtServiceClient(server);
}
