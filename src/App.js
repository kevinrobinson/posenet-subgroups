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
  // different searches
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
  const [index, setIndex] = useState(Math.floor(Math.random()*sets.length));
  const set = sets[index];
  const {query, source, date} = set;

  // paging
  const batchSize = 3;
  const [n, setN] = useState(batchSize);

  return (
    <div className="App-page">
      <h1 style={{marginBottom: 10}}>What does PoseNet see?</h1>
      <div><small>These are some examples of what it sees in images that come up from different searches.</small></div>
      <div className="App-paging">
        <div className="App-page-arrow App-page-left">
          <span
            className="App-link"
            onClick={() => {
              setN(batchSize);
              setIndex(index < 0 ? sets.length - 1 : index - 1);
            }}
            role="img"
            aria-label="left">
            ◄
          </span>
        </div>
        <div className="App-page-search">
          <div><b>"{query}"</b></div>
          <small>from {source} on {date}</small>
        </div>
        <div className="App-page-arrow App-page-right">
          <span
            className="App-link"
            onClick={() => {
              setN(batchSize);
              setIndex(index >= sets.length ? 0 : index + 1);
            }}
            role="img"
            aria-label="right">
            ►
          </span>
        </div>
      </div>

      <Search
        net={net}
        set={set}
        n={n}
        onMore={() => setN(n + batchSize)}
      />

      <div className="App-learn-more">
        <div className="App-learn-more-panel">
          <div className="App-learn-more-title">More about PoseNet</div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://github.com/tensorflow/tfjs-models/tree/master/posenet">@tensorflow-models/posenet</a></div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5">Real-time Human Pose Estimation in the Browser with TensorFlow.js</a></div>
        </div>
        <div className="App-learn-more-panel">
          <div className="App-learn-more-title">More about ethics in facial recognition systems</div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.ajlunited.org/">Algorithmic Justice League</a></div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.notflawless.ai/">AI, Ain't I A Woman?</a></div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="http://gendershades.org/">Gender Shades</a></div>
        </div>
        <div className="App-learn-more-panel">
          <div className="App-learn-more-title">More about building ethical AI</div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="http://designjusticenetwork.org/network-principles/">Design Justice Network Principles</a>,</div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.research.ibm.com/artificial-intelligence/trusted-ai/diversity-in-faces/">Diversity in Faces Dataset</a></div>
          <div className="App-learn-more-item"><a className="App-link" target="_blank" rel="noopener noreferrer" href="https://www.safefacepledge.org/">Safe Face Pledge</a></div>
        </div>
        <div className="App-learn-more-panel">
          <div className="App-try-your-own">...or make <a className="App-link" target="_blank" rel="noopener noreferrer" href="https://github.com/kevinrobinson/posenet-subgroups">your own experiments</a> and share!</div>
        </div>
      </div>
    </div>
  );
}


// Skip images srcs that are empty strings, take only the first few
function Search({net, set, n, onMore}) {
  const {query, source, date, srcs} = set;
  return (
    <div key={query} className="App-search">
      {_.compact(srcs).slice(0, n).map((src, index) => <Face net={net} key={index} src={src} />)}
      <small>
        <div
          className="App-link"
          style={{marginTop: 10}}
          onClick={e => e.preventDefault() || onMore()}>
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