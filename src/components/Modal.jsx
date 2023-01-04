import { useEffect } from 'react';

import { RemoveScroll } from 'react-remove-scroll';
import PropTypes from 'prop-types';

export default function Modal({
  onModal: { largeImageURL, tags },
  onCloseModal,
}) {
  useEffect(() => {
    window.addEventListener('keydown', handleCloseModal);

    return () => {
      window.removeEventListener('keydown', handleCloseModal);
    };
  });

  const handleCloseModal = event => {
    if (event.code === 'Escape' || event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  return (
    <RemoveScroll className="Overlay" onClick={handleCloseModal}>
      <div className="Modal">
        <img src={largeImageURL} alt={tags} />
      </div>
    </RemoveScroll>
  );
}

Modal.propTypes = {
  onModal: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
