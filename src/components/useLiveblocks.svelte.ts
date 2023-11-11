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
