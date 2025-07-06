import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { GraphqlContext, Member } from '../types.js';
import { memberTypeId } from './MemberTypeId.js';

export const MemberType: GraphQLObjectType<Member, GraphqlContext> =
  new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: {
        type: memberTypeId,
      },
      discount: {
        type: GraphQLFloat,
      },
      postsLimitPerMonth: {
        type: GraphQLInt,
      },
    }),
  });
