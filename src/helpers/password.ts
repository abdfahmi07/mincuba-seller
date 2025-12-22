export const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) {
    return { label: "", percent: 0, color: "bg-transparent" };
  }

  if (score <= 2) {
    return { label: "Weak", percent: 33, color: "bg-red-500" };
  }

  if (score <= 4) {
    return { label: "Medium", percent: 66, color: "bg-yellow-500" };
  }

  return { label: "Strong", percent: 100, color: "bg-green-500" };
};
