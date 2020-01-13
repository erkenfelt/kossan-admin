export function secondsToDateString(seconds: number): string {
  const date = new Date(seconds * 1000);
  return dateToDayAndTime(date);
}

export function dateToDayAndTime(date: Date): string {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const dateString = date.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return `${dateString.charAt(0).toUpperCase()}${dateString.slice(1)} ${hours}:${minutes}`;
}

export function dateToDay(seconds: number): string {
  const date = new Date(seconds * 1000);
  const dateString = date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
  });

  return dateString;
}

export function dateToTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes}`;
}

