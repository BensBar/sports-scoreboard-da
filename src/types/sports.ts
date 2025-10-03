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
  records?: Array<{
    summary: string;
    type: string;
  }>;
  curatedRank?: {
    current: number;
  };
  rank?: number;
}

export interface GameStatus {
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    detail?: string;
    shortDetail?: string;
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

export interface Venue {
  id: string;
  fullName: string;
  address?: {
    city: string;
    state: string;
  };
}

export interface Broadcast {
  names?: string[];
  market?: string;
}

export interface Odds {
  provider?: {
    id: string;
    name: string;
  };
  details?: string;
  overUnder?: number;
  spread?: number;
  homeTeamOdds?: {
    favorite?: boolean;
    underdog?: boolean;
    moneyLine?: number;
    spreadOdds?: number;
  };
  awayTeamOdds?: {
    favorite?: boolean;
    underdog?: boolean;
    moneyLine?: number;
    spreadOdds?: number;
  };
}

export interface Headline {
  description: string;
  shortLinkText?: string;
  type?: string;
}

// New interfaces for enhanced features
export interface PlayerLeader {
  playerId: string;
  name: string;
  headshot?: string;
  stats: string;
  position?: string;
}

export interface GameLeaders {
  passing?: PlayerLeader;
  rushing?: PlayerLeader;
  receiving?: PlayerLeader;
}

export interface TeamStatistic {
  name: string;
  displayValue: string;
}

export interface GameStatistics {
  [teamId: string]: TeamStatistic[];
}

export interface Play {
  id: string;
  type: {
    text: string;
  };
  text: string;
  homeScore: number;
  awayScore: number;
  period: {
    number: number;
  };
  clock: {
    displayValue: string;
  };
  scoringPlay?: boolean;
  team?: {
    id: string;
  };
}

export interface Drive {
  id: string;
  description: string;
  team: {
    name: string;
    abbreviation: string;
  };
  start: {
    period: {
      number: number;
    };
    clock: {
      displayValue: string;
    };
  };
  end?: {
    period: {
      number: number;
    };
    clock: {
      displayValue: string;
    };
  };
  plays: Play[];
  result?: string;
}

export interface Competition {
  id: string;
  competitors: ESPNTeam[];
  situation?: Situation;
  venue?: Venue;
  broadcasts?: Broadcast[];
  odds?: Odds[];
  notes?: Array<{
    headline: string;
  }>;
  leaders?: GameLeaders[];
  statistics?: GameStatistics;
  drives?: Drive[];
}

export interface Game {
  id: string;
  date: string;
  status: GameStatus;
  competitions: Competition[];
  league: 'nfl' | 'college-football';
  name?: string;
  shortName?: string;
  links?: Array<{
    href: string;
    text: string;
  }>;
}

export interface ESPNResponse {
  events: Omit<Game, 'league'>[];
}

export type League = 'nfl' | 'college-football';