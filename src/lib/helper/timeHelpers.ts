 // Calculate the time left until the game ends
 export function calculateTimeLeft(endAt: Date): number {
    const now = new Date();
    const timeLeft = Math.ceil((endAt.getTime() - now.getTime()) / 1000);
    return timeLeft > 0 ? timeLeft : 0; // Ensure the counter doesn't go negative
  }