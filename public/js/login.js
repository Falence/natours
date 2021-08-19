import axios from 'axios'

export const login = async (email, password) => {
    console.log(email, password)
    try {
        const res = await axios({
            method: 'post',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        console.log(res)
    } catch(err) {
        console.log(err.message)
    }
}

