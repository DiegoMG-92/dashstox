import axios from 'axios';

const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;
const HOST = 'yahoo-finance15.p.rapidapi.com';

if (!RAPID_KEY) {
  // helps catch misconfigured envs early
  // eslint-disable-next-line no-console
  console.warn('VITE_RAPIDAPI_KEY is missing');
}

export const http = axios.create({
  baseURL: `https://${HOST}`,
  headers: {
    'x-rapidapi-key': RAPID_KEY,
    'x-rapidapi-host': HOST,
  },
});