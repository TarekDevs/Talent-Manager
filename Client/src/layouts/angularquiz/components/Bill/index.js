/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState ,useEffect} from "react";
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import "./bill.css"
import styles from './bill.css'; // Import the CSS module
import { useLocation } from "react-router-dom";
import axios from "axios"; 

function Bill({  }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const id = localStorage.getItem('userId');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const formationId = location.pathname.split('/').pop(); // Extract the formation ID from the URL path

  const questions = [
		{
			questionText: "What is Angular in the context of web development?",
			answerOptions: [
				{ answerText: 'A programming language for building server-side applications"', isCorrect: false },
				{ answerText: 'A version control system for managing code repositories"', isCorrect: false },
				{ answerText: 'A version control system for managing code repositories', isCorrect: true },
				{ answerText: 'A tool for optimizing images and other assets on websites"', isCorrect: false },
			],
		},
		{
			questionText: 'Which directive is used in Angular to create a two-way data binding?',
			answerOptions: [
				{ answerText: 'ng-bind', isCorrect: false },
				{ answerText: 'ng-model', isCorrect: true },
				{ answerText: 'ng-bind-model', isCorrect: false },
				{ answerText: 'ng-data-bind', isCorrect: false },
			],
		},
		{
			questionText:"'What is the purpose of Angular CLI (Command Line Interface)??'",
			answerOptions: [
				{ answerText: ' Its a tool for managing databases in Angular applications.', isCorrect: false },
				{ answerText: 'its used to create and manage virtual environments for Angular..', isCorrect: true },
				{ answerText: 'Its a command-line tool for generating, building, and deploying Angular projects.', isCorrect: false },
				{ answerText: ' Its a built-in browser-based code editor specifically designed for Angular development.', isCorrect: false },
			],
		},
		{
			questionText: 'What is a component in Angular?',
			answerOptions: [
				{ answerText: 'A specialized type of service for making HTTP requests.', isCorrect: false },
				{ answerText: 'A reusable user interface element representing a part of the UI.', isCorrect: true },
				{ answerText: 'A module responsible for routing between different views', isCorrect: false },
				{ answerText: 'A function used for mapping data in arrays or objects.', isCorrect: false },
			],
		},
	]

  const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);



  const [formationUpdated, setFormationUpdated] = useState(false);
  const [user,setUser]= useState(null);  



	
	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
		  setScore(score + 1);
		}
	
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
		  setCurrentQuestion(nextQuestion);
		} else {
		  setShowScore(true);
		}
	  };

	

	
	
	  const updateFormationStatus = async () => {
		try {
		  const response = await axios.put(
			`http://localhost:8000/api/users/updatestatus/${formationId}`,
			{ userId: id }
		  );
		  setFormationUpdated(true); // Set the formationUpdated state to true
		} catch (error) {
		  console.error("Error updating formation status:", error);	}
	  };
	


  return (
    <MDBox
	component="li"
	display="flex"
	justifyContent="space-between"
	alignItems="flex-start"
	bgColor={darkMode ? "transparent" : "grey-100"}
	borderRadius="lg"
	p={10}
	witdh={1}
	style={{
	  margin: 0,
	  fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	  WebkitFontSmoothing: "antialiased",
	  MozOsxFontSmoothing: "grayscale",
	  color: "#ffffff", // Set the color to white
	  
	}}

      mt={2}

    >

<div className="quiz">
{showScore ? (
          <div>
            <p className="score-section" style={{ marginLeft: "150px" }}>
              You scored {score} out of {questions.length}
            </p>
            <div>
              {score === questions.length ? (
                <div>
                  <p className="score-section">
                    Congratulations! You got a perfect score.
                  </p>
                  {formationUpdated ? (
                    <p className="score-section">
                      Your formation is verified successfully!
                    </p>
                  ) : (
                    <button className="score" onClick={updateFormationStatus}>
                      Get your Badge
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="score-section">
                    Unfortunately, you did not answer all questions </p>
					<p style={{marginLeft:"200px"}}>correctly.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (

          <>
      <div className='question-section' style={{ marginBottom: '20px' }}>
        <div className='question-count'>
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className='question-text'>{questions[currentQuestion].questionText}</div>
      </div>
      <div className='answer-section' style={{ marginLeft: '25px' , }}>
        {questions[currentQuestion].answerOptions.map((answerOption, index) => (
          <button
		  className="key"
            key={index}
            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
          >
            {answerOption.answerText}
          </button>
        ))}
      </div>
    </>
  )}
</div>




      </MDBox>
      
      
       
  );
}



export default Bill;
