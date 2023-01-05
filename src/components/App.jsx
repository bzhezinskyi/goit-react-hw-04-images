import { useState, useEffect } from 'react';

import { getPixabay } from 'services/pixabay.service';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import { STATUS } from 'constants/status.constants';
import Loader from './Loader';
import Button from './Button';
import Modal from './Modal';

export default function App() {
  const [modal, setModal] = useState(null);
  const [pixabay, setPixabay] = useState([]);
  const [status, setStatus] = useState(STATUS.idle); // 'idle', 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [firstSearch, setFirstSearch] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (firstSearch) {
      return;
    }
    const createPixabay = async () => {
      setLoading(true);

      try {
        const data = await getPixabay({
          page,
          q: search,
        });
        const newData = data.hits.map(el => ({
          id: el.id,
          largeImageURL: el.largeImageURL,
          webformatURL: el.webformatURL,
          tags: el.tags,
        }));

        if (data.totalHits === data.hits.length) {
          setLoadMore(false);
        } else {
          setLoadMore(true);
        }

        if (newData.length !== 0) {
          setPixabay(prevPixabay => [...prevPixabay, ...newData]);
          setStatus(STATUS.success);
        } else {
          setErrorMessage('Ooops!!! Non-existent value: ' + search);
          setStatus(STATUS.error);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setStatus(STATUS.error);
      } finally {
        setLoading(false);
      }
    };
    createPixabay();
  }, [page, search, firstSearch]);

  const handleSearch = message => {
    if (message === search) {
      return;
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setSearch(message);
    setStatus(STATUS.idle);
    setPage(1);
    setPixabay([]);
    setFirstSearch(false);
  };

  const handleLoadeMore = () => {
    setPage(page + 1);
  };

  const handleOpenModal = (largeImageURL, tags) => {
    setModal({ largeImageURL, tags });
  };

  const handleCloseModal = () => {
    setModal(null);
  };

  return (
    <div className="App">
      <Searchbar onSearch={handleSearch} />

      {status === STATUS.error && <h2>{errorMessage}</h2>}
      {status === STATUS.success && (
        <>
          <ImageGallery GalleryList={pixabay} handleClick={handleOpenModal} />
          {!loading && loadMore && <Button onClick={handleLoadeMore} />}
          {!loading && !loadMore && <h2>The End</h2>}
        </>
      )}
      {loading && <Loader />}
      {modal && <Modal onModal={modal} onCloseModal={handleCloseModal} />}
    </div>
  );
}
