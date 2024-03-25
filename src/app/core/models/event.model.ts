import { Timestamp } from '@angular/fire/firestore';
import { User } from './user.model';

export interface Event {
  banner: string;
  createdAt: Timestamp;
  creatorUserID: string;
  description: string;
  name: string;
  location: number[];
  imageArray: string[];
  creator?: User;
}
