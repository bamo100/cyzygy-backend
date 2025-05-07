import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
  } from 'graphql';
  
export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
        role: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString },
        avatar: { type: GraphQLString },
    },
});
  