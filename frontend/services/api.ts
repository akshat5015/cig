import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000",
});

API.interceptors.request.use((config) => {

  if (typeof window !== "undefined") {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers = config.headers ?? {};

      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});


// =========================
// AUTH APIs
// =========================
export const authApi = {

  signup: (data: {
    username: string;
    email: string;
    password: string;
  }) =>
    API.post("/signup", data),

  login: (data: {
    email: string;
    password: string;
  }) =>
    API.post("/login", data),

  me: () =>
    API.get("/me"),
};


// =========================
// EVENT APIs
// =========================
export const eventApi = {

  list: () =>
    API.get("/events"),

  create: (data: {
    title: string;
    description: string;
    category: string;
    is_private: boolean;
  }) =>
    API.post("/events", data),
};


// =========================
// MEDIA APIs
// =========================
export const mediaApi = {

  list: () =>
    API.get("/media"),

  byEvent: (
    eventId: number,
    page = 1,
    limit = 12
  ) =>
    API.get(
      `/events/${eventId}/media`,
      {
        params: { page, limit }
      }
    ),

  upload: (
    eventId: number,
    file: File
  ) => {

    const form = new FormData();

    form.append("file", file);

    return API.post(
      `/upload/${eventId}`,
      form
    );
  },

  bulkUpload: (
    eventId: number,
    files: File[]
  ) => {

    const form = new FormData();

    files.forEach((f) => {
      form.append("files", f);
    });

    return API.post(
      `/bulk-upload/${eventId}`,
      form
    );
  },
};


// =========================
// SOCIAL APIs
// =========================
export const socialApi = {

  like: (mediaId: number) =>
    API.post(`/like/${mediaId}`),

  unlike: (mediaId: number) =>
    API.delete(`/like/${mediaId}`),

  getLikes: (mediaId: number) =>
    API.get(`/media/${mediaId}/likes`),

  comment: (
    mediaId: number,
    text: string
  ) =>
    API.post(
      `/comment/${mediaId}`,
      { text }
    ),

  getComments: (mediaId: number) =>
    API.get(`/media/${mediaId}/comments`),

  search: (query: string) =>
    API.get(
      "/search",
      {
        params: { query }
      }
    ),

  favorite: (mediaId: number) =>
    API.post(`/favorite/${mediaId}`),

  unfavorite: (mediaId: number) =>
    API.delete(`/favorite/${mediaId}`),

  myFavorites: () =>
    API.get("/my-favorites"),

  downloadUrl: (mediaId: number) =>
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/download/${mediaId}`,
};


// =========================
// FACE APIs
// =========================
export const faceApi = {

  findPhotos: (selfie: File) => {

    const form = new FormData();

    form.append("selfie", selfie);

    return API.post(
      "/find-my-photos",
      form
    );
  },
};


// =========================
// NOTIFICATION APIs
// =========================
export const notificationApi = {

  list: () =>
    API.get("/notifications"),
};


export default API;