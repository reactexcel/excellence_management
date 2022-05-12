import {
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  where,
  query,
  collection,
  setDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

export const addProjectApi = async (
  projectName: string,
  projectType: string,
  createdDate: string,
  Description: string,
  Link: string,
  Rate: string,
  Team: string,
  userData: any
) => {
  try {
    const userDatasets: any = [];
    await Promise.all(
      userData?.map(async (dataset: any) => {
        const q = query(
          collection(db, "employee"),
          where("userId", "==", dataset)
        );
        const querySnapshot = await getDocs(q);
        await Promise.all(
          querySnapshot.docs.map((doc) => {
            userDatasets.push(doc.data());
          })
        );
      })
    );
    const newDocRef = doc(collection(db, "projects"));
    setDoc(newDocRef, {
      projectName: projectName,
      projectType: projectType,
      createdDate: createdDate,
      description: Description,
      team: Team,
      link: Link,
      rate: Rate,
      projectid: newDocRef.id
    }).then(async function () {
      await Promise.all(
        userDatasets?.map(async (data: any) => {
          const newColRef = doc(
            db,
            "projects",
            newDocRef.id,
            "users",
            data.userId
          );
          await setDoc(newColRef, {
            userName: data.userName,
            userRole: data.userRole,
            userEmail: data.userEmail,
            userID: data.userId
          });
        })
      );
    });
  } catch (error: any) {
    throw error;
  }
};

export const listProjectApi = async () => {
  console.log("list Callled");
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const collectiondata: any = [];
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const projectData = doc.data();
        const querySnapshot2 = await getDocs(
          collection(db, "projects", projectData.projectid, "users")
        );
        const arr: Array<object> = [];
        await Promise.all(
          querySnapshot2.docs.map((doc) => {
            const userquerydata = doc.data();
            arr.push(userquerydata);
          })
        );
        if (arr.length > 0) {
          collectiondata.push({ ...projectData, userData: arr });
        }
      })
    );
    return collectiondata;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProjectApi = async (projectId: string) => {
  try {
    const deleteRef = doc(db, "projects", projectId);
    deleteDoc(deleteRef);

    const deleteuserarr: Array<object> = [];
    const DeletequerySnapshot2 = await getDocs(
      collection(db, "projects", projectId, "users")
    );

    await Promise.all(
      DeletequerySnapshot2.docs.map((doc) => {
        const Edituserquerydata = doc.data();
        deleteuserarr.push(Edituserquerydata);
      })
    );

    await Promise.all(
      deleteuserarr?.map(async (dataset: any) => {
        const deleteEditRef = doc(
          db,
          "projects",
          projectId,
          "users",
          dataset.userID
        );
        deleteDoc(deleteEditRef);
      })
    );

    toast("product deleted successfully", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  } catch (error: any) {
    throw error;
  }
};

export const editProjectApi = async (
  projectName: string,
  projectType: string,
  createdDate: string,
  Description: string,
  Link: string,
  Rate: string,
  Team: string,
  projectId: string,
  userData: any
) => {
  try {
    const userEditData: any = [];
    await Promise.all(
      userData?.map(async (dataset: any) => {
        const q = query(
          collection(db, "employee"),
          where("userId", "==", dataset)
        );
        const querySnapshot = await getDocs(q);
        await Promise.all(
          querySnapshot.docs.map((doc) => {
            userEditData.push(doc.data());
          })
        );
      })
    );

    const edituserarr: Array<object> = [];
    const EditquerySnapshot2 = await getDocs(
      collection(db, "projects", projectId, "users")
    );
    await Promise.all(
      EditquerySnapshot2.docs.map((doc) => {
        const Edituserquerydata = doc.data();
        edituserarr.push(Edituserquerydata);
      })
    );

    await Promise.all(
      edituserarr?.map(async (dataset: any) => {
        const deleteEditRef = doc(
          db,
          "projects",
          projectId,
          "users",
          dataset.userID
        );
        deleteDoc(deleteEditRef);
      })
    );

    const editRef = doc(db, "projects", projectId);
    updateDoc(editRef, {
      projectName: projectName,
      projectType: projectType,
      createdDate: createdDate,
      description: Description,
      link: Link,
      rate: Rate,
      team: Team
    });

    userEditData?.map(async (data: any) => {
      const usereditRef = doc(db, "projects", projectId, "users", data.userId);
      await setDoc(usereditRef, {
        userName: data.userName,
        userRole: data.userRole,
        userEmail: data.userEmail,
        userID: data.userId
      });
    });

    toast("product updated successfully", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  } catch (error: any) {
    throw error;
  }
};
