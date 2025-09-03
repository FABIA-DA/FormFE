import {BaseService} from './base-service';
import {z} from 'zod';
import {FieldZod} from './field-service';
import {SingleChoiceFieldZod} from './single-choice-field-service';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {id} from 'zod/v4/locales';

@Injectable({
  providedIn: 'root'
})
export class FieldGroupService extends BaseService {
  protected get controller(): string {
    return 'api/field-groups';
  }

  public async getAllFieldGroupsAsync(): Promise<FieldGroup[]> {
    return await this.trySendRequest(async (): Promise<FieldGroup[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FieldGroupListResponse = FieldGroupListResponseZod.parse(response.body);

      return result.fieldGroups;
    }, 'Error while trying to get all field groups.');
  }

  public async getFieldGroupByIdAsync(id: string | number): Promise<FieldGroup> {
    return await this.trySendRequest(async (): Promise<FieldGroup> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FieldGroup = FieldGroupZod.parse(response.body);

      return result;
    }, `Error while trying to get field group with id ${id}.`);
  }

  public async createFieldGroupAsync(name: string, singleChoiceFieldIds: (string | number)[], fieldIds: (string | number)[]): Promise<FieldGroup> {
    return await this.trySendRequest(async (): Promise<FieldGroup> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        singleChoiceFieldIds: singleChoiceFieldIds,
        fieldIds: fieldIds
      }, {observe: 'response'}));
      const result: FieldGroup = FieldGroupZod.parse(response.body);

      return result;
    }, 'Error while trying to create field group.');
  }

  public async updateFieldGroupByIdAsync(id: string | number, name: string, singleChoiceFieldIds: (string | number)[], fieldIds: (string | number)[]): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        singleChoiceFieldIds: singleChoiceFieldIds,
        fieldIds: fieldIds
      }, {observe: 'response'}));
    }, `Error while trying to update field group with id ${id}.`);
  }

  public async deleteFieldGroupByIdAsync(id: string | number): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete field group with id ${id}.`);
  }
}

export const FieldGroupZod = z.object({
  id: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  name: z.string().nonempty(),
  singleChoiceFields: z.array(SingleChoiceFieldZod),
  fields: z.array(FieldZod)
});

export type FieldGroup = z.infer<typeof FieldGroupZod>;

const FieldGroupListResponseZod = z.object({
  fieldGroups: z.array(FieldGroupZod),
});

export type FieldGroupListResponse = z.infer<typeof FieldGroupListResponseZod>;
