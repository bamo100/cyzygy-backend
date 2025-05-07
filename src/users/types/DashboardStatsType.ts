import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from "graphql";

export const DashboardStatsType = new GraphQLObjectType({
    name: 'DashboardStats',
    fields: () => ({
      totalUsers: { type: GraphQLInt },
      newUsers: { type: GraphQLInt },
      inactiveUsers: { type: GraphQLInt },
      activeNow: { type: GraphQLInt },
      totalUsersGrowth: { type: GraphQLFloat },
      newUsersGrowth: { type: GraphQLFloat },
      inactiveUsersGrowth: { type: GraphQLFloat },
      activeNowGrowth: { type: GraphQLFloat },
    }),
});