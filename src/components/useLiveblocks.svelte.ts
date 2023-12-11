import { enterRoom } from "../liveblocks.config";

// Functions to join/leave a multiplayer room and get real-time Storage
export class Liveblocks {
  room = $state();
  storage = $state();
  roomId;

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
