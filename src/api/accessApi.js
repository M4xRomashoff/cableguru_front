import { API } from './api';

export async function removeAccessRequest({ user_id, dbNames }) {
  let url = '/data-bases/remove-access';
  let options = {
    method: 'DELETE',
    url,
    data: {
      user_id: parseInt(user_id),
      dbNames: dbNames,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function removeAccessRequestAndDelete({ user_id, dbNames }) {
  let url = '/data-bases/remove-access-and-delete';
  let options = {
    method: 'DELETE',
    url,
    data: {
      user_id: parseInt(user_id),
      dbNames: dbNames,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}

export async function addAccessRequest({ user_id, dbNames, access_level }) {
  let url = '/data-bases/add-access';
  let options = {
    method: 'POST',
    url: url,
    data: {
      user_id: parseInt(user_id),
      dbNames,
      access_level,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
