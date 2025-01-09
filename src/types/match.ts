import type { Profile } from './profile';

export type MatchStatus = 'pending' | 'accepted' | 'rejected';

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: MatchStatus;
  created_at: string;
}

export interface MatchWithProfiles extends Match {
  user1: Profile;
  user2: Profile;
}

export interface PotentialMatch extends Profile {
  distance?: number;
  match_percentage?: number;
}