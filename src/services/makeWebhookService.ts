const MAKE_WEBHOOK_URL = import.meta.env['VITE_MAKE_WEBHOOK_URL'] as string;

export const submitToMake = async (formData: any) => {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify(formData)
    });

    console.log('Make webhook response status:', response.status);
    const text = await response.text();
    console.log('Make webhook response text:', text);

    if (response.ok) {
      return { success: true };
    }

    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || 'Unknown error from Make webhook');
    } catch {
      throw new Error(text || 'Unknown error from Make webhook');
    }
  } catch (error) {
    console.error('Error submitting to Make:', error);
    throw error;
  }
}; 