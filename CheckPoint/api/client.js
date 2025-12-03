import axios from 'axios';

export const createAuthClient = (token) => {
  return axios.create({
    baseURL: 'http://10.0.2.2:5000/api/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
