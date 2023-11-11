<script lang="ts">
  import "../globals.css";
  import Canvas from "../components/Canvas.svelte";
  import { onDestroy, onMount } from "svelte";
  import { enterRoom } from "../liveblocks.config";
  import Logo from "../components/Logo.svelte";

  let roomId = "my-svelte-room";
  let room: ReturnType<enterRoom["room"]>;
  let points;

  onMount(() => {
    async function run() {
      const info = enterRoom(roomId);
      const storage = await info.room.getStorage();
      room = info.room;
      points = storage.root.get("points");

      onDestroy(() => {
        info.leave();
      });
    }

    run();
  });
</script>

<main>
  <Logo />
  {#if room && points}
    <Canvas {room} {points} />
  {/if}
</main>

<style>
  main {
    background: #fff;
    position: absolute;
    inset: 0;
  }
</style>
