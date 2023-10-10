import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const API_KEY = 'live_2uLhYZi6Kg6tExPc3t6t6aIMlmZNwGvK8zXSwv9XgRehrpGNn5iqWyBfHIjumuvG';
  const BASE_URL = 'https://api.thedogapi.com/v1/images/search';
  
  const [data, setData] = useState([]);
  const [banList, setBanList] = useState([]);

  const fetchData = async () => {
    const URL = `${BASE_URL}?has_breeds=1&api_key=${API_KEY}`;
    const response = await axios.get(URL);
    const filteredData = response.data.filter((item) => {
      return (
        !banList.some((banned) => banned.type === 'Breed' && banned.value === item.breeds[0].name) &&
        !banList.some((banned) => banned.type === 'Lifespan' && banned.value === item.breeds[0].life_span) &&
        !banList.some((banned) => banned.type === 'Temperament' && banned.value === item.breeds[0].temperament)
      );
    });
    setData(filteredData);
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
  }, [data]);

  const handleButtonClick = () => {
    fetchData();
  };

  const handleBan = (type, value) => {
    setBanList([...banList, { type, value }]);
    fetchData();
  };

  const handleUnban = (type, value) => {
    setBanList(banList.filter((item) => !(item.type === type && item.value === value)));
    fetchData();
  };

  const isBanned = (type, value) => {
    return banList.some((item) => item.type === type && item.value === value);
  };

  const lastDisplayedItem = data.length > 0 ? data[0] : null;

  return (
    <div className='App'>
      <div className="image-container">
        {lastDisplayedItem && (
          <>
            <h2>Breed: {lastDisplayedItem.breeds[0].name}</h2>
            <p>Lifespan: {lastDisplayedItem.breeds[0].life_span}</p>
            <p>Temperament: {lastDisplayedItem.breeds[0].temperament}</p>
            <img
              src={lastDisplayedItem.url}
              alt='Dog Image'
              style={{
                width: "auto",
                height: 300,
              }}
            />
          </>
        )}
      </div>
      
      <div className="button-container">
        <button onClick={handleButtonClick}>Click for random dog</button>
      </div>

      {lastDisplayedItem && (
        <div className="button-container">
          <button
            onClick={() =>
              handleBan('Breed', lastDisplayedItem.breeds[0].name)
            }
            disabled={isBanned('Breed', lastDisplayedItem.breeds[0].name)}
          >
            Ban Breed
          </button>
          <button
            onClick={() =>
              handleBan('Lifespan', lastDisplayedItem.breeds[0].life_span)
            }
            disabled={isBanned('Lifespan', lastDisplayedItem.breeds[0].life_span)}
          >
            Ban Lifespan
          </button>
          <button
            onClick={() =>
              handleBan('Temperament', lastDisplayedItem.breeds[0].temperament)
            }
            disabled={isBanned('Temperament', lastDisplayedItem.breeds[0].temperament)}
          >
            Ban Temperament
          </button>
        </div>
      )}

      <div>
        <h3>Ban List:</h3>
        <ul>
          {banList.map((item, index) => (
            <li
              key={index}
              onClick={() => handleUnban(item.type, item.value)}
              className="ban-list-item"
            >
              {item.type}: {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
