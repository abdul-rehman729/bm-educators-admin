import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Use useLocation to get passed state
import data from "../../assets/data/data.json"; // Import all categories data
import { ReactComponent as ChapterIcon } from "../../assets/chapters.svg";

function Chapters() {
  const location = useLocation();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [allChapters, setAllChapters] = useState([]); // State for storing all chapters

  useEffect(() => {
    // Check if a quiz was passed via state
    if (location.state && location.state.selectedQuiz) {
      setSelectedQuiz(location.state.selectedQuiz); // Set the selected quiz data
    } else {
      // If no quiz is selected, gather all chapters from all quizzes
      const allQuizChapters = [];
      data.categories.forEach((category) => {
        category.quizzes.forEach((quiz) => {
          allQuizChapters.push({
            quizName: quiz.name,
            chapters: quiz.chapters,
          });
        });
      });
      setAllChapters(allQuizChapters); // Set all chapters from all quizzes
    }
  }, [location.state]);

  return (
    <div className="tab-content chapters quizzes">
      <div className="tab-inner">
        {selectedQuiz ? (
          <>
            <div className="top-header">
              <div className="heading">
                <ChapterIcon />
                <h1>Chapters</h1>
              </div>
            </div>

            <div className="category-name">
              <h1>{selectedQuiz.name}</h1>
              <ChapterIcon />
            </div>
            <div className="quiz-cards">
              {selectedQuiz.chapters.map((chapter, chapterIndex) => (
                <li key={chapterIndex}>
                  <span>
                    <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
                  </span>
                  <p className="quizName">{chapter.name}</p>
                </li>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="top-header">
              <div className="heading">
                <ChapterIcon />
                <h1>Chapters</h1>
              </div>
              <p>All Quizzes</p>
            </div>

            {allChapters.map((quiz, quizIndex) => (
              <div key={quizIndex}>
                <div className="quiz-name">
                  <h2>{quiz.quizName}</h2>
                </div>

                <div className="quiz-cards">
                  {quiz.chapters.map((chapter, chapterIndex) => (
                    <li key={chapterIndex}>
                      <span>
                        <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
                      </span>
                      <p className="quizName">{chapter.name}</p>
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

export default Chapters;
