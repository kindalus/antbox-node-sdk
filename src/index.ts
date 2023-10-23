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

import extServiceClient, { ExtServiceClient } from "./ext_service_client";

export {
  actionServiceClient,
  ActionServiceClient,
  aspectServiceClient,
  AspectServiceClient,
  extServiceClient,
  ExtServiceClient,
  nodeServiceClient,
  NodeServiceClient,
  loginClient,
  LoginClient,
  webContentServiceClient,
  WebContentServiceClient,
};

export type {
  ActionNode,
  ActionParams,
  AspectNode,
  AspectProperty,
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
  EXT_MIMETYPE,
  GROUP_MIMETYPE,
  USER_MIMETYPE,
  ASPECTS_FOLDER_UUID,
  ACTIONS_FOLDER_UUID,
  SYSTEM_FOLDER_UUID,
  SYSTEM_FOLDERS,
  EXT_FOLDER_UUID,
  USERS_FOLDER_UUID,
  GROUPS_FOLDER_UUID,
  fidToUuid,
  isApikey,
  isAspect,
  isAction,
  isFolder,
  isSmartFolder,
  isUser,
  isGroup,
  isOcrTemplate,
  isMetaNode,
  isRootFolder,
  isSystemNode,
  isFid,
  isJavascript,
  isSystemRootFolder,
  isActionsFolder,
  isAspectsFolder,
  isApiKeysFolder,
  isSystemFolder,
  isExtensionsFolder,
  isExtension,
} from "./antbox";

export { left, right, type Either } from "./either";

export type { AntboxError } from "./antbox_error";
