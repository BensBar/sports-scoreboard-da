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
  if (!down) return '';

  const distText = (distance === 0) ? 'Goal' : (distance === undefined || distance === null) ? '?' : String(distance);

  if (down === 1) return `1st & ${distText}`;
  if (down === 2) return `2nd & ${distText}`;
  if (down === 3) return `3rd & ${distText}`;
  if (down === 4) return `4th & ${distText}`;
  return '';
}

/**
 * Format a compact situation string that includes down/distance, yard line and an optional play description.
 * Example: "1st & 8 at the 32 - Michael Penix Jr. throws for 68 yard TD"
 */
export function formatSituation(
  down?: number,
  distance?: number,
  yardLine?: number,
  lastPlayText?: string,
  maxPlayLength = 80
): string {
  const dd = formatDownAndDistance(down, distance);
  // Display yard line as "on their own <yard>" to indicate field position from team's perspective
  const yard = yardLine !== undefined && yardLine !== null ? `on their own ${yardLine}` : '';

  const parts: string[] = [];
  if (dd) parts.push(dd.replace('&', '/').replace(/\s+/g, ' ')); // make & into /
  if (yard) parts.push(yard);

  let result = parts.join(' ');
  if (lastPlayText) {
    const cleaned = lastPlayText.replace(/\s+/g, ' ').trim();
    const truncated = cleaned.length > maxPlayLength ? cleaned.slice(0, maxPlayLength).trim() + '…' : cleaned;
    if (result) result = `${result} - ${truncated}`;
    else result = truncated;
  }

  return result;
}

export function getGameStatusText(status: any): string {
  if (status.type.state === 'pre') {
    return 'Upcoming';
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
  return 'bg-muted';
}