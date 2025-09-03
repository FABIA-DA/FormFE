import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ZodError} from 'zod';
import {firstValueFrom} from 'rxjs';
import {FieldTypeListResponse} from './field-type-service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  private static readonly baseUrl: string = 'http://localhost:5200';
  protected readonly http: HttpClient = inject(HttpClient);

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

  protected async trySendRequest<T>(executeRequest: () => Promise<T>, errorLocation: string): Promise<T> {
    try {
      return await executeRequest();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(`${errorLocation} Http error: ${error.status} ${error.message}`);
      } else if (error instanceof ZodError) {
        throw new Error(`${errorLocation} Parsing error: ${error.message}`)
      } else if (error instanceof Error) {
        throw new Error(`${errorLocation} Unexpected error: ${error.message}`);
      }
      throw new Error(`${errorLocation} Unknown error.`);
    }
  }
}

export type QueryParam = [
  key: string,
  value: any
];
