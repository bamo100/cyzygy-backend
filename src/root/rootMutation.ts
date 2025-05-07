import { GraphQLObjectType } from "graphql";
import { createUser, deleteUser, loginUser, logoutUser, updateUser } from "../users/resolvers/userMutations";

export const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
  },
});
