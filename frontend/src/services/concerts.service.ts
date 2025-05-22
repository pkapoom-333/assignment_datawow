import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const ConcertService = {
  async getConcerts() {
    const res = await axios.get(`${API_BASE_URL}/concerts`);
    return res.data;
  },

  async createConcert(data: {
    name: string;
    description: string;
    totalSeats: number;
  }) {
    const res = await axios.post(`${API_BASE_URL}/concerts`, data);
    return res.data;
  },

  async deleteConcert({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) {
    const res = await axios.put(`${API_BASE_URL}/concerts/${id}`, {
      name,
    });
    return res.data;
  },

  async getStats() {
    const res = await axios.get(`${API_BASE_URL}/concerts/concert-stats`);
    return res.data;
  },
};
