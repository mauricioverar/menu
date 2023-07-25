import app from "./app.js" // import en ES6, require en ES5
import { PORT } from "./config.js"

app.listen(PORT)
console.log(`Server on port http://localhost:${PORT}`)

// npm run dev
