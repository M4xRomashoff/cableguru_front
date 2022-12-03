import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useModalIdParam = ({ callback }) => {
  const [searchParams] = useSearchParams();

  const modalId = searchParams.get('modalId');

  useEffect(() => {
    if (modalId !== undefined) {
      callback(modalId);
    }
  }, [modalId]);
};
