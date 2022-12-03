import { useSearchParams } from 'react-router-dom';

export default function ParamsModal({ children, modalName }) {
  const [searchParams] = useSearchParams();

  if (modalName === searchParams.get('modal')) return children;

  return null;
}
