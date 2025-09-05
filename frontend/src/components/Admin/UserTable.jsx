import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteUser,
  GetAllUsers,
  SearchedUser,
} from "../../redux/slices/AdminSlice";
import FadeLoader from "react-spinners/FadeLoader";
const UserTable = () => {
  const dispatch = useDispatch();
  const [delid, setdelid] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const { allusers, getloading, delloading } = useSelector(
    (state) => state.admin
  );

  const { filteredUser } = useSelector((state) => state.admin);

  const dispalyUser = filteredUser.length > 0 ? filteredUser : allusers;

  const handleDelete = (id) => {
    setdelid(id);
    dispatch(DeleteUser(id));
  };

  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const value = e.target.value.trim();

    if (value !== "") {
      if (value.includes("@")) {
        dispatch(SearchedUser({ firstName: "", email: value }));
      } else {
        dispatch(SearchedUser({ firstName: value, email: "" }));
      }
      setInputVal(value);
    } else {
      setInputVal("");
    }
  };

  return (
    <div className="max-w-7xl">
      <div className="w-full flex  items-center md:flex-row flex-col justify-between">
        <h2 className="text-2xl  font-bold mb-6"> User Management</h2>
        <input
          value={inputVal}
          onChange={handleInputChange}
          placeholder="search user.."
          className="mb-6 px-2 w-full md:w-1/2 py-2 outline-none border rounded-md placeholder:text-sm"
          type="text"
        />
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getloading ? (
              <tr>
                <td colSpan={4}>
                  {" "}
                  <FadeLoader className="w-full text-center" />
                </td>
              </tr>
            ) : dispalyUser.length > 0 ? (
              dispalyUser.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.firstName}
                  </td>
                  <td
                    className="py-4 px-4 font-medium text-gray-900 max-w-[200px] truncate"
                    title={user.email}
                  >
                    {user.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">{user.role}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className={`bg-red-500 text-white  px-3 py-2 rounded text-sm ${
                        delid === user._id && delloading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "hover:bg-red-600"
                      }`}
                    >
                      {delid === user._id && delloading ? (
                        <p>Deleting....</p>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
