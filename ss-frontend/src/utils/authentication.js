import { getFromStorage } from './storage';

export const verifyAuth = async () => {
    
    let authState = false
    const obj = getFromStorage('auth-token');
    if (!obj) {
        return null
    }
    try {
    //verify token
    await fetch('http://localhost:4000/users/verify', {
        method: 'GET',
        headers: {
            'Content-Type': 'application-json',
            'auth-token': obj.token
        }
    })
        .then(res =>  res.json())
        .then(json => {
            authState =  json.state
        })
        return authState
    }
    catch (err) {
        return err;
    }
}