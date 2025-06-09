import { createApi } from './baseApi';

const eventApi = createApi('events');

// Add any event-specific API methods here
export const getUpcomingEvents = async () => {
  const events = await eventApi.getAll();
  const now = new Date();
  return events.filter(event => new Date(event.date) > now);
};

export const getPastEvents = async () => {
  const events = await eventApi.getAll();
  const now = new Date();
  return events.filter(event => new Date(event.date) <= now);
};

export const getEventById = async (id) => {
  const event = await eventApi.getById(id);
  return event;
};

// Export the base CRUD operations
export default eventApi; 