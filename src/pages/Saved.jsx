import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteTrip, getSavedTrips } from "../lib/tripStorage";

function Saved() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(getSavedTrips());

  const handleDelete = (tripId) => {
    setTrips(deleteTrip(tripId));
  };

  const viewTrip = (trip) => {
    navigate("/results", { state: { trip } });
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Saved Trips</h2>
        <p className="mt-2 text-slate-600">
          All generated plans are stored locally in your browser.
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">No saved trips yet.</p>
          <Link
            to="/form"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Create a Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{trip.destination}</p>
                <p className="text-sm text-slate-600">
                  {trip.startDate} • {trip.days} days • {trip.budget}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => viewTrip(trip)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(trip.id)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Saved;
