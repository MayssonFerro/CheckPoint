import { createAuthClient } from './client';

export const getFeedReviews = async (token) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get('reviews');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar feed de reviews:', error);
    throw error;
  }
};

export const createReview = async (token, rawg_game_id, reviewData) => {
  try {
    const client = createAuthClient(token);
    const response = await client.post('reviews', {
      rawg_game_id,
      ...reviewData,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar review:', error);
    throw error;
  }
};

export const getUserReviews = async (token) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get('reviews/my-reviews');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar reviews do usuário:', error);
    throw error;
  }
};

export const deleteReview = async (token, reviewId) => {
  try {
    const client = createAuthClient(token);
    await client.delete(`reviews/${reviewId}`);
  } catch (error) {
    console.error('Erro ao deletar review:', error);
    throw error;
  }
};

export const updateReview = async (token, reviewId, updatedData) => {
  try {
    const client = createAuthClient(token);
    const response = await client.put(`reviews/${reviewId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar review:', error);
    throw error;
  }
};

export const getReviewById = async (token, reviewId) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get(`reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar review por id:', error);
    throw error;
  }
};
