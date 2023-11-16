import {atom} from "recoil";

export const userState = atom({
    key: "userState",
    default: JSON.parse(localStorage.getItem("user")) || null,
});

export const apiUrl = atom({
    key: "apiUrl",
    default: "http://localhost:8080/api/v1/",
});

export const isAppLoading = atom({key: "isAppLoading", default: false})