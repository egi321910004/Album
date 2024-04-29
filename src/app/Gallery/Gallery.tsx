"use client";
import { ListGroup, Row, Col, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/utils/apiConfig";
import ListAlbum from "@/components/common/List/List";
import CardPhoto from "@/components/common/Card/Card";

interface PhotoGalleryModalProps {
  Isshow: boolean;
  handleClose: () => void;
  userId: number;
  userName: string;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  id: number;
  thumbnailUrl: string;
}

interface AlbumProps {
  albums: Album[];
  setSelectedAlbum: (album: Album) => void;
  selectedAlbumId: number | null;
}

const GalleryPhoto: React.FC<PhotoGalleryModalProps> = ({
  Isshow,
  handleClose,
  userId,
  userName,
}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredAlbum, setFilteredAlbum] = useState<Album[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const photosPerPage = 9;
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/albums?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
          if (data.length > 0) {
            setSelectedAlbum(data[0]);
          }
        } else {
          console.error("Failed to fetch albums");
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    if (Isshow) {
      fetchAlbums();
    }
  }, [Isshow, userId]);

  useEffect(() => {
    if (selectedAlbum) {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/photos?albumId=${selectedAlbum.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setPhotos(data);
          } else {
            console.error("Failed to fetch photos");
          }
        } catch (error) {
          console.error("Error fetching photos:", error);
        }
      };

      fetchPhotos();
    }
  }, [selectedAlbum]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredData = albums.filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbum(filteredData);
  }, [albums, searchTerm]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  return (
    <Modal show={Isshow} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{userName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3" style={{ width: "250px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search Album"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Row>
          <Col sm={4}>
            <h4>Album List</h4>
            <ListAlbum
              albums={filteredAlbum}
              setSelectedAlbum={setSelectedAlbum}
              selectedAlbumId={selectedAlbum?.id || null}
            />
          </Col>

          <Col sm={8} className="photo-gallery-container">
            {selectedAlbum && (
              <>
                <div className="row">
                  <h4>All Photos</h4>
                  {/* Photo component called here */}
                  <CardPhoto photos={currentPhotos} />
                </div>

                <div className="d-flex justify-content-between pagination-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={indexOfLastPhoto >= photos.length}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GalleryPhoto;
