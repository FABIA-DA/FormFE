import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  private static readonly baseUrl: string = 'http://localhost:8080';
  //protected readonly http: HttpClient = inject(HttpClient);

  protected abstract get controller(): string;

  protected buildUrl(action: string | null, ...queryParams: ((QueryParam | null) | undefined)[]): string {
    let url = `${BaseService.baseUrl}/${this.controller}`;
    if(action !== null) {
      url += `/${action}`;
    }

    if(queryParams.length > 0
    && queryParams.some(p => p != undefined)) {
      let first: boolean = true;
      for(const [key, value] of queryParams
        .filter(p => p != null && p[0] != null)
        .map(p => p as QueryParam)) {
        let prefix = '&';
        if(first){
          prefix = '?';
          first = false;
        }

        url = url.concat(prefix, value, '=', value.toString());
      }
    }

    return url;
  }
}

export type QueryParam = [
  key: string,
  value: any
];
