import { useState } from 'react';
import PropTypes from 'prop-types';

export default function Searchbar({ onSearch }) {
  const [value, setValue] = useState('');

  const hendleFilter = event => {
    setValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    onSearch(value);
    setValue('');
  };

  return (
    <header className="Searchbar" onSubmit={handleSubmit}>
      <form className="SearchForm">
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          placeholder="Search images and photos"
          onChange={hendleFilter}
          value={value}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
