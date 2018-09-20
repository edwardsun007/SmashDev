const smashControl = require('../controllers/smashControl.js');


/* note (app)  means that in the file you import this, you need to require('route.js')(app) 
got it? */
module.exports = function(app){
    // get for read
    // this is the first part in those routes,  get('route', functionFromControl)
    /* form submit to here , we need to validate and show error if there is, if not save to db */

    //team urls
    app.get('/api/teams',smashControl.findAllTeams)            // return full list of teams, or errors
    app.get('/api/teams/:teamURL',smashControl.findOneTeam)    // return object for one specific team , return error or success
    app.post('/api/teams/:teamURL/login',smashControl.loginTeam)  //find the team via TeamURL and then find persona by email, then authenticate password, return error or success
    app.post('/api/teams/create',smashControl.createTeam)    // create new team with post, return team object or errors

    //user urls
    app.get('/api/users',smashControl.findAllUsers)  // return list of users
    app.post('/api/users/login',smashControl.userlogin) // find user via email and authenticate password
    app.post('/api/users/create',smashControl.createUser) // create new user with post data, return user object on success, errors on failure

    //channel urls
    //app.get('/')
    // update by id
    //app.put('/restaurants/:id/update',foodControl.updateOneRest);

    // create new review
    // app.post('/restaurants/:id/createreview', foodControl.createReview);

    // // get one p by id
    // app.get('/restaurants/:id',foodControl.getOne);
    
    // // create new restaurant
    // app.post('/restaurants/new', foodControl.createRest);

    // // get all
    // app.get('/restaurants',foodControl.index);

    // // delete one
    // app.delete('/restaurants/:id',foodControl.deleteOne);


}

