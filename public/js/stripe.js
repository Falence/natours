import '@babel/polyfill'
import axios from 'axios'
import { showAlert } from './alerts'
import Stripe from 'stripe'

export const bookTour = async tourId => {
  try {
    // 1. Get checkout session from API
    const session = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`)
    // console.log(session)
  
    // 2. Create checkout form + checkout credit card
    location.assign(session.data.session.url)
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // })
  } catch (err) {
    console.log(err)
    showAlert('error', err)
  }
}