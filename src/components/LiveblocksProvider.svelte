<script lang="ts">
  import { useLiveblocks } from "./liveblocks-hooks.svelte";

  export const { id }: { id: string } = $props();

  $effect(() => {
    return useLiveblocks(id);
  })
</script>

<slot />