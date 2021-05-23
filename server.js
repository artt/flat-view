const express = require('express');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));
const fs = require('fs-extra')
const matter = require('gray-matter');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/scan', function (req, res) {
  glob(path.join(req.body.dir, '**', '*.md'))
    .then(files => {
      return files.map(file =>
        fs.readFile(file)
          .then(data => {
            let tmp = matter(data)
            tmp.file = path.relative(req.body.dir, file)
            return tmp
          })
      )
    })
    .then(allFiles => Promise.all(allFiles))
    .then(x => {
      console.log('++', x)
      res.json(x)
    })

});

app.listen(process.env.PORT || 8080);