import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  changeTitle,
  deleteTask,
  completeTask,
  loadTasks,
  getTasks,
  getTasksIsLoading,
  createTask,
} from "./store/task";
import configureStore from "./store/store";
import { Provider, useSelector, useDispatch } from "react-redux";
import { getErrors } from "./store/errors";

const store = configureStore();

const App = () => {
  const state = useSelector(getTasks());
  const isLoading = useSelector(getTasksIsLoading());
  const error = useSelector(getErrors());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  function handleTitleChange(taskId) {
    dispatch(changeTitle(taskId));
  }

  function handleCreate() {
    const title = prompt("Введите название задачи");
    dispatch(createTask(title));
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>App</h1>
      <button onClick={handleCreate}>Create Task</button>
      <ul>
        {state.map((el) => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p>{`Completed: ${el.completed}`}</p>
            <button onClick={() => dispatch(completeTask(el.id))}>
              Complete
            </button>
            <button onClick={() => handleTitleChange(el.id)}>
              Change Title
            </button>
            <button onClick={() => dispatch(deleteTask(el.id))}>
              Delete Task
            </button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
