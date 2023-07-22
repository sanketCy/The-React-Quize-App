import { useReducer, useEffect } from 'react';
import Header from './Header';
import Main from './Main';

import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextQuestion from './NextQuestion';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading', 'error','ready', 'active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remaingSeconds: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'networkFail':
      return { ...state, status: 'error' };
    case 'start':
      return {
        ...state,
        status: 'active',
        remaingSeconds: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? question.points + state.points
            : state.points,
      };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'active',
      };
    case 'tick':
      return {
        ...state,
        remaingSeconds: state.remaingSeconds - 1,
        status: state.remaingSeconds === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Action unknown');
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, remaingSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestons = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataRecived', payload: data }))
      .catch((err) => dispatch({ type: 'networkFail' }));
  }, []);

  return (
    <div className="App">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen totalQuestions={numQuestons} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestons}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} remaingSeconds={remaingSeconds} />
              <NextQuestion
                answer={answer}
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestons}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
