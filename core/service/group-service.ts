import {BaseService} from './base-service';
import {z} from 'zod';
import {FormZod} from './form-service';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {id} from 'zod/v4/locales';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {
  protected get controller(): string {
    return 'api/groups';
  }

  public async getAllGroupsAsync(): Promise<Group[]> {
    return await this.trySendRequest(async (): Promise<Group[]> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: GroupListResponse = GroupListResponseZod.parse(response.body);

      return result.groups;
    }, 'Error while trying to get all groups.');
  }

  public async getGroupByIdAsync(id: string | number): Promise<Group> {
    return await this.trySendRequest(async (): Promise<Group> => {
      const url: string = this.buildUrl(id.toString());
      const response = await firstValueFrom(this.http.get(url, {observe: 'response'}));
      const result: Group = GroupZod.parse(response.body);

      return result;
    }, `Error while trying to get group with id ${id}.`);
  }

  public async createGroupAsync(name: string, parentId: (string | number) | null, subgroupIds: (string | number)[], formIds: (string | number)[]): Promise<Group> {
    return await this.trySendRequest(async (): Promise<Group> => {
      const url: string = this.buildUrl(null);
      const response = await firstValueFrom(this.http.post(url, {
        name: name,
        parentId: parentId,
        groupIds: subgroupIds,
        formIds: formIds
      }, {observe: 'response'}));
      const result: Group = GroupZod.parse(response.body);

      return result;
    }, 'Error while trying to create group.');
  }

  public async updateGroupAsync(id: string | number, name: string, parentId: (string | number) | null, subgroupIds: (string | number)[], formIds: (string | number)[]): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.put(url, {
        name: name,
        parentId: parentId,
        groupIds: subgroupIds,
        formIds: formIds
      }, {observe: 'response'}));
    }, `Error while trying to update group with id ${id}.`);
  }

  public async deleteGroupAsync(id: string | number): Promise<void> {
    return await this.trySendRequest(async (): Promise<void> => {
      const url: string = this.buildUrl(id.toString());
      await firstValueFrom(this.http.delete(url, {observe: 'response'}));
    }, `Error while trying to delete group with id ${id}.`);
  }
}

export const GroupZod = z.object({
  id: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  parentId: z.union([z.string().nonempty(), z.number().nonnegative().gt(0)]),
  name: z.string().nonempty(),
  parentName: z.string().nonempty(),
  get subGroups() {
    return z.array(GroupZod);
  },
  forms: z.array(FormZod),
});

export type Group = z.infer<typeof GroupZod>;

const GroupListResponseZod = z.object({
  groups: z.array(GroupZod),
});

export type GroupListResponse = z.infer<typeof GroupListResponseZod>;
