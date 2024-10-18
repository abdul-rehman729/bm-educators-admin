import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as UserIcon } from "../../assets/users.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg";
import { ReactComponent as CheckIcon } from "../../assets/checkmark.svg";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Store users from API
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUser, setIsAddUser] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // Store form errors
  const [categories, setCategories] = useState([]); // Store categories from API
  const [selectedCategories, setSelectedCategories] = useState([]); // Store selected category IDs

  // Form data state for adding a new user
  const [formData, setFormData] = useState({
    username: "",
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    DniNumber: "",
    IsResident: false,
    Education: "",
    ContactNumber: "",
    Address: "",
    City: "",
    Gender: "Male",
    categoryIds: [],
    DeviceType: "web", // default
    DeviceMac: "currently test", // static for now
    Permission: "all", // default to "all"
    LanguageConversionPermission: "deny", // default to "deny"
    QuestionAllowed: "50", // default to "50"
    PaidAmount: "",
    ExpiryDate: null, // Optional
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const url = "http://108.181.195.7:3000/admin/getAllUser";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        const usersData = data.Users.map((user) => ({
          id: user._id,
          name: `${user.FirstName} ${user.LastName}`,
          email: user.EmailAddress,
          city: user.City,
          gender: user.Gender,
          fullData: user, // Storing all user data for View screen
        }));
        setUsers(usersData);
        console.log(usersData);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const url = "http://108.181.195.7:3000/admin/category/all";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        setCategories(data.Categories);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCategories(); // Fetch categories when component loads
  }, []);

  // Action Handlers
  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    navigate(`/users/${id}`, { state: { user: user.fullData } }); // Pass full user data to View screen
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handlePermission = (id) => {
    console.log(`Set permissions for user with ID: ${id}`);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.FirstName.trim()) errors.FirstName = "First Name is required";
    if (!formData.LastName.trim()) errors.LastName = "Last Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    if (!formData.DniNumber.trim()) errors.DniNumber = "DNI Number is required";
    if (!formData.ContactNumber.trim())
      errors.ContactNumber = "Contact Number is required";
    if (!formData.Address.trim()) errors.Address = "Address is required";
    if (!formData.City.trim()) errors.City = "City is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find((cat) => cat._id === selectedId);
    if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, selectedId],
      });
    }
  };

  // Handle removing selected category
  const removeCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat._id !== id));
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.filter((catId) => catId !== id),
    });
  };

  // Handle adding new user (POST request)
  const handleAddUser = async () => {
    const token = localStorage.getItem("token");

    if (!validateForm()) return;

    const dataToSend = { ...formData };
    if (!formData.ExpiryDate) {
      delete dataToSend.ExpiryDate;
    }

    try {
      const response = await fetch(
        "http://108.181.195.7:3000/admin/addClient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend), // Send the data as a JSON string
        }
      );

      if (response.ok) {
        fetchUsers(); // Refresh the user list after adding
        setIsAddUser(false); // Close the form
        resetForm();
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      username: "",
      FirstName: "",
      LastName: "",
      email: "",
      password: "",
      DniNumber: "",
      IsResident: false,
      Education: "",
      ContactNumber: "",
      Address: "",
      City: "",
      Gender: "Male",
      categoryIds: [],
      DeviceType: "web",
      DeviceMac: "currently test",
      Permission: "all",
      LanguageConversionPermission: "deny",
      QuestionAllowed: "50",
      PaidAmount: "",
      ExpiryDate: null,
    });
    setSelectedCategories([]);
  };

  // Columns configuration for DataGrid
  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "city", headerName: "City", width: 150 },
    { field: "gender", headerName: "Gender", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="buttons-row h-100">
          <button
            className="btn btn-success"
            onClick={() => handlePermission(params.row.id)}
          >
            Permission
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
          <button
            className="btn btn-purp"
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
  
  // Filter available categories to exclude already selected categories
  const availableCategories = categories.filter(
    (category) => !selectedCategories.some((selected) => selected._id === category._id)
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
              <form autoComplete="off">
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="FirstName">First Name</label>
                    <input
                      type="text"
                      id="FirstName"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleFormChange}
                      placeholder="Enter first name"
                    />
                    {formErrors.FirstName && (
                      <p className="error-message">{formErrors.FirstName}</p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="LastName">Last Name</label>
                    <input
                      type="text"
                      id="LastName"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleFormChange}
                      placeholder="Enter last name"
                    />
                    {formErrors.LastName && (
                      <p className="error-message">{formErrors.LastName}</p>
                    )}
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleFormChange}
                      placeholder="Enter username"
                    />
                    {formErrors.username && (
                      <p className="error-message">{formErrors.username}</p>
                    )}
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
                    {formErrors.email && (
                      <p className="error-message">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Category Select */}
                <div className="field">
                  <label htmlFor="categoryIds">Select Categories</label>
                  <select id="categoryIds" onChange={handleCategorySelect}>
                    <option value="">Select a category</option>
                    {availableCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Display Selected Categories */}
                  <div className="selected-categories">
                    {selectedCategories.map((category) => (
                      <div key={category._id} className="selected-category">
                        <p>{category.name}</p>
                        <button
                          type="button"
                          onClick={() => removeCategory(category._id)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional form fields */}
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="Enter password"
                    />
                    {formErrors.password && (
                      <p className="error-message">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="DniNumber">DNI Number</label>
                    <input
                      type="text"
                      id="DniNumber"
                      name="DniNumber"
                      value={formData.DniNumber}
                      onChange={handleFormChange}
                      placeholder="Enter DNI Number"
                    />
                    {formErrors.DniNumber && (
                      <p className="error-message">{formErrors.DniNumber}</p>
                    )}
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="IsResident" className="selection">
                      <input
                        type="checkbox"
                        id="IsResident"
                        name="IsResident"
                        checked={formData.IsResident}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            IsResident: e.target.checked,
                          })
                        }
                      />{" "}
                      <span className="checkmark">
                        <CheckIcon />
                      </span>
                      Is Resident
                    </label>
                  </div>

                  <div className="field">
                    <label htmlFor="Education">Education</label>
                    <input
                      type="text"
                      id="Education"
                      name="Education"
                      value={formData.Education}
                      onChange={handleFormChange}
                      placeholder="Enter education"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="ContactNumber">Contact Number</label>
                    <input
                      type="text"
                      id="ContactNumber"
                      name="ContactNumber"
                      value={formData.ContactNumber}
                      onChange={handleFormChange}
                      placeholder="Enter contact number"
                    />
                    {formErrors.ContactNumber && (
                      <p className="error-message">
                        {formErrors.ContactNumber}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="Address">Address</label>
                    <input
                      type="text"
                      id="Address"
                      name="Address"
                      value={formData.Address}
                      onChange={handleFormChange}
                      placeholder="Enter address"
                    />
                    {formErrors.Address && (
                      <p className="error-message">{formErrors.Address}</p>
                    )}
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="City">City</label>
                    <input
                      type="text"
                      id="City"
                      name="City"
                      value={formData.City}
                      onChange={handleFormChange}
                      placeholder="Enter city"
                    />
                    {formErrors.City && (
                      <p className="error-message">{formErrors.City}</p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="Gender">Gender</label>
                    <select
                      name="Gender"
                      id="Gender"
                      value={formData.Gender}
                      onChange={handleFormChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="DeviceType">Device Type</label>
                    <select
                      name="DeviceType"
                      id="DeviceType"
                      value={formData.DeviceType}
                      onChange={handleFormChange}
                    >
                      <option value="web">Web</option>
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="DeviceMac">Device MAC</label>
                    <input
                      type="text"
                      id="DeviceMac"
                      name="DeviceMac"
                      value={formData.DeviceMac}
                      onChange={handleFormChange}
                      placeholder="Enter device MAC"
                    />
                  </div>
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddUser}
                  >
                    Add User
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
