import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

export function useThunkDispatch(): AppDispatch {
  const dispatch: AppDispatch = useDispatch();
  return dispatch;
}
