import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {apiUrl, userState} from "../atoms";
import {useRecoilState, useRecoilValue} from "recoil";
import axios from "axios";
import {Text} from "@chakra-ui/react";
function EditEvent() {

    const {id} = useParams();
    const baseApiUrl = useRecoilValue(apiUrl);
    const [user, setUser] = useRecoilState(userState)



    useEffect(() => {
        axios.get(baseApiUrl + `events/${id}`,{params: {userId: user.id}}).then((response)=> console.log(response))
    }, []);
    return(
        <Text>Edit</Text>
    )
}

export default EditEvent