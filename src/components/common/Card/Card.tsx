import React, { useState } from "react";
import { Col, Row, Card, Modal, Button } from "react-bootstrap";

interface Photo {
  id: number;
  thumbnailUrl: string;
}

interface PhotoProps {
  photos: Photo[];
}

const CardPhoto: React.FC<PhotoProps> = ({ photos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  const openFullScreen = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeFullScreen = () => {
    setSelectedPhotoIndex(null);
  };

  const navigate = (direction: number) => {
    if (selectedPhotoIndex !== null) {
      const newIndex = selectedPhotoIndex + direction;
      if (newIndex >= 0 && newIndex < photos.length) {
        setSelectedPhotoIndex(newIndex);
      }
    }
  };

  return (
    <Row>
      {photos.map((photo, index) => (
        <Col key={photo.id} md={4} className="mb-3">
          <Card onClick={() => openFullScreen(index)}>
            <Card.Img
              variant="top"
              src={photo.thumbnailUrl}
              alt={`Photo ${index + 1}`}
            />
          </Card>
        </Col>
      ))}

      <Modal
        show={selectedPhotoIndex !== null}
        onHide={closeFullScreen}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Screen Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhotoIndex !== null && (
            <img
              src={photos[selectedPhotoIndex].thumbnailUrl}
              alt={`Full Screen Photo ${selectedPhotoIndex + 1}`}
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => navigate(1)}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default CardPhoto;
