import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  loginUser,
  registerUser,
  logoutUser,
  loadUser,
  updateProfile,
  clearError,
  forgotPasswordThunk,
  resetPasswordThunk,
} from '../store/slices/authSlice';
import type { LoginFormData, RegisterFormData } from '../types';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    (data: LoginFormData) => dispatch(loginUser(data)).unwrap(),
    [dispatch]
  );

  const register = useCallback(
    (data: RegisterFormData) => dispatch(registerUser(data)).unwrap(),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const fetchUser = useCallback(() => dispatch(loadUser()).unwrap(), [dispatch]);

  const updateUserProfile = useCallback(
    (data: Parameters<typeof updateProfile>[0]) =>
      dispatch(updateProfile(data)).unwrap(),
    [dispatch]
  );

  const forgotPassword = useCallback(
    (email: string) => dispatch(forgotPasswordThunk(email)).unwrap(),
    [dispatch]
  );

  const resetPassword = useCallback(
    (data: { token: string; password: string; passwordConfirm: string }) =>
      dispatch(resetPasswordThunk(data)).unwrap(),
    [dispatch]
  );

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    resetError,
  };
}
