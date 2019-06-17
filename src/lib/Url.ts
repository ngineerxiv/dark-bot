import * as uuid from "uuid/v4";

export class Url {
  private urlString: string;
  private cacheBusterPrefix: string;

  constructor(urlString: string, cacheBusterPrefix?: string) {
    this.urlString = urlString;
    this.cacheBusterPrefix =
      cacheBusterPrefix === undefined ? "?" : cacheBusterPrefix;
  }

  withCacheBuster(): string {
    return this.urlString + this.cacheBusterPrefix + "cb=" + uuid();
  }

  static apply(urlString: string, cacheBusterPrefix?: string): string {
    return new Url(urlString, cacheBusterPrefix).withCacheBuster();
  }
}
