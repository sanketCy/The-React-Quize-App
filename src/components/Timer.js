import { useEffect } from 'react';

function Timer({ dispatch, remaingSeconds }) {
  const min = Math.floor(remaingSeconds / 60);
  const secs = remaingSeconds % 60;

  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: 'tick' });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className="timer">
      {min < 10 && '0'}
      {min}:{secs < 10 && '0'}
      {secs}
    </div>
  );
}

export default Timer;
