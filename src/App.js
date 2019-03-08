import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import _ from 'lodash';
import * as posenet from '@tensorflow-models/posenet';
import './App.css';
import Face from './Face';
import youngWhiteGirl from './searches/youngWhiteGirl.json';
import preschoolKidWithGlasses from './searches/preschoolKidWithGlasses.json';
import highSchoolKidWithGlasses from './searches/highSchoolKidWithGlasses.json';
import youngBlackMan from './searches/youngBlackMan.json';

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
  return (
    <div>
      <h1 style={{marginBottom: 10}}>What does PoseNet see?</h1>
      <small>These are some examples of what it sees on images that come up in searches.</small>
      <small>To learn more, see <a className="App-link" href="https://www.ajlunited.org/gender-shades">ajlunited.org/gender-shades</a></small>
      {renderSearch(net, youngBlackMan)}
      {renderSearch(net, youngWhiteGirl)}
      {renderSearch(net, highSchoolKidWithGlasses)}
      {renderSearch(net, preschoolKidWithGlasses)}
      <div style={{margin: 40}}>Try your own experiments!</div>
    </div>
  );
}


// Skip images srcs that are empty strings, take only the first few
function renderSearch(net, search) {
  const {query, source, date, srcs} = search;
  return (
    <div key={query} className="App-search">
      <div><b>"{query}"</b></div>
      <small>from {source} on {date}</small>
      {_.compact(srcs).slice(0, 5).map((src, index) => <Face net={net} key={index} src={src} />)}
    </div>
  );
}

// Loads posenet and calls `whenLoaded` with it when ready.
function PoseNet({loadingEl, whenLoaded}) {
  const [net, setNet] = useState(null);
  useEffect(() => {
    console.log('useEffect');
    if (net) return;
    console.log('load()');
    posenet.load().then(loadedNet => {
      console.log('loaded');
      setNet(loadedNet);
    });
  }, [net]);

  if (!net) return loadingEl;
  return whenLoaded(net);
}