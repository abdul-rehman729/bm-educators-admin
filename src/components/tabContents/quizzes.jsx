import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import data from "../../assets/data/data.json"; // Import all categories data
import { ReactComponent as QuizIcon } from "../../assets/quiz.svg";
import { ReactComponent as QuestionIcon } from "../../assets/question-mark.svg";

function Quizzes() {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for routing
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]); // State for storing all categories

  useEffect(() => {
    // Check if a category was passed via state
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory); // Set the selected category data
    } else {
      // If no category is selected, display all categories
      setAllCategories(data.categories); // Fetch all categories from the data
    }
  }, [location.state]);

  // Handle quiz selection and navigate to Chapters screen
  const handleQuizClick = (quiz) => {
    navigate("/chapters", { state: { selectedQuiz: quiz } }); // Pass selected quiz to chapters screen
  };

  return (
    <div className="tab-content quizzes">
      <div className="tab-inner">
        {selectedCategory ? (
          <>
            <div className="top-header">
              <div className="heading">
                <QuizIcon />
                <h1>Quizzes</h1>
              </div>
            </div>

            <div className="category-name">
              <h1>{selectedCategory.name}</h1>
              <QuestionIcon />
            </div>
            <div className="quiz-cards">
              {selectedCategory.quizzes.map((quiz, quizIndex) => (
                <li key={quizIndex} onClick={() => handleQuizClick(quiz)}>
                  <span>
                    <p className="quizNo">Quiz #{quizIndex + 1}</p>
                    <p className="chaptersNo">Chapters: {quiz.chapters.length}</p>
                  </span>
                  <p className="quizName">{quiz.name}</p>
                </li>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="top-header">
              <div className="heading">
                <QuizIcon />
                <h1>Quizzes</h1>
              </div>
              <p>All Categories</p>
            </div>

            {allCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="category-name">
                  <h1>{category.name}</h1>
                  <QuestionIcon />
                </div>

                <div className="quiz-cards">
                  {category.quizzes.map((quiz, quizIndex) => (
                    <li key={quizIndex} onClick={() => handleQuizClick(quiz)}>
                      <span>
                        <p className="quizNo">Quiz #{quizIndex + 1}</p>
                        <p className="chaptersNo">Chapters: {quiz.chapters.length}</p>
                      </span>
                      <p className="quizName">{quiz.name}</p>
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Quizzes;
