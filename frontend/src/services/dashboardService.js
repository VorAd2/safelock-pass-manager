import api from "./api";

export const fetchDataService = async (authToken, username) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    }
    const res = await api.get(`/dashboard/${username}`, config)
    return res
}