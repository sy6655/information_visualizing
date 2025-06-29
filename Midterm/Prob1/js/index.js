// Don't edit code here!

const express = require('express')
const path = require('path')

const app = express()

app.use('/', express.static("./"));

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, "/../index.html"))
})

app.listen(3000, () => {
    console.log('Local server with port 3000 opened!')
})
