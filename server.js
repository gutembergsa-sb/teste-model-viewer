const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/')));


// For single-page apps, fallback to index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.listen(PORT, () => console.log(`Teste model viwer running at http://localhost:${PORT}`));