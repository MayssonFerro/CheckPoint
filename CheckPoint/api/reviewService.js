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
