import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To retrieve chapterId
import { ReactComponent as QuestionIcon } from "../../assets/question.svg";

function Questions() {
  const { chapterId } = useParams(); // Retrieve chapter ID from route
  const [questions, setQuestions] = useState([]);
  const [chapterTitle, setChapterTitle] = useState(""); // State to store chapter title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // To store form errors
  const [isAddQuestion, setIsAddQuestion] = useState(false); // For toggling question form visibility
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""], // Array to hold 4 answer options
    correctOption: "", // To hold the correct answer's index
    imageURL: null, // To store the uploaded image
    audioURL: null, // To store the uploaded audio
  });

  // Fetch questions by chapter ID
  const fetchQuestions = async () => {
    const token = localStorage.getItem("token");
    const url = `http://108.181.195.7:3000/admin/question/getByChapterID/${chapterId}`;

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
        setQuestions(data.Questions || []);

        // Extract and set the chapter title from the first question
        if (data.Questions.length > 0) {
          const title = data.Questions[0].Chapter.Title;
          setChapterTitle(title);
        }
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    if (!formData.question.trim()) {
      errors.question = "Please enter the question.";
    }

    formData.options.forEach((option, index) => {
      if (!option.trim()) {
        errors[`option-${index}`] = `Please enter answer ${index + 1}.`;
      }
    });

    if (formData.correctOption === "") {
      errors.correctOption = "Please select the correct answer.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes and clear errors for specific fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Clear the specific error when the user provides a valid input
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? null : prevErrors[name], // If field is valid, clear error
    }));

    if (name.startsWith("option")) {
      // Handle option changes
      const index = parseInt(name.split("-")[1], 10); // Get the option index from the name
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file input for image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageURL: file });
  };

  // Handle file input for audio
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, audioURL: file });
  };

  // Handle adding new question (POST request)
  const handleAddQuestion = async () => {
    if (!validateForm()) return; // If validation fails, return early

    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    formDataToSend.append("ChapterID", chapterId);
    formDataToSend.append("QuestionTitle", formData.question);

    // Add image and audio files if they are uploaded, otherwise empty strings
    if (formData.imageURL) {
      formDataToSend.append("QuestionImage", formData.imageURL);
    } else {
      formDataToSend.append("QuestionImage", ""); // Send empty string if no image
    }

    if (formData.audioURL) {
      formDataToSend.append("QuestionAudio", formData.audioURL);
    } else {
      formDataToSend.append("QuestionAudio", ""); // Send empty string if no audio
    }

    // Convert options array to a JSON string and append it
    const optionsData = formData.options.map((option, index) => ({
      option: option,
      IsCorrect: formData.correctOption == index,
    }));

    formDataToSend.append("QuestionOption", JSON.stringify(optionsData));

    try {
      const response = await fetch(
        "http://108.181.195.7:3000/admin/question/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        fetchQuestions();
        setIsAddQuestion(false); // Close the form after submission
      } else {
        throw new Error("Failed to add question");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchQuestions(); // Fetch questions when the component loads
  }, [chapterId]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="tab-content">
      <div className="tab-inner">
        {!isAddQuestion ? (
          <>
            <div className="top-header">
              <div className="heading">
                <QuestionIcon />
                {/* Display the chapter title */}
                <h1>{chapterTitle + " > Questions"}</h1>
              </div>

              <div className="buttons-row flex-end">
                <button
                  className="btn btn-purple"
                  onClick={() => {
                    setIsAddQuestion(true); // Open the form
                    setFormData({
                      question: "",
                      options: ["", "", "", ""],
                      correctOption: "",
                      imageURL: null,
                      audioURL: null,
                    }); // Reset form fields
                  }}
                >
                  <QuestionIcon />
                  Add Question
                </button>
              </div>
            </div>

            <div className="question-cards">
              {questions.map((question, index) => (
                <div key={question._id} className="bm-question">
                  <h4>
                    Q#{index + 1}: {question.Question}
                  </h4>
                  <div className="options">
                    {question.options.map((option, optIndex) => (
                      <p
                        key={option._id}
                        className={
                          "option " +
                          (option.isCorrect ? "Correct" : "Incorrect")
                        }
                      >
                        <b>{optIndex + 1}: </b>
                        {option.Option}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="add-question-page">
            <div className="top-header">
              <div className="heading">
                <QuestionIcon />
                <h1>Add New Question</h1>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => {
                  setIsAddQuestion(false); // Close the form
                }}
              >
                Cancel
              </button>
            </div>

            <div className="add-form">
              <form autoComplete="off">
                <div className="field">
                  <label htmlFor="question">
                    Question<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleFormChange}
                    placeholder="Enter the question"
                    required
                  />
                  {formErrors.question && (
                    <p className="error-message">{formErrors.question}</p>
                  )}
                </div>

                <div className="field">
                  <label>
                    Answers<span className="required">*</span>
                  </label>
                  <div className="field-row">
                    {formData.options.map((option, index) => (
                      <div className="field" key={index}>
                        <input
                          type="text"
                          name={`option-${index}`}
                          value={option}
                          onChange={handleFormChange}
                          placeholder={`Answer ${index + 1}`}
                          required
                        />
                        {formErrors[`option-${index}`] && (
                          <p className="error-message">
                            {formErrors[`option-${index}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="correctOption">
                    Correct Answer<span className="required">*</span>
                  </label>
                  <select
                    name="correctOption"
                    id="correctOption"
                    value={formData.correctOption}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select the correct answer</option>
                    {formData.options.map((_, index) => (
                      <option key={index} value={index}>
                        Answer {index + 1}
                      </option>
                    ))}
                  </select>
                  {formErrors.correctOption && (
                    <p className="error-message">{formErrors.correctOption}</p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="image">Upload Image (Optional)</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="field">
                  <label htmlFor="audio">Upload Audio (Optional)</label>
                  <input
                    type="file"
                    id="audio"
                    name="audio"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                  />
                </div>

                <div className="field buttons">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setIsAddQuestion(false); // Close the form
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

export default Questions;
