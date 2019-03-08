import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
  }

  componentDidMount() {
    this.startEstimate();
  }

  // This config could use more experimenting!
  estimate() {
    const {net} = this.props;
    const imageScaleFactor = 0.50;
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
            height={200}
            alt={altText}
            onError={e => {
              /* Renders a 1x1 white pixel */
              e.target.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }}
          />
          <div>
            {keypoints && this.renderKeypoints(keypoints)}
          </div>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {score && <div width="50%">{score.toFixed(2)} overall confidence</div>}
          {error && <div>error! {error.toString()}</div>}
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
    const faceKeypoints = [leftEye, rightEye, leftEar, rightEar, nose];
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
          background: 'blue',
          opacity: 0.5
        }}></div>
        {faceKeypoints.map(keypoint => (
          this.renderDot(keypoint, 2, {
            borderRadius: 4,
            background: 'white'
          })
        ))}
        {this.renderDot(nose, 5, {
          borderRadius: 10,
          background: 'red'
        })}
      </div>
    );
  }

  renderDot(keypoint, radius, style) {
    const {x, y} = keypoint.position;
    const {part} = keypoint;
    return (
      <div key={part} style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        ...style
      }}></div>
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
