import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as UserIcon } from "../../assets/users.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg";

const Users = () => {
  // Sample data
  const initialUsers = [
    {
      id: 1,
      name: "Florence Shaw",
      email: "florence@untitledui.com",
      city: "New York",
      dob: "03/01/2024",
      gender: "Female",
      dateCreated: "2022-07-04",
    },
    {
      id: 2,
      name: "Amélie Laurent",
      email: "amelie@untitledui.com",
      city: "Paris",
      dob: "03/01/2024",
      gender: "Female",
      dateCreated: "2022-07-04",
    },
    {
      id: 3,
      name: "Ammar Foley",
      email: "ammar@untitledui.com",
      city: "London",
      dob: "03/01/2024",
      gender: "Male",
      dateCreated: "2022-07-04",
    },
    {
      id: 4,
      name: "Caitlyn King",
      email: "caitlyn@untitledui.com",
      city: "Los Angeles",
      dob: "03/01/2024",
      gender: "Female",
      dateCreated: "2022-07-04",
    },
    {
      id: 5,
      name: "Sienna Hewitt",
      email: "sienna@untitledui.com",
      city: "Sydney",
      dob: "03/01/2024",
      gender: "Female",
      dateCreated: "2022-07-04",
    },
    {
      id: 6,
      name: "Olly Shroeder",
      email: "olly@untitledui.com",
      city: "Berlin",
      dob: "03/01/2024",
      gender: "Male",
      dateCreated: "2022-07-04",
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
    dob: "",
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
      dob: formData.dob,
      gender: formData.gender,
      dateCreated: new Date().toISOString().split("T")[0], // current date
    };

    setUsers([...users, newUser]); // Add new user to the list
    setIsAddUser(false); // Return to the main users table
    setFormData({ firstName: "", lastName: "", email: "", city: "", dob: "", gender: "male" }); // Reset form
  };

  // Columns configuration
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "city", headerName: "City", width: 150 },
    { field: "dob", headerName: "DOB", width: 100 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "dateCreated", headerName: "Date Created", width: 150 },
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
              <button className="btn btn-success">Edit</button>

              <button className="btn btn-danger">Delete</button>
            </div>

            <Box style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                checkboxSelection
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

            <div className="add-user-form">
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
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleFormChange}
                    placeholder="Enter date of birth"
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
