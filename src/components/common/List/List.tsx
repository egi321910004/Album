import React from "react";
import { ListGroup } from "react-bootstrap";
import "./List.css";

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

interface AlbumProps {
  albums: Album[];
  setSelectedAlbum: (album: Album) => void;
  selectedAlbumId: number | null;
}

const ListAlbum: React.FC<AlbumProps> = ({
  albums,
  setSelectedAlbum,
  selectedAlbumId,
}) => {
  return (
    <ListGroup>
      {albums.map((album) => (
        <ListGroup.Item
          key={album.id}
          className={`album-list-item ${
            selectedAlbumId === album.id ? "active" : ""
          }`}
          onClick={() => setSelectedAlbum(album)}
          action
        >
          {album.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ListAlbum;
