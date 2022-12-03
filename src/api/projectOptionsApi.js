import { API } from './api';
import { getSessionItem } from '../helpers/storage';

export async function changeProjectOptions(pOptions) {
  const project = getSessionItem('project');

  const { user_id, dbName } = project;

  let url = '/updateProjectOptions/';
  let options = {
    method: 'POST',
    url,
    data: {
      user_id: parseInt(user_id),
      dbName,
      coefficient: pOptions.coefficient,
      att1310: pOptions.att1310,
      att1550: pOptions.att1550,
      spliceLoss: pOptions.spliceLoss,
      connectorLoss: pOptions.connectorLoss,
    },
  };
  let response = await API(options);
  let responseOK = response && response.status === 200 && response.statusText === 'OK';

  if (responseOK) return await response.data;
}
