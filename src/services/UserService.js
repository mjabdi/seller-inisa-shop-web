import API from './api-users';

export default class UserService{

    static setToken = (token) =>
    {
        this.token = token
    }

    static signUp = (payload) =>
    {
        return API.post('/api/users/signup', payload)
    }

    static preSignUp = (payload) =>
    {
        return API.post('/api/users/presignup', payload)
    }

    static signIn = (payload) =>
    {
        return  API.post('/api/users/signin', payload)
    }

    static forgotPassword = (payload) =>
    {
        return  API.post('/api/users/forgotpassword', payload)
    }

    static resetPassword = (payload) =>
    {
        return  API.post('/api/users/resetpassword', payload)
    }

    static changePassword = (payload) =>
    {
        return  API.post('/api/users/changepassword', {token: this.token, ...payload})
    }

    static checkToken = (payload) =>
    {
        return  API.post('/api/users/checktoken', payload)
    }

}