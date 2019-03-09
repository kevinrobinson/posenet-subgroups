import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Spinner from './Spinner';
import './Face.css';


// Show an image of a face, and run PoseNet estimate on it and draw an overlay.
export default class Face extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busy: false,
      score: null,
      error: null,
      keypoints: null,
    };
    this.imageEl = null;

    this.estimate = this.estimate.bind(this);
    this.startEstimate = this.startEstimate.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
  }

  // This config could use more experimenting!
  estimate() {
    const {net} = this.props;
    const imageScaleFactor = 1;
    const flipHorizontal = false;
    const outputStride = 16;
    return net.estimateSinglePose(this.imageEl, imageScaleFactor, flipHorizontal, outputStride);
  }

  startEstimate() {
    this.setState({busy: true});
    this.estimate()
      .then(({score, keypoints}) => this.setState({score, keypoints, busy: false}))
      .catch(error => this.setState({error}));
  }

  // Delay and jitter in loading, since there's a lot at once.
  onImageLoaded() {
    setTimeout(this.startEstimate, 200 + (Math.random() * 1000));
  }

  render() {
    const {keypoints, score, error} = this.state;
    const {src, alt} = this.props;
    const altText = alt || 'face';

    return (
      <div
        className="Face">
        <div className="Face-container">
          <img
            ref={el => this.imageEl = el}
            className="Face-image"
            src={src}
            alt={altText}
            onLoad={this.onImageLoaded}
            onError={e => {
              /* Renders a 1x1 white pixel */
              e.target.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }}
          />
          <div>
            {keypoints && this.renderKeypoints(keypoints)}
          </div>
        </div>
        <div className="Face-space">
          {!score ? <Spinner /> : (
            <div className="Face-text">
              <div>
                <div style={{marginBottom: 5}}>{<b>{score.toFixed(2)}</b>}</div>
                <div style={{fontSize: 20, marginBottom: 20}}>confidence overall</div>
                <div style={{fontSize: 14}}>{scoreFor(keypoints, 'nose', 'nose')}</div>
                <div style={{fontSize: 14}}>{scoreFor(keypoints, 'leftEye', 'left eye')}</div>
                <div style={{fontSize: 14}}>{scoreFor(keypoints, 'rightEye', 'right eye')}</div>
                <div style={{fontSize: 14}}>{scoreFor(keypoints, 'leftEar', 'left ear')}</div>
                <div style={{fontSize: 14}}>{scoreFor(keypoints, 'rightEar', 'right ear')}</div>
              </div>
              {error && <div>error! {error.toString()}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderKeypoints(keypoints) {
    const leftEye = _.find(keypoints, { part: 'leftEye' });
    const rightEye = _.find(keypoints, { part: 'rightEye' });
    const leftEar = _.find(keypoints, { part: 'leftEar' });
    const rightEar = _.find(keypoints, { part: 'rightEar' });
    const nose = _.find(keypoints, { part: 'nose' });
    const {left, right, bottom, top} = faceBox(keypoints);

    return (
      <div>
        <div style={{
          position: 'absolute',
          left,
          top,
          width: (right - left),
          height: (bottom - top),
          borderRadius: 2,
          // background: 'blue',
          opacity: 0.0
        }}></div>
        {this.renderDot(nose, 4, {
          background: 'red'
        })}
        {[leftEye, rightEye].map(keypoint => (
          this.renderDot(keypoint, 3, {
            background: 'white'
          })
        ))}
        {[leftEar, rightEar].map(keypoint => (
          this.renderDot(keypoint, 2, {
            background: 'blue'
          })
        ))}
      </div>
    );
  }

  renderDot(keypoint, radius, style) {
    const {x, y} = keypoint.position;
    const {part} = keypoint;
    const glowRadius = radius*2.0;
    return (
      <div key={part}>
        <div style={{
          position: 'absolute',
          left: x - glowRadius,
          top: y - glowRadius,
          width: glowRadius * 2,
          height: glowRadius * 2,
          borderRadius: glowRadius * 2,
          opacity: 0.5,
          ...style
        }}></div>
        <div style={{
          position: 'absolute',
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius * 2,
          ...style
        }}></div>
      </div>
    );
  }
}
Face.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string
};


function faceBox(keypoints) {
  const leftEye = _.find(keypoints, { part: 'leftEye' });
  const rightEye = _.find(keypoints, { part: 'rightEye' });
  const leftEar = _.find(keypoints, { part: 'leftEar' });
  const rightEar = _.find(keypoints, { part: 'rightEar' });
  const nose = _.find(keypoints, { part: 'nose' });
  const faceKeypoints = [leftEye, rightEye, leftEar, rightEar, nose];
  const left = _.min(faceKeypoints.map(keypoint => keypoint.position.x));
  const right = _.max(faceKeypoints.map(keypoint => keypoint.position.x));
  const top = _.min(faceKeypoints.map(keypoint => keypoint.position.y));
  const bottom = _.max(faceKeypoints.map(keypoint => keypoint.position.y));
  return {left, right, bottom, top};
}


function scoreFor(keypoints, part, text) {
  if (!keypoints) return null;
  const {score} = _.find(keypoints, {part});
  if (!score) return null;
  return (
    <span style={{opacity: score}}>
      <span>{score.toFixed(2)}</span>
      <span> {text}</span>
    </span>
  );
}