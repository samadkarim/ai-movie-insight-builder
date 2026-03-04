import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const fetchMovie = async (id) => {
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }
};