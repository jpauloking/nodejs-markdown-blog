const path = require('node:path');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const homeRoutes = require('./routes/homeRoutes');
const postRoutes = require('./routes/postRoutes');
const feedbackMiddleware = require('./middlewares/feedbackMiddleware');

const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://127.0.0.1";
const mainLayoutFile = path.join('layouts', 'mainLayout');
const publicDirectory = path.join(__dirname, 'public');

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDirectory));
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('layout', mainLayoutFile);
app.use(feedbackMiddleware);
app.use('/posts', postRoutes);
app.use('/', homeRoutes);

app.listen(PORT, () => {
    console.log(`Server running ${SERVER_URL}:${PORT}`);
});