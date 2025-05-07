import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLID } from "graphql";
import UserType from "../types/UserType";
import User from "../../models/User";
import { handleNonAdminPassword, hashPassword } from "../../utils/passwordUtils";
import { signToken } from "../../utils/jwt";
import { assignRandomAvatar, validateEmail, validateName, validatePassword } from "../../utils/helper";
import { CreateUserInput } from "../types/CreateUserType";
import { UpdateUserInput } from "../types/UpdateUserType";

//Create a new user
// This mutation creates a new user in the database and returns the created user
export const createUser = {
  type: UserType,
  args: {
    input: { type: GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (_: unknown, args: { [key: string]: any }, context: { res: any, role: string }) => {
    const { input } = args;
    const { res } = context;
    const { lastName, firstName, email, password, role, avatar, status } = input;
    
    // Check if the user is an admin
    if (context.role !== "admin") {
        const error: any = new Error("Not authorized");
        error.extensions = { code: "FORBIDDEN", httpStatus: 403 };
        throw error;
    }

    try {
        //check if user details exist
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            const error: any = new Error('User already exists');
            error.extensions = { code: 'BAD_USER_INPUT', httpStatus: 409 };
            throw error;
        }
          
        // Validate user details
        if (!lastName || !firstName || !email || !role) {
            const error: any = new Error("All fields are required.");
            error.extensions = { code: 'BAD_USER_INPUT', httpStatus: 400 };
            throw error;
        }
        if (!validateEmail(email)) {
            const error: any = new Error("Invalid email format.");
            error.extensions = { code: 'BAD_USER_INPUT', httpStatus: 400 };
            throw error;
        }
        if (!validateName(lastName, firstName)) {
            const error: any = new Error("Invalid name format.");
            error.extensions = { code: 'BAD_USER_INPUT', httpStatus: 400 };
            throw error;
        }

        //if the role is "user" and the lastName is not empty, hash the lastName and set it as the password
        //afterwards create the user and save to the database
        //otherwise the password is hashed and saved to the database
        if(role == 'user'){
            const userData = await handleNonAdminPassword({role, lastName, password});
            //create a new User with the submitted data
            const user = new User({ lastName, firstName, email, password: userData.password, role, avatar, status });
            
            //assign random avatar
            user.avatar = assignRandomAvatar();

            //save user to the database
            const savedUser = await user.save();
            return {
                ...savedUser.toObject(),
                id: savedUser._id,
                createdAt: savedUser.createdAt.toISOString(),
                updatedAt: savedUser.updatedAt.toISOString(),
            };
        }

        if (!validatePassword(password)) {
            const error: any = new Error("Password must be at least 9 characters and contain letters, numbers, and special characters.");
            error.extensions = { code: 'BAD_USER_INPUT', httpStatus: 400 };
            throw error;
        }
        //hash the user password
        const hashedPassword = await hashPassword(password);

        //create a new User with the submitted data
        const user = new User({ lastName, firstName, email, password: hashedPassword, role, avatar, status });
        
         //assign random avatar
         user.avatar = assignRandomAvatar();

        //create token and save as cookie
        const token = signToken(user.id, user.role);
        if (res) {
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
          });
        }

        //save user to the database
        const savedUser = await user.save();
        return {
          ...savedUser.toObject(),
          id: savedUser._id,
          createdAt: savedUser.createdAt.toISOString(),
          updatedAt: savedUser.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
  },
};

//loginUser
export const loginUser = {
    type: UserType,
    args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_: unknown, args: { [key: string]: any }, context: { res: any}) => {
        const { email, password } = args;
        const { res } = context;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                const error: any = new Error('Invalid credentials');
                error.extensions = { code: 'UNAUTHORIZED', httpStatus: 401 };
                throw error;
            }

            // Assuming comparePassword is a method on the User model
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                const error: any = new Error('Invalid credentials');
                error.extensions = { code: 'UNAUTHORIZED', httpStatus: 401 };
                throw error;
            }

            //create token and save as cookie
            const token = signToken(user.id, user.role);
            if (res) {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None',
                });
            }

            return {
                ...user.toObject(),
                id: user._id,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                acceess_token: token
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
}

//logout User
export const logoutUser = {
    type: GraphQLBoolean,
    args: {},
    resolve: (_: unknown, __: unknown, context: { res: any }) => {
        const { res } = context;
        res.clearCookie('token');
        return true;
    }
};

// Mutation to update a user by ID
export const updateUser = {
    type: UserType,
    args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        input: { type: UpdateUserInput }, 
    },
    resolve: async (_: unknown, args: { [key: string]: any }, context: { role: string }) => {
        const { id, input } = args;

        // Check if the user is an admin
        if (context.role !== "admin") {
            const error: any = new Error("Not authorized");
            error.extensions = { code: "FORBIDDEN", httpStatus: 403 };
            throw error;
        }

        try {
            return await User.findByIdAndUpdate(id, input, { new: true });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },
};

// Mutation to delete a user by ID
export const deleteUser = {
    type: UserType,
    args: { id: { type: GraphQLNonNull(GraphQLString) } },
    resolve: async (_: unknown, args: { [key: string]: any }, context: { role: string }) => {
         // Check if the user is an admin
        if (context.role !== "admin") {
            const error: any = new Error("Not authorized");
            error.extensions = { code: "FORBIDDEN", httpStatus: 403 };
            throw error;
        }
        
        try {
            return await User.findByIdAndDelete(args.id);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },
};
