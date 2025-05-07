import {
    GraphQLInputObjectType,
    GraphQLString,
  } from 'graphql';
  
export const UpdateUserInput = new GraphQLInputObjectType({
    name: 'UpdateUserInput',
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        status: { type: GraphQLString },
        avatar: { type: GraphQLString },
    },
});
  