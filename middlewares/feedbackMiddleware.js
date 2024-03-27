module.exports = (req, res, next)=>{
    res.locals.message = null;
    res.locals.error = null;
    next();
}