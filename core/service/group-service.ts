import {BaseService, IdType, IdTypeZod} from './base-service';
import {z} from 'zod';
import {FormZod} from './form-service';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {
  protected get controller(): string {
    return 'api/groups';
  }

  public async getAllGroupsAsync(): Promise<GroupListPresentation[]> {
    return await this.trySendRequest(async (): Promise<GroupListPresentation[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: GroupListResponse = GroupListResponseZod.parse(response.body);

      return result.groups;
    }, 'Error while trying to get all groups.');
  }

  public async getGroupByIdAsync(id: IdType): Promise<Group> {
    return await this.trySendRequest(async (): Promise<Group> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: Group = GroupZod.parse(response.body);

      return result;
    }, `Error while trying to get group with id ${id}.`);
  }

  public async createGroupAsync(name: string, parentId: IdType | null, subgroupIds: IdType[], formIds: IdType[]): Promise<Group> {
    return await this.trySendRequest(async (): Promise<Group> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        parentId: parentId,
        subgroupIds: subgroupIds,
        formIds: formIds
      }, {observe: 'response'}));
      const result: Group = GroupZod.parse(response.body);

      return result;
    }, 'Error while trying to create group.');
  }

  public async updateGroupAsync(id: IdType, name: string, parentId: IdType | null, subgroupIds: IdType[], formIds: IdType[]): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        parentId: parentId,
        subgroupIds: subgroupIds,
        formIds: formIds
      }, {observe: 'response'}));
    }, `Error while trying to update group with id ${id}.`);
  }

  public async deleteGroupAsync(id: IdType): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete group with id ${id}.`);
  }
}

export const MinimalGroupZod = z.object({
  id: IdTypeZod,
  parentId: IdTypeZod.nullable(),
  name: z.string().nonempty(),
  parentName: z.string().nonempty().nullable()
});

export type MinimalGroup = z.infer<typeof MinimalGroupZod>;

const SubgroupZod = MinimalGroupZod.extend({});

export type Subgroup = z.infer<typeof SubgroupZod>;

export const GroupZod = MinimalGroupZod.extend({
  subgroups: z.array(SubgroupZod),
  forms: z.array(FormZod)
});

export type Group = z.infer<typeof GroupZod>;

export const GroupListPresentationZod = z.object({
  id: IdTypeZod,
  name: z.string().nonempty(),
  parentId: IdTypeZod.nullable(),
  parentName: z.string().nonempty().nullable(),
  subgroupCount: z.number().nonnegative(),
  formCount: z.number().nonnegative()
});

export type GroupListPresentation = z.infer<typeof GroupListPresentationZod>;

const GroupListResponseZod = z.object({
  groups: z.array(GroupListPresentationZod),
});

export type GroupListResponse = z.infer<typeof GroupListResponseZod>;
