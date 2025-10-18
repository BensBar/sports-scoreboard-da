import { Game } from '@/types/sports';

export const sampleNFLGames: Game[] = [
  {
    id: 'nfl-1',
    date: new Date().toISOString(),
    league: 'nfl',
    status: {
      type: {
        id: '2',
        name: 'STATUS_IN_PROGRESS',
        state: 'in',
        completed: false,
        detail: 'In Progress',
        shortDetail: '2nd 8:45'
      },
      displayClock: '8:45',
      period: 2
    },
    competitions: [{
      id: 'comp-1',
      competitors: [{
        id: 'team-1',
        team: {
          id: 'kc',
          name: 'Chiefs',
          abbreviation: 'KC',
          displayName: 'Kansas City Chiefs',
          color: '#E31837',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png'
        },
        score: '14',
        timeouts: 2,
        records: [{ summary: '11-1', type: 'total' }]
      }, {
        id: 'team-2',
        team: {
          id: 'buf',
          name: 'Bills',
          abbreviation: 'BUF',
          displayName: 'Buffalo Bills',
          color: '#00338D',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png'
        },
        score: '10',
        timeouts: 3,
        records: [{ summary: '10-2', type: 'total' }]
      }],
      situation: {
        lastPlay: {
          text: 'Josh Allen pass complete to Stefon Diggs for 12 yards'
        },
        down: 1,
        distance: 10,
        yardLine: 35,
        possession: 'team-2'
      },
      venue: {
        id: 'venue-1',
        fullName: 'Highmark Stadium',
        address: {
          city: 'Orchard Park',
          state: 'NY'
        }
      },
      broadcasts: [{
        names: ['CBS'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'draftkings',
          name: 'DraftKings'
        },
        details: 'KC -2.5',
        overUnder: 47.5,
        spread: -2.5,
        awayTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -145,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +125,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'Josh Allen leads the NFL with 32 passing touchdowns this season'
      }, {
        headline: 'Chiefs defense ranks 3rd in the league, allowing just 18.2 PPG'
      }],
      leaders: [{
        passing: {
          playerId: '3139477',
          name: 'P. Mahomes',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
          stats: '185 YDS, 2 TD',
          position: 'QB'
        },
        rushing: {
          playerId: '4241457',
          name: 'I. Pacheco',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/4241457.png',
          stats: '67 YDS, 1 TD',
          position: 'RB'
        },
        receiving: {
          playerId: '3116593',
          name: 'T. Kelce',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/3116593.png',
          stats: '5 REC, 78 YDS',
          position: 'TE'
        }
      }, {
        passing: {
          playerId: '3918298',
          name: 'J. Allen',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png',
          stats: '142 YDS, 1 TD',
          position: 'QB'
        },
        rushing: {
          playerId: '4241986',
          name: 'J. Cook',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/4241986.png',
          stats: '45 YDS',
          position: 'RB'
        },
        receiving: {
          playerId: '4035687',
          name: 'S. Diggs',
          headshot: 'https://a.espncdn.com/i/headshots/nfl/players/full/4035687.png',
          stats: '6 REC, 89 YDS, 1 TD',
          position: 'WR'
        }
      }],
      statistics: {
        'team-1': [
          { name: 'Total Yards', displayValue: '252' },
          { name: 'Passing Yards', displayValue: '185' },
          { name: 'Rushing Yards', displayValue: '67' },
          { name: 'Turnovers', displayValue: '0' },
          { name: 'Time of Possession', displayValue: '16:22' }
        ],
        'team-2': [
          { name: 'Total Yards', displayValue: '187' },
          { name: 'Passing Yards', displayValue: '142' },
          { name: 'Rushing Yards', displayValue: '45' },
          { name: 'Turnovers', displayValue: '1' },
          { name: 'Time of Possession', displayValue: '13:38' }
        ]
      },
      drives: [
        {
          id: 'drive-1',
          description: '7 plays, 75 yards, 3:24',
          team: {
            name: 'Chiefs',
            abbreviation: 'KC'
          },
          start: {
            period: { number: 1 },
            clock: { displayValue: '12:45' }
          },
          end: {
            period: { number: 1 },
            clock: { displayValue: '9:21' }
          },
          result: 'Touchdown',
          plays: [
            {
              id: 'play-1',
              type: { text: 'Rush' },
              text: 'I. Pacheco rush to the left for 8 yards',
              homeScore: 0,
              awayScore: 0,
              period: { number: 1 },
              clock: { displayValue: '12:45' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 25 }
            },
            {
              id: 'play-2',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to T. Kelce for 15 yards',
              homeScore: 0,
              awayScore: 0,
              period: { number: 1 },
              clock: { displayValue: '12:10' },
              team: { id: 'kc' },
              start: { down: 2, distance: 2, yardLine: 33 }
            },
            {
              id: 'play-3',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to M. Hardman for 22 yards',
              homeScore: 0,
              awayScore: 0,
              period: { number: 1 },
              clock: { displayValue: '11:35' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 48 }
            },
            {
              id: 'play-4',
              type: { text: 'Rush' },
              text: 'I. Pacheco rush up the middle for 18 yards',
              homeScore: 0,
              awayScore: 0,
              period: { number: 1 },
              clock: { displayValue: '10:52' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 30 }
            },
            {
              id: 'play-5',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to J. Smith-Schuster for 12 yards. TOUCHDOWN',
              homeScore: 0,
              awayScore: 7,
              period: { number: 1 },
              clock: { displayValue: '9:21' },
              scoringPlay: true,
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 12 }
            }
          ]
        },
        {
          id: 'drive-2',
          description: '8 plays, 68 yards, 4:12',
          team: {
            name: 'Bills',
            abbreviation: 'BUF'
          },
          start: {
            period: { number: 1 },
            clock: { displayValue: '9:21' }
          },
          end: {
            period: { number: 1 },
            clock: { displayValue: '5:09' }
          },
          result: 'Touchdown',
          plays: [
            {
              id: 'play-6',
              type: { text: 'Pass' },
              text: 'J. Allen pass complete to S. Diggs for 18 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 1 },
              clock: { displayValue: '9:15' },
              team: { id: 'buf' },
              start: { down: 1, distance: 10, yardLine: 25 }
            },
            {
              id: 'play-7',
              type: { text: 'Rush' },
              text: 'J. Cook rush to the right for 12 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 1 },
              clock: { displayValue: '8:42' },
              team: { id: 'buf' },
              start: { down: 1, distance: 10, yardLine: 43 }
            },
            {
              id: 'play-8',
              type: { text: 'Pass' },
              text: 'J. Allen pass complete to D. Knox for 9 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 1 },
              clock: { displayValue: '8:10' },
              team: { id: 'buf' },
              start: { down: 1, distance: 10, yardLine: 45 }
            },
            {
              id: 'play-9',
              type: { text: 'Pass' },
              text: 'J. Allen pass complete to S. Diggs for 29 yards. TOUCHDOWN',
              homeScore: 7,
              awayScore: 7,
              period: { number: 1 },
              clock: { displayValue: '5:09' },
              scoringPlay: true,
              team: { id: 'buf' },
              start: { down: 2, distance: 1, yardLine: 29 }
            }
          ]
        },
        {
          id: 'drive-3',
          description: '10 plays, 82 yards, 5:28',
          team: {
            name: 'Chiefs',
            abbreviation: 'KC'
          },
          start: {
            period: { number: 2 },
            clock: { displayValue: '14:45' }
          },
          end: {
            period: { number: 2 },
            clock: { displayValue: '9:17' }
          },
          result: 'Touchdown',
          plays: [
            {
              id: 'play-10',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to T. Kelce for 14 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 2 },
              clock: { displayValue: '14:45' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 18 }
            },
            {
              id: 'play-11',
              type: { text: 'Rush' },
              text: 'I. Pacheco rush up the middle for 11 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 2 },
              clock: { displayValue: '14:12' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 32 }
            },
            {
              id: 'play-12',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to M. Valdes-Scantling for 27 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 2 },
              clock: { displayValue: '13:35' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 43 }
            },
            {
              id: 'play-13',
              type: { text: 'Rush' },
              text: 'I. Pacheco rush to the left for 18 yards',
              homeScore: 7,
              awayScore: 7,
              period: { number: 2 },
              clock: { displayValue: '12:48' },
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 30 }
            },
            {
              id: 'play-14',
              type: { text: 'Pass' },
              text: 'P. Mahomes pass complete to T. Kelce for 12 yards. TOUCHDOWN',
              homeScore: 7,
              awayScore: 14,
              period: { number: 2 },
              clock: { displayValue: '9:17' },
              scoringPlay: true,
              team: { id: 'kc' },
              start: { down: 1, distance: 10, yardLine: 12 }
            }
          ]
        },
        {
          id: 'drive-4',
          description: 'Current Drive - 3 plays, 21 yards',
          team: {
            name: 'Bills',
            abbreviation: 'BUF'
          },
          start: {
            period: { number: 2 },
            clock: { displayValue: '9:17' }
          },
          plays: [
            {
              id: 'play-15',
              type: { text: 'Pass' },
              text: 'J. Allen pass incomplete to G. Davis',
              homeScore: 10,
              awayScore: 14,
              period: { number: 2 },
              clock: { displayValue: '9:10' },
              team: { id: 'buf' },
              start: { down: 1, distance: 10, yardLine: 25 }
            },
            {
              id: 'play-16',
              type: { text: 'Rush' },
              text: 'J. Cook rush to the left for 9 yards',
              homeScore: 10,
              awayScore: 14,
              period: { number: 2 },
              clock: { displayValue: '8:52' },
              team: { id: 'buf' },
              start: { down: 2, distance: 10, yardLine: 25 }
            },
            {
              id: 'play-17',
              type: { text: 'Pass' },
              text: 'J. Allen pass complete to S. Diggs for 12 yards',
              homeScore: 10,
              awayScore: 14,
              period: { number: 2 },
              clock: { displayValue: '8:45' },
              team: { id: 'buf' },
              start: { down: 3, distance: 1, yardLine: 34 }
            }
          ]
        }
      ]
    }]
  },
  {
    id: 'nfl-2',
    date: new Date(Date.now() + 3 * 3600000).toISOString(), // 3 hours from now
    league: 'nfl',
    status: {
      type: {
        id: '1',
        name: 'STATUS_SCHEDULED',
        state: 'pre',
        completed: false,
        detail: 'Today 4:25 PM',
        shortDetail: '4:25 PM'
      }
    },
    competitions: [{
      id: 'comp-2',
      competitors: [{
        id: 'team-3',
        team: {
          id: 'sf',
          name: '49ers',
          abbreviation: 'SF',
          displayName: 'San Francisco 49ers',
          color: '#AA0000',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '9-3', type: 'total' }]
      }, {
        id: 'team-4',
        team: {
          id: 'sea',
          name: 'Seahawks',
          abbreviation: 'SEA',
          displayName: 'Seattle Seahawks',
          color: '#002244',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '7-5', type: 'total' }]
      }],
      venue: {
        id: 'venue-2',
        fullName: 'Lumen Field',
        address: {
          city: 'Seattle',
          state: 'WA'
        }
      },
      broadcasts: [{
        names: ['FOX'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'fanduel',
          name: 'FanDuel'
        },
        details: 'SF -6.5',
        overUnder: 44.5,
        spread: -6.5,
        awayTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -280,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +230,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'Christian McCaffrey questionable with knee injury'
      }, {
        headline: 'Seahawks have won 3 straight games at home'
      }]
    }]
  },
  {
    id: 'nfl-3',
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    league: 'nfl',
    status: {
      type: {
        id: '3',
        name: 'STATUS_FINAL',
        state: 'post',
        completed: true,
        detail: 'Final',
        shortDetail: 'Final'
      }
    },
    competitions: [{
      id: 'comp-3',
      competitors: [{
        id: 'team-5',
        team: {
          id: 'dal',
          name: 'Cowboys',
          abbreviation: 'DAL',
          displayName: 'Dallas Cowboys',
          color: '#041E42',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png'
        },
        score: '24',
        timeouts: 0,
        records: [{ summary: '8-4', type: 'total' }]
      }, {
        id: 'team-6',
        team: {
          id: 'phi',
          name: 'Eagles',
          abbreviation: 'PHI',
          displayName: 'Philadelphia Eagles',
          color: '#004C54',
          logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png'
        },
        score: '21',
        timeouts: 0,
        records: [{ summary: '10-2', type: 'total' }]
      }],
      venue: {
        id: 'venue-3',
        fullName: 'Lincoln Financial Field',
        address: {
          city: 'Philadelphia',
          state: 'PA'
        }
      },
      broadcasts: [{
        names: ['NBC', 'Peacock'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'draftkings',
          name: 'DraftKings'
        },
        details: 'PHI -3',
        overUnder: 49.5,
        spread: -3,
        awayTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +135,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -155,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'Dak Prescott threw for 325 yards and 2 TDs in thriller'
      }, {
        headline: 'Eagles defense had 4 sacks but couldn\'t stop late Dallas drive'
      }]
    }]
  }
];

export const sampleNCAAFGames: Game[] = [
  {
    id: 'ncaaf-1',
    date: new Date().toISOString(),
    league: 'college-football',
    status: {
      type: {
        id: '2',
        name: 'STATUS_IN_PROGRESS',
        state: 'in',
        completed: false,
        detail: 'In Progress',
        shortDetail: '3rd 12:30'
      },
      displayClock: '12:30',
      period: 3
    },
    competitions: [{
      id: 'comp-4',
      competitors: [{
        id: 'team-7',
        team: {
          id: 'georgia',
          name: 'Bulldogs',
          abbreviation: 'UGA',
          displayName: 'Georgia Bulldogs',
          color: '#BA0C2F',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png'
        },
        score: '28',
        timeouts: 1,
        records: [{ summary: '11-1', type: 'total' }],
        curatedRank: {
          current: 1
        }
      }, {
        id: 'team-8',
        team: {
          id: 'alabama',
          name: 'Crimson Tide',
          abbreviation: 'BAMA',
          displayName: 'Alabama Crimson Tide',
          color: '#9E1B32',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png'
        },
        score: '21',
        timeouts: 2,
        records: [{ summary: '10-2', type: 'total' }],
        curatedRank: {
          current: 5
        }
      }],
      situation: {
        lastPlay: {
          text: 'Stetson Bennett IV pass complete to Ladd McConkey for 8 yards'
        },
        down: 2,
        distance: 5,
        yardLine: 42,
        possession: 'UGA'
      },
      venue: {
        id: 'venue-4',
        fullName: 'Mercedes-Benz Stadium',
        address: {
          city: 'Atlanta',
          state: 'GA'
        }
      },
      broadcasts: [{
        names: ['ESPN'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'caesars',
          name: 'Caesars Sportsbook'
        },
        details: 'UGA -7',
        overUnder: 52.5,
        spread: -7,
        awayTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -320,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +260,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'SEC Championship Game: Winner advances to College Football Playoff'
      }, {
        headline: 'Georgia looking to avenge last year\'s loss to Alabama'
      }]
    }]
  },
  {
    id: 'ncaaf-2',
    date: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    league: 'college-football',
    status: {
      type: {
        id: '1',
        name: 'STATUS_SCHEDULED',
        state: 'pre',
        completed: false,
        detail: 'Today 8:00 PM',
        shortDetail: '8:00 PM'
      }
    },
    competitions: [{
      id: 'comp-5',
      competitors: [{
        id: 'team-9',
        team: {
          id: 'michigan',
          name: 'Wolverines',
          abbreviation: 'MICH',
          displayName: 'Michigan Wolverines',
          color: '#00274C',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '12-0', type: 'total' }],
        curatedRank: {
          current: 2
        }
      }, {
        id: 'team-10',
        team: {
          id: 'ohio-state',
          name: 'Buckeyes',
          abbreviation: 'OSU',
          displayName: 'Ohio State Buckeyes',
          color: '#BB0000',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '11-1', type: 'total' }],
        curatedRank: {
          current: 3
        }
      }],
      venue: {
        id: 'venue-5',
        fullName: 'Ohio Stadium',
        address: {
          city: 'Columbus',
          state: 'OH'
        }
      },
      broadcasts: [{
        names: ['ABC'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'draftkings',
          name: 'DraftKings'
        },
        details: 'MICH -3.5',
        overUnder: 48.5,
        spread: -3.5,
        awayTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -165,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +145,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'The Game: Rivalry matchup will determine Big Ten East champion'
      }, {
        headline: 'Michigan undefeated and looking for playoff berth'
      }]
    }]
  },
  {
    id: 'ncaaf-3',
    date: new Date(Date.now() + 24 * 3600000).toISOString(), // Tomorrow
    league: 'college-football',
    status: {
      type: {
        id: '1',
        name: 'STATUS_SCHEDULED',
        state: 'pre',
        completed: false,
        detail: 'Tomorrow 1:00 PM',
        shortDetail: '1:00 PM'
      }
    },
    competitions: [{
      id: 'comp-4',
      competitors: [{
        id: 'team-7',
        team: {
          id: 'texas',
          name: 'Longhorns',
          abbreviation: 'TEX',
          displayName: 'Texas Longhorns',
          color: '#BF5700',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '8-4', type: 'total' }]
      }, {
        id: 'team-8',
        team: {
          id: 'oklahoma',
          name: 'Sooners',
          abbreviation: 'OU',
          displayName: 'Oklahoma Sooners',
          color: '#841617',
          logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png'
        },
        score: '0',
        timeouts: 3,
        records: [{ summary: '10-2', type: 'total' }],
        curatedRank: {
          current: 12
        }
      }],
      venue: {
        id: 'venue-5',
        fullName: 'Darrell K Royal Stadium',
        address: {
          city: 'Austin',
          state: 'TX'
        }
      },
      broadcasts: [{
        names: ['FOX'],
        market: 'national'
      }],
      odds: [{
        provider: {
          id: 'fanduel',
          name: 'FanDuel'
        },
        details: 'OU -4',
        overUnder: 55.5,
        spread: -4,
        awayTeamOdds: {
          favorite: false,
          underdog: true,
          moneyLine: +155,
          spreadOdds: -110
        },
        homeTeamOdds: {
          favorite: true,
          underdog: false,
          moneyLine: -180,
          spreadOdds: -110
        }
      }],
      notes: [{
        headline: 'Red River Rivalry: High-scoring affair expected'
      }]
    }]
  }
];