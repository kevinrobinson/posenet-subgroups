# posenet-subgroups
experimenting with posenet on images of different subgroups


## Demo
https://posenet-subgroups.herokuapp.com/

### Browse through
<img src="docs/a.jpg" alt="a" width="20%" height="auto" /><img src="docs/b.jpg" alt="b" width="20%" height="auto" /><img src="docs/c.jpg" alt="c" width="20%" height="auto" /><img src="docs/d.jpg" alt="d" width="20%" height="auto" />

### Try your own
<img src="docs/ira.jpg" alt="ira" width="20%" height="auto" /><img src="docs/joy.jpg" alt="joy" width="20%" height="auto" /><img src="docs/babies.jpg" alt="babies" width="20%" height="auto" /><img src="docs/puppies.jpg" alt="puppies" width="20%" height="auto" />

### Learn more
<img src="docs/label.jpg" alt="label" width="20%" height="auto" />
<img src="docs/learn-more.jpg" alt="learn-more" width="20%" height="auto" />


![one](docs/a.png)
![two](docs/b.png)
![three](docs/c.png)


### New data sets
On Google Images, this grabs images from the console:
```
JSON.stringify({srcs: [].slice.call(document.querySelectorAll('.rg_ic')).map(el => el.src)})
```

### Development
`$ npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).