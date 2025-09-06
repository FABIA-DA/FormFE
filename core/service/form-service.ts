import {Injectable} from '@angular/core';
import {BaseService, IdType, IdTypeZod} from './base-service';
import * as z from "zod";
import {FieldGroupZod} from './field-group-service';
import {MinimalGroupZod} from './group-service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService extends BaseService {
  protected override get controller(): string {
    return `api/forms`;
  }

  public async getAllFormsAsync(): Promise<Form[]> {
    return await BaseService.trySendRequest(async (): Promise<Form[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FormListResponse = FormListResponseZod.parse(response.body);

      return result.forms;
    }, 'Error while trying to get all forms.');
  }

  public async getFormByIdAsync(id: IdType): Promise<Form> {
    return await BaseService.trySendRequest(async (): Promise<Form> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: Form = FormZod.parse(response.body);

      return result;
    }, `Error while trying to get form with id ${id}.`);
  }

  public async createFormAsync(name: string, groupId: string | null, fieldGroupIds: (IdType)[]): Promise<Form> {
    return await BaseService.trySendRequest(async (): Promise<Form> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        groupId: groupId,
        fieldGroupIds: fieldGroupIds
      }, {observe: 'response'}));
      const result: Form = FormZod.parse(response.body);

      return result;
    }, 'Error while trying to create form.');
  }

  public async updateFormByIdAsync(id: IdType, name: string, groupId: string | null, fieldGroupIds: (IdType)[]): Promise<void> {
    return await BaseService.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        groupId: groupId,
        fieldGroupIds: fieldGroupIds
      }, {observe: 'response'}));
    }, `Error while trying to update form with id ${id}.`);
  }

  public async deleteFormByIdAsync(id: IdType): Promise<void> {
    return await BaseService.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete form with id ${id}.`);
  }
}

export const MinimalFormZod = z.object({
  id: IdTypeZod,
  groupId: IdTypeZod.nullable(),
  name: z.string().nonempty()
});

export type MinimalFormZod = z.infer<typeof MinimalFormZod>;

export const FormZod = MinimalFormZod.extend({
  id: IdTypeZod,
  groupId: IdTypeZod.nullable(),
  name: z.string().nonempty(),
  group: MinimalGroupZod.nullable(),
  fieldGroups: z.array(FieldGroupZod),
});

export type Form = z.infer<typeof FormZod>;

const FormListResponseZod = z.object({
  forms: z.array(FormZod)
});

export type FormListResponse = z.infer<typeof FormListResponseZod>;
