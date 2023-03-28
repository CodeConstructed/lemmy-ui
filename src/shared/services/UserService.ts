// import Cookies from 'js-cookie';
import IsomorphicCookie from "isomorphic-cookie";
import jwt_decode from "jwt-decode";
import { LoginResponse, MyUserInfo } from "lemmy-js-client";
import { BehaviorSubject, Subject } from "rxjs";
import { isHttps, externalHost } from "../env";
import { Analytics } from "@june-so/analytics-node";

interface Claims {
  sub: number;
  iss: string;
  iat: number;
}

export class UserService {
  private static _instance: UserService;
  public myUserInfo: MyUserInfo;
  public claims: Claims;
  public jwtSub: Subject<string> = new Subject<string>();
  public unreadInboxCountSub: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public unreadReportCountSub: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public unreadApplicationCountSub: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  protected analytics: Analytics | undefined;

  private constructor() {
    const analyticsAPIKey = process.env["JUNO_APIKEY"] || "";
    if ( !!externalHost && !!analyticsAPIKey ) {
      this.analytics = new Analytics(analyticsAPIKey);
    }
    if (this.auth) {
      this.setClaims(this.auth);
    } else {
      // setTheme();
      console.log("No JWT cookie found.");
    }
  }

  public login(res: LoginResponse) {
    let expires = new Date();
    expires.setDate(expires.getDate() + 365);
    IsomorphicCookie.save("jwt", res.jwt, { expires, secure: isHttps });
    console.log("jwt cookie set");
    this.setClaims(res.jwt);
  }

  public logout() {
    this.claims = undefined;
    this.myUserInfo = undefined;
    // setTheme();
    this.jwtSub.next("");
    IsomorphicCookie.remove("jwt"); // TODO is sometimes unreliable for some reason
    document.cookie = "jwt=; Max-Age=0; path=/; domain=" + location.host;
    console.log("Logged out.");
    location.reload();
  }

  public get auth(): string {
    return IsomorphicCookie.load("jwt");
  }

  public trackAnalytics(event: string, properties) {
    this.analytics?.track({
      userId: this.claims.sub,
      event: event,
      properties: properties,
    });    
  }

  private setClaims(jwt: string) {
    this.claims = jwt_decode(jwt);
    this.jwtSub.next(jwt);
    this.analytics?.identify({
      userId: this.claims.sub,
      traits: {
        email: this.claims.sub
      }
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
