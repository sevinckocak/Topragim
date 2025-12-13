import { createContext } from "react";

export const AuthContext = createContext({
  user: null, // Firebase user objesi
  initializing: true, // ilk auth kontrolü bitene kadar true
  signUp: async () => {},
  signIn: async () => {},
  signOutUser: async () => {},
});
