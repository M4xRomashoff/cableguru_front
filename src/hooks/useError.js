import { useState } from 'react';

export default function useError() {
  const [error, setError] = useState({});

  return { error, setError };
}