import { useNavigate, useLocation } from "react-router-dom";

const useTagNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedTags = new Set(
    params.size === 0 ? [] : params.get("tags")?.split("_"),
  );

  const handleSelectedTag = (tag) => {
    selectedTags.add(tag);
    const query = Array.from(selectedTags).join("_");
    navigate(`/allEvents?tags=${query}`);
  };

  return { handleSelectedTag };
};

export default useTagNavigation;
