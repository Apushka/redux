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
    create(state, action) {
      state.entities.unshift(action.payload);
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter((t) => t.id !== action.payload.id);
    },
    loadingStart(state) {
      state.isLoading = true;
    },
    loadingEnd(state) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, received, loadingStart, loadingEnd, create } = actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(loadingStart());
  try {
    const data = await todoService.fetch();
    dispatch(received(data));
  } catch (error) {
    dispatch(loadingEnd());
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch, getState) => {
  return dispatch(update({ id, completed: true }));
};

export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` });
}

export function taskDeleted(id) {
  return remove({ id });
}

export const taskCreated = (title) => async (dispatch) => {
  dispatch(loadingStart());
  try {
    const data = await todoService.createTask({
      title,
      completed: false,
      userId: 1,
    });
    dispatch(create(data));
  } catch (error) {
    dispatch(loadingEnd());
    dispatch(setError(error.message));
  }
};

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksIsLoading = () => (state) => state.tasks.isLoading;

export default taskReducer;
