import React, { useState, useEffect, useRef } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import Profile from "../Components/profile";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

const Home = () => {
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleResize = ref => {
    const textarea = ref.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const [todos, setTodos] = useState([]);
  // console.log("todos", todos[0]?.data?.userUID)
  // todos.map((t) => {
  //   console.log("map all id's",t?.data?.userUID)
  // })

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), snapshot => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const currentDate = new Date();

    if (name.trim() !== "") {
      await addDoc(collection(db, "todos"), {
        name: name.trim(),
        description,
        isCompleted: false,
        priority: ["low", "medium", "high"],
        label: "", // Assuming label is a string, you can assign it here
        date: currentDate,
        userUID: user.uid
      });
      nameRef.current.value = "";
      descriptionRef.current.value = "";
    }
  };

  const handleEditTodo = async (id, newData) => {
    await updateDoc(doc(db, "todos", id), newData);
  };

  const handleDeleteTodo = async id => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleCheckboxChange = async (id, isCompleted) => {
    await updateDoc(doc(db, "todos", id), { isCompleted: !isCompleted });
  };

  // user logic
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg" />
      </div>
    );
  }

  console.log("user in home page:", user.uid);
  // user logic

  return (
    <div className="">
    <div className="mt-10"></div>
      <Profile />
      <div className="flex justify-center">
        <ul className="w-[20rem] sm:w-[50rem]">
          {todos.map((todo, index) =>
            <div key={todo.id}>
              {todo.data.userUID === user.uid &&
                <li className="flex items-center justify-between border-b border-gray-700 py-2">
                  <div className="flex gap-10 items-center ">
                    <input
                      type="checkbox"
                      value={todo.data.isCompleted}
                      checked={todo.data.isCompleted}
                      onChange={() =>
                        handleCheckboxChange(todo.id, todo.data.isCompleted)}
                      className="checkbox checkbox-success theme-controller"
                    />
                    <div className="">
                      <div
                        className={
                          "text-[15px] " +
                          (todo.data.isCompleted ? "text-[#00A96D]" : "")
                        }
                      >
                        {todo.data.name}
                      </div>
                      <div
                        className={
                          "text-[12px] " +
                          (todo.data.isCompleted ? "text-[#00A96D]" : "")
                        }
                      >
                        {todo.data.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <CiEdit
                      onClick={() => {
                        // Implement edit functionality
                      }}
                      className="text-gray-400 cursor-pointer mx-1 hover:text-green-400 text-xl"
                    />
                    <AiOutlineDelete
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-gray-400 cursor-pointer mx-3 hover:text-red-300 text-xl"
                    />
                  </div>
                </li>}
            </div>
          )}
        </ul>
      </div>
      <div className="my-10 flex items-center justify-center">
        <div className=" w-[20rem] sm:w-[53rem] border border-gray-300 rounded-lg flex flex-col ">
          <div className="flex flex-col px-4 pt-4">
            <textarea
              ref={nameRef}
              className="bg-transparent text-14 font-bold outline-none overflow-hidden resize-none w-full"
              placeholder="Task name"
              onInput={() => handleResize(descriptionRef)}
            />
            <textarea
              ref={descriptionRef}
              onInput={() => handleResize(descriptionRef)}
              className=" bg-transparent placeholder-gray-500  text-[14px] outline-none overflow-hidden resize-none w-full mb-4"
              placeholder="Description"
            />
          </div>
          <div className="felx flex-col px-3 pb-3 text-[13px] ">
            <button
              type="submit"
              className="border border-gray-300 rounded-md mx-1 px-[19px] py-[3px] hover:bg-gray-800 hover:text-white"
            >
              Due date
            </button>
            <button
              type="submit"
              className="border border-gray-300 rounded-md px-[19px] py-[3px] mx-1 hover:bg-gray-800 hover:text-white"
            >
              Priority
            </button>
            <button
              type="submit"
              className="border border-gray-300 rounded-md px-[19px] py-[3px] mx-1 hover:bg-gray-800 hover:text-white"
            >
              label
            </button>
          </div>
          <hr />
          <div className="flex justify-end px-3 text-[13px] py-4">
            <button
              type="submit"
              className="border border-gray-300 rounded-md px-[19px] py-[3px] mx-1 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-gray-300 rounded-md px-[19px] py-[3px] mx-1 hover:bg-gray-800 hover:text-white"
              onClick={handleAddTodo}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
