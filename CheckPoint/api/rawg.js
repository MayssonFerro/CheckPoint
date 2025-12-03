import axios from 'axios';

const API_KEY = '1110000fb6d048079a383b785d852007';
const BASE_URL = 'https://api.rawg.io/api/games';

export const searchGames = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        search: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};
