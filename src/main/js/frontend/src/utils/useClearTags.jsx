import { useNavigate } from "react-router-dom";

const useClearTags = (selectedTags) => {
  const navigate = useNavigate();
  const handleClearTags = () => {
    selectedTags.clear();
    navigate("/allEvents");
  };

  return { handleClearTags };
};

export default useClearTags;
