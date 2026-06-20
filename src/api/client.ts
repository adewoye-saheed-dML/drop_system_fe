import axios from 'axios';

export const api =
  axios.create({
    baseURL:
      'http://172.22.171.253:3000/',
  });