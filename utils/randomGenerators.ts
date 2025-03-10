/**
 * Utility functions for generating random data
 */

/**
 * Generate a random instrument ID similar to real market instruments
 * @returns {string} A random instrument ID
 */
export function generateRandomInstrumentId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  // Generate 2-4 random letters
  let id = '';
  const letterLength = Math.floor(Math.random() * 3) + 2; // 2-4 letters
  for (let i = 0; i < letterLength; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Sometimes add 1-2 digits
  if (Math.random() > 0.5) {
    const numLength = Math.floor(Math.random() * 2) + 1; // 1-2 digits
    for (let i = 0; i < numLength; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  }
  
  return id;
}

/**
 * Generate a random time in HH:MM format
 * @returns {string} A random time in HH:MM format
 */
export function generateRandomTime(): string {
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * Generate a random set of days (0=Sunday, 6=Saturday)
 * @returns {number[]} An array of days
 */
export function generateRandomDays(): number[] {
  const days = [0, 1, 2, 3, 4, 5, 6];
  const selectedDays = [];
  
  // Select a random number of days (at least 1)
  const numDays = Math.floor(Math.random() * days.length) + 1;
  
  // Choose random days
  for (let i = 0; i < numDays; i++) {
    const randomIndex = Math.floor(Math.random() * days.length);
    const day = days.splice(randomIndex, 1)[0];
    selectedDays.push(day);
  }
  
  return selectedDays.sort((a, b) => a - b);
}
