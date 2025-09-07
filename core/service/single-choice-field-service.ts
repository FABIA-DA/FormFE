import {BaseService, IdType, IdTypeZod} from './base-service';
import {z} from 'zod';
import {FieldZod} from './field-service';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {id} from 'zod/v4/locales';

@Injectable({
  providedIn: 'root'
})
export class SingleChoiceFieldService extends BaseService {
  protected get controller(): string {
    return 'api/single-choice-fields';
  }

  public async getAllSingleChoiceFieldsAsync(): Promise<SingleChoiceField[]> {
    return await this.trySendRequest(async (): Promise<SingleChoiceField[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: SingleChoiceFieldListResponse = SingleChoiceFieldListResponseZod.parse(response.body);

      return result.fields;
    }, 'Error while trying to get all single choice fields.');
  }

  public async getSingleChoiceFieldByIdAsync(id: IdType): Promise<SingleChoiceField> {
    return await this.trySendRequest(async (): Promise<SingleChoiceField> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: SingleChoiceField = SingleChoiceFieldZod.parse(response.body);

      return result;
    }, `Error while trying to get single choice field with id ${id}.`);
  }

  public async createSingleChoiceFieldAsync(name: string, options: {
    name: string,
    fieldIds: (IdType)[]
  }[]): Promise<SingleChoiceField> {
    return await this.trySendRequest(async (): Promise<SingleChoiceField> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        options: options
      }, {observe: 'response'}));
      const result: SingleChoiceField = SingleChoiceFieldZod.parse(response.body);

      return result;
    }, 'Error while trying to create single choice field.');
  }

  public async updateSingleChoiceFieldByIdAsync(id: IdType, name: string, oldOptions: {
    id: IdType,
    name: string,
    fieldIds: (IdType)[]
  }[], newOptions: { name: string, fieldIds: (IdType)[] }[]): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        oldOptions: oldOptions,
        newOptions: newOptions
      }, {observe: 'response'}));
    }, `Error while trying to update single choice field with id ${id}.`);
  }

  public async deleteSingleChoiceFieldByIdAsync(id: IdType): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete single choice field with id ${id}.`);
  }

}

export const OptionZod = z.object({
  id: IdTypeZod,
  singleChoiceFieldId: IdTypeZod,
  name: z.string().nonempty(),
  fields: z.array(FieldZod)
});

export type Option = z.infer<typeof OptionZod>;

export const SingleChoiceFieldZod = z.object({
  id: IdTypeZod,
  name: z.string().nonempty(),
  options: z.array(OptionZod)
});

export type SingleChoiceField = z.infer<typeof SingleChoiceFieldZod>;

const SingleChoiceFieldListResponseZod = z.object({
  fields: z.array(SingleChoiceFieldZod)
});

export type SingleChoiceFieldListResponse = z.infer<typeof SingleChoiceFieldListResponseZod>;
