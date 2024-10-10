import React from "react";
import { ReactComponent as CategoryIcon } from "../../assets/categories.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import data from "../../assets/data/data.json"; // Import the data from the JSON file

function Categories() {
  const navigate = useNavigate();

  const categories = data.categories;

  // Function to handle category click
  const handleCategoryClick = (category) => {
    navigate("/quizzes", { state: { selectedCategory: category } }); // Navigate to quizzes page with selected category data in state
  };

  return (
    <div className="tab-content categories">
      <div className="tab-inner">
        <div className="top-header">
          <div className="heading">
            <CategoryIcon />
            <h1>Categories</h1>
          </div>
        </div>

        <div className="category-cards">
          {categories.map((category, index) => (
            <div
              className="card"
              key={index}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="image">
                <img src={category.image} alt={category.name} />
              </div>
              <div className="text">
                <h4>{category.name}</h4>
                <p>{category.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
