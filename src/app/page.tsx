"use client";
import "./page.module.css";
import API_BASE_URL from "@/utils/apiConfig";
import { useEffect, useState } from "react";
import GalleryPhoto from "./Gallery/Gallery";
import { Button } from "react-bootstrap";
interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

interface Album {
  userId: number;
  id: number;
  title: string;
}
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [showPhotoGalleryModal, setShowPhotoGalleryModal] =
    useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>("");

  useEffect(() => {
    if (!users) {
      return;
    }
    fetch(`${API_BASE_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterUsers(event.target.value);
  };

  const filterUsers = (searchQuery: string) => {
    const filteredData = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePhotoGallery = (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowPhotoGalleryModal(true);
  };
  return (
    <main className={""}>
      <div className="container mt-4">
        <div className="mb-3" style={{ width: "250px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search User"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <table data-testid="cypress-table" className="table table-striped">
          <thead>
            <tr>
              <th>No.</th>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                Name
                {/* {sortOrder === "asc" ? <p>Up</p> : <p>Down</p>} */}
              </th>
              <th>Email</th>
              <th>Street</th>
              <th>Suite</th>
              <th>City</th>
              <th>Zipcode</th>
              <th>Preview Photo Gallery</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address.street}</td>
                <td>{user.address.suite}</td>
                <td>{user.address.city}</td>
                <td>{user.address.zipcode}</td>
                <td>
                  <Button
                    data-testid="preview-photo-gallery-button"
                    onClick={() => handlePhotoGallery(user.id, user.name)}
                    variant="primary"
                    size="sm"
                  >
                    Preview Photo Gallery
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination justify-content-end">
            {Array.from(
              { length: Math.ceil(filteredUsers.length / usersPerPage) },
              (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button onClick={() => paginate(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>

        <GalleryPhoto
          Isshow={showPhotoGalleryModal}
          handleClose={() => setShowPhotoGalleryModal(false)}
          userId={selectedUserId || 0}
          userName={selectedUserName || ""}
        />
      </div>
    </main>
  );
}
