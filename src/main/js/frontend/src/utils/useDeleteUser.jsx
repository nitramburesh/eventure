import { useNavigate } from "react-router-dom";
import { axiosInstance, handleLogout } from "./Utils";

const useDeleteUser = () => {
  const navigate = useNavigate();
  const handleDeleteUser = async (user, setUser) => {
    await axiosInstance.delete(`users/${user.id}`).then((res) => {
      handleLogout(setUser);
    });
    await navigate("/");
  };
  return { handleDeleteUser };
};

export default useDeleteUser;
