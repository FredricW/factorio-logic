export interface Blueprint {
	/**
	 * The name of the item that was saved ("blueprint" in vanilla).
	 */
	item: 'blueprint';
	/**
	 * The name of the blueprint set by the user.
	 */
	label: string;
	/**
	 * The color of the label of this blueprint.
	 */
	label_color: Color;
	/**
	 * The actual content of the blueprint, array of #Entity objects.
	 */
	entities: BlueprintEntity[];
	/**
	 * The tiles included in the blueprint, array of #Tile objects.
	 */
	tiles: Tile[];
	/**
	 * The icons of the blueprint set by the user, array of #Icon objects.
	 */
	icons: Icon[];
	/**
	 * The map version of the map the blueprint was created in.
	 */
	version: number; // long
	/**
	 * The schedules for trains in this blueprint, array of #Schedule objects.
	 */
	schedules: Schedule[];
}

export interface BlueprintBook {
	/**
	 * The name of the item that was saved ("blueprint-book" in vanilla).
	 */
	item: 'blueprint-book';
	/**
	 * The name of the blueprint set by the user.
	 */
	label: string;
	/**
	 * The color of the label of this blueprint.
	 */
	label_color: Color;
	/**
	 * The actual content of the blueprint book, array of objects containing an "index" key and 0-based value and a "blueprint" key with a #Blueprint object as the value.
	 */
	blueprints: Blueprint[];
	/**
	 * Index of the currently selected blueprint, 0-based.
	 */
	active_index: number;
	/**
	 * The map version of the map the blueprint was created in, see Version string format.
	 */
	version: number; // long
}

interface Icon {
	/**
	 * Index of the icon, 1-based.
	 */
	index: number;
	/**
	 * The icon that is displayed, #SignalID object.
	 */
	signal: SignalID;
}

interface SignalID {
	/**
	 * The name of the signal.
	 */
	name: string;
	/**
	 * The type of the signal.
	 */
	type: 'item' | 'fluid' | 'virtual';
}

/**
 * The representation of an entity inside of a blueprint.
 */
interface BlueprintEntity {
	/**
	 * Index of the entity, 1-based
	 */
	entity_number: number;
	/**
	 * Name of the entity (e.g. "transport-belt")
	 */
	name: string; // make this an enum or union type?
	/**
	 * Position of the entity within the blueprint
	 */
	position: Position;
	/**
	 * Direction of the entity, uint
	 */
	direction?: number;
	/**
	 * Orientation of cargo wagon or locomotive, value 0 to 1 (optional).
	 */
	orientation?: number; // float
	/**
	 * Circuit connection, object with keys starting from 1, values are #Connection objects.
	 */
	connections?: Connection;
	/**
	 * Copper wire connections, array of entity_numbers.
	 */
	neighbors?: number[];
	/**
	 * The control behavior of the entity, if it has one. The format of the control behavior depends on the entity's type. Only relevant for entities that support control behaviors.
	 */
	control_behavior?: Record<string, unknown>;
	/**
	 * Item requests by this entity, this is what defines the item-request-proxy
	 * when the blueprint is placed
	 */
	items?: ItemRequest[];
	/**
	 * Name of the recipe protitype this assembling machine is set to
	 */
	recipe?: string;
	/**
	 * Used by Prototype/Container. The index of the first inaccessible item slot
	 * due to limiting with the red "bar". 0-based Types/ItemStackIndex.
	 */
	bar?: number;
	/**
	 * Cargo wagon inventory configuration, optional. #Inventory object
	 */
	inventory?: Inventory;
	/**
	 * Used by Prototype/InfinityContainer, optional. #Infinity settings object.
	 */
	infinity_settings?: InfinitySettings;
	/**
	 * Type of the underground belt or loader, optional. Either "input" or "output".
	 */
	type?: 'input' | 'output';
	/**
	 * The entity tags of the entity, if there are any. Only relevant for entity ghosts.
	 */
	tags?: Record<string, string | number | boolean | Record<string, unknown>>;
	/**
	 * Input priority of the splitter, optional. Either "right" or "left", "none" is omitted.
	 */
	input_priority?: 'right' | 'left' | 'none';
	/**
	 * Output priority of the splitter, optional. Either "right" or "left", "none" is omitted.
	 */
	output_priority?: 'right' | 'left' | 'none';
	/**
	 * Filter of the splitter, optional. Name of the item prototype the filter is set to, string.
	 */
	filter?: string;
	/**
	 * Filters of the filter inserter or loader, optional. Array of #Item filter objects.
	 */
	filters?: ItemFilter[];
	/**
	 * Filter mode of the filter inserter, optional. Either "whitelist" or "blacklist".
	 */
	filter_mode?: 'whitelist' | 'blacklist';
	/**
	 * The stack size the inserter is set to, optional. Types/uint8.
	 */
	override_stack_size?: number;
	/**
	 * The drop position the inserter is set to, optional. #Position object.
	 */
	drop_position?: Position;
	/**
	 * The pickup position the inserter is set to, optional. #Position object.
	 */
	pickup_position?: Position;
	/**
	 * Used by Prototype/LogisticContainer, optional. #Logistic filter object.
	 */
	request_filters?: LogisticFilter[];
	/**
	 * Boolean. Whether this requester chest can request from buffer chests.
	 */
	request_from_buffers: boolean;
	/**
	 * Used by Programmable speaker, optional. #Speaker parameter object.
	 */
	parameters?: SpeakerParameters[];
	/**
	 * Used by Programmable speaker, optional. #Speaker alert parameter object
	 */
	alert_parameters?: SpeakerAlertParameters[];
	/**
	 * Used by the rocket silo, optional. Boolean, whether auto launch is enabled.
	 */
	auto_launch?: boolean;
	/**
	 * Used by Prototype/SimpleEntityWithForce or Prototype/SimpleEntityWithOwner, optional. Types/GraphicsVariation
	 */
	variation?: unknown;
	/**
	 * Color of the Prototype/SimpleEntityWithForce, Prototype/SimpleEntityWithOwner, or train station, optional. #Color object.
	 */
	color?: Color;
	/**
	 * The name of the train station, optional.
	 */
	station?: string;
}

/**
 * Key-value object where the key is the name of the item and the value is the
 * amount of that item to be requested
 */
type ItemRequest = {
	[name: string]: number;
};

interface Inventory {
	/**
	 * Array of #Item filter objects.
	 */
	filters: ItemFilter[];
	/**
	 * The index of the first inaccessible item slot due to limiting with the red "bar". 0-based, optional. Types/ItemStackIndex.
	 */
	bar?: number;
}

interface Schedule {
	/**
	 * Array of #Schedule Record objects.
	 */
	schedule: ScheduleRecord[];
	/**
	 * Array of entity numbers of locomotives using this schedule.
	 */
	locomotives: number[];
}

interface ScheduleRecord {
	/**
	 * The name of the stop for this schedule record.
	 */
	station: string;
	/**
	 * Array of #Wait Condition objects.
	 */
	wait_conditions: WaitCondition[];
}

interface WaitCondition {
	type:
		| 'time'
		| 'inactivity'
		| 'full'
		| 'empty'
		| 'item_count'
		| 'circuit'
		| 'robots_inactive'
		| 'fluid_count'
		| 'passenger_present'
		| 'passenger_not_present';
	/**
	 * Tells how this condition is to be compared with the preceding conditions in the corresponding wait_conditions array.
	 */
	compare_type: 'and' | 'or';
	/**
	 * Number of ticks to wait or of inactivity. Only present when type is "time" or "inactivity". Optional.
	 */
	ticks?: number; // uint
	/**
	 * CircuitCondition Object, only present when type is "item_count", "circuit" or "fluid_count".
	 */
	condition?: CircuitCondition;
}

interface CircuitCondition {
	/**
	 * Specifies how the inputs should be compared. If not specified, defaults to "<".
	 */
	comparator?: ComparatorString;
	/**
	 * Defaults to blank
	 */
	first_signal?: SignalID;
	/**
	 * What to compare first_signal to. If not specified, first_signal will be compared to constant.
	 */
	second_signal?: SignalID;
	/**
	 * Constant to compare first_signal to. Has no effect when second_signal is set. When neither second_signal nor constant are specified, the effect is as though constant were specified with the value 0.
	 */
	constant?: number;
}

/**
 * A string that specifies how the inputs should be compared.
 */
type ComparatorString = '=' | '>' | '<' | '≥' | '≤' | '≠' | '>=' | '<=' | '!=';

interface Tile {
	/**
	 * Prototype name of the tile (e.g. "concrete")
	 */
	name: string;
	/**
	 * #Position object, position of the entity within the blueprint.
	 */
	position: Position;
}

interface Position {
	/**
	 * X coordinate of the position, 0 is the center.
	 */
	x: number; // float
	/**
	 * Y coordinate of the position, 0 is the center.
	 */
	y: number; // float
}

/**
 * Object containing information about the connections to other entities formed by red or green wires.
 */
interface Connection {
	/**
	 * First connection point. The default for everything that doesn't have multiple connection points.
	 */
	1: ConnectionPoint;
	/**
	 * Second connection point. For example, the "output" part of an arithmetic combinator.
	 */
	2: ConnectionPoint;
}

/**
 * The actual point where a wire is connected to. Contains information about where it is connected to.
 */
interface ConnectionPoint {
	/**
	 * An array of #Connection data object containing all the connections from this point created by red wire.
	 */
	red: ConnectionData[];
	/**
	 * An array of #Connection data object containing all the connections from this point created by green wire.
	 */
	green: ConnectionData[];
}

/**
 * Information about a single connection between two connection points.
 */
interface ConnectionData {
	/**
	 * ID of the entity this connection is connected with.
	 */
	entity_id: number; // uint?
	/**
	 * The circuit connector id of the entity this connection is connected to, see defines.circuit_connector_id.
	 */
	circuit_id: number; // uint?
}

interface ItemFilter {
	/**
	 * Name of the item prototype this filter is set to.
	 */
	name: string;
	/**
	 * Index of the filter, 1-based.
	 */
	index: number;
}

interface InfinitySettings {
	/**
	 * Boolean. Whether the "remove unfiltered items" checkbox is checked.
	 */
	remove_unfiltered_items: boolean;
	/**
	 * Filters of the infinity container, optional. Array of #Infinity filter objects.
	 */
	filters?: InfinityFilter[];
}

interface InfinityFilter {
	/**
	 * Name of the item prototype the filter is set to, string.
	 */
	name: string;
	/**
	 * Number the filter is set to, Types/ItemCountType.
	 */
	count: number;
	/**
	 * Mode of the filter. Either "at-least", "at-most", or "exactly".
	 */
	mode: 'at-least' | 'at-most' | 'exactly';
	/**
	 * Index of the filter, 1-based.
	 */
	index: number;
}

interface LogisticFilter {
	/**
	 * Name of the item prototype this filter is set to.
	 */
	name: string;
	/**
	 * Index of the filter, 1-based.
	 */
	index: number;
	/**
	 * Number the filter is set to, Types/ItemCountType. Is 0 for storage chests.
	 */
	count: number;
}

interface SpeakerParameters {
	/**
	 * Types/double. Volume of the speaker.
	 */
	playback_volume: number;
	/**
	 * Boolean, whether global playback is enabled.
	 */
	playback_globally: boolean;
	/**
	 * Boolean, whether polyphony is allowed.
	 */
	allow_polyphony: boolean;
}

interface SpeakerAlertParameters {
	/**
	 * Boolean, whether an alert is shown.
	 */
	show_alert: boolean;
	/**
	 * Boolean, whether an alert icon is shown on the map.
	 */
	show_on_map: boolean;
	/**
	 * The icon that is displayed with the alert, #SignalID object.
	 */
	icon_signal_id: SignalID;
	/**
	 * String, message of the alert.
	 */
	alert_message: string;
}

interface Color {
	/**
	 * red, number from 0 to 1.
	 */
	r: number;
	/**
	 * green, number from 0 to 1.
	 */
	g: number;
	/**
	 * blue, number from 0 to 1.
	 */
	b: number;
	/**
	 * transparency, number from 0 to 1.
	 */
	a: number;
}
