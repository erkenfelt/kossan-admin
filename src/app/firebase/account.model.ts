export type ParticipationType = 'full' | 'semi-full' | 'limited' | 'no';

export interface Account {
  readonly id: string;
  readonly displayName: string;
  readonly participation: ParticipationType;
}
