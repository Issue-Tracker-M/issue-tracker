import { useSelector } from "react-redux";
import { User } from "../store/user/types";

export const useCurrentUser = (): User | null => {
  const currentUser = useSelector((state) => {
    const user = state.users.entities[state.auth.currentUserId || ""];
    return user && user.loaded ? user : null;
  });
  return currentUser;
};
