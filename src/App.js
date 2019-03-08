import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import * as posenet from '@tensorflow-models/posenet';
import './App.css';
import Spinner from './Spinner';
import Face from './Face';
import youngWhiteGirl from './searches/youngWhiteGirl.json';
import preschoolKidWithGlasses from './searches/preschoolKidWithGlasses.json';
import highSchoolKidWithGlasses from './searches/highSchoolKidWithGlasses.json';
import youngBlackMan from './searches/youngBlackMan.json';
import manWearingTurban from './searches/manWearingTurban.json';
import womanWearingEarrings from './searches/womanWearingEarrings.json';
import toddlerCrying from './searches/toddlerCrying.json';
import teenWearingHeadphones from './searches/teenWearingHeadphones.json';
import blackWomanWearingMakeup from './searches/blackWomanWearingMakeup.json';
import laughingOldMan from './searches/laughingOldMan.json';


export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PoseNet
          loadingEl={renderLoading()}
          whenLoaded={net => <Page net={net} />}
        />
      </header>
    </div>
  );
}

function renderLoading() {
  return (
    <div>
      <div style={{margin: 20}}>Loading PoseNet...</div>
      <Spinner />
    </div>
  );     
}

function Page({net}) {
  const [index, setIndex] = useState(0);

  const sets = [
    blackWomanWearingMakeup,
    preschoolKidWithGlasses,
    youngWhiteGirl,
    manWearingTurban,
    laughingOldMan,
    womanWearingEarrings,
    youngBlackMan,
    highSchoolKidWithGlasses,
    toddlerCrying,
    teenWearingHeadphones
  ];
  const set = sets[index];
  return (
    <div className="App-page">
      <h1 style={{marginBottom: 10}}>What does PoseNet see?</h1>
      <div><small>These are some examples of what it sees on images that come up in searches.</small></div>
      <div><small>To learn more, see <a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.ajlunited.org/gender-shades">ajlunited.org/gender-shades</a></small></div>
      <div className="App-paging">
        <div className="App-page-arrow App-page-left">{index > 0 && (
          <span
            className="App-link"
            onClick={() => setIndex(index - 1)}
            role="img"
            aria-label="left">
            ◄
          </span>
          )}
        </div>
        <div className="App-page-search">
          <Search net={net} set={set} />
        </div>
        <div className="App-page-arrow App-page-right">
          {index < sets.length - 1 && (
            <span
              className="App-link"
              onClick={() => setIndex(index + 1)}
              role="img"
              aria-label="right">
              ►
            </span>
          )}
        </div>
      </div>

      <div style={{margin: 40}}>...or try your own experiments and share!</div>
    </div>
  );
}


// Skip images srcs that are empty strings, take only the first few
function Search({net, set}) {
  const batchSize = 3;
  const [n, setN] = useState(batchSize);
  const {query, source, date, srcs} = set;
  return (
    <div key={query} className="App-search">
      <div><b>"{query}"</b></div>
      <small>from {source} on {date}</small>
      {_.compact(srcs).slice(0, n).map((src, index) => <Face net={net} key={index} src={src} />)}
      <small>
        <div
          className="App-link"
          style={{marginTop: 10}}
          onClick={e => e.preventDefault() || setN(n + batchSize)}>
          see more
        </div>
      </small>
    </div>
  );
}

// Loads posenet and calls `whenLoaded` with it when ready.
function PoseNet({loadingEl, whenLoaded}) {
  const [net, setNet] = useState(null);
  useEffect(() => {
    if (net) return;
    posenet.load().then(loadedNet => {
      setNet(loadedNet);
    });
  }, [net]);

  if (!net) return loadingEl;

  return whenLoaded(net);
}