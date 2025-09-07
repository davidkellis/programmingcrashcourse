// Global command history shared across ALL REPL instances
// This will persist across component instances and remounts
export const globalSharedHistoryArray: string[] = []

export const addToSharedHistory = (code: string) => {
  if (
    code.trim() &&
    (globalSharedHistoryArray.length === 0 ||
      globalSharedHistoryArray[globalSharedHistoryArray.length - 1] !== code)
  ) {
    globalSharedHistoryArray.push(code)
    console.log('Added to SHARED global history:', code, 'Total:', globalSharedHistoryArray.length)
    console.log('Full SHARED global history array:', globalSharedHistoryArray)
  } else {
    console.log('Skipped adding to SHARED global history (duplicate or empty):', code)
  }
}
