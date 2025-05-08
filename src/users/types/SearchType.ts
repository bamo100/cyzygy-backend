import { GraphQLObjectType, GraphQLString } from "graphql";

export const SearchType = new GraphQLObjectType({
  name: 'SearchType',
  fields: {
    role: { type: GraphQLString },
    status: { type: GraphQLString },
    searchTerm: { type: GraphQLString },
  },
});