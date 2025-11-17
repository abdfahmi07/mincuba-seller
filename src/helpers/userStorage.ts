import type { User } from "@/interface/ILoginResponse";

export const userStorage = {
  set: (data: User) => localStorage.setItem("user", JSON.stringify(data)),
  get: () => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  },
  clear: () => localStorage.removeItem("user"),
};
