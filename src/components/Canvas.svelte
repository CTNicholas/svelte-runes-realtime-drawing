<script lang="ts">
  import { getStroke } from "./perfect-freehand/perfect-freehand";
  import { getSvgPathFromStroke } from "./perfect-freehand/perfect-freehand-utils";
  import type { Storage, Point, TypedRoom } from "../liveblocks.config";
  import { LiveList, LiveObject } from "@liveblocks/client";
  import { nanoid } from "nanoid";

  export const {
    room,
    storage,
  }: {
    room: TypedRoom;
    storage: LiveObject<Storage>;
  } = $props();

  // Multiplayer presence, used to store temporary user data e.g. brush colour
  let presence = room.getPresence();

  // Get the `paths` LiveMap from Storage
  // https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap
  const paths = storage.get("paths");

  // Holds SVG paths data to draw the paths
  let svgPaths: { d: string, fill: string }[] = $state([]);

  // Current pathId being drawn
  let currentId: string | null = $state(null);

  // Delete previous points and start a new path
  function handlePointerDown(e: PointerEvent) {
    (e.target as SVGElement).setPointerCapture(e.pointerId);

    const newPoints = new LiveList<Point>();
    newPoints.push([e.pageX, e.pageY, e.pressure]);

    // Create a path with the current user's brush colour
    const newId = nanoid();
    const newPath = new LiveObject({
      color: presence.color,
      points: newPoints,
    });

    paths.set(newId, newPath);
    currentId = newId;
  }

  // If holding button down on pointer move, add new points
  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1 || !currentId) {
      return;
    }

    (e.target as SVGElement).setPointerCapture(e.pointerId);

    const points = paths.get(currentId)?.get("points");
    points?.push([e.pageX, e.pageY, e.pressure]);
  }

  function handlePointerUp() {
    currentId = null;
  }

  // Delete all paths in one go
  function resetPaths() {
    room.batch(() => {
      for (const id of paths.keys()) {
        paths.delete(id);
      }
    });
  }

  function renderPaths() {
    const newSvgPaths = [];

    for (const path of paths.values()) {
      const points = path.get("points");
      const fill = path.get("color");

      const stroke = getStroke(points.toImmutable(), {
        size: 16,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });
      newSvgPaths.push({ fill, d: getSvgPathFromStroke(stroke) });
    }

    svgPaths = [...newSvgPaths];
  }

  // Listen for `paths` changing in Storage, and create updated `svgPaths`
  room.subscribe(paths, renderPaths, { isDeep: true });

  // Listen for presence changes and update
  room.subscribe("my-presence", (newPresence) => presence = newPresence);

  renderPaths();
</script>

<svg
  id="paths"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
>
  {#each svgPaths as svgPath}
    <path d={svgPath.d} fill={svgPath.fill} />
  {/each}
</svg>

<button onclick={resetPaths} aria-label="Reset paths">
  <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
    <path
      fill-rule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
      clip-rule="evenodd"
    />
  </svg>
</button>

<style>
  #paths {
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  button {
    position: absolute;
    top: 36px;
    right: 40px;
    appearance: none;
    width: 38px;
    border: 0;
    background: none;
    opacity: 0.4;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.7;
  }
</style>
