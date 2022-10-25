import httpService from "./httpService";
const todoEndpoint = "todos/";

const todoService = {
  fetch: async () => {
    const { data } = await httpService.get(todoEndpoint, {
      params: {
        _page: 1,
        _limit: 10,
      },
    });
    return data;
  },
  createTask: async (taskData) => {
    const { data } = await httpService.post(todoEndpoint, taskData);
    return data;
  },
};

export default todoService;
