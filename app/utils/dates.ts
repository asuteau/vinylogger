import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

export const dateToString = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD');
};

export const timeFromNow = (date: string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};
