import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleLogout } from "./Utils";
import { useRecoilValue } from "recoil";
import { apiUrl } from "../atoms";

const useDeleteUser = () => {
  const baseApiUrl = useRecoilValue(apiUrl);
  const navigate = useNavigate();
  const handleDeleteUser = async (user, setUser) => {
    await axios.delete(baseApiUrl + `users/${user.id}`).then((res) => {
      handleLogout(baseApiUrl, setUser);
    });
    await navigate("/");
  };
  return { handleDeleteUser };
};

export default useDeleteUser;
