import { createSlice } from "@reduxjs/toolkit";
import todoService from "../services/todoService";
import { setError } from "./errors";

const initialState = {
  entities: [],
  isLoading: true,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    received(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    created(state, action) {
      state.entities.push(action.payload);
      state.isLoading = false;
    },
    updated(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    removed(state, action) {
      state.entities = state.entities.filter((t) => t.id !== action.payload.id);
    },
    loadingStarted(state) {
      state.isLoading = true;
    },
    loadingEnded(state) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { updated, removed, received, loadingStarted, loadingEnded, created } =
  actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(loadingStarted());
  try {
    const data = await todoService.fetch();
    dispatch(received(data));
  } catch (error) {
    dispatch(loadingEnded());
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch) => {
  return dispatch(updated({ id, completed: true }));
};

export function changeTitle(id) {
  return updated({ id, title: `New title for ${id}` });
}

export function deleteTask(id) {
  return removed({ id });
}

export const createTask = (title) => async (dispatch) => {
  dispatch(loadingStarted());
  try {
    const data = await todoService.createTask({
      userId: 1,
      title,
      completed: false,
    });
    dispatch(created(data));
  } catch (error) {
    dispatch(loadingEnded());
    dispatch(setError(error.message));
  }
};

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksIsLoading = () => (state) => state.tasks.isLoading;

export default taskReducer;
