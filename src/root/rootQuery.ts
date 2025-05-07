import { GraphQLObjectType } from "graphql";
import { getAllUsers, getUser, checkAuthUser, getDashboardStats } from "../users/resolvers/userQueries";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers,
    getUser,
    checkAuthUser,
    getDashboardStats
  },
});
