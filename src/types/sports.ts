export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  displayName: string;
  color: string;
  logo: string;
  score?: number;
  timeouts?: number;
}

export interface ESPNTeam {
  id: string;
  team: {
    id: string;
    name: string;
    abbreviation: string;
    displayName: string;
    color: string;
    logo: string;
  };
  score: string;
  timeouts?: number;
}

export interface GameStatus {
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
  };
  displayClock?: string;
  period?: number;
}

export interface Situation {
  lastPlay?: {
    text: string;
  };
  down?: number;
  distance?: number;
  yardLine?: number;
  possession?: string;
}

export interface Competition {
  id: string;
  competitors: ESPNTeam[];
  situation?: Situation;
}

export interface Game {
  id: string;
  date: string;
  status: GameStatus;
  competitions: Competition[];
  league: 'nfl' | 'college-football';
}

export interface ESPNResponse {
  events: Omit<Game, 'league'>[];
}

export type League = 'nfl' | 'college-football';