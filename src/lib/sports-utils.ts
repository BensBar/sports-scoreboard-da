import { ESPNTeam } from '@/types/sports';

export function getTeamScore(team: ESPNTeam): number {
  if (!team || !team.score) return 0;
  const score = parseInt(team.score);
  return isNaN(score) ? 0 : score;
}

export function formatTimeRemaining(displayClock?: string): string {
  if (!displayClock) return '';
  return displayClock;
}

export function formatDownAndDistance(down?: number, distance?: number): string {
  if (!down || !distance) return '';
  
  if (down === 1) return `1st & ${distance}`;
  if (down === 2) return `2nd & ${distance}`;
  if (down === 3) return `3rd & ${distance}`;
  if (down === 4) return `4th & ${distance}`;
  
  return '';
}

export function getGameStatusText(status: any): string {
  if (status.type.state === 'pre') {
    return status.type.shortDetail || status.type.detail || 'Upcoming';
  }
  
  if (status.type.state === 'in') {
    const period = status.period || 1;
    const quarter = period === 1 ? '1st' : 
                   period === 2 ? '2nd' : 
                   period === 3 ? '3rd' : 
                   period === 4 ? '4th' : `OT${period - 4}`;
    return `${quarter} ${status.displayClock || ''}`.trim();
  }
  
  if (status.type.state === 'post') {
    return 'Final';
  }
  
  return status.type.name || '';
}

export function formatGameDate(dateString: string): string {
  try {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'TBD';
    }
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today ${date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        timeZoneName: 'short'
      })}`;
    } else if (isTomorrow) {
      return `Tomorrow ${date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        timeZoneName: 'short'
      })}`;
    } else if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit'
      })}`;
    } else {
      const diffDays = Math.abs(Math.floor((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      
      if (diffDays <= 7) {
        return date.toLocaleDateString([], {
          weekday: 'long',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        });
      } else {
        return date.toLocaleDateString([], {
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        });
      }
    }
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return 'TBD';
  }
}

export function formatGameDateShort(dateString: string): string {
  try {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'TBD';
    }
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today ${date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit'
      })}`;
    } else if (isTomorrow) {
      return `Tomorrow`;
    } else if (isYesterday) {
      return `Yesterday`;
    } else {
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return 'TBD';
  }
}

export function getGameStatusColor(status: any): string {
  if (status.type.state === 'in') return 'bg-primary';
  if (status.type.state === 'pre') return 'bg-accent';
  if (status.type.state === 'post') return 'bg-green-600';
  return 'bg-muted';
}