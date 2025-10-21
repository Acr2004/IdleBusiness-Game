export function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const paddedMinutes = String(minutes).padStart(2, "0");

    return `${hours}h${paddedMinutes}m`;
}