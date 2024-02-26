import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
    res.send(`<p style="
    text-align: center; 
    color: #33333d;
    font-size: 26px;
    font-family:'Lucida Grande';
    height: 100vh;
    margin: 50px auto;
    " >
    API powered by J.R 🚀
    </p>`)
})

export default router;