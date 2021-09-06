import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './updateSettings'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--lougout')
const updateDataForm = document.querySelector('.form-user-data')
const updatePasswordForm = document.querySelector('.form-user-password')

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault()  // prevents the form from loading any other page
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout)

if (updateDataForm) {
    updateDataForm.addEventListener('submit', e => {
        e.preventDefault()
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        updateSettings({ name, email }, 'data')
    })
}

if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async e => {
        e.preventDefault()
        document.querySelector('.btn--save--password').textContent = 'Updating...'
        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirm = document.getElementById('password-confirm').value
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')

        document.querySelector('.btn--save--password').textContent = 'Save password'
        // clear form values after submission
        document.getElementById('password-current').value = ''
        document.getElementById('password').value = ''
        document.getElementById('password-confirm').value = ''
    })
}
