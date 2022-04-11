import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import { ToastContainer } from "react-toastify";
import AddProject from "./addProject";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { listProject } from "../../redux/slice/project/listProjectSlice";
import { RootState } from "../../redux/rootReducer";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteProject } from "../../redux/slice/project/deleteProjectSlice";
import EditProject from "./editProject";

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const projectList = useSelector((state: RootState) => state.listProjectSlice);
  const deleteProductList = useSelector(
    (state: RootState) => state.deleteProjectSlice
  );

  useEffect(() => {
    dispatch(listProject());
  }, []);

  useEffect(() => {
    if (deleteProductList.projectdeleteSuccess == true) {
      dispatch(listProject());
    }
  }, [deleteProductList.projectdeleteSuccess]);

  interface projectalldata {
    projectName: string;
    link: string;
    description: string;
    rate: string;
    team: string;
    createdDate: Date;
    projectType: string;
    projectid: string;
  }
  const handleClick = (projectid: string) => {
    dispatch(
      deleteProject({
        projectId: projectid
      })
    );
  };

  const [open, setOpen] = useState(false);
  const handleCardClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="flex justify-end p-5">
        <AddProject />
      </div>
      <EditProject open={open} />
      {projectList?.isprojectlistloading == true ? (
        <CircularProgress />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 m-8 gap-4">
          {projectList &&
            projectList.projectData &&
            projectList?.projectData?.map((data: projectalldata) => {
              return (
                <div
                  className="shadow-md rounded font-medium  p-5 my-5"
                  onClick={handleCardClick}
                  key={data.projectid}
                >
                  <div className="flex justify-between">
                    <div className="text-black text-left font-bold">
                      {data.projectName}
                    </div>
                    <div className="text-black text-left text-xs contents">
                      {data.projectType}
                    </div>
                  </div>{" "}
                  <div className="flex justify-between">
                    <div className="font-light text-sm text-left py-1 text-gray-500">
                      {data.createdDate}
                    </div>
                    <div className="font-light text-xs text-left  text-gray-500">
                      {data.rate}
                    </div>
                  </div>
                  <div className="font-light text-sm text-left">
                    {data.description}
                  </div>
                  <div className="font-light text-xs text-left py-2">
                    {data.link}
                  </div>
                  <div className="font-light text-sm text-left ">
                    {data.team}
                  </div>
                  <div className="flex justify-end p-0">
                    <IconButton
                      onClick={() => {
                        handleClick(data.projectid);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              );
            })}

          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      )}
    </>
  );
};
export default Index;
