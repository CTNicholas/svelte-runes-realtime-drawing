import { enterRoom } from "../liveblocks.config";

// Functions to join/leave a multiplayer room and get real-time Storage
export function useLiveblocks(roomId: string) {
  class Liveblocks {
    room = $state();
    leave = $state();
    storage = $state();

    async enter() {
      const info = enterRoom(roomId);
      this.room = info.room;
      this.leave = info.leave;
      this.storage = (await info.room.getStorage()).root;
    }
  }

  return new Liveblocks();
}
