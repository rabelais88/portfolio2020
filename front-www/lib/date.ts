import dayjs from 'dayjs';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('en');
dayjs.extend(relativeTime);

export const formatPastDate = (targetDate: number) => {
  const _date = dayjs(targetDate);
  return _date.fromNow();
};

export default {
  formatPastDate,
};
