const express = require('express');
const users = require('../inc/users');
const admin = require('../inc/admin');
const menus = require('../inc/menus');
const reservations = require('../inc/reservations');
const contacts = require('../inc/contacts');
const emails = require('../inc/emails');
const moment = require('moment');
const router = express.Router();

module.exports = function(io){

    moment.locale('pt-BR');

    router.use(function(req, res, next){
        if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect("/admin/login"); 
        } else {
            next();
        }
    });

    router.use(function(req, res, next){
        req.menus = admin.getMenus(req);
        next()
    });

    router.get("/logout", function(req, res, next){
        delete req.session.user;
        res.redirect("/admin/login");
    });

    router.get("/", async function(req, res, next){
        try{
            const data = await admin.dashboard();
            res.render("admin/index", admin.getParams(req, {
                data
            }));
        }catch(err) {
            console.error(err);
        }
    });

    router.get("/dashboard", async function(req, res, next){
        try{
            const results = await reservations.dashboard();
            res.json({
                success: true,
                data: results
            });
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.post("/login", async function(req, res, next){      
        if(!req.body.email){
            users.render(req, res, "Preencha o E-mail!");
        } else if (!req.body.password){
            users.render(req, res, "Preencha a senha!");
        } else {
            try{ 
                const user = await users.login(req.body.email, req.body.password);
                    req.session.user = user;
                    res.redirect("/admin");
            } catch(err) {
                users.render(req, res, err.message);
            };
        }
    });

    router.get("/login", function(req, res, next){
        users.render(req, res, null);
    });

    router.get("/contacts", async function(req, res, next){
        try{
            const data = await contacts.getContacts();
            res.render("admin/contacts", admin.getParams(req, {
                data
            }));
        } catch(err){
            console.error(err);
        }
    });

    router.delete("/contacts/:id", async function(req, res, next){
        try{
            const results = await contacts.delete(req.params.id);
            res.json({
                success: true,
                data: results
            })
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.get("/emails", async function(req, res, next){
        try{
            const data = await emails.getEmails()
            res.render("admin/emails", admin.getParams(req, {
                data
            }));
        } catch(err){
            console.error(err);
        }
    });

    router.delete("/emails/:id", async function(req, res, next){
        try{
            const results = await emails.delete(req.params.id);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.get("/menus", async function(req, res, next){
        try{
           const data = await menus.getMenus();
            res.render("admin/menus", admin.getParams(req, {
                data
            }));
        } catch(err){
            console.error(err);
        }
    });

    router.post("/menus", async function(req, res, next){
        try{
            const results = await menus.save(req.fields, req.files);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.delete("/menus/:id", async function(req, res, next){
        try{
            const results = await menus.delete(req.params.id);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.get("/reservations", async function(req, res, next){
        try{
            const start = (req.query.start) ? req.query.start: moment().subtract(10, "years").format("YYYY-MM-DD");
            const end = (req.query.end) ? req.query.end: moment().format("YYYY-MM-DD");
            const pag = await reservations.getReservations(req);
            res.render("admin/reservations", admin.getParams(req, {
                date: {
                    start,
                    end
                },
                data: pag.data,
                moment,
                links: pag.links
            }));
        } catch(err){
            console.error(err);
        }
    });

    router.get("/reservations/charts", async function(req, res, next){
        
        req.query.start = (req.query.start) ? req.query.start: moment().subtract(10, "years").format("YYYY-MM-DD");
        req.query.end = (req.query.end) ? req.query.end: moment().format("YYYY-MM-DD");
        try{
            const chartData = await reservations.chart(req);
            res.json({
                success: true,
                data: chartData
            });
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.post("/reservations", async function(req, res, next){
        try{
            const results = await reservations.save(req.fields);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.delete("/reservations/:id", async function(req, res, next){
        try{
            const results = await reservations.delete(req.params.id);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.get("/users", async function(req, res, next){
        try{
            const data = await users.getUsers();
            res.render("admin/users", admin.getParams(req, {
                data
            }));
        } catch(err){
            console.error(err);
        }
    });

    router.post("/users", async function(req, res, next){
        try{
            const results = await users.save(req.fields);
            res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.post("/users/password-change", async function(req, res, next){
        try{
            const results = await users.ChangePassword(req);
            res.json({
                success: true,
                data: results
            });
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    router.delete("/users/:id", async function(req, res, next){
        try{
            const results = await users.delete(req.params.id);
             res.json({
                success: true,
                data: results
            });
            io.emit('dashboard update');
        } catch(err) {
            res.status(400).json({
                success: false,
                error: err.message 
            });
        }
    });

    return router;
};