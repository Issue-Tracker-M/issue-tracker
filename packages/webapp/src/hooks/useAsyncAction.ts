import { AsyncThunk } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useThunkDispatch } from "./useThunkDispatch";

interface useAsyncThunkReturn {
  /**
   * Shows whether the thunk is pending or not
   */
  loading: boolean;
  /**
   * Error returned by the thunk
   */
  error: unknown;
}

/**
 * Exposes the state of the promise of the given async thunk, intended to be used for loading indications
 * meaningful state changes are meant to be handled within the thunk.
 * @param thunk async thunk to be used in the effect
 * @param args args object to be passed to thunk
 * @param condition if passed, action will be dispatched only if it returns true
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useAsyncThunk<T extends AsyncThunk<any, any, any>>(
  thunk: T,
  args: Parameters<T>["0"],
  condition?: (...args: unknown[]) => boolean
): useAsyncThunkReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useThunkDispatch();

  useEffect(() => {
    console.log("Running effect", args);
    let mounted = true;
    if (loading)
      return () => {
        console.log("Loading cleanup");
        mounted = false;
      };
    if (!condition || condition()) {
      console.log("No condition or condition true");
      setLoading(true);
      dispatch(thunk(args)).then((res) => {
        console.log("Should set loading to false", mounted);
        if (res.meta.requestStatus === "rejected") setError(res.payload);
        setLoading(false);
      });
    }
    return () => {
      console.log("cleanup");
      mounted = false;
    };
  }, [args, condition, dispatch, loading, thunk]);

  return { loading, error };
}
