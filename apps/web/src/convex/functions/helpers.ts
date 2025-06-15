import {
  mutation as mutationCore,
  query as queryCore,
} from '@/convex/_generated/server';
import { NoOp } from 'convex-helpers/server/customFunctions';
import { zCustomMutation, zCustomQuery } from 'convex-helpers/server/zod';

export const query = zCustomQuery(queryCore, NoOp);
export const mutation = zCustomMutation(mutationCore, NoOp);
