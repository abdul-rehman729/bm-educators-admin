import React, { useState, useEffect } from "react";
import { ReactComponent as CategoryIcon } from "../../assets/categories.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg";
import { ReactComponent as CheckIcon } from "../../assets/checkmark.svg";
import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddCat, setIsAddCat] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing a category
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://108.181.195.7:3000/admin/category/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.Categories);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle category form submission (POST request for Add and PUT request for Update)
  const handleSubmitCategory = async () => {
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST"; // Determine whether to add or update
    const url = isEditing
      ? `http://108.181.195.7:3000/admin/category/update/${selectedCategories[0]._id}`
      : "http://108.181.195.7:3000/admin/category/add";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          Price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        // Refresh the categories list after adding/updating
        fetchCategories();
        setIsAddCat(false); // Close the form after submission
        setIsEditing(false); // Reset editing state
        setSelectedCategories([]); // Reset selected categories
      } else {
        throw new Error(isEditing ? "Failed to update category" : "Failed to add category");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle category checkbox toggle
  const handleCheckboxToggle = (category) => {
    const updatedSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedSelection);
  };

  // Handle Edit click
  const handleEditClick = () => {
    const selectedCategory = selectedCategories[0];
    setFormData({
      title: selectedCategory.name,
      description: selectedCategory.description,
      price: selectedCategory.Price,
    });
    setIsEditing(true);
    setIsAddCat(true); // Open the form
  };

  const handleDeleteClick = async () => {
    const token = localStorage.getItem("token");
    try {
      for (const category of selectedCategories) {
        await fetch(`http://108.181.195.7:3000/admin/category/delete/${category._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // Refresh categories after deletion
      fetchCategories();
      setSelectedCategories([]); // Reset selection after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/quizzes/${category._id}`); // Pass category ID in the URL
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="tab-content categories">
      <div className="tab-inner">
        {!isAddCat ? (
          <>
            <div className="top-header">
              <div className="heading">
                <CategoryIcon />
                <h1>{loading ? "Loading Categories..." : "Categories"}</h1>
              </div>

              <div className="buttons-row flex-end">
                <button
                  className="btn btn-purple"
                  onClick={() => {
                    setIsAddCat(true);
                    setIsEditing(false); // Reset editing state if adding new
                    setFormData({ title: "", description: "", price: "" });
                  }}
                >
                  <AddUserIcon />
                  Add Category
                </button>
                {selectedCategories.length === 1 && (
                  <button className="btn btn-success" onClick={handleEditClick}>
                    Edit
                  </button>
                )}
                {selectedCategories.length > 0 && (
                  <button className="btn btn-danger" onClick={handleDeleteClick}>
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="category-cards">
              {categories.map((category, index) => (
                <div className="card" key={index}>
                  <label className="selection">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCheckboxToggle(category)}
                    />
                    <span className="checkmark"><CheckIcon/></span>
                  </label>
                  <div className="text" onClick={() => handleCategoryClick(category)}>
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                    <p>Price: ${category.Price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="add-category-page">
            <div className="top-header">
              <div className="heading">
                <AddUserIcon />
                <h1>{isEditing ? "Update Category" : "Add New Category"}</h1>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setIsAddCat(false);
                  setIsEditing(false); // Reset editing state if canceled
                  setSelectedCategories([]); // Reset selection
                }}
              >
                Cancel
              </button>
            </div>

            <div className="add-form">
              <form autoComplete="off">
                <div className="field">
                  <label htmlFor="title">Category Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter category title"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Category Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter category description"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSubmitCategory}
                  >
                    {isEditing ? "Update Category" : "Add Category"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setIsAddCat(false);
                      setIsEditing(false); // Reset editing state if canceled
                      setSelectedCategories([]); // Reset selection
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
}

export default Categories;
