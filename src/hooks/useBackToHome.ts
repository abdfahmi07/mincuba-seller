import { useLocation, useNavigate } from "react-router-dom";

export const useBackToHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (
      location.pathname.startsWith("/orders/") ||
      location.pathname.startsWith("/store/")
    ) {
      navigate("/orders", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return goBack;
};
