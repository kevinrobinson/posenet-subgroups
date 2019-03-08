import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import logo from './logo.svg';
import _ from 'lodash';
import * as posenet from '@tensorflow-models/posenet';
import './App.css';
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


export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PoseNet
          loadingEl={renderLoading()}
          whenLoaded={net => renderPage(net)}
        />
      </header>
    </div>
  );
}

function renderLoading() {
  return (
    <div>
      <div>Loading PoseNet...</div>
      <img className="App-logo" alt="waiting..." src={logo} />
    </div>
  );     
}

function renderPage(net) {
  const queryString = qs.parse(window.location.search) || {};
  const offset = queryString.offset || 0;
  const n = queryString.n || 3;

  console.log('renderPage');
  return (
    <div>
      <h1 style={{marginBottom: 10}}>What does PoseNet see?</h1>
      <div><small>These are some examples of what it sees on images that come up in searches.</small></div>
      <div><small>To learn more, see <a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.ajlunited.org/gender-shades">ajlunited.org/gender-shades</a></small></div>
      {renderSearch({offset, n, net, set: youngBlackMan})}
      {renderSearch({offset, n, net, set: youngWhiteGirl})}
      {renderSearch({offset, n, net, set: highSchoolKidWithGlasses})}
      {renderSearch({offset, n, net, set: preschoolKidWithGlasses})}
      {renderSearch({offset, n, net, set: manWearingTurban})}
      {renderSearch({offset, n, net, set: toddlerCrying})}
      {renderSearch({offset, n, net, set: womanWearingEarrings})}
      {renderSearch({offset, n, net, set: teenWearingHeadphones})}
      {renderSearch({offset, n, net, set: blackWomanWearingMakeup})}
      {/*<div style={{margin: 40}}>
        {/*<a className="App-link" href={`/?${qs.stringify({offset: offset + n})}`} style={{margin: 40}}>See more</a>
      </div>*/}
      <div style={{margin: 40}}>...or try your own experiments and share!</div>
    </div>
  );
}


// Skip images srcs that are empty strings, take only the first few
function renderSearch({net, set, offset, n}) {
  const {query, source, date, srcs} = set;
  return (
    <div key={query} className="App-search">
      <div><b>"{query}"</b></div>
      <small>from {source} on {date}</small>
      {_.compact(srcs).slice(offset, offset + n).map((src, index) => <Face net={net} key={index} src={src} />)}
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