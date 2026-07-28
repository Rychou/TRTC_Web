/**
 * TRTC Web SDK Whiteboard plugin (v0.2)
 *
 * Drawing overlay built on top of VideoMixer's canvas source capability,
 * with support for interactive whiteboard sessions:
 *
 *   - **host**: drives the shared canvas, mixes it into its own published
 *     video stream via VideoMixer, and broadcasts SEI ack frames.
 *   - **guest**: draws on a local preview canvas overlaid on the host's
 *     remote video element, and synchronizes strokes with the host through
 *     TRTC `customMessage` signaling.
 *
 * Role is **derived from `targetUser`**:
 *   - `targetUser` empty / undefined -> host
 *   - `targetUser` non-empty userId  -> guest of that host
 *
 * `mode` controls **interactivity only** (`'interactive' | 'viewing'`); both
 * host and guest can be either mode. Runtime role transitions (host↔guest)
 * are a future planned capability; the current version supports only
 * guest→guest target host switching via `updatePlugin('Whiteboard', { targetUser })`.
 *
 * Prerequisites:
 *   - host: VideoMixer must be started, and TRTC must be created with
 *     `enableSEI: true`.
 *   - guest: the host's remote video must be subscribed and rendered into
 *     the same `view` container before `startPlugin('Whiteboard', ...)`.
 *
 * @packageDocumentation
 */

/**
 * Drawing tool types supported by Whiteboard.
 */
export enum WhiteboardTool {
  Pen          = 'pen',
  Rect         = 'rect',
  Ellipse      = 'ellipse',
  Arrow        = 'arrow',
  Laser        = 'laser',
  EraserPath   = 'eraserPath',
  EraserObject = 'eraserObject',
}

/**
 * Whiteboard operating mode (controls interactivity, NOT role).
 *
 * - `'interactive'` (default): canvas listens to pointer events and is drawable.
 * - `'viewing'`: canvas does NOT listen to pointer events; remains visible only.
 *
 * Both host and guest can be either `'interactive'` or `'viewing'`.
 */
export type WhiteboardMode = 'interactive' | 'viewing';

/**
 * Eraser-object scope (host only).
 *
 * - `'self'` (default): host's eraserObject hit-test only deletes strokes
 *   owned by the host itself; clicks on guest strokes are treated as misses.
 * - `'all'`: host can object-erase any owner's stroke; guest-owned hits are
 *   broadcast as `UNDO_ACK` so all peers stay in sync.
 *
 * Guest is always treated as `'self'` regardless of this option (self-only
 * rule, see doc.md §6.2).
 */
export type EraserObjectScope = 'self' | 'all';

/**
 * Whiteboard plugin events.
 *
 * See doc.md §3.3.
 */
export enum WhiteboardEvent {
  STARTED                 = 'started',
  STOPPED                 = 'stopped',
  ERROR                   = 'error',
  /** Guest only: emitted when the ACK feedback loop enters `stalled`. */
  STALLED                 = 'stalled',
  /** Guest only: emitted when a SESSION_START batch resend exits stalled. */
  RESUMED                 = 'resumed',
  /** Host + Guest: undo availability changed. */
  UNDO_STATE_CHANGED      = 'undo-state-changed',
  /** Host + Guest: redo availability changed. */
  REDO_STATE_CHANGED      = 'redo-state-changed',
}

/** Reason why the guest ACK feedback loop entered `stalled`. */
export type SessionStalledReason = 'silence' | 'queue-full' | 'ack-timeout';

/** Payload carried by `STALLED`. */
export interface WhiteboardSessionStalledInfo {
  /** Target host userId. */
  targetUser: string;
  /** Number of pending ACK items preserved for SESSION_START batch resend. */
  pendingCount: number;
  /** `silence` for 5 s target-host silence; `queue-full` for queue cap protection. */
  reason: SessionStalledReason;
}

/** Payload carried by `RESUMED`. */
export interface WhiteboardSessionResumedInfo {
  /** Target host userId. */
  targetUser: string;
  /** Number of pending ACK items put back on the wire. */
  resentCount: number;
}

/**
 * Whiteboard start options.
 *
 * Single unified options type for both host and guest. The role is derived
 * from `targetUser` at start time:
 *   - omitted / `''`        -> host
 *   - non-empty userId      -> guest of that host
 *
 * See doc.md §3.1 for the full per-field contract.
 */
export interface WhiteboardStartOptions {
  // ===== Common (host & guest) =====

  /**
   * Required. Container element (or its id selector) for the whiteboard canvas.
   *   - host: hosts the dual-canvas (preview + committed) overlay.
   *   - guest: hosts the local preview canvas overlaid on the host's
   *     remote video.
   */
  view: HTMLElement | string;

  /**
   * Optional. Specifies which host this whiteboard interacts with at start time.
   *   - omitted / `''`      -> current role = host
   *   - non-empty userId    -> current role = guest of that host
   *
   * Runtime `targetUser` updates currently support guest→guest host switching only.
   * Host↔guest role transitions are a future planned capability; until then,
   * stop and restart the plugin to change role.
   */
  targetUser?: string;

  /**
   * Optional. Controls whether the canvas reacts to pointer events.
   * Independent of role - applies to host and guest alike.
   * Default: `'interactive'`.
   */
  mode?: WhiteboardMode;

  /** Optional display name broadcast to remote peers. Falls back to userId. */
  userName?: string;

  /**
   * Optional. TRTC `customMessage` cmdId. Default: `9`. Range: `[1, 10]`.
   * Must not conflict with other plugins / business logic.
   *
   * NOTE: cmdId is **fixed at start time and cannot be updated later**;
   * passing `cmdId` to `update()` throws `INVALID_OPERATION`.
   */
  cmdId?: number;

  // ===== Common tool / style =====

  /** Initial drawing tool. Default: `WhiteboardTool.Pen`. */
  tool?: WhiteboardTool;

  /** Initial drawing color. Default: `'#ff0000'`. */
  color?: string;

  /** Initial line width in pixels. Default: `3`. */
  lineWidth?: number;

  /**
   * Duration in milliseconds for the laser trail to fade out.
   * Only applies when `tool` is `WhiteboardTool.Laser`. Default: `1000`.
   */
  laserFadeDuration?: number;

  // ===== Host-only =====

  /** VideoMixer canvas source id. Default: `'whiteboard'`. Host only. */
  canvasId?: string;

  /** VideoMixer canvas zIndex. Default: `100`. Host only. */
  zIndex?: number;

  /**
   * Number of consecutive SEI frames in which a COMMIT_ACK batch is repeated
   * (weak-network fallback). Default: `3`. Host only.
   */
  seiAckRepeatFrames?: number;

  /**
   * Object-eraser scope (host only). Default: `'self'`.
   *
   *   - `'self'`: host's `eraserObject` only deletes its own strokes.
   *   - `'all'`:  host can also object-erase any guest's stroke; the deletion
   *               is broadcast via SEI `UNDO_ACK` to keep all peers in sync.
   *
   * Ignored on guest (guest is always self-only).
   */
  eraserObjectScope?: EraserObjectScope;
}

/**
 * Whiteboard update options.
 *
 * See doc.md §3.2 for the field-by-field semantics on host vs guest.
 */
export interface WhiteboardUpdateOptions {
  /**
   * Switch interaction target (guest→guest only in the current version).
   *   - guest + non-empty userId -> re-point this guest at a different host
   *   - host + non-empty userId  -> throws `INVALID_OPERATION`
   *   - guest + `''`            -> throws `INVALID_OPERATION`
   *
   * Host↔guest runtime role transitions are a future planned capability;
   * stop and restart the plugin if you need to change role today.
   */
  targetUser?: string;

  /**
   * Toggle interactivity without changing role.
   *   - `'interactive'` -> canvas accepts pointer events
   *   - `'viewing'`     -> canvas is read-only
   */
  mode?: WhiteboardMode;

  /** Switch drawing tool. */
  tool?: WhiteboardTool;

  /** Update drawing color. */
  color?: string;

  /** Update line width. */
  lineWidth?: number;

  /**
   * Update the laser trail fade-out duration (ms).
   * Only applies when `tool` is `WhiteboardTool.Laser`.
   */
  laserFadeDuration?: number;

  /** Trigger one undo step. Set to `true` to execute. */
  undo?: boolean;

  /** Trigger one redo step. Set to `true` to execute. */
  redo?: boolean;

  /** Clear strokes (host: clear all; guest: clear self). */
  clear?: boolean;

  /**
   * Update VideoMixer canvas source id (host only). Triggers
   * `removeCanvasSource(old) -> addCanvasSource(new)` on VideoMixer.
   */
  canvasId?: string;

  /** Update VideoMixer canvas zIndex (host only). */
  zIndex?: number;

  /**
   * Switch object-eraser scope (host only). See `WhiteboardStartOptions.eraserObjectScope`.
   * Ignored on guest (guest is always self-only).
   */
  eraserObjectScope?: EraserObjectScope;
}

/**
 * Whiteboard Plugin Class.
 *
 * Extends `EventEmitter`-style API: `on / off / once / removeAllListeners`
 * follow the eventemitter3 conventions used across other TRTC plugins
 * (Chorus, etc.). Listener payloads are typed via overloads below.
 */
export default class Whiteboard {
  static Name: string;

  /**
   * Public event name enum:
   * `Whiteboard.EVENT.STARTED`, `Whiteboard.EVENT.STOPPED`, …
   */
  static EVENT: typeof WhiteboardEvent;

  /**
   * Start the whiteboard plugin.
   *
   * Role is derived from `options.targetUser`:
   *   - omitted / `''`     -> host (requires VideoMixer active and `enableSEI: true`)
   *   - non-empty userId   -> guest of that host
   */
  start(options: WhiteboardStartOptions): Promise<void>;

  /**
   * Update plugin state at runtime. See doc.md §3.2.
   *
   * Notable transitions:
   *   - guest `update({ targetUser: 'xxx' })` -> switch to another host
   *   - `update({ mode })`                    -> toggle interactivity in place
   *
   * Host↔guest runtime role transitions are future planned and currently
   * throw `INVALID_OPERATION`. Passing `cmdId` also throws `INVALID_OPERATION`
   * because cmdId is fixed at start time.
   */
  update(options?: WhiteboardUpdateOptions): Promise<void>;

  /**
   * Stop the whiteboard plugin. As host, broadcasts `SESSION_END`, removes
   * the canvas source from VideoMixer and tears down listeners. As guest,
   * tears down preview canvas / op stack and stops listening.
   */
  stop(): Promise<void>;

  // ─── EventEmitter surface (typed overloads) ───────────────────────────────

  /** Subscribe to `STARTED`. */
  on(event: WhiteboardEvent.STARTED                  | 'started',                   handler: () => void): this;
  /** Subscribe to `STOPPED`. */
  on(event: WhiteboardEvent.STOPPED                  | 'stopped',                   handler: () => void): this;
  /** Subscribe to `ERROR`. */
  on(event: WhiteboardEvent.ERROR                    | 'error',                     handler: (err: Error) => void): this;
  /** Subscribe to `STALLED` (guest only). */
  on(event: WhiteboardEvent.STALLED                  | 'stalled',                   handler: (info: WhiteboardSessionStalledInfo) => void): this;
  /** Subscribe to `RESUMED` (guest only). */
  on(event: WhiteboardEvent.RESUMED                  | 'resumed',                   handler: (info: WhiteboardSessionResumedInfo) => void): this;

  /** Subscribe-once helpers (same overloads as `on`). */
  once(event: WhiteboardEvent.STARTED                | 'started',                   handler: () => void): this;
  once(event: WhiteboardEvent.STOPPED                | 'stopped',                   handler: () => void): this;
  once(event: WhiteboardEvent.ERROR                  | 'error',                     handler: (err: Error) => void): this;
  once(event: WhiteboardEvent.STALLED                | 'stalled',                   handler: (info: WhiteboardSessionStalledInfo) => void): this;
  once(event: WhiteboardEvent.RESUMED                | 'resumed',                   handler: (info: WhiteboardSessionResumedInfo) => void): this;

  /** Unsubscribe a previously registered handler. Pass no `handler` to remove all for the event. */
  off(event: WhiteboardEvent | `${WhiteboardEvent}`, handler?: (...args: any[]) => void): this;

  /** Remove all listeners (optionally for a specific event). */
  removeAllListeners(event?: WhiteboardEvent | `${WhiteboardEvent}`): this;
}

export { Whiteboard };
