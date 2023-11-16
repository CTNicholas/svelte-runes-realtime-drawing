<script lang="ts">
  import "../globals.css";
  import Canvas from "../components/Canvas.svelte";
  import Logo from "../components/Logo.svelte";
  import Toolbar from "../components/Toolbar.svelte";
  import LiveblocksProvider from "../components/LiveblocksProvider.svelte";
</script>

<main>
  <Logo />
  <LiveblocksProvider id="my-other-svelte-room-again">
    <Toolbar />
  </LiveblocksProvider>
  <!-- {#if provider.room && provider.storage}
    <Canvas room={lb.room} storage={lb.storage} />
    <Toolbar />
  {/if} -->
</main>

<style>
  main {
    background: #fff;
    position: absolute;
    inset: 0;
  }
</style>
