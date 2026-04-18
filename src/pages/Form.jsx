import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { generateTripPlanWithGemini } from "../lib/gemini";
import { saveTrip } from "../lib/tripStorage";

function Form() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    days: 3,
    budget: "Medium",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const aiPlan = await generateTripPlanWithGemini(formData);

      const tripPlan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...formData,
        ownerUid: user?.uid,
        ownerName: user?.name,
        summary: aiPlan.summary || "",
        bestTimeToVisit: aiPlan.bestTimeToVisit || "",
        estimatedBudgetNote: aiPlan.estimatedBudgetNote || "",
        suggestions: Array.isArray(aiPlan.suggestions) ? aiPlan.suggestions : [],
        hotelAreaSuggestions: Array.isArray(aiPlan.hotelAreaSuggestions)
          ? aiPlan.hotelAreaSuggestions
          : [],
        foodSuggestions: Array.isArray(aiPlan.foodSuggestions)
          ? aiPlan.foodSuggestions
          : [],
        travelTips: Array.isArray(aiPlan.travelTips) ? aiPlan.travelTips : [],
      };

      saveTrip(tripPlan);
      navigate("/results", { state: { trip: tripPlan } });
    } catch (submitError) {
      setError(
        submitError.message || "Unable to generate plan. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Trip Form</h2>
        <p className="mt-2 text-slate-600">
          Welcome, {user?.name}. Fill this form to generate your trip result.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Destination</span>
          <input
            required
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Goa"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Start Date</span>
            <input
              required
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Days</span>
            <input
              required
              min="1"
              max="30"
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Budget</span>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">
            Interests (comma separated)
          </span>
          <input
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="beaches, food, adventure"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-fit rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating with AI..." : "Generate Plan"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}

export default Form;
