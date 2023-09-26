import { requestInit } from "./request_utils";
import { AntboxError } from "./antbox_error";
import { Either } from "./either";
import { processResponse, toObject, toVoid } from "./process_response";
import { ServerOpts } from "./server_opts";

import type { Node, NodeFilter } from "./antbox";

import {
  FolderNode,
  FOLDER_MIMETYPE,
  META_NODE_MIMETYPE,
  NodeFilterResult,
  SmartFolderNodeEvaluation,
} from "./antbox";

export default function (server: ServerOpts): NodeServiceClient {
  return new NodeServiceClient(server);
}

export class NodeServiceClient {
  constructor(private readonly server: ServerOpts) {}

  getNodeUrl(uuid: string): string {
    return exportEndpoint(this.server, uuid);
  }

  copy(uuid: string, to: string): Promise<Either<AntboxError, Node>> {
    const url = endpoint(this.server, uuid, "-", "copy");
    const init = requestInit(this.server, "POST", JSON.stringify({ to }));

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  duplicate(uuid: string): Promise<Either<AntboxError, Node>> {
    const url = endpoint(this.server, uuid, "-", "duplicate");
    const init = requestInit(this.server);

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  createFolder(
    metadata: Partial<FolderNode>
  ): Promise<Either<AntboxError, Node>> {
    const url = endpoint(this.server);
    const body = JSON.stringify({
      metadata: { ...metadata, mimetype: FOLDER_MIMETYPE },
    });
    const init = requestInit(this.server, "POST", body, "application/json");

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  createFile(
    file: File,
    metadata: Partial<Node>
  ): Promise<Either<AntboxError, Node>> {
    const url = uploadEndpoint(this.server);
    const init = uploadFileInitRequest(this.server, file, metadata);

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  createMetanode(metadata: Partial<Node>): Promise<Either<AntboxError, Node>> {
    const url = endpoint(this.server);
    const body = JSON.stringify({
      metadata: { ...metadata, mimetype: META_NODE_MIMETYPE },
    });
    const init = requestInit(this.server, "POST", body, "application/json");

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  updateFile(uuid: string, file: File): Promise<Either<AntboxError, void>> {
    const url = uploadEndpoint(this.server, uuid);
    const init = uploadFileInitRequest(this.server, file);

    return fetch(url, init).then(processResponse(toVoid));
  }

  delete(uuid: string) {
    const url = endpoint(this.server, uuid);
    const init = requestInit(this.server, "DELETE");

    return fetch(url, init).then(processResponse(toVoid));
  }

  get(uuid: string): Promise<Either<AntboxError, Node>> {
    const url = endpoint(this.server, uuid);
    const init = requestInit(this.server);

    return fetch(url, init).then(processResponse(toObject<Node>));
  }

  list(parent = ""): Promise<Either<AntboxError, Node[]>> {
    const url = endpoint(this.server).concat(`?parent=${parent}`);
    const init = requestInit(this.server);

    return fetch(url, init).then(
      processResponse((res) =>
        res
          .json()
          .then((nodes: Node[]) =>
            nodes.sort((a, b) => a.title.localeCompare(b.title))
          )
      )
    );
  }

  query(
    filters: NodeFilter[],
    pageSize?: number,
    pageToken?: number
  ): Promise<Either<AntboxError, NodeFilterResult>> {
    const queryEndpoint = endpoint(this.server, "-", "query");

    const body = JSON.stringify({ filters, pageSize, pageToken });
    const init = requestInit(this.server, "POST", body, "application/json");

    return fetch(queryEndpoint, init).then(
      processResponse(toObject<NodeFilterResult>)
    );
  }

  update(
    uuid: string,
    node: Partial<Node>
  ): Promise<Either<AntboxError, void>> {
    const url = endpoint(this.server, uuid);
    const body = JSON.stringify({ ...node });
    const init = requestInit(this.server, "PATCH", body, "application/json");

    return fetch(url, init).then(processResponse(toVoid));
  }

  evaluate(
    uuid: string
  ): Promise<Either<AntboxError, SmartFolderNodeEvaluation>> {
    const url = endpoint(this.server, uuid, "-", "evaluate");
    const init = requestInit();
    const byTitle = (a: Node, b: Node) => a.title.localeCompare(b.title);

    return fetch(url, init).then(
      processResponse(async (res) => {
        const { records, aggregations } = await res.json();
        return {
          aggregations,
          records: records.sort(byTitle),
        } as SmartFolderNodeEvaluation;
      })
    );
  }

  export(uuid: string): Promise<Either<AntboxError, Blob>> {
    const url = exportEndpoint(this.server, uuid);
    const init = requestInit(this.server);

    return fetch(url, init).then(processResponse((res) => res.blob()));
  }
}

function uploadFileInitRequest(
  server: ServerOpts,
  file: File,
  metadata?: Partial<Node>
): RequestInit {
  const formData = new FormData();

  formData.append("file", file, file.name);

  if (metadata) {
    formData.append(
      "metadata",
      new File([JSON.stringify(metadata)], "metadata", {
        type: "application/json",
      })
    );
  }

  return requestInit(server, "POST", formData);
}

function uploadEndpoint(server: ServerOpts, uuid?: string) {
  const path = [server.url, "upload", "nodes"];
  if (uuid) {
    path.push(uuid);
  }

  return path.join("/");
}

function exportEndpoint(server: ServerOpts, uuid: string): string {
  return endpoint(server, uuid, "-", "export");
}

function endpoint(server: ServerOpts, ...path: string[]): string {
  return [server.url, "nodes", ...path].join("/");
}

export const getNodeDownloadUrl = exportEndpoint;
