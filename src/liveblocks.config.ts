import {
  createClient,
  type Room,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { PUBLIC_LIVEBLOCKS_PUBLIC_KEY } from "$env/static/public";

export const client = createClient({
  publicApiKey: PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
  throttle: 16,
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = {
  color: string;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.

// A LiveList (multiplayer array) of coordinates used to represent the path
// https://liveblocks.io/docs/api-reference/liveblocks-client#LiveList
export type Point =
  | [x: number, y: number, pressure: number]
  | [x: number, y: number];

export type Path = LiveObject<{
  color: string;
  points: LiveList<Point>;
}>;

// Basically this structure
// paths: Map<{
//   "s8sfg8...": {
//     color: "red",
//     points: [
//       [245, 373, 0.5],
//       [256, 383, 0.5],
//       ...
//     ],
//   }>
// }
export type Storage = {
  paths: LiveMap<string, Path>;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
export type UserMeta = {
  // id?: string,  // Accessible through `user.id`
  // info?: Json,  // Accessible through `user.info`
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
export type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

// Optionally, when using Comments, ThreadMetadata represents metadata on
// each thread. Can only contain booleans, strings, and numbers.
export type ThreadMetadata = {
  // resolved: boolean;
  // quote: string;
  // time: number;
};

export type TypedRoom = Room<Presence, Storage, UserMeta, RoomEvent>;

// Enter room with initial values and correct types
export function enterRoom(roomId: string) {
  return client.enterRoom<Presence, Storage, UserMeta, RoomEvent>(roomId, {
    initialPresence: {
      color: "#E54900"
    },
    initialStorage: {
      // Start the room with an empty LiveMap
      // https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap
      paths: new LiveMap(),
    },
  });
}
