import express from "express"
import bodyParser from "body-parser"
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js"

// Init the Express application
const app = express()

// Set the network port
const port = process.env.PORT || 8082

// Use the body parser middleware for post requests
app.use(bodyParser.json())

app.get("/filteredimage", async (req, res) => {
  try {
    const imageUrl = req.query.image_url
    if (imageUrl.endsWith("jpg") || imageUrl.endsWith("jpeg") || imageUrl.endsWith("png") || imageUrl.endsWith("tiff")) {
      const img = await filterImageFromURL(imageUrl)
      res.sendFile(img, undefined, (err) => {
        deleteLocalFiles([img])
      })
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    res.sendStatus(422)
  }
})

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
})

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`)
  console.log(`press CTRL+C to stop server`)
})
