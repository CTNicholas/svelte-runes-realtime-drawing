<script lang="ts">
  import { usePresence } from "./liveblocks-hooks.svelte";


  // export const {
  //   room,
  //   storage,
  // }: {
  //   room: TypedRoom;
  //   storage: LiveObject<Storage>;
  // } = $props();

  const colors = ["#E54900", "red", "blue"]

  const presence = usePresence();
  console.log(9, presence.get)
</script>

<div class="toolbar">
  {#each colors as color}

  {/each}
</div>

<style>
  .toolbar {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>