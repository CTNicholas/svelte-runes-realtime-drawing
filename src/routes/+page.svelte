<script>
  import "../globals.css";
  import Canvas from "../components/Canvas.svelte";
  import { onDestroy, onMount } from "svelte";
  import { enterRoom } from "../liveblocks.config";
  import Logo from "../components/Logo.svelte";

  let roomId = "my-svelte-room";
  let room = $state();
  let leave = $state();
  let points = $state();

  onMount(() => {
    async function run() {
      const info = enterRoom(roomId);
      const storage = await info.room.getStorage();
      room = info.room;
      leave = info.leave;
      points = storage.root.get("points");
    }

    run();
  });

  onDestroy(() => {
    leave();
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
