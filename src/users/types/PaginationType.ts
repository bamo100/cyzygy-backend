import { GraphQLObjectType, GraphQLInt, GraphQLList } from 'graphql';
import UserType from './UserType'; // Your existing UserType
import { SearchType } from './SearchType';

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
    data: { type: new GraphQLList(UserType) },
    pagination: { type: PaginationInfoType },
    search: { type: new GraphQLList(SearchType) },
  },
});
