import { GetSiteResponse, LemmyHttp } from "lemmy-js-client";

/**
 * This contains serialized data, it needs to be deserialized before use.
 */
export interface IsoData {
  path: string;
  routeData: any[];
  site_res: GetSiteResponse;
}

export interface ILemmyConfig {
  wsHost?: string;
}

declare global {
  interface Window {
    isoData: IsoData;
    lemmyConfig?: ILemmyConfig;
  }
}

export interface InitialFetchRequest {
  auth?: string;
  client: LemmyHttp;
  path: string;
}

export interface PostFormParams {
  name?: string;
  url?: string;
  body?: string;
  nameOrId?: string | number;
}

export enum CommentViewType {
  Tree,
  Flat,
}

export enum DataType {
  Post,
  Comment,
}

export enum BanType {
  Community,
  Site,
}

export enum PersonDetailsView {
  Overview,
  Comments,
  Posts,
  Saved,
}

export enum PurgeType {
  Person,
  Community,
  Post,
  Comment,
}
