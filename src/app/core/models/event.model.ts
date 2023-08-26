import { Timestamp } from '@angular/fire/firestore';
import { User } from './user.model';

export interface Event {
  banner: string;
  createdAt: Timestamp;
  creatorUserID: string;
  description: string;
  imageArray: string[];
  location: number[];
  name: string;
  creator?: User;
}
