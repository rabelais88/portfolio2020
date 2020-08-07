import { format } from 'date-fns';

const _fullDate = (dateValue) => format(dateValue, 'yyyy/MM/dd HH:mm');

const fullDate = (dateValue) => _fullDate(new Date(dateValue));

export default fullDate;
