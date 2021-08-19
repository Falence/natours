import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'post',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)    // redirect to home page after 1.5 seconds
        }

    } catch(err) {
        showAlert('error', err.response.data.message)    // the err.response proty comes with axios
    }
}

