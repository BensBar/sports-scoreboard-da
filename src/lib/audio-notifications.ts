/**
 * Audio notification system using Web Audio API
 * Generates and plays sounds for score changes and turnovers
 */

// Create an AudioContext that will be reused
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Plays a score change notification sound
 * Creates a pleasant ascending tone to celebrate scoring
 */
export function playScoreSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create oscillator for the main tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure ascending tone sequence (C5 -> E5 -> G5)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    
    // Shape the volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    // Play the sound
    oscillator.start(now);
    oscillator.stop(now + 0.4);
  } catch (error) {
    console.error('Failed to play score sound:', error);
  }
}

/**
 * Plays a turnover notification sound
 * Creates an alert tone to signal possession change
 */
export function playTurnoverSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create two oscillators for a more complex sound
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure alert tone (descending pattern)
    oscillator1.type = 'triangle';
    oscillator1.frequency.setValueAtTime(880, now); // A5
    oscillator1.frequency.setValueAtTime(440, now + 0.15); // A4
    
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(1108.73, now); // C#6
    oscillator2.frequency.setValueAtTime(554.37, now + 0.15); // C#5
    
    // Shape the volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    // Play the sound
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.3);
    oscillator2.stop(now + 0.3);
  } catch (error) {
    console.error('Failed to play turnover sound:', error);
  }
}

/**
 * Resumes the audio context if it's suspended (required by browser autoplay policies)
 * Should be called after user interaction
 */
export async function resumeAudioContext(): Promise<void> {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch (error) {
    console.error('Failed to resume audio context:', error);
  }
}

/**
 * Checks if audio is available and ready to play
 */
export function isAudioAvailable(): boolean {
  try {
    const ctx = getAudioContext();
    return ctx.state === 'running' || ctx.state === 'suspended';
  } catch (error) {
    return false;
  }
}
