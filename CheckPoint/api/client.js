import axios from 'axios';

export const createAuthClient = (token) => {
  return axios.create({
    baseURL: 'https://checkpoint-api.onrender.com/api/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
