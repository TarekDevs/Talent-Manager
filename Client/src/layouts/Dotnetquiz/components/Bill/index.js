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
			questionText: "What does CLR stand for in the context of .NET?",
			answerOptions: [
				{ answerText: 'Common Language Reflection', isCorrect: false },
				{ answerText: 'Component Language Runtime', isCorrect: false },
				{ answerText: ' Core Language Reflection', isCorrect: false },
				{ answerText: 'Common Language Runtime ', isCorrect: true },
			],
		},
		{
			questionText: 'What is the purpose of an interface in C#?',
			answerOptions: [
				{ answerText: 'To define a blueprint for a class, specifying method signatures ', isCorrect: true },
				{ answerText: 'To define a class constructor', isCorrect: false },
				{ answerText: 'To create instances of a class', isCorrect: false },
				{ answerText: 'To provide implementation details for a class', isCorrect: false },
			],
		},
		{
			questionText:"'Which of the following is NOT a built-in data type in C#?'",
			answerOptions: [
				{ answerText: ' int', isCorrect: false },
				{ answerText: 'string', isCorrect: false },
				{ answerText: ' number', isCorrect: true },
				{ answerText: 'decimal', isCorrect: false },
			],
		},
		{
			questionText: 'Which attribute is used to mark a method as asynchronous in C#',
			answerOptions: [
				{ answerText: '[Sync]', isCorrect: false },
				{ answerText: '[AsyncMethod]', isCorrect: false },
				{ answerText: ' [Awaitable]', isCorrect: false },
				{ answerText: '[Async] ', isCorrect: true },
			],
		},
	]

  const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);



  const [formationUpdated, setFormationUpdated] = useState(false);
  const [user,setUser]= useState(null);  

  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const [timerRunning, setTimerRunning] = useState(true);

	

  useEffect(() => {
    let interval;

    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setShowScore(true);
      setTimerRunning(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer, timerRunning]);

	
  const handleAnswerOptionClick = (isCorrect) => {
    if (!showScore) {
      if (isCorrect) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
        setTimerRunning(false); // Stop the timer when all questions are answered
      }
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
        <div className='question-text'>{questions[currentQuestion].questionText}
		</div>
		<div style={{marginTop:"190px"}}>
        <span>Time Left: {timer} seconds</span>
      </div>
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
