import actionServiceClient, {
  ActionServiceClient,
} from "./action_service_client";
import aspectServiceClient, {
  AspectServiceClient,
} from "./aspect_service_client";
import nodeServiceClient, { NodeServiceClient } from "./node_service_client";
import webContentServiceClient, {
  WebContentServiceClient,
} from "./web_content_service_client";
import loginClient, { LoginClient } from "./login_client";

export {
  actionServiceClient,
  ActionServiceClient,
  aspectServiceClient,
  AspectServiceClient,
  nodeServiceClient,
  NodeServiceClient,
  loginClient,
  LoginClient,
  webContentServiceClient,
  WebContentServiceClient,
};

export type {
  Action,
  ActionParams,
  Aspect,
  AspectProperty,
  FileNode,
  FolderNode,
  Node,
  FilterOperator,
  NodeFilter,
  NodeFilterResult,
  Permissions,
  Properties,
  PropertyType,
  SmartFolderNode,
  SmartFolderNodeEvaluation,
  WebContent,
} from "./antbox";

export {
  FOLDER_MIMETYPE,
  SMART_FOLDER_MIMETYPE,
  ROOT_FOLDER_UUID,
  META_NODE_MIMETYPE,
  ASPECT_MIMETYPE,
  ACTION_MIMETYPE,
  EXTENTION_MIMETYPE,
  GROUP_MIMETYPE,
  USER_MIMETYPE,
  ASPECTS_FOLDER_UUID,
  ACTIONS_FOLDER_UUID,
  SYSTEM_FOLDER_UUID,
  EXTENTIONS_FOLDER_UUID,
  USERS_FOLDER_UUID,
  GROUPS_FOLDER_UUID,
  fidToUuid,
} from "./antbox";

export { left, right, type Either } from "./either";

export type { AntboxError } from "./antbox_error";
