<script lang="ts">
  import "../globals.css";
  import { Liveblocks } from "../components/useLiveblocks.svelte";
  import Canvas from "../components/Canvas.svelte";
  import Logo from "../components/Logo.svelte";

  const lb = new Liveblocks("my-other-svelte-room-again");

  $effect(() => {
    return lb.enter();
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
