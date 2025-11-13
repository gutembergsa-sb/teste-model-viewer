const express = require('express');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '/')));

// For single-page apps, fallback to index.html
app.get(/.*/, cors(), (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.listen(PORT, () => console.log(`Teste model viwer running at http://localhost:${PORT}`));