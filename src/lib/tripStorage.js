const TRIPS_STORAGE_KEY = "smart-travel-plans";

export function getSavedTrips() {
  const storedTrips = localStorage.getItem(TRIPS_STORAGE_KEY);
  return storedTrips ? JSON.parse(storedTrips) : [];
}

export function saveTrip(trip) {
  const existingTrips = getSavedTrips();
  const updatedTrips = [trip, ...existingTrips];
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
  return updatedTrips;
}

export function deleteTrip(tripId) {
  const updatedTrips = getSavedTrips().filter((trip) => trip.id !== tripId);
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
  return updatedTrips;
}
