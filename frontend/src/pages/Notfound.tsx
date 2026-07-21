import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <p className="text-gray-500 mb-6">This page doesn't exist.</p>
      <Link to={"/dashboard"}>
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
};
export default Notfound;
