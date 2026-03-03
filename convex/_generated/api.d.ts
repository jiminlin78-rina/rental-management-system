/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as actionsV2 from "../actionsV2.js";
import type * as basic from "../basic.js";
import type * as bills from "../bills.js";
import type * as clearForTest from "../clearForTest.js";
import type * as clearRagic from "../clearRagic.js";
import type * as clearRagicData from "../clearRagicData.js";
import type * as debug from "../debug.js";
import type * as landlordLookup from "../landlordLookup.js";
import type * as mapping from "../mapping.js";
import type * as multiLandlordAction from "../multiLandlordAction.js";
import type * as multiLandlordSync from "../multiLandlordSync.js";
import type * as properties from "../properties.js";
import type * as ragic from "../ragic.js";
import type * as ragicDirect from "../ragicDirect.js";
import type * as rooms from "../rooms.js";
import type * as seedData from "../seedData.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  actionsV2: typeof actionsV2;
  basic: typeof basic;
  bills: typeof bills;
  clearForTest: typeof clearForTest;
  clearRagic: typeof clearRagic;
  clearRagicData: typeof clearRagicData;
  debug: typeof debug;
  landlordLookup: typeof landlordLookup;
  mapping: typeof mapping;
  multiLandlordAction: typeof multiLandlordAction;
  multiLandlordSync: typeof multiLandlordSync;
  properties: typeof properties;
  ragic: typeof ragic;
  ragicDirect: typeof ragicDirect;
  rooms: typeof rooms;
  seedData: typeof seedData;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
