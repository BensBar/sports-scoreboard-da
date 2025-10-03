# Sports Dashboard PRD

A real-time iPad dashboard displaying live NCAAF and NFL game scores, statistics, and game details with automatic updates.

**Experience Qualities**: 
1. **Real-time** - Immediate updates with live game data refreshing every 10-15 seconds
2. **Comprehensive** - Complete game information including scores, game state, and play details in an organized layout
3. **Professional** - Clean, sports-broadcast quality interface that feels authoritative and reliable

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-league game tracking with live data fetching, organized card layout, and automatic refresh functionality

## Essential Features

**Live Game Cards**
- Functionality: Display current NFL/NCAAF games with live scores, quarter, time remaining, down/distance, timeouts, and last play
- Purpose: Provide comprehensive real-time game tracking for active games
- Trigger: Automatic data refresh every 10-15 seconds for live games
- Progression: Data fetch → Parse game state → Update card display → Schedule next refresh
- Success criteria: Games update within 15 seconds of real events, all game stats display accurately

**Upcoming Games Display**
- Functionality: Show scheduled games with teams, start times, and basic preview information
- Purpose: Allow users to see what games are coming up today/this week
- Trigger: Page load and periodic refresh
- Progression: Fetch schedule → Filter upcoming games → Display in upcoming section
- Success criteria: Accurate game times, proper team information, clear upcoming vs live distinction

**League Toggle**
- Functionality: Switch between NFL and NCAAF game views
- Purpose: Allow focused viewing of preferred league without cluttering interface
- Trigger: User clicks league toggle buttons
- Progression: User selects league → Filter games by league → Update display → Persist preference
- Success criteria: Smooth transitions, persistent league selection, accurate filtering

**Auto-Refresh System**
- Functionality: Automatically update live game data at optimal intervals
- Purpose: Ensure users see current information without manual refresh
- Trigger: Component mount and interval-based updates
- Progression: Set interval → Fetch fresh data → Compare with current → Update changed games only
- Success criteria: Reliable updates, efficient API usage, visual indicators during refresh

## Edge Case Handling

- **API Failures**: Display cached data with error indicator and retry mechanism
- **No Games Today**: Show informative message with next scheduled games
- **Network Issues**: Graceful degradation with offline indicator
- **Rate Limiting**: Implement backoff strategy and user notification
- **Malformed Data**: Fallback to basic game info with error logging

## Design Direction

The interface should feel like a professional sports broadcast control room - clean, data-dense, and immediately readable with a modern, tablet-optimized layout that prioritizes information hierarchy.

## Color Selection

Triadic color scheme (three equally spaced colors) - using team colors as accents while maintaining neutral backgrounds for optimal readability across different team combinations.

- **Primary Color**: ESPN Red `oklch(0.55 0.22 25)` - Represents live/active states and primary actions
- **Secondary Colors**: Charcoal Gray `oklch(0.25 0.02 240)` for text and borders, maintaining professional sports broadcast aesthetic
- **Accent Color**: Electric Blue `oklch(0.65 0.25 240)` - Highlights upcoming games and interactive elements
- **Foreground/Background Pairings**: 
  - Background (White `oklch(0.98 0 0)`): Charcoal text `oklch(0.25 0.02 240)` - Ratio 12.8:1 ✓
  - Card (Light Gray `oklch(0.96 0.005 240)`): Charcoal text `oklch(0.25 0.02 240)` - Ratio 11.2:1 ✓
  - Primary (ESPN Red): White text `oklch(0.98 0 0)` - Ratio 6.1:1 ✓
  - Accent (Electric Blue): White text `oklch(0.98 0 0)` - Ratio 4.8:1 ✓

## Font Selection

Typography should convey precision and immediacy like sports tickers and broadcast graphics, using a clean sans-serif that maintains readability at various sizes.

- **Typographic Hierarchy**: 
  - H1 (Dashboard Title): Inter Bold/32px/tight letter spacing
  - H2 (Team Names): Inter Semibold/24px/normal spacing  
  - H3 (Scores): Inter Bold/36px/tight spacing for emphasis
  - Body (Game Details): Inter Medium/16px/normal spacing
  - Caption (Time/Status): Inter Regular/14px/wide spacing

## Animations

Subtle, functional animations that feel responsive like live sports graphics - emphasizing data updates and state changes without distraction.

- **Purposeful Meaning**: Score changes get brief highlight animations, refresh indicators use smooth rotation, card updates have gentle fade transitions
- **Hierarchy of Movement**: Score updates are most prominent, followed by game state changes, with background refresh being nearly invisible

## Component Selection

- **Components**: Card for game display, Badge for game status, Button for league toggle, Skeleton for loading states, custom refresh indicator
- **Customizations**: Custom game card component with team logos, score emphasis, and detailed game state display
- **States**: Cards have live/upcoming/final states with distinct styling, buttons show active league clearly
- **Icon Selection**: Refresh, Clock, Football icons from Phosphor for game elements
- **Spacing**: Consistent 4-unit grid (16px) spacing with 6-unit gaps between cards
- **Mobile**: Single column card layout, collapsible details, touch-optimized controls for portrait orientation