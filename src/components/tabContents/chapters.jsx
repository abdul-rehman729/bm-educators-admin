// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom"; // Use useLocation to get passed state
// import data from "../../assets/data/data.json"; // Import all categories data
// import { ReactComponent as ChapterIcon } from "../../assets/chapters.svg";

// function Chapters() {
//   const location = useLocation();
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [allChapters, setAllChapters] = useState([]); // State for storing all chapters

//   useEffect(() => {
//     // Check if a quiz was passed via state
//     if (location.state && location.state.selectedQuiz) {
//       setSelectedQuiz(location.state.selectedQuiz); // Set the selected quiz data
//     } else {
//       // If no quiz is selected, gather all chapters from all quizzes
//       const allQuizChapters = [];
//       data.categories.forEach((category) => {
//         category.quizzes.forEach((quiz) => {
//           allQuizChapters.push({
//             quizName: quiz.name,
//             chapters: quiz.chapters,
//           });
//         });
//       });
//       setAllChapters(allQuizChapters); // Set all chapters from all quizzes
//     }
//   }, [location.state]);

//   return (
//     <div className="tab-content chapters quizzes">
//       <div className="tab-inner">
//         {selectedQuiz ? (
//           <>
//             <div className="top-header">
//               <div className="heading">
//                 <ChapterIcon />
//                 <h1>Chapters</h1>
//               </div>
//             </div>

//             <div className="category-name">
//               <h1>{selectedQuiz.name}</h1>
//               <ChapterIcon />
//             </div>
//             <div className="quiz-cards">
//               {selectedQuiz.chapters.map((chapter, chapterIndex) => (
//                 <li key={chapterIndex}>
//                   <span>
//                     <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
//                   </span>
//                   <p className="quizName">{chapter.name}</p>
//                 </li>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="top-header">
//               <div className="heading">
//                 <ChapterIcon />
//                 <h1>Chapters</h1>
//               </div>
//               <p>All Quizzes</p>
//             </div>

//             {allChapters.map((quiz, quizIndex) => (
//               <div key={quizIndex}>
//                 <div className="quiz-name">
//                   <h2>{quiz.quizName}</h2>
//                 </div>

//                 <div className="quiz-cards">
//                   {quiz.chapters.map((chapter, chapterIndex) => (
//                     <li key={chapterIndex}>
//                       <span>
//                         <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
//                       </span>
//                       <p className="quizName">{chapter.name}</p>
//                     </li>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Chapters;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // For dynamic routing
// import { ReactComponent as ChapterIcon } from "../../assets/chapters.svg";
// import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg"; // Icon for adding chapter

// function Chapters() {
//   const { quizId } = useParams(); // Retrieve quiz ID if a quiz is selected
//   const navigate = useNavigate();
//   const [chaptersByQuiz, setChaptersByQuiz] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isAddChapter, setIsAddChapter] = useState(false); // For toggling chapter form visibility
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     quizId: quizId || "", // Pre-fill quizId if available
//   });

//   // Fetch all chapters by quiz or all chapters
//   const fetchChapters = async () => {
//     const token = localStorage.getItem("token");
//     const url = quizId
//       ? `http://108.181.195.7:3000/admin/chapter/getByQuizID/${quizId}`
//       : "http://108.181.195.7:3000/admin/chapter/getAll";

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const chapters = data.Chapters || [];

//         // Group chapters by quiz if all chapters are fetched
//         if (!quizId) {
//           const chaptersByQuiz = chapters.reduce((acc, chapter) => {
//             const quizName = chapter.QuizID.Title; // Assuming you have quiz name in QuizID
//             if (!acc[quizName]) {
//               acc[quizName] = [];
//             }
//             acc[quizName].push(chapter);
//             return acc;
//           }, {});
//           setChaptersByQuiz(chaptersByQuiz); // Set grouped chapters
//         } else {
//           setChaptersByQuiz({ [`Quiz ID: ${quizId}`]: chapters });
//         }
//       } else {
//         throw new Error("Failed to fetch chapters");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleFormChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle chapter form submission (POST request)
//   const handleAddChapter = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch("http://108.181.195.7:3000/admin/chapter/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           QuizID: formData.quizId, // Use the selected quiz ID
//           Title: formData.title, // Chapter title
//           Description: formData.description, // Chapter description
//         }),
//       });

//       if (response.ok) {
//         // Refresh the chapters list after adding
//         fetchChapters();
//         setIsAddChapter(false); // Close the form after submission
//       } else {
//         throw new Error("Failed to add chapter");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchChapters(); // Fetch chapters when the component loads
//   }, [quizId]);

//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="tab-content chapters">
//       <div className="tab-inner">
//         {!isAddChapter ? (
//           <>
//             <div className="top-header">
//               <div className="heading">
//                 <ChapterIcon />
//                 <h1>{loading ? "Loading Chapters..." : "Chapters"}</h1>
//               </div>

//               <div className="buttons-row flex-end">
//                 <button
//                   className="btn btn-purple"
//                   onClick={() => {
//                     setIsAddChapter(true); // Open the form
//                     setFormData({ title: "", description: "", quizId: quizId || "" }); // Reset form fields
//                   }}
//                 >
//                   <AddUserIcon />
//                   Add Chapter
//                 </button>
//               </div>
//             </div>

//             {/* Render chapters by quiz */}
//             {Object.keys(chaptersByQuiz).map((quizName) => (
//               <div key={quizName}>
//                 <h2>{quizName}</h2> {/* Display quiz name */}

//                 <div className="chapter-cards">
//                   {chaptersByQuiz[quizName].map((chapter, chapterIndex) => (
//                     <li key={chapterIndex}>
//                       <span>
//                         <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
//                       </span>
//                       <p className="chapterName">{chapter.Title}</p> {/* Displaying the chapter title */}
//                       <p>{chapter.Description}</p> {/* Displaying the chapter description */}
//                     </li>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </>
//         ) : (
//           <div className="add-chapter-page">
//             <div className="top-header">
//               <div className="heading">
//                 <AddUserIcon />
//                 <h1>Add New Chapter</h1>
//               </div>

//               <button
//                 className="btn btn-danger"
//                 onClick={() => {
//                   setIsAddChapter(false); // Close the form
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>

//             <div className="add-form">
//               <form autoComplete="off">
//                 {/* Only show quiz selection if no quiz is selected */}
//                 {!quizId && (
//                   <div className="field">
//                     <label htmlFor="quizId">Select Quiz</label>
//                     <select
//                       id="quizId"
//                       name="quizId"
//                       value={formData.quizId}
//                       onChange={handleFormChange}
//                       required
//                     >
//                       <option value="">Select a quiz</option>
//                       {Object.keys(chaptersByQuiz).map((quiz) => (
//                         <option key={quiz} value={quiz}>
//                           {quiz}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 <div className="field">
//                   <label htmlFor="title">Chapter Title</label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleFormChange}
//                     placeholder="Enter chapter title"
//                     required
//                   />
//                 </div>

//                 <div className="field">
//                   <label htmlFor="description">Chapter Description</label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleFormChange}
//                     placeholder="Enter chapter description"
//                     required
//                   />
//                 </div>

//                 <div className="field buttons">
//                   <button
//                     type="button"
//                     className="btn btn-success"
//                     onClick={handleAddChapter}
//                   >
//                     Add Chapter
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={() => {
//                       setIsAddChapter(false); // Close the form
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Chapters;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For dynamic routing
import { ReactComponent as ChapterIcon } from "../../assets/chapters.svg";
import { ReactComponent as AddUserIcon } from "../../assets/add-user.svg"; // Icon for adding chapter

function Chapters() {
  const { quizId } = useParams(); // Retrieve quiz ID if a quiz is selected
  const navigate = useNavigate();
  const [chaptersByQuiz, setChaptersByQuiz] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddChapter, setIsAddChapter] = useState(false); // For toggling chapter form visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quizId: quizId || "", // Pre-fill quizId if available
  });

  // Fetch all chapters by quiz or all chapters
  const fetchChapters = async () => {
    const token = localStorage.getItem("token");
    const url = quizId
      ? `http://108.181.195.7:3000/admin/chapter/getByQuizID/${quizId}`
      : "http://108.181.195.7:3000/admin/chapter/getAll";

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
        const chapters = data.Chapters || [];

        // Group chapters by quiz if all chapters are fetched
        if (!quizId) {
          const chaptersByQuiz = chapters.reduce((acc, chapter) => {
            const quizName = chapter.QuizID.Title; // Assuming you have quiz name in QuizID
            if (!acc[quizName]) {
              acc[quizName] = [];
            }
            acc[quizName].push(chapter);
            return acc;
          }, {});
          setChaptersByQuiz(chaptersByQuiz); // Set grouped chapters
        } else {
          setChaptersByQuiz({ [`Quiz ID: ${quizId}`]: chapters });
        }
      } else {
        throw new Error("Failed to fetch chapters");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Questions screen with chapter ID
  const handleChapterClick = (chapterId) => {
    navigate(`/questions/${chapterId}`);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle chapter form submission (POST request)
  const handleAddChapter = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://108.181.195.7:3000/admin/chapter/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          QuizID: formData.quizId, // Use the selected quiz ID
          Title: formData.title, // Chapter title
          Description: formData.description, // Chapter description
        }),
      });

      if (response.ok) {
        // Refresh the chapters list after adding
        fetchChapters();
        setIsAddChapter(false); // Close the form after submission
      } else {
        throw new Error("Failed to add chapter");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchChapters(); // Fetch chapters when the component loads
  }, [  quizId]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tab-content chapters">
      <div className="tab-inner">
        {!isAddChapter ? (
          <>
            <div className="top-header">
              <div className="heading">
                <ChapterIcon />
                <h1>{loading ? "Loading Chapters..." : "Chapters"}</h1>
              </div>

              <div className="buttons-row flex-end">
                <button
                  className="btn btn-purple"
                  onClick={() => {
                    setIsAddChapter(true); // Open the form
                    setFormData({ title: "", description: "", quizId: quizId || "" }); // Reset form fields
                  }}
                >
                  <AddUserIcon />
                  Add Chapter
                </button>
              </div>
            </div>

            {/* Render chapters by quiz */}
            {Object.keys(chaptersByQuiz).map((quizName) => (
              <div key={quizName}>
                <h2>{quizName}</h2> {/* Display quiz name */}

                <div className="chapter-cards">
                  {chaptersByQuiz[quizName].map((chapter, chapterIndex) => (
                    <li
                      key={chapterIndex}
                      onClick={() => handleChapterClick(chapter._id)} // Navigate to questions
                    >
                      <span>
                        <p className="chapterNo">Chapter #{chapterIndex + 1}</p>
                      </span>
                      <p className="chapterName">{chapter.Title}</p> {/* Displaying the chapter title */}
                      <p>{chapter.Description}</p> {/* Displaying the chapter description */}
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="add-chapter-page">
            <div className="top-header">
              <div className="heading">
                <AddUserIcon />
                <h1>Add New Chapter</h1>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setIsAddChapter(false); // Close the form
                }}
              >
                Cancel
              </button>
            </div>

            <div className="add-form">
              <form autoComplete="off">
                {/* Only show quiz selection if no quiz is selected */}
                {!quizId && (
                  <div className="field">
                    <label htmlFor="quizId">Select Quiz</label>
                    <select
                      id="quizId"
                      name="quizId"
                      value={formData.quizId}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select a quiz</option>
                      {Object.keys(chaptersByQuiz).map((quiz) => (
                        <option key={quiz} value={quiz}>
                          {quiz}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="title">Chapter Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Enter chapter title"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="description">Chapter Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter chapter description"
                    required
                  />
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddChapter}
                  >
                    Add Chapter
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setIsAddChapter(false); // Close the form
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

export default Chapters;