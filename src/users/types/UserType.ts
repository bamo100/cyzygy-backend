
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from "graphql";
  
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLID },
      email: { type: GraphQLString },
      firstName: { type: GraphQLString }, 
      lastName: { type: GraphQLString },
      password: { type: GraphQLString },
      role: { type: GraphQLString },
      status: { type: GraphQLString },
      avatar: { type: GraphQLString },
      acceess_token: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
});
  
export default UserType;
  