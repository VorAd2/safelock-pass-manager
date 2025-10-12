import api from "./api";

class GeneratorService {
    async genUsername(authToken, params) {
        const headers = {
            Authorization: `Bearer ${authToken}`
        }
        const response = await api.get('/dashboard/generator/username', {
            params,
            headers
        })
        return response
    }
}

export default new GeneratorService()