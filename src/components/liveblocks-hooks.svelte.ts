import type { LiveObject } from "@liveblocks/client";
import { type Storage as TStorage, type TypedRoom, enterRoom, type Presence as TPresence } from "../liveblocks.config";
import { getContext, setContext } from "svelte";

type Context = {
  room: TypedRoom;
  storage: LiveObject<TStorage> | undefined;
}

const contextKey = Symbol();
const getLb = () => getContext<Context>(contextKey);

// Functions to join/leave a multiplayer room and get real-time Storage
export function useLiveblocks(roomId: string) {
  const info = enterRoom(roomId);
  let room: TypedRoom = $state(info.room);
  
  let storage: LiveObject<TStorage> | undefined = $state()
  room.getStorage().then(({ root }) => {
    storage = root;
  });

  const context = {
    get room() {
      return room;
    },

    get storage() {
      return storage;
    },
  };

  setContext(contextKey, context);
  return info.leave;
}

export class Room {
  room: TypedRoom = $state(getLb().room);
}

export class Storage {
  get: LiveObject<TStorage> | undefined = $state(getLb().storage);
}

export class Presence {
  get: TPresence = $state(getLb().room.getPresence());
  update: TypedRoom["updatePresence"] = $state(getLb().room.updatePresence)
  
  constructor() {
    getLb().room.subscribe("my-presence", (newPresence) => this.get = newPresence);
  }
}

export function usePresence() {
  let a = $state({ get: null, set: () => {} });
  $effect(() => {
    a = new Presence();
  })
  return a
}