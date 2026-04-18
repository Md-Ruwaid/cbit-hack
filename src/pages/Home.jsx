import { Navigate } from "react-router-dom";
import LoginButton from "../components/LoginButton";
import { useAuth } from "../context/useAuth";

function Home() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/form" replace />;
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Plan your smart trip in minutes
        </h1>
        <p className="mt-3 text-slate-600">
          Sign in with Google to access your personalized travel planner.
        </p>
        <div className="mt-6 flex justify-center">
          <LoginButton />
        </div>
      </div>
    </section>
  );
}

export default Home;
