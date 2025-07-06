import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphqlContext, Profile } from '../types.js';
import { MemberType } from './MemberType.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { memberTypeId } from './MemberTypeId.js';
import { UserType } from './User.js';

export const ProfileType: GraphQLObjectType<Profile, GraphqlContext> =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {
        type: UUIDType,
      },
      isMale: {
        type: GraphQLBoolean,
      },
      yearOfBirth: {
        type: GraphQLInt,
      },
      memberTypeId: {
        type: GraphQLString,
      },
      userId: {
        type: UUIDType,
      },
      user: {
        type: UserType,
        resolve: async ({ userId }, _, context: GraphqlContext) => {
          return await context.loaders.userById.load(userId);
        },
      },
      memberType: {
        type: MemberType,
        resolve: async (
          { memberTypeId }: { memberTypeId: MemberTypeId },
          _,
          context: GraphqlContext,
        ) => {
          return await context.loaders.memberTypeById.load(memberTypeId);
        },
      },
    }),
  });

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});
