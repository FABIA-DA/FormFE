import {BaseService, IdType, IdTypeZod} from './base-service';
import {z} from 'zod';
import {FieldTypeZod} from './field-type-service';
import {firstValueFrom} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseService {
  protected get controller(): string {
    return 'api/fields';
  }

  public async getAllFieldsAsync(): Promise<Field[]> {
    return await this.trySendRequest(async (): Promise<Field[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FieldListResponse = FieldListResponseZod.parse(response.body);

      return result.fields;
    }, 'Error while trying to get all fields.');
  }

  public async getFieldByIdAsync(id: IdType): Promise<Field> {
    return await this.trySendRequest(async (): Promise<Field> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: Field = FieldZod.parse(response.body);

      return result;
    }, `Error while trying to get field with id ${id}.`);
  }

  public async createFieldAsync(fieldTypeId: IdType, name: string, description: string | null, isOptional: boolean): Promise<Field> {
    return await this.trySendRequest(async (): Promise<Field> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        fieldTypeId: fieldTypeId,
        name: name,
        description: description,
        isOptional: isOptional
      }, {observe: 'response'}));
      const result: Field = FieldZod.parse(response.body);

      return result;
    }, 'Error while trying to create field.');
  }

  public async updateFieldAsync(id: IdType, fieldTypeId: IdType, name: string, description: string | null, isOptional: boolean): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        fieldTypeId: fieldTypeId,
        name: name,
        description: description,
        isOptional: isOptional
      }, {observe: 'response'}));
    }, ``);
  }

  public async deleteFieldAsync(id: IdType): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete field with id ${id}.`);
  }
}

export const FieldZod = z.object({
  id: IdTypeZod,
  fieldTypeId: IdTypeZod,
  name: z.string().nonempty(),
  description: z.string().nullable(),
  isOptional: z.boolean(),
  type: FieldTypeZod
});

export type Field = z.infer<typeof FieldZod>;

const FieldListResponseZod = z.object({
  fields: z.array(FieldZod)
});

export type FieldListResponse = z.infer<typeof FieldListResponseZod>;
