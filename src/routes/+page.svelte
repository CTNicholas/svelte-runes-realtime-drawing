<script lang="ts">
  import "../globals.css";
  import { onDestroy, onMount } from "svelte";
  import { useLiveblocks } from "../components/useLiveblocks.svelte";
  import Canvas from "../components/Canvas.svelte";
  import Logo from "../components/Logo.svelte";

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
