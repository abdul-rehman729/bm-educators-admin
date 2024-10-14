import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as UserIcon } from "../../assets/users.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg";
import { useNavigate } from "react-router-dom"; 

const Users = () => {
  const navigate = useNavigate();
  
  // Sample data
  const initialUsers = [
    {
      id: 1,
      name: "Florence Shaw",
      email: "florence@untitledui.com",
      city: "New York",
      gender: "Female",
    },
    {
      id: 2,
      name: "Amélie Laurent",
      email: "amelie@untitledui.com",
      city: "Paris",
      gender: "Female",
    },
    {
      id: 3,
      name: "Ammar Foley",
      email: "ammar@untitledui.com",
      city: "London",
      gender: "Male",
    },
    {
      id: 4,
      name: "Caitlyn King",
      email: "caitlyn@untitledui.com",
      city: "Los Angeles",
      gender: "Female",
    },
    {
      id: 5,
      name: "Sienna Hewitt",
      email: "sienna@untitledui.com",
      city: "Sydney",
      gender: "Female",
    },
    {
      id: 6,
      name: "Olly Shroeder",
      email: "olly@untitledui.com",
      city: "Berlin",
      gender: "Male",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUser, setIsAddUser] = useState(false);

  // State to handle form input
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    gender: "male",
  });

  // Handle form changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1, // Unique ID based on length
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      city: formData.city,
      gender: formData.gender,
    };

    setUsers([...users, newUser]); // Add new user to the list
    setIsAddUser(false); // Return to the main users table
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      gender: "male",
    }); // Reset form
  };

  // Action Handlers
  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    navigate(`/users/${id}`, { state: { user } }); // Navigate and pass user data
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handlePermission = (id) => {
    console.log(`Set permissions for user with ID: ${id}`);
    // Add your permission logic here
  };

  // Columns configuration
  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "city", headerName: "City", width: 100 },
    { field: "gender", headerName: "Gender", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="buttons-row h-100">
          <button className="btn btn-success"
            onClick={() => handlePermission(params.row.id)}
          >
            Permission
          </button>

          <button className="btn btn-danger"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>

          <button className="btn btn-purp"
            onClick={() => handleView(params.row.id)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  // Handle search filtering
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtered users list
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tab-content users">
      <div className="tab-inner">
        {!isAddUser ? (
          <>
            <div className="top-header">
              <div className="heading">
                <UserIcon />
                <h1>Users</h1>
              </div>

              <button
                className="btn btn-purple"
                onClick={() => {
                  setIsAddUser(true);
                }}
              >
                <AddUserIcon />
                Create User
              </button>
            </div>

            <div className="grid-table-header">
              <div className="search-bar">
                <input
                  className="search"
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <SearchIcon />
              </div>
            </div>

            <Box style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                pagination
              />
            </Box>
          </>
        ) : (
          <div className="add-user-page">
            <div className="top-header">
              <div className="heading">
                <AddUserIcon />
                <h1>Create User</h1>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setIsAddUser(false);
                }}
              >
                Cancel
              </button>
            </div>

            <div className="add-form">
              <form action="#" autoComplete="off">
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-name">First Name</label>
                    <input
                      type="text"
                      id="f-name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="l-name">Last Name</label>
                    <input
                      type="text"
                      id="l-name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="field">
                  <label htmlFor="gender">Gender</label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddUser}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setIsAddUser(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
