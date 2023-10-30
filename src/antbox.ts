export const FOLDER_MIMETYPE = "application/vnd.antbox.folder";
export const META_NODE_MIMETYPE = "application/vnd.antbox.metanode";
export const SMART_FOLDER_MIMETYPE = "application/vnd.antbox.smartfolder";
export const ASPECT_MIMETYPE = "application/vnd.antbox.aspect";
export const ACTION_MIMETYPE = "application/vnd.antbox.action";
export const EXT_MIMETYPE = "application/vnd.antbox.extension";
export const USER_MIMETYPE = "application/vnd.antbox.user";
export const GROUP_MIMETYPE = "application/vnd.antbox.group";
export const OCR_TEMPLATE_MIMETYPE = "application/vnd.antbox.ocrtemplate";
export const API_KEY_MIMETYPE = "application/vnd.antbox.apikey";

export const ROOT_FOLDER_UUID = "--root--";
export const USERS_FOLDER_UUID = "--users--";
export const GROUPS_FOLDER_UUID = "--groups--";
export const ASPECTS_FOLDER_UUID = "--aspects--";
export const ACTIONS_FOLDER_UUID = "--actions--";
export const EXT_FOLDER_UUID = "--ext--";
export const SYSTEM_FOLDER_UUID = "--system--";
export const OCR_TEMPLATES_FOLDER_UUID = "--ocr-templates--";
export const API_KEYS_FOLDER_UUID = "--api-keys--";

export const ADMINS_GROUP_UUID = "--admins--";
const FID_PREFIX = "--fid--";

export const SYSTEM_MIMETYPES = [
  ASPECT_MIMETYPE,
  ACTION_MIMETYPE,
  EXT_MIMETYPE,
  USER_MIMETYPE,
  GROUP_MIMETYPE,
  OCR_TEMPLATE_MIMETYPE,
  API_KEY_MIMETYPE,
];

export interface ActionNode extends Node {
  runOnCreates: boolean;
  runOnUpdates: boolean;
  runManually: boolean;
  params: string[];
  filters: NodeFilter[];
}

export interface ActionParams {
  name: string;
  title: string;
  type: string;
  required: boolean;
  validationRegex?: string;
  validationList?: string[];
}

export type Properties = Record<string, unknown>;

export interface Node extends Record<string, unknown> {
  uuid: string;
  fid: string;
  title: string;
  description?: string;
  mimetype: string;
  size: number;
  aspects?: string[];
  parent?: string;
  createdTime: string;
  modifiedTime: string;
  owner: string;
  properties?: Properties;
}

export type Permissions = "Read" | "Write" | "Export";
export interface FolderNode extends Node {
  onCreate: string[];
  onUpdate: string[];
  group: string;
  permissions: {
    group: Permissions[];
    authenticated: Permissions[];
    anonymous: Permissions[];
  };
}

export interface SmartFolderNode extends Node {
  aspectConstraints: [string];
  mimetypeConstraints: [string];
  filters: NodeFilter[];
  aggregations?: Aggregation[];
}

export type FilterOperator =
  | "=="
  | "<="
  | ">="
  | "<"
  | ">"
  | "!="
  | "in"
  | "not-in"
  | "match"
  | "contains"
  | "contains-all"
  | "contains-any"
  | "not-contains"
  | "contains-none";

export type NodeFilter = [
  field: string,
  operator: FilterOperator,
  value: unknown
];

export interface Aggregation {
  title: string;
  fieldName: string;
  formula: AggregationFormula;
}

export type AggregationFormula =
  | "sum"
  | "count"
  | "avg"
  | "med"
  | "max"
  | "min"
  | "string";

export interface AspectNode extends Node {
  filters: NodeFilter[];
  aspectProperties: AspectProperty[];
}

export interface AspectProperty {
  /**
   * regex /[a-zA-Z_][_a-zA-Z0-9_]{2,}/;
   */
  name: string;
  title: string;
  type: PropertyType;
  readonly: boolean;

  /**
   * Opcional
   */
  validationRegex?: string;

  /**
   * Opcional
   */
  validationList?: string[];
  validationFilters?: NodeFilter[];
  required: boolean;
  default?: unknown;
}

export interface GroupNode extends Node {
  mimetype: "application/vnd.antbox.group";
}

export interface UserNode extends Node {
  email: string;
  group: string;
  groups: string[];
}

export interface ApiKeyNode extends Node {
  group: string;
  secret: string;
}

export type PropertyType =
  | "boolean"
  | "date"
  | "dateTime"
  | "json"
  | "number"
  | "number[]"
  | "richText"
  | "string"
  | "string[]"
  | "text"
  | "uuid"
  | "uuid[]";

export interface WebContent {
  uuid: string;
  fid: string;
  title: string;
  pt: string;
  en?: string;
  es?: string;
  fr?: string;
}

export interface NodeFilterResult {
  pageToken: number;
  pageSize: number;
  pageCount: number;
  nodes: Array<Node>;
}

export interface SmartFolderNodeEvaluation {
  records: Node[];
  aggregations?: {
    title: string;
    value: unknown;
  }[];
}

export function fidToUuid(fid: string): string {
  return `${FID_PREFIX}${fid}`;
}

export function isFid(uuid: string): boolean {
  return uuid?.startsWith(FID_PREFIX);
}

export function uuidToFid(fid: string): string {
  return fid?.startsWith(FID_PREFIX) ? fid.substring(FID_PREFIX.length) : fid;
}

export function isRootFolder(uuid: string): boolean {
  return uuid === ROOT_FOLDER_UUID;
}

export function isSystemRootFolder(uuid: string): boolean {
  return uuid === SYSTEM_FOLDER_UUID;
}

export function isFolder(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === FOLDER_MIMETYPE;
}

export function isGroupsFolder(metadata: Partial<Node>): boolean {
  return metadata.uuid === GROUPS_FOLDER_UUID;
}

export function isUser(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === USER_MIMETYPE;
}

export function isApiKey(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === API_KEY_MIMETYPE;
}

export function isSmartFolder(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === SMART_FOLDER_MIMETYPE;
}

export function isAction(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === ACTION_MIMETYPE;
}

export function isMetaNode(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === META_NODE_MIMETYPE;
}

export function isGroup(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === GROUP_MIMETYPE;
}

export function isOcrTemplate(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === OCR_TEMPLATE_MIMETYPE;
}

export function isAspect(metadata: Partial<Node>): boolean {
  return metadata?.mimetype === ASPECT_MIMETYPE;
}

export function isSystemNode(metadata: Partial<Node>): boolean {
  return SYSTEM_MIMETYPES.some((mimetype) => mimetype === metadata?.mimetype);
}

export function isJavascript(file: File) {
  return (
    file.type === "application/javascript" || file.type === "text/javascript"
  );
}

export function isAspectsFolder(metadata: Partial<Node>): boolean {
  return metadata.uuid === ASPECTS_FOLDER_UUID;
}

export function isActionsFolder(metadata: Partial<Node>): boolean {
  return metadata.uuid === ACTIONS_FOLDER_UUID;
}

export function isApiKeysFolder(metadata: Partial<Node>): boolean {
  return metadata.uuid === API_KEYS_FOLDER_UUID;
}

export function isExtensionsFolder(metadata: Partial<Node>): boolean {
  return metadata.uuid === EXT_FOLDER_UUID;
}

export function isExtension(metadata: Partial<Node>): boolean {
  return metadata.mimetype === EXT_MIMETYPE;
}

export type Permission = "Read" | "Write" | "Export";

export const SYSTEM_FOLDERS = [
  SYSTEM_FOLDER_UUID,
  ASPECTS_FOLDER_UUID,
  USERS_FOLDER_UUID,
  GROUPS_FOLDER_UUID,
  ACTIONS_FOLDER_UUID,
  EXT_FOLDER_UUID,
  OCR_TEMPLATES_FOLDER_UUID,
  API_KEYS_FOLDER_UUID,
];

export function isSystemFolder(metadata: Partial<Node>): boolean {
  return SYSTEM_FOLDERS.some((folder) => folder === metadata.uuid);
}
