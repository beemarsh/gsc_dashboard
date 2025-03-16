// ...existing code...

// Add this new method to your api service
export const getEvents = async () => {
  try {
    const response = await axios.get('/event/get')
    return response.data
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}
