import {
    GraphQLSchema,
} from "graphql";
import { RootQuery } from "../root/rootQuery";
import { RootMutation } from "../root/rootMutation";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;

  
  
  