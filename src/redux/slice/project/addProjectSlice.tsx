import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addProjectApi } from "../../../api/projectapi";

interface addProject {
  projectName: string | any;
  projectType: string | any;
  createdDate: string | any;
  Description: string | any;
  Link: string | any;
  Rate: string | any;
  Team: string | any;
}

export const addProject = createAsyncThunk(
  "/addProject",
  async (
    {
      projectName,
      projectType,
      createdDate,
      Description,
      Link,
      Rate,
      Team
    }: addProject,
    thunkAPI
  ) => {
    try {
      return await addProjectApi(
        projectName,
        projectType,
        createdDate,
        Description,
        Link,
        Rate,
        Team
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  projectadding: false,
  projectaddingFailed: true,
  projectaddingSuccess: false,
  errorMsg: ""
};

const addProjectSlice = createSlice({
  name: "addProjectSlice",
  initialState,
  reducers: {
    resetaddProject: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(addProject.fulfilled, (state, { payload }) => {
      state.projectadding = false;
      state.projectaddingFailed = false;
      state.projectaddingSuccess = true;
      state.errorMsg = "";
    });
    builder.addCase(addProject.rejected, (state, action: any) => {
      state.projectadding = false;
      state.projectaddingFailed = true;
      state.projectaddingSuccess = false;
      state.errorMsg = action.payload;
    });
    builder.addCase(addProject.pending, (state, { payload }) => {
      state.projectadding = true;
      state.projectaddingFailed = false;
      state.projectaddingSuccess = false;
      state.errorMsg = "";
    });
  }
});

export const { resetaddProject } = addProjectSlice.actions;

export default addProjectSlice.reducer;
