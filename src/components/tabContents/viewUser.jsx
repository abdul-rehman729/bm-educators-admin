import React from "react";
import { useLocation } from "react-router-dom"; // Import hooks for params and location

const ViewUser = () => {
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
                <strong>First Name:</strong> {user.FirstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user.LastName}
              </p>
              <p>
                <strong>Email:</strong> {user.EmailAddress}
              </p>
              <p>
                <strong>City:</strong> {user.City}
              </p>
              <p>
                <strong>Gender:</strong> {user.Gender}
              </p>
              <p>
                <strong>DNI/NIE Number:</strong> {user.DniNieNumber}
              </p>
              <p>
                <strong>Contact Number:</strong> {user.ContactNumber}
              </p>
              <p>
                <strong>Role:</strong> {user.RoleID.RoleName}
              </p>
              <p>
                <strong>Permission:</strong> {user.PermissionID.PermissionName}
              </p>
              {/* Add more fields as needed */}
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
