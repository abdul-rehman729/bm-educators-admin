import React from "react";
import { useLocation, useParams } from "react-router-dom"; // Import hooks for params and location

const ViewUser = () => {
  const { userId } = useParams(); // Retrieve userId from URL params
  const location = useLocation(); // Get the state passed via navigate
  const user = location.state?.user; // Extract the passed user data

  return (
    <div className="tab-content users">
      <div className="tab-inner">
        <div>
          <h2>View User</h2>
          {user ? (
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>City:</strong> {user.city}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender}
              </p>
            </div>
          ) : (
            <p>User not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
