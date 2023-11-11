<script lang="ts">
  import { getStroke } from "./perfect-freehand";
  import { getSvgPathFromStroke } from "./utils";
  import type { TypedRoom, Storage } from "../liveblocks.config";

  type Props = {
    room: TypedRoom;
    points: Storage["points"];
  };
  let { room, points }: Props = $props();

  let pathData = $state();

  function handlePointerDown(e: PointerEvent) {
    e.target.setPointerCapture(e.pointerId);
    points.clear();
    points.push([e.pageX, e.pageY, e.pressure]);
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1) {
      return;
    }

    e.target.setPointerCapture(e.pointerId);
    points.push([e.pageX, e.pageY, e.pressure]);
  }

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
