export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  is_private: boolean;
  created_by?: number;
}

export interface Media {
  id: number;
  file_name: string;
  file_url: string;
  uploaded_by: number;
  event_id: number;
}

export interface EventMediaResponse {
  page: number;
  limit: number;
  total_media: number;
  media: Media[];
}

export interface Comment {
  id: number;
  text: string;
  user_id: number;
  media_id: number;
}

export interface Notification {
  id: number;
  message: string;
  user_id: number;
}

export interface FaceMatch {
  media_id: number;
  file_url: string;
}
