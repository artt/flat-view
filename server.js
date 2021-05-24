const express = require('express');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));
const fs = require('fs-extra')
const matter = require('gray-matter');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function getURL(relativePath) {
  parsed = path.parse(relativePath)
  let url = parsed.dir
  let variant = ''
  if (parsed.base.substring(0, 6) !== "index.") {
    url = path.join(url, parsed.name)
  }
  else {
    variant = parsed.name.substring(6)
  }
  return {main: url, variant: variant}
}

app.post('/scan', function (req, res) {
  if (req.body.dir[0] === "~") {
    const homedir = require('os').homedir();
    req.body.dir = path.join(homedir, req.body.dir.substring(1))
  }
  glob(path.join(req.body.dir, '**', '*.md'))
    .then(files => {
      return files.map(file => {
        const relPath = "/" + path.relative(req.body.dir, file)
        return fs.readFile(file)
          .then(data => {
            const m = matter(data)
            tmp = {
              ...m.data,
              body: m.content,
              file: relPath,
              url: getURL(relPath),
            }
            return tmp
          })
      })
    })
    .then(allFiles => Promise.all(allFiles))
    .then(xs => {
      // merge stuff that should be merged (duh)
      let all = {}
      xs.map(x => {
        if (!(x.url.main in all)) {
          all[x.url.main] = {}
        }
        all[x.url.main][x.url.variant || "default"] = x
        delete all[x.url.main][x.url.variant || "default"].url
      })
      res.json(all)
    })

});

app.listen(process.env.PORT || 8080);