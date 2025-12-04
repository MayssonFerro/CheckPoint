import axios from 'axios';

export const createAuthClient = (token) => {
  return axios.create({
    baseURL: 'http://192.168.15.102:5000/api/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
