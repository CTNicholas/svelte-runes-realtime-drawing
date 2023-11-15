import type { LiveObject } from "@liveblocks/client";
import { type Storage, type TypedRoom, enterRoom } from "../liveblocks.config";

// Functions to join/leave a multiplayer room and get real-time Storage
export class Liveblocks {
  room: TypedRoom | undefined = $state();
  storage: LiveObject<Storage> | undefined = $state();
  roomId: string;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  // Enter a multiplayer room, get storage, return a cleanup function
  enter = () => {
    const { room, leave } = enterRoom(this.roomId);
    room.getStorage().then(({ root }) => {
      this.storage = root;
    });
    this.room = room;
    return leave;
  };
}

// Was previously written like this and used with `useLiveblocks()` and onMount/onDestroy
// export function useLiveblocks(roomId: string) {
//   class Liveblocks {
//     room = $state();
//     leave  = $state();
//     storage = $state();
//
//     async enter() {
//       const info = enterRoom(roomId);
//       this.room = info.room;
//       this.leave = info.leave;
//       this.storage = (await info.room.getStorage()).root);
//     }
//   }
//
//   return new Liveblocks();
// }
