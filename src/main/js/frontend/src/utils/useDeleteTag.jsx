import { useNavigate } from "react-router-dom";

const useDeleteTag = (selectedTags) => {
  const navigate = useNavigate();
  const handleDeleteTag = (tag) => {
    selectedTags.delete(tag);
    const tagList = [...selectedTags].join("_");
    const query = tagList.length === 0 ? "" : `?tags=${tagList}`;
    navigate(`/allEvents${query}`);
  };

  return { handleDeleteTag };
};

export default useDeleteTag;
