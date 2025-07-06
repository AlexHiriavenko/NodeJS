import { UUID } from 'crypto';
import { MemberTypeId } from '../member-types/schemas.ts';
import { PrismaClient } from '@prisma/client';
import { initDataLoaders } from './loader/loader.ts';

export type GraphqlContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof initDataLoaders>;
};

export type Profile = {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: MemberTypeId;
};

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export type Subscription = {
  subscriberId: UUID;
  authorId: UUID;
};

export type User = {
  id: UUID;
  name: string;
  balance: number;
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
};

export type Member = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};
