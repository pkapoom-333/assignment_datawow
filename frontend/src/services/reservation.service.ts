import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const ReservationService = {
  async reserve(userId: string, concertId: string) {
    const res = await axios.post(`${API_BASE_URL}/reservation`, {
      userId,
      concertId,
    });
    return res.data;
  },

  async cancel({
    userId,
    concertId,
  }: {
    userId: string;
    concertId: string;
  }) {
    const res = await axios.put(`${API_BASE_URL}/reservation`, {
      userId,
      concertId,
    });
    return res.data;
  },

  async getHistory(userId: string) {
    const res = await axios.get(`${API_BASE_URL}/reservation/history`, {
      params: { userId },
    });
    return res.data;
  },
};
