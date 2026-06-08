import { useEffect, useState } from "react";
import { currentUser } from "../services/authService";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await currentUser();

        setUser({
          ...data,
          roles: data.roles || [],
          isCitizen:
            data.roles?.includes("Citizen") && !data.roles?.includes("Staff"),
          isStaff: data.roles?.includes("Staff"),
        });
      } catch (err) {
        console.log("Error fetching user", err);
      }
    };

    fetchUser();
  }, []);

  return user;
}
