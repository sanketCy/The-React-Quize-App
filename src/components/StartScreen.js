function StartScreen({ totalQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Wlcome to React Quize!</h2>
      <h3>{totalQuestions} Quetions to test your mastery of react</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Let's Started
      </button>
    </div>
  );
}

export default StartScreen;
