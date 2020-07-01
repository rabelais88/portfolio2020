import request from '@/utils/request';
import { DASHBOARD } from './path';

export function getDashboard() {
  return request({
    url: `/${DASHBOARD}`,
    method: 'get',
  });
}
