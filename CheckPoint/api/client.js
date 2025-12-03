import axios from 'axios';

export const createAuthClient = (token) => {
  return axios.create({
    baseURL: 'http://localhost:5000/api/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
