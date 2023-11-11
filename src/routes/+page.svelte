<script lang="ts">
  import "../globals.css";
  import Canvas from "../components/Canvas.svelte";
  import { onDestroy, onMount } from "svelte";
  import Logo from "../components/Logo.svelte";
  import { enterRoom } from "../liveblocks.config";

  // Functions to join/leave a multiplayer room and get real-time Storage
  export function useLiveblocks(roomId: string) {
    let room = $state();
    let leave = $state();
    let storage = $state();

    async function enter() {
      const info = enterRoom(roomId);
      room = info.room;
      leave = info.leave;
      storage = (await info.room.getStorage()).root;
    }

    return {
      enter,
      get leave() {
        return leave;
      },
      get room() {
        return room;
      },
      get storage() {
        return storage;
      },
    };
  }

  const lb = useLiveblocks("my-svelte-room");

  onMount(() => {
    lb.enter();
  });

  onDestroy(() => {
    lb.leave();
  });
</script>

<main>
  <Logo />
  {#if lb.room && lb.storage}
    <Canvas room={lb.room} storage={lb.storage} />
  {/if}
</main>

<style>
  main {
    background: #fff;
    position: absolute;
    inset: 0;
  }
</style>
