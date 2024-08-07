/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const mongoose = require('mongoose')

export default {
  // fetches active sports
  getSports: () => {
    return axios.get(`/api/sports`);
  },

  // fetches games
  getGames: (sport) => {
    return axios.get('/api/games', {
      sport
    })
  },



  submitBetSlip: async (betInfo) => {
    
    let sum = 0;
    await betInfo.map(async (bet) => {
      await Object.keys(bet.slips.keys).map((key) => {
        bet.slips.keys[`${ key }`]['id'] = mongoose.Types.ObjectId()
        return bet;
      })
      sum += parseFloat(bet.payout.toLose)
      return betInfo;
    })
    console.log('hi')
    return axios.post('/api/bet', {
      betInfo,
      sum
    });
  },




  getBets: async (userId) => {
  
    return await axios({
      method: 'GET',
      url: '/api/bet',
      params: {
        userId
      }
    })
  },



  // post for a new user
  signup: (userData) => {
    return axios.post('/signup', userData);
  },

  // post for logging in
  login: (user) => {
    // console.log(user)
    const username=user.email;
    const password=user.password
    return axios.post('/login', {
      username,
      password
    })

      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
      })
      .catch(err => {
        console.log(err);
      });
  },

  
  isLoggedIn: () => {
    if (localStorage.getItem('user') === null) {
      return false;
    }
    return true;
  },

  // function to get the data of the current user
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),

  getUser: async (user_id) => {
    
    return await axios({
      method: 'GET',
      url: '/api/user',
      params: {
        user_id
      }
    })
  },

  // logs user out
  logout: () => {
    localStorage.removeItem('user');
  }
};
