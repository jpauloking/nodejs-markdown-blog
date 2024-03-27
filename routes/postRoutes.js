const express = require('express');
const slugify = require('slugify');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { PrismaClient } = require('@prisma/client');
const { marked } = require('marked');

const router = express.Router();
const prisma = new PrismaClient();
const DOMPurify = createDOMPurify(new JSDOM().window);

router.delete('/delete/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const deletedPost = await prisma.post.delete({
            where: { id }
        });
        res.locals.message = `Delete post with id = ${deletedPost.id}`;
        res.redirect(`/posts/`);
    } catch (error) {
        res.locals.error = error.message;
        res.redirect(`/posts/delete/${id}`);
    }
});

router.get('/', async (req, res, next) => {
    const data = {};
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        data.posts = posts;
    } catch (error) {
        res.locals.error = error.message;
        data.posts = null;
    }
    res.render('pages/posts/post_list_view', data);
});

router.get('/create', (req, res, next) => {
    const data = {};
    data.post = {};
    res.render('pages/posts/post_create_view', data);
});

router.get('/details/:slug', async (req, res, next) => {
    const { slug } = req.params;
    const data = {};
    try {
        const post = await prisma.post.findFirstOrThrow({
            where: { slug }
        });
        data.post = post;
    } catch (error) {
        res.locals.error = error.message;
        data.post = {};
    }
    res.render('pages/posts/post_details_view', data);
});

router.get('/delete/:slug', async (req, res, next) => {
    const { slug } = req.params;
    const data = {};
    try {
        const post = await prisma.post.findFirstOrThrow({
            where: { slug }
        });
        data.post = post;
    } catch (error) {
        res.locals.error = error.message;
        data.post = {};
    }
    res.render('pages/posts/post_delete_view', data);
});

router.get('/edit/:slug', async (req, res, next) => {
    const { slug } = req.params;
    const data = {};
    try {
        const post = await prisma.post.findFirstOrThrow({
            where: { slug }
        });
        data.post = post;
    } catch (error) {
        res.locals.error = error.message;
        data.post = {};
    }
    res.render('pages/posts/post_edit_view', data);
});

router.post('/create', async (req, res, next) => {
    const { title, body } = req.body;
    const HTMLBody = marked(body);
    const sanitizedHTMLBody = DOMPurify.sanitize(HTMLBody);
    const data = {};
    try {
        const slug = slugify(title, { lower: true, strict: true });
        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                body,
                HTMLBody: sanitizedHTMLBody
            }
        });
        return res.redirect(`/posts/details/${newPost.slug}`);
    } catch (error) {
        res.locals.error = error.message;
        data.post = {
            title,
            slug,
            body
        }
        return res.render('pages/posts/post_create_view', data);
    }
});

router.patch('/edit/:id', async (req, res, next) => {
    const { id, slug, title, body } = req.body;
    const HTMLBody = marked(body);
    const sanitizedHTMLBody = DOMPurify.sanitize(HTMLBody);
    const data = {};
    try {
        const newPost = await prisma.post.update({
            data: {
                title,
                body,
                HTMLBody: sanitizedHTMLBody
            },
            where: { id: parseInt(id), slug }
        });
        return res.redirect(`/posts/details/${newPost.slug}`);
    } catch (error) {
        res.locals.error = error.message;
        data.post = {
            title,
            slug,
            body
        }
        return res.render('pages/posts/post_create_view', data);
    }
});


module.exports = router;