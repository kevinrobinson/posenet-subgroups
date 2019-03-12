import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import './YourOwnSearch.css';


export default function YourOwnSearch({renderImage}) {
  const batchSize = 3;
  const [inputText, setInputText] = useState('');
  const [query, setQuery] = useState('');
  const [n, setN] = useState(batchSize);
  const apiKey = readApiKey();

  return (
    <div className="YourOwnSearch">
      <div>
        <input
          className="YourOwnSearch-text"
          onKeyPress={e => (e.key === 'Enter') && setQuery(inputText)}
          onChange={e => setInputText(e.target.value)}
          type="text"
          value={inputText} />
        <button
          className="YourOwnSearch-button"
          onClick={e => setQuery(inputText)}>Search</button>
      </div>
      {query !== '' && (
        <ImageSearch
          query={query}
          apiKey={apiKey}
          n={n}
          loadingEl={<Spinner />}
          renderImagesJson={({json, n}) => (
            <Image
              renderImage={renderImage}
              json={json} 
              seeMore={() => setN(n + batchSize)}
              n={n}
            />
            )}
          renderImagesError={error => (
            <div>error: {JSON.stringify(error, null, 2)}</div>
          )}
        />
      )}
    </div>
  );
}

  
function ImageSearch(props = {}) {
  const {apiKey, query, n, renderImagesError, renderImagesJson, loadingEl} = props;
  const [json, setJson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages({apiKey, query})
      .then(response => response.json())
      .then(setJson)
      .catch(setError);
  }, [query, apiKey]);

  if (error) return renderImagesError(error);
  if (json) return renderImagesJson({json, n});

  return loadingEl;
}


function fetchImages({apiKey, query}) {
  if (query === '') return Promise.resolve(null);

  const domain = readDomain();
  const headers = {'X-Services-Edu-Api-Key': apiKey};
  const url = `${domain}/images/search?q=${encodeURIComponent(query)}`;
  return fetch(url, {headers});
}


function Image({renderImage, n, seeMore, json}) {
  return (
    <div className="YourOwnSearch-images">
      {(json.items || []).slice(0, n).map(item => (
        <div key={item.link}>{renderImage(item.image.thumbnailLink)}</div>
      ))}
      <small>
        <div
          className="App-link"
          style={{marginTop: 10}}
          onClick={e => e.preventDefault() || seeMore()}>
          see more
        </div>
      </small>
    </div>
  );
}


function readApiKey() {
  return process.env.REACT_APP_SERVICES_EDU_API_KEY || 'abc';
}


function readDomain() {
  return process.env.REACT_APP_SERVICES_EDU_DOMAIN || 'http://localhost:5000';
}
