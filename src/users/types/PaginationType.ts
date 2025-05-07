import { GraphQLObjectType, GraphQLInt, GraphQLList } from 'graphql';
import UserType from './UserType'; // Your existing UserType

const PaginationInfoType = new GraphQLObjectType({
  name: 'PaginationInfo',
  fields: {
    total: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
});

export const PaginatedUsersType = new GraphQLObjectType({
  name: 'PaginatedUsers',
  fields: {
    users: { type: new GraphQLList(UserType) },
    pagination: { type: PaginationInfoType },
  },
});
