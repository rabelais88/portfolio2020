import request from '@/utils/request';
import { IMAGE_URL } from '@/env';
import { AUTH_REQUIRED, FILE } from './path';

export function uploadFile(fileData) {
  const url = [AUTH_REQUIRED, FILE].join('/');
  // return request({
  //   url: `/${url}`,
  //   method: 'post',
  //   data,
  // });
  const form = new FormData();
  form.append('files', fileData);
  return request.post(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getFileUrl(fileName) {
  const isFullUrl = new RegExp('^(http|https)://', 'ig').test(fileName);
  if (isFullUrl) return fileName;
  return [IMAGE_URL, fileName].join('/');
}
