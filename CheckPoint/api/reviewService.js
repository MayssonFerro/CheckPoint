import { createAuthClient } from './client';

export const getFeedReviews = async (token) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get('reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching feed reviews:', error);
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
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getUserReviews = async (token) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get('reviews/my-reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const deleteReview = async (token, reviewId) => {
  try {
    const client = createAuthClient(token);
    await client.delete(`reviews/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const updateReview = async (token, reviewId, updatedData) => {
  try {
    const client = createAuthClient(token);
    const response = await client.put(`reviews/${reviewId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const getReviewById = async (token, reviewId) => {
  try {
    const client = createAuthClient(token);
    const response = await client.get(`reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review by id:', error);
    throw error;
  }
};
