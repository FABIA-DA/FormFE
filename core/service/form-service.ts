import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {DataFormField, FieldGroup, OneOfField} from '../module';
import * as z from "zod";
import {FieldGroupZod} from './field-group-service';
import {GroupZod} from './group-service';
import {id} from 'zod/v4/locales';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService extends BaseService {
  protected override get controller(): string {
    return `'api/forms`;
  }

  public async getAllFormsAsync(): Promise<Form[]> {
    return await this.trySendRequest(async (): Promise<Form[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: FormListResponse = FormListResponseZod.parse(response.body);

      return result.forms;
    }, 'Error while trying to get all forms.');
  }

  public async getFormByIdAsync(id: string | number): Promise<Form> {
    return await this.trySendRequest(async (): Promise<Form> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: Form = FormZod.parse(response.body);

      return result;
    }, `Error while trying to get form with id ${id}.`);
  }

  public async createFormAsync(name: string, groupId: string | null, fieldGroupIds: (string | number)[]): Promise<Form> {
    return await this.trySendRequest(async (): Promise<Form> => {
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

  public async updateFormByIdAsync(id: string | number, name: string, groupId: string | null, fieldGroupIds: (string | number)[]): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        groupId: groupId,
        fieldGroupIds: fieldGroupIds
      }, {observe: 'response'}));
    }, `Error while trying to update form with id ${id}.`);
  }

  public async deleteFormByIdAsync(id: string | number): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete form with id ${id}.`);
  }

  public async getDataFieldTypes(): Promise<string[]> {
    return ['Number', 'String', 'Email', 'Telephone Number', '...'];
  }

  public async getDataFields(): Promise<DataFormField[]> {
    return [
      {
        id: 0,
        name: 'Email Field',
        description: '',
        isOptional: false,
        type: 'email'
      },
      {
        id: 1,
        name: 'Tele Field',
        description: '',
        isOptional: false,
        type: 'tele'
      },
      {
        id: 2,
        name: 'Sirname Field',
        description: '',
        isOptional: false,
        type: 'text'
      },
      {
        id: 3,
        name: 'Title Field',
        description: '',
        isOptional: false,
        type: 'text'
      },
    ];
  }

  public async sendDataField(field: DataFormField): Promise<void> {
    console.log(field);
  }

  public async getOneOfFormFields(): Promise<OneOfField[]> {
    return [
      {
        id: 0,
        name: "Group a",
        optionsMap: new Map<string, DataFormField[]>([
          ["Option a",
            [
              {
                id: 0,
                name: 'Email',
                description: '',
                isOptional: false,
                type: 'email'
              },
              {
                id: 1,
                name: 'Tele',
                description: '',
                isOptional: false,
                type: 'tele'
              }
            ]],
          ["Option c", []],
        ])
      },
      {
        id: 1,
        name: "Group b",
        optionsMap: new Map<string, DataFormField[]>([
          ["c",
            [
              {
                id: 0,
                name: 'Email',
                description: '',
                isOptional: false,
                type: 'email'
              },
              {
                id: 1,
                name: 'Tele',
                description: '',
                isOptional: false,
                type: 'tele'
              }
            ]],
          ["d", []],
        ])
      }
    ];
  }

  public async sendOneOfFormField(field: OneOfField): Promise<void> {
    console.log(field);
  }

  public async getFieldGroups(): Promise<FieldGroup[]> {
    return [];
  }

  public async sendFieldGroup(group: FieldGroup): Promise<void> {
    console.log(group);
  }

  public async getForms(): Promise<Form[]> {
    return [];
  }

  public async sendForm(data: Form): Promise<void> {
    console.log(data);
  }
}

export const FormZod = z.object({
  id: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  groupId: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  name: z.string().nonempty(),
  get group() {
    return GroupZod
  },
  fieldGroups: z.array(FieldGroupZod),
});

export type Form = z.infer<typeof FormZod>;

const FormListResponseZod = z.object({
  forms: z.array(FormZod)
});

export type FormListResponse = z.infer<typeof FormListResponseZod>;
