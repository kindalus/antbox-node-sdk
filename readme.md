# Antbox SDK

Antbox SDK provides a Node client for the Antbox ECM, offering a clear and consistent API to interact with the system. With this SDK, developers can seamlessly integrate Antbox's functionalities into their applications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [ActionServiceClient](#1-actionserviceclient)
  - [AspectServiceClient](#2-aspectserviceclient)
  - [LoginClient](#3-loginclient)
  - [NodeServiceClient](#4-nodeserviceclient)
  - [WebContentService](#5-webcontentservice)

## Installation

To get started, you can install the package using npm:

```bash
npm install antbox-sdk
```

## Usage

### Importing the Clients

To use a client, you first need to import it:

```typescript
import {
  ActionServiceClient,
  AspectServiceClient,
  LoginClient,
  NodeServiceClient,
  WebContentService,
} from "antbox-sdk";
```

### Clients and Methods

Below are the provided clients with their associated methods:

#### 1. ActionServiceClient

| Method                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| get(uuid)                 | Retrieves an action by its UUID.              |
| run(uuid, uuids, params?) | Executes a specific action on multiple nodes. |
| list()                    | Lists all available actions.                  |

Example:

```typescript
const actionService = new ActionServiceClient(serverOpts);
actionService.get("sample-uuid").then((action) => {
  console.log(action);
});
```

#### 2. AspectServiceClient

| Method    | Description                      |
| --------- | -------------------------------- |
| get(uuid) | Retrieves an aspect by its UUID. |
| list()    | Lists all available aspects.     |

Example:

```typescript
const aspectService = new AspectServiceClient(serverOpts);
aspectService.get("sample-uuid").then((aspect) => {
  console.log(aspect);
});
```

#### 3. LoginClient

| Method         | Description                                |
| -------------- | ------------------------------------------ |
| loginRoot(pwd) | Logs in as the root user using a password. |

Example:

```typescript
const loginClient = new LoginClient(serverOpts);
loginClient.loginRoot("your-password").then((response) => {
  console.log(response);
});
```

#### 4. NodeServiceClient

| Method                                | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| getNodeUrl(uuid)                      | Retrieves the URL for a specific node by its UUID.           |
| copy(uuid, to)                        | Copies a node to a specified location.                       |
| duplicate(uuid)                       | Duplicates a node.                                           |
| createFolder(metadata)                | Creates a new folder node with the given metadata.           |
| createFile(file, metadata)            | Creates a new file node with the provided file and metadata. |
| createMetanode(metadata)              | Creates a new meta node with the specified metadata.         |
| updateFile(uuid, file)                | Updates an existing file node with a new file.               |
| delete(uuid)                          | Deletes a node by its UUID.                                  |
| get(uuid)                             | Retrieves a node by its UUID.                                |
| list(parent?)                         | Lists all nodes, optionally filtered by their parent.        |
| query(filters, pageSize?, pageToken?) | Queries nodes based on given filters and pagination options. |
| update(uuid, node)                    | Updates a node's metadata.                                   |
| evaluate(uuid)                        | Evaluates a smart folder node.                               |
| export(uuid)                          | Exports a node's content.                                    |

Example:

```typescript
const nodeService = new NodeServiceClient(serverOpts);
nodeService.get("sample-uuid").then((node) => {
  console.log(node);
});
```

#### 5. WebContentService

This section is left blank because the provided code does not have any methods or descriptions for the WebContentService client.

### ServerOpts

For all the examples above, the `serverOpts` should be an object that provides necessary configurations for the client to communicate with the server. Typically, it would include the URL of the server.

Example:

```typescript
const serverOpts = {
  url: "https://your-antbox-server-url.com",
};
```

## Conclusion

The Antbox SDK offers a comprehensive interface to work with the Antbox ECM, ensuring that developers can easily integrate and leverage its capabilities. Make sure to consult the official Antbox documentation for more details on the available features and functionalities.
