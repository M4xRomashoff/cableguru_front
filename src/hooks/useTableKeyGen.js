import { useMemo } from 'react';

const getTableKeys = (tableData, field) => {
  return tableData[field].map((rows) => ({ id: keyGen(), rows: rows.map(() => keyGen())}))
}


function keyGen() {
  return Math.random();
}
export default function useTableKeyGen({ tableData }) {
  return useMemo(() => {
    const headerKeys = getTableKeys(tableData, 'header');
    const bodyKeys = getTableKeys(tableData, 'body');
    const bodyFullKeys = getTableKeys(tableData, 'bodyFull');

    return { headerKeys, bodyKeys, bodyFullKeys }
  }, [tableData])
}