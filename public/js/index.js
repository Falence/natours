import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--lougout')

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

