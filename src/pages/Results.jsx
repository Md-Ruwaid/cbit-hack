import { Link, useLocation } from "react-router-dom";
import { getSavedTrips } from "../lib/tripStorage";

function Results() {
  const location = useLocation();
  const trip = location.state?.trip || getSavedTrips()[0];

  if (!trip) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Results</h2>
          <p className="mt-2 text-slate-600">
            No trip found yet. Create your first trip plan from the form page.
          </p>
          <Link
            to="/form"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Go to Form
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Results</h2>
        <p className="mt-2 text-slate-600">Your generated itinerary is ready.</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Destination</p>
        <p className="text-lg font-semibold text-slate-900">{trip.destination}</p>
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <p>
            <span className="font-medium">Start:</span> {trip.startDate}
          </p>
          <p>
            <span className="font-medium">Days:</span> {trip.days}
          </p>
          <p>
            <span className="font-medium">Budget:</span> {trip.budget}
          </p>
        </div>
        <p className="text-sm text-slate-700">
          <span className="font-medium">Interests:</span>{" "}
          {trip.interests || "Not specified"}
        </p>
        {trip.summary ? (
          <p className="text-sm text-slate-700">
            <span className="font-medium">AI Summary:</span> {trip.summary}
          </p>
        ) : null}
        {trip.bestTimeToVisit ? (
          <p className="text-sm text-slate-700">
            <span className="font-medium">Best Time:</span> {trip.bestTimeToVisit}
          </p>
        ) : null}
        {trip.estimatedBudgetNote ? (
          <p className="text-sm text-slate-700">
            <span className="font-medium">Budget Note:</span>{" "}
            {trip.estimatedBudgetNote}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Suggested Plan</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {trip.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {trip.hotelAreaSuggestions?.length ? (
          <>
            <h4 className="mt-4 text-sm font-semibold text-slate-900">
              Hotel Area Suggestions
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {trip.hotelAreaSuggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

        {trip.foodSuggestions?.length ? (
          <>
            <h4 className="mt-4 text-sm font-semibold text-slate-900">
              Food Suggestions
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {trip.foodSuggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

        {trip.travelTips?.length ? (
          <>
            <h4 className="mt-4 text-sm font-semibold text-slate-900">Travel Tips</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {trip.travelTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

        <div className="mt-5 flex gap-2">
          <Link
            to="/saved"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            View Saved Trips
          </Link>
          <Link
            to="/form"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Create Another
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Results;
