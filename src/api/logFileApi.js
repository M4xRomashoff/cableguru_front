import { API } from './api';
import { getSessionItem } from '../helpers/storage';

export async function logAddInfo(item, action, comments) {
  const project = getSessionItem('project');
  let commentsModified = comments;
  const { user_id, dbName } = project;
  if (Array.isArray(comments)) {
    commentsModified = '';
    for (let i = 0; i < comments.length; i++) {
      commentsModified += comments[i];
    }
  }

  let url = '/log-file/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      item,
      action,
      comments: commentsModified,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
