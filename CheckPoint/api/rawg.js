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
    console.error('Erro ao buscar jogos:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
    throw error;
  }
};

export const getGameDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      params: {
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do jogo:', error);
    throw error;
  }
};
