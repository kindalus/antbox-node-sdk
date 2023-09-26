export const FOLDER_MIMETYPE = "application/vnd.antbox.folder";
export const META_NODE_MIMETYPE = "application/vnd.antbox.metanode";
export const SMART_FOLDER_MIMETYPE = "application/vnd.antbox.smartfolder";
export const ACTION_MIMETYPE = "application/vnd.antbox.action";
export const ASPECT_MIMETYPE = "application/vnd.antbox.aspect";
export const EXTENTION_MIMETYPE = "application/vnd.antbox.extension";
export const GROUP_MIMETYPE = "application/vnd.antbox.group";
export const USER_MIMETYPE = "application/vnd.antbox.user";

export const ROOT_FOLDER_UUID = "--root--";
export const USERS_FOLDER_UUID = "--users--";
export const GROUPS_FOLDER_UUID = "--groups--";
export const ASPECTS_FOLDER_UUID = "--aspects--";
export const ACTIONS_FOLDER_UUID = "--actions--";
export const EXTENTIONS_FOLDER_UUID = "--ext--";
export const SYSTEM_FOLDER_UUID = "--system--";
export const FID_PREFIX = "fid--";

export interface Action {
	uuid: string;
	title: string;
	description: string;
	builtIn: boolean;
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

export interface RunContext {
	readonly principal: Principal;
	readonly nodeService: NodeServiceForActions;
	readonly aspectService: AspectServiceForActions;
}

export interface NodeServiceForActions {
	createFile(principal: Principal, file: File, parent: string): Promise<string>;

	createFolder(principal: Principal, title: string, parent: string): Promise<string>;

	copy(principal: Principal, uuid: string): Promise<string>;

	updateFile(principal: Principal, uuid: string, file: File): Promise<void>;

	delete(principal: Principal, uuid: string): Promise<void>;

	get(principal: Principal, uuid: string): Promise<Node>;

	list(principal: Principal, parent: string): Promise<Node[]>;

	query(
		principal: Principal,
		constraints: NodeFilter[],
		pageSize: number,
		pageToken: number,
	): Promise<NodeFilterResult>;

	update(principal: Principal, uuid: string, data: Partial<Node>): Promise<void>;
}

export interface AspectServiceForActions {
	get(principal: Principal, uuid: string): Promise<Aspect>;
	list(principal: Principal): Promise<Aspect[]>;
}

export interface Principal {
	getPrincipalName(): string;
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

export interface FileNode extends Node {
	// Versões têm o formato aaaa-MM-ddTHH:mm:ss
	versions: string[];
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

export type NodeFilter = [field: string, operator: FilterOperator, value: unknown];

export interface Aggregation {
	title: string;
	fieldName: string;
	formula: AggregationFormula;
}

export type AggregationFormula = "sum" | "count" | "avg" | "med" | "max" | "min" | "string";

export interface Aspect {
	uuid: string;
	title: string;
	description: string;
	builtIn: boolean;
	filters: NodeFilter[];
	properties: AspectProperty[];
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
