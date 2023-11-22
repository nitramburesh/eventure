import { useNavigate } from "react-router-dom";

const useDelayedRedirect = () => {
  const navigate = useNavigate();
  const redirectWithDelay = (route) => {
    return setTimeout(() => {
      navigate(route);
    }, 2000);
  };

  return { redirectWithDelay };
};

export default useDelayedRedirect;
