import type { LoginResponse } from "@/interface/ILoginResponse";
import api from "./axios";
import { userStorage } from "@/helpers/userStorage";

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });

  const { token: access_token, refresh_token, user } = data.result;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  userStorage.set(user);

  return data;
};

export const logout = async () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  userStorage.clear();
};

export const getUser = async () => {
  const { data } = await api.get("/user");

  return data.result;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  const { data } = await api.post(
    "/auth/refresh-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const newAccessToken = data.result.token;
  const newRefreshToken = data.result.refresh_token; // <-- penting

  if (newAccessToken) {
    localStorage.setItem("access_token", newAccessToken);
  }

  if (newRefreshToken) {
    localStorage.setItem("refresh_token", newRefreshToken);
  }

  return newAccessToken;
};
