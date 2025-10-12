import api from "./api";

class AuthService {
    async signin(form) {
        const res = await api.post('/signin', form)
        const { token } = res.data
        return token
    }

    async signup(form) {
        const res = await api.post('signup', form)
        const { token } = res.data
        return token
    }
}


export default new AuthService()