//  This is the client side js entry file to be browserified

// old jquery stuff
require('./user-admin.js')();

// stuff below is gradually being converted into react applets
// for now page.js is being used to provide a bit of a router 
var page = require('page');
var React = require('react');
var ReactDOM = require('react-dom');

page.base(baseUrl);

var ConnectionAdmin = require('./ConnectionAdmin.js');
page('/connections', getConfig, function (ctx) {
    ReactDOM.render(
        <ConnectionAdmin 
            config={ctx.config}/
            >,
        document.getElementById('react-applet')
    );
})

var ConfigValues = require('./ConfigValues.js');
page('/config-values', function (ctx) {
    ReactDOM.render(
        <ConfigValues/>,
        document.getElementById('react-applet')
    );
});

var FilterableQueryList = require('./FilterableQueryList.js');
page('/queries', getConfig, getCurrentUser, function (ctx) {
    ReactDOM.render(
        <FilterableQueryList
            config={ctx.config}
            currentUser={ctx.currentUser}
            users={ctx.users}
            />,
        document.getElementById('react-applet')
    )
})

var QueryEditor = require('./QueryEditor.js');
page('/queries/:queryId', getConfig, getTags, function (ctx) {
    ReactDOM.render(
        <QueryEditor 
            queryId={ctx.params.queryId}
            availableTags={ctx.tags} 
            config={ctx.config}/>,
        document.getElementById('react-applet')
    )
})

var QueryTableOnly = require('./QueryTableOnly.js');
page('/query-table/:queryId', getConfig, function (ctx) {
    ReactDOM.render(
        <QueryTableOnly queryId={ctx.params.queryId} />,
        document.getElementById('react-applet')
    )
});

var QueryChartOnly = require('./QueryChartOnly.js');
page('/query-chart/:queryId', getConfig, function (ctx) {
    ReactDOM.render(
        <QueryChartOnly queryId={ctx.params.queryId} />,
        document.getElementById('react-applet')
    )
});

// init page router
page({click: false});


// client-side middleware
function getUsers (ctx, next) {
    fetch(baseUrl + "/api/users", {credentials: 'same-origin'})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            ctx.users = json.users;
        })
        .catch(function (ex) {
            console.error(ex.toString());
        })
        .then(() => {
            next();   
        })
}

function getConfig (ctx, next) {
    fetch(baseUrl + "/api/config", {credentials: 'same-origin'})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            ctx.config = json.config;
        })
        .catch(function (ex) {
            console.error(ex.toString());
        })
        .then(() => {
            next();
        })
}

function getCurrentUser (ctx, next) {
    fetch(baseUrl + "/api/users/current", {credentials: 'same-origin'})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            ctx.currentUser = json.user;
        })
        .catch(function (ex) {
            console.error(ex.toString());
        })
        .then(() => {
            next();   
        })
}

function getTags (ctx, next) {
    fetch(baseUrl + "/api/tags", {credentials: 'same-origin'})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            ctx.tags = json.tags;
        })
        .catch(function (ex) {
            console.error(ex.toString());
        })
        .then(() => {
            next();
        })
}