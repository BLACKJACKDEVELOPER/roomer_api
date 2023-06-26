const express = require('express')
const app = express()
const path = require('path')

// corssite
const CORS = require('cors')

// config

app.use(express.json({ limit:"50mb" }))
app.use(express.urlencoded({ extended:true,limit:"50mb" }))
app.use(CORS())
app.use(express.static(path.join(__dirname,"public")))

module.exports = app