import { sample_users } from "../app.js";

export const graphqlResolver = {
  Query: {
    getUsers: () => {
      try {
        return;
      } catch (error) {
        return { message: "Hello" };
      }
    },
  },
};
