function Progress({ index, numQuestions, points, maxPossiblePoints, answer }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />

      <p>
        Question <span>{index + 1}</span> / {numQuestions}
      </p>

      <p>
        {points} / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
