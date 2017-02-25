'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);

var _ = require('lodash');
var request = require('request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var serveur1 = "https://tchat-salon.herokuapp.com/";
var serveur2 = "https://tchat-salon2.herokuapp.com/";
var maxserv1 = 0;
var maxserv2 = 0;

function load(){
    let serveur;
    if(maxserv1 <30 ){
        serveur = serveur1;
        maxserv1=maxserv1+1;
    }else {
        if(maxserv2<30){
            serveur = serveur2;
            maxserv2=maxserv2+1;
        }
    }
    return serveur;
}

app.post("/salon",function (req,res) {
    let serveur = load();
    if(serveur!=null){
    serveur = serveur+"salon";
    request.post({url:serveur, form: {title:req.body.title}}, function(err,httpResponse,body){
        if(!err){
            res.json(JSON.parse(body));
        }else{
            res.json(404);
        }
    });
    }else{
        res.json(404);
    }



});
app.get("/salon",function (req,res) {
    let serveur = load();
    if(serveur!=null){
        serveur = serveur+"salon";
        console.log(serveur);
        request(serveur, function (error, response, body) {
            res.json(JSON.parse(body));
        });
    }else{
        res.json(404);
    }

});

app.post("/subscribe",function (req,res) {
    let serveur = load();
    if(serveur!=null){
        serveur = serveur+"subscribe";
        request.post({url:serveur, form: {username:req.body.username,salon:req.body.salon}}, function(err,httpResponse,body){
            if(!err){
                res.json(JSON.parse(body));
            }else{
                res.json(404);
            }
        });
    }else{
        res.json(404);
    }


});

app.post("/messages",function (req,res) {
    let serveur = load();
    if(serveur!=null){
        serveur = serveur+"message";
        request.post({url:serveur, form: {username:req.body.username,salon:req.body.salon,message:req.body.message}}, function(err,httpResponse,body){
            if(!err){
                res.json(JSON.parse(body));
            }else{
                res.json(404);
            }
        });
    }else{
        res.json(404);
    }

});

app.get("/messages/:salon",function (req,res) {
    let salon = req.params.salon;
    let serveur = load();
    if(serveur!=null){
        serveur = serveur+"messages/"+salon;
        console.log(serveur);
        request(serveur, function (error, response, body) {
            res.json(JSON.parse(body));
        });
    }else{
        res.json([]);
    }



});


let port = process.env.PORT || 3000;


server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:'+port);
});