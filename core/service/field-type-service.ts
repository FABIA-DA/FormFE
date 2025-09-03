import {BaseService} from './base-service';
import {z} from 'zod';
import {firstValueFrom} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldTypeService extends BaseService {
  protected get controller(): string {
    return 'api/field-types';
  }

  public async getAllFieldTypesAsync(): Promise<FieldType[]> {
    return await this.trySendRequest(async (): Promise<FieldType[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FieldTypeListResponse = FieldTypeListResponseZod.parse(response.body);

      return result.types;
    }, 'Error while trying to get all field types.');
  }

  public async getFieldTypeByIdAsync(id: string | number): Promise<FieldType> {
    return await this.trySendRequest(async (): Promise<FieldType> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FieldType = FieldTypeZod.parse(response.body);

      return result;
    }, `Error while trying to get field type with id ${id}.`);
  }

  public async createFieldTypeAsync(name: string, description: string | null, regex: string): Promise<FieldType> {
    return await this.trySendRequest(async (): Promise<FieldType> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        description: description,
        regex: regex
      }, {observe: 'response'}));
      const result: FieldType = FieldTypeZod.parse(response.body);

      return result;
    }, 'Error while trying to create field type.');
  }

  public async updateFieldTypeAsync(id: string | number, name: string, description: string | null, regex: string): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        description: description,
        regex: regex
      }, {observe: 'response'}));
    }, `Error while trying to update field type with id ${id}.`);
  }

  public async deleteFieldTypeAsync(id: string | number): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete field type with id ${id}.`);
  }
}

export const FieldTypeZod = z.object({
  id: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  name: z.string().nonempty(),
  description: z.string().nullable(),
  regex: z.string().nonempty()
});

export type FieldType = z.infer<typeof FieldTypeZod>;

const FieldTypeListResponseZod = z.object({
  types: z.array(FieldTypeZod)
});

export type FieldTypeListResponse = z.infer<typeof FieldTypeListResponseZod>;
