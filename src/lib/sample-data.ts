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
        possession: 'BUF'
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
      }]
    }]
  },
  {
    id: 'nfl-2',
    date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
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
      }
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
        records: [{ summary: '11-1', type: 'total' }]
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
        records: [{ summary: '10-2', type: 'total' }]
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
        records: [{ summary: '12-0', type: 'total' }]
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
        records: [{ summary: '11-1', type: 'total' }]
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
      }]
    }]
  }
];