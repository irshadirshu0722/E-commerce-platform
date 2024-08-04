export interface IChatContacts {
  id: number;
  username: string;
  room_name: string;
  total_unseen_messages: number;
  last_message_date: string | null;
  latest_message: string | null;
}
