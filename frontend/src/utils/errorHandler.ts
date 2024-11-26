export const extractErrorMessage = (error: any, fallbackMessage: string): string => {
    return (
      error?.response?.data?.message || 
      error?.message || 
      fallbackMessage
    );
  };
  