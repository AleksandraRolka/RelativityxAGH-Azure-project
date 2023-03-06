import "./Flashcards.css";
import { Flashcard } from "react-quizlet-flashcard";

export default function CustomFlashcard({ textFront, textBack, textSize }) {
  return (
    <Flashcard
      frontHTML={
        <div className="card-div">
          {textSize === "very-small" ? (
            <h4 id="card-text" className="very-small-text">
              {textFront}
            </h4>
          ) : textSize === "small" ? (
            <h4 id="card-text" className="small-text">
              {textFront}
            </h4>
          ) : (
            <h3 id="card-text">{textFront}</h3>
          )}
        </div>
      }
      backHTML={
        <div className="card-div">
          {textSize === "very-small" ? (
            <h5 id="card-text">{textBack}</h5>
          ) : textSize === "small" ? (
            <h4 id="card-text" className="very-small-text">
              {textBack}
            </h4>
          ) : (
            <h3 id="card-text" className="small-text">
              {textBack}
            </h3>
          )}
        </div>
      }
      height={200}
      style={{ margin: "10px" }}
      width={280}
      frontCardStyle={{ backgroundColor: "white" }}
      backCardStyle={{ backgroundColor: "#fa7a70", color: "white" }}
    />
  );
}
