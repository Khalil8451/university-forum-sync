export type UserRelationTypes =
  | 'role'
  | 'status'
  | 'photo'
  | 'group'
  | 'instructorGroups';

export type UserRelationOptions = {
  relations?: UserRelationTypes[];
};
