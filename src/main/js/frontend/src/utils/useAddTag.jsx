import { useNavigate } from "react-router-dom";

const useAddTag = () => {
  const navigate = useNavigate();
  const handleAddTagFilter = (selectedTags, search, setSearch) => {
    selectedTags.add(search.tag);
    setSearch({ ...search, tag: "" });
    const tagList = [...selectedTags].join("_");
    navigate(`/allEvents?tags=${tagList}`);
  };

  return { handleAddTagFilter };
};

export default useAddTag;
