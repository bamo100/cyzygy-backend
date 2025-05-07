import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import UserType from "../types/UserType";
import User from "../../models/User";
import { PaginatedUsersType } from "../types/PaginationType";
import { DashboardStatsType } from "../types/DashboardStatsType";

//Query to get all users
// This query retrieves all users from the database and formats the response
export const getAllUsers = {
    type: PaginatedUsersType,
    args: {
        page: { type: GraphQLInt, defaultValue: 1 },
        limit: { type: GraphQLInt, defaultValue: 10 },
    },
    resolve: async (_: unknown, args: { [key: string]: any }) => {
        const { page, limit } = args;
        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find().skip(skip).limit(limit),
        ]);
        
        const pages = Math.ceil(total / limit);
        
        return {
            users: users.map((user) => ({
              ...user.toObject(),
              id: user._id,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            })),
            pagination: {
              total,
              pages,
              page,
              limit,
            },
        };
    },
};

// Query to get a user by ID
export const getUser = {
    type: UserType,
    args: { id: { type: GraphQLNonNull(GraphQLString) } },
    resolve: async (_: unknown, args: { [key: string]: any }) => {
        try {
            const user = await User.findById(args.id);
            return {
                ...(user ? user.toObject() : {}),
                id: user?._id || null,
                createdAt: user?.createdAt?.toISOString() || null,
                updatedAt: user?.updatedAt?.toISOString() || null,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },
};

//check authenticated User
export const checkAuthUser = {
    type: UserType,
    resolve: async (_: any, __: any, context: { user?: string }) => {
        console.log("context", context)
        if (!context.user) {
          throw new Error("Not authenticated")
        }
        // Find the user in the database using the userId from the context
        const user = await User.findById(context.user)
        return user
    }
}

//ggetDashboardStats
export const getDashboardStats = {
    type: DashboardStatsType,
    resolve: async (_: unknown, __:any) => {
        // Replace with actual DB queries
        const totalUsers = await User.countDocuments();
        const newUsers = await User.countDocuments({ createdAt: { $gte: /* last 7 days */ new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
        const inactiveUsers = await User.countDocuments({ status: 'inactive' });
        const activeNow = await User.countDocuments({ status: 'active' });

        // Fake growth values – replace with real calculation logic
        const totalUsersGrowth = 5.6;
        const newUsersGrowth = 10.2;
        const inactiveUsersGrowth = -2.1;
        const activeNowGrowth = 1.5;

        return {
            totalUsers,
            newUsers,
            inactiveUsers,
            activeNow,
            totalUsersGrowth,
            newUsersGrowth,
            inactiveUsersGrowth,
            activeNowGrowth,
        };
    }
}