import type { NextApiRequest, NextApiResponse } from "next";
import type Movie from 'movie.d.ts'

const {readFileSync} = require('fs');
const pg = require('pg');
const use = require('@tensorflow-models/universal-sentence-encoder');

const config = {
  user: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: "defaultdb",
  ssl: {
      rejectUnauthorized: true,
      ca: readFileSync('./certificates/ca.pem').toString(),
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Movie[]>
) {
  const model = await use.load();
  const userId = req.body.userId;

  // Retrieve user's search history from database
  const client = new pg.Client(config);
  await client.connect();
  const userSearchHistoryQuery = await client.query(`SELECT * FROM user_search_history WHERE user_id = $1`, [userId]);
  const userSearchHistory = userSearchHistoryQuery.rows;

  // Generate vectors for user's search history
  const userSearchHistoryVectors = await Promise.all(userSearchHistory.map(async (search) => {
    const embeddings = await model.embed(search.search_query);
    return embeddings.arraySync()[0];
  }));

  // Generate vectors for movie plots
  const moviePlotsQuery = await client.query(`SELECT * FROM movie_plots`);
  const moviePlots = moviePlotsQuery.rows;
  const moviePlotVectors = await Promise.all(moviePlots.map(async (movie) => {
    const embeddings = await model.embed(movie.plot);
    return embeddings.arraySync()[0];
  }));

  // Calculate similarity between user's search history and movie plots
  const similarities = await calculateSimilarity(userSearchHistoryVectors, moviePlotVectors);

  // Get top N recommendations
  const topN = await getTopNRecommendations(similarities, 5);

  res.status(200).json(topN);
}

async function calculateSimilarity(userSearchHistoryVectors, moviePlotVectors) {
  // Calculate cosine similarity between user's search history and movie plots
  const similarities = [];
  for (let i = 0; i < userSearchHistoryVectors.length; i++) {
    const userVector = userSearchHistoryVectors[i];
    for (let j = 0; j < moviePlotVectors.length; j++) {
      const movieVector = moviePlotVectors[j];
      const similarity = await calculateCosineSimilarity(userVector, movieVector);
      similarities.push(similarity);
    }
  }
  return similarities;
}

async function getTopNRecommendations(similarities, n) {
  // Get top N recommendations based on similarity scores
  const topN = [];
  for (let i = 0; i < similarities.length; i++) {
    const similarity = similarities[i];
    const index = await getIndexOfMaxValue(similarity);
    topN.push(index);
  }
  return topN.slice(0, n);
}

async function calculateCosineSimilarity(vector1, vector2) {
  // Calculate cosine similarity between two vectors
  const dotProduct = await calculateDotProduct(vector1, vector2);
  const magnitude1 = await calculateMagnitude(vector1);
  const magnitude2 = await calculateMagnitude(vector2);
  const similarity = dotProduct / (magnitude1 * magnitude2);
  return similarity;
}

async function calculateDotProduct(vector1, vector2) {
  // Calculate dot product of two vectors
  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }
  return dotProduct;
}

async function calculateMagnitude(vector) {
  // Calculate magnitude of a vector
  let magnitude = 0;
  for (let i = 0; i < vector.length; i++) {
    magnitude += vector[i] * vector[i];
  }
  return Math.sqrt(magnitude);
}

async function getIndexOfMaxValue(array) {
  // Get index of maximum value in an array
  let maxIndex = 0;
  let maxValue = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxIndex = i;
      maxValue = array[i];
    }
  }
  return maxIndex;
}