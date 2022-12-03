import { API } from './api';
import { getSessionItem } from '../helpers/storage';

export async function changeItemState(item_id, item_name, item_type, item_state) {
  console.log('changeItemState(item_id, item_name, item_type, item_state)', item_id, item_name, item_type, item_state);
  const project = getSessionItem('project');

  const { user_id, dbName } = project;

  let url = '/change-state/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      item_id,
      item_name,
      item_type,
      item_state,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
