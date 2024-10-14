import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams for dynamic routing
import { ReactComponent as QuizIcon } from "../../assets/quiz.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg"; // Icon for adding quiz

function Quizzes() {
  const { categoryId } = useParams(); // Retrieve category ID if a category is selected
  const navigate = useNavigate();
  const [quizzesByCategory, setQuizzesByCategory] = useState({});
  const [categories, setCategories] = useState([]); // State for all categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddQuiz, setIsAddQuiz] = useState(false); // For toggling quiz form visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: categoryId || "", // Pre-fill categoryId if available
  });

  // Fetch all quizzes by category or by selected category
  const fetchQuizzes = async () => {
    const token = localStorage.getItem("token");
    const url = categoryId
      ? `http://108.181.195.7:3000/admin/quiz/getByCatID/${categoryId}`
      : "http://108.181.195.7:3000/admin/quiz/getAll";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const quizzes = data.Quizs || [];
        console.log(data);

        // Group quizzes by category if all categories are fetched
        if (!categoryId) {
          const quizzesByCategory = quizzes.reduce((acc, quiz) => {
            const category = quiz.Category.name;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(quiz);
            return acc;
          }, {});
          setQuizzesByCategory(quizzesByCategory); // Set grouped quizzes
        } else {
          if (quizzes.length > 0) {
            const categoryName = quizzes[0].Category.name; // Get category name from the first quiz
            setQuizzesByCategory({ [categoryName]: quizzes }); // Set the quizzes under the category name
          } else {
            // Handle case if no quizzes are found for the category
            setQuizzesByCategory({});
          }
        }
      } else {
        throw new Error("Failed to fetch quizzes");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for selection dropdown
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const url = "http://108.181.195.7:3000/admin/category/all";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.Categories || []); // Set categories for dropdown
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchQuizzes(); // Fetch quizzes when the component loads
    if (!categoryId) {
      fetchCategories(); // Fetch categories only if categoryId is not present
    }
  }, [categoryId]);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle quiz form submission (POST request)
  const handleAddQuiz = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://108.181.195.7:3000/admin/quiz/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          CatID: formData.categoryId, // Use the selected category ID
          Title: formData.title, // Quiz title
          Description: formData.description, // Quiz description
        }),
      });

      if (response.ok) {
        // Refresh the quizzes list after adding
        fetchQuizzes();
        setIsAddQuiz(false); // Close the form after submission
      } else {
        throw new Error("Failed to add quiz");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle quiz selection and navigate to Chapters screen
  const handleQuizClick = (quiz) => {
    navigate(`/chapters/${quiz._id}`);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tab-content quizzes">
      <div className="tab-inner">
        {!isAddQuiz ? (
          <>
            <div className="top-header">
              <div className="heading">
                <QuizIcon />
                <h1>{loading ? "Loading Quizzes..." : "Quizzes"}</h1>
              </div>

              <div className="buttons-row flex-end">
                <button
                  className="btn btn-purple"
                  onClick={() => {
                    setIsAddQuiz(true); // Open the form
                    setFormData({
                      title: "",
                      description: "",
                      categoryId: categoryId || "",
                    }); // Reset form fields
                  }}
                >
                  <AddUserIcon />
                  Add Quiz
                </button>
              </div>
            </div>

            {/* Render quizzes by category */}
            {Object.keys(quizzesByCategory).map((categoryName) => (
              <div key={categoryName}>
                <h2>{categoryName}</h2> {/* Display category name */}
                <div className="quiz-cards">
                  {quizzesByCategory[categoryName].map((quiz, quizIndex) => (
                    <li key={quizIndex} onClick={() => handleQuizClick(quiz)}>
                      <span>
                        <p className="quizNo">Quiz #{quizIndex + 1}</p>
                        <p className="chaptersNo">
                          Created At:{" "}
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </span>
                      <p className="quizName">{quiz.Title}</p>{" "}
                      {/* Displaying the quiz title */}
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="add-quiz-page">
            <div className="top-header">
              <div className="heading">
                <AddUserIcon />
                <h1>Add New Quiz</h1>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setIsAddQuiz(false); // Close the form
                }}
              >
                Cancel
              </button>
            </div>

            <div className="add-form">
              <form autoComplete="off">
                {/* Only show category selection if no category is selected */}
                {!categoryId && (
                  <div className="field">
                    <label htmlFor="categoryId">Select Category</label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="title">Quiz Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter quiz title"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Quiz Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter quiz description"
                    required
                  />
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddQuiz}
                  >
                    Add Quiz
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setIsAddQuiz(false); // Close the form
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

export default Quizzes;
