<script lang="ts">
  import { getStroke } from "./perfect-freehand";
  import { getSvgPathFromStroke } from "./utils";
  import type { TypedRoom, Storage } from "../liveblocks.config";

  let {
    room,
    storage,
  }: {
    room: TypedRoom;
    storage: Storage;
  } = $props();

  // Get the `points` LiveObject from Storage
  // https://liveblocks.io/docs/api-reference/liveblocks-client#LiveObject
  let points = $state(storage.get("points"));

  // Holds SVG path data to draw the path
  let pathData = $state();

  // Delete previous points and start a new path
  function handlePointerDown(e: PointerEvent) {
    e.target.setPointerCapture(e.pointerId);
    points.clear();
    points.push([e.pageX, e.pageY, e.pressure]);
  }

  // If holding button down on pointer move, add new points
  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1) {
      return;
    }

    e.target.setPointerCapture(e.pointerId);
    points.push([e.pageX, e.pageY, e.pressure]);
  }

  // Listen for `points` changing in Storage, and create updated `pathData`
  room.subscribe(points, (newPoints: Storage["points"]) => {
    const stroke = getStroke(newPoints.toImmutable(), {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });
    pathData = getSvgPathFromStroke(stroke);
  });
</script>

<svg on:pointerdown={handlePointerDown} on:pointermove={handlePointerMove}>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E54B00" />
      <stop offset="100%" stop-color="#E54900" />
    </linearGradient>
  </defs>

  {#if points}
    <path d={pathData} fill="white" />
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  path {
    fill: url("#gradient");
  }
</style>
