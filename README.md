# node-selectel-manager

The library provides API for some Selectel storage options.
Supported functions:

- Get container files;
- Delete file;
- Upload file;
- Create container;

### Installation

```
npm install node-selectel-manager
```

### Usage

```js
const fs = require('fs');
const manager = require('./index')({
	login: 'xxx',
	password: 'xxx'
});

const file = fs.readFileSync('/home/user/Downloads/archive.tar.gz');

manager
	.createContainer('test', {'X-Container-Meta-Type': 'public'})
	.then(() => {
		return manager.uploadFile(file, 'test/sub-folder/', 'tar.gz');
	})
	.then(() => {
		return manager.clearCache(['http://xxx.selcdn.com/test/cached-file.jpg']);
	})
	.then(() => {
		return manager.getContainerFiles('test');
	})
	.then(res => console.log(res.body, res.headers)).catch(console.log)

```

### License

MIT
