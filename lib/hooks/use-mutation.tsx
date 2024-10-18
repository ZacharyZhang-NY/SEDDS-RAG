import { useState } from 'react';
import { toast } from 'sonner';

interface useMutationProps {
  url: string
  body: Record<string, any>
  method: string
  operation: string
}

const useMutation = (
  url: string | URL | Request,
  body: any,
  method: any,
  operation: any,
) => {
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      toast.success(`${operation}成功`);
    } catch (e: any) {
      toast.error(e.message);
      setError(e.message);
    } finally {
    }
  };

  return {
    fetchData,
    error,
  };
};

export default useMutation;