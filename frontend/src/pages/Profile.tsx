import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



const Profile = () => {


  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {user && (
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Name:</span> {user.first_name}{" "}
                {user.last_name}
              </p>
              <p>
                <span className="text-gray-500">Email:</span>
                {user.email}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Profile;
