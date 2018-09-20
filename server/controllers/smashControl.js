var mongoose = require("mongoose");
var bcrypt = require('bcrypt-as-promised')

var Team=mongoose.model('Team')
var User=mongoose.model('User')
var Persona=mongoose.model('Persona')
var Channel=mongoose.model('Channel')
var Comment=mongoose.model('Comment')
var Post=mongoose.model('Post')

module.exports = {
    // this is the second part in taskAPI , that starts with function(req,res)

    // return all teams
    findAllTeams: function(req,res){
        console.log('smashControl->findallTeams()...');
        
        Team.find({},function(err,teams){
            if(err){
                console.log('Got Error from index:',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success",data:teams});
            }
        })
    },

    // retrieve one team
    findOneTeam:function(req, res) {
        console.log('smashControl->findOneTeam()...');
        console.log('req.params.teamURL=',req.params.teamURL);
        
        Team.findOne({url:req.params.teamURL},function(err,team){
            if(err){
                console.log('FindOneTeam Got err:',err);
                res.json({message:"Error",error:err});
            }else{
                res.json({message:"Success",data:team});
            }
        })
    },

    // loginTeam
    loginTeam:function(req, res) {
        console.log('smashControl->loginTeam()...');
        console.log('req.params.teamURL=',req.params.teamURL);
        
        Team.findOne({url:req.params.teamURL},function(err,team){
            if(err){
                console.log('FindOneTeam Got err:',err);
                res.json({message:"Error",error:err});
            }else if(!team){
                console.log('Team not found!');
                res.json({message:"Error",error:"This team does not exist!"});
            }else // team found, search team personas for persona with matching email
            {
                console.log('Team found');
                Persona.findOne({_id:req.body.personaId},function(err,persona){
                    if(err){
                        res.json({message:"Error",error:err});
                    }else if(!persona){
                        console.log("persona not found!");
                        res.json({message:"Error",error:"This persona does not exist!"})
                    }else{
                        console.log('persona object=',persona);
                        console.log(req.body.password, persona.password);
                        bcrypt.compare(req.body.password,persona.password)
                        .then(
                            result=>{
                                console.log('pw compare result:',result);
                                console.log('Login successful');
                                res.json({message:"Login Successful",data:result});
                            })
                            .catch(err=>{
                                console.log('Login Error:',err);
                                console.log('Authentication Failed!');
                                res.json({message:"Authentication Failed!",error:"Authentication Failed!"});
                            })
                    }
                })
            }
        })
    },

    // register / create new Team
    createTeam: function(req, res) {
        console.log('smashControl->createTeam()');
        console.log('POST DATA',req.body);
        console.log('req.body.teamname=',req.body.teamname);
        console.log('req.body.teamURL=',req.body.teamURL);
        console.log('req.body.purpose=',req.body.purpose);
        
        // add from req to database
        var newTeam = new Team({
            name:req.body.name,
            url:req.body.url,
            purpose:req.body.purpose
        });
    
        newTeam.save(function(err){
            if(err){
                console.log('Errors in smashcontrol->createTeam:',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success created new Team!"});
            }
        });
    },

    // create user
    createUser:function(req,res){
        console.log('Running smashControl->createUser()');
        //console.log('Rests Id=',req.params.id);
        console.log('req.body.firstname=',req.body.firstname);
        console.log('req.body.lastname=',req.body.lastname);
        console.log('req.body.email=',req.body.email);
        console.log('req.body.password=',req.body.password);

        bcrypt.hash(req.body.password,10).then(
            hashed=>{
                console.log(`hashed= ${typeof(hashed)}`);
                var newUser = new User({
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    password:hashed
                });

                newUser.save(function(err,user){
                    if(err){
                        console.log('Save newUser failed:',err);
                        res.json({message:"Error",error:err});
                    }else{
                        res.json({message:"Success",data:user});
                    }
                })
            }
        )
    },

    //userlogin
    userlogin:function(req, res){
        console.log('Running smashControl->userLogin()...');
        console.log('req.body.email=',req.body.email);
        console.log('req.body.password=',req.body.password);
        
        User.findOne({email:req.body.email},function(err,user){
            if(err){
                console.log('Found err at userlogin=',err);
                res.json({message:"Error",error:err});
            }else if(!user){
                res.json({message:"Error",error:"Email does not exist!"});
            }else {
                // found user 
                console.log('user object=',user);
                console.log(req.body.password, user.password);
                bcrypt.compare(req.body.password, user.password)
                .then(
                    result=>{
                        console.log('pw compare result:',result);
                        console.log('Login successful');
                        res.json({message:"Login Successful",data:result});
                    })
                    .catch(err=>{
                        console.log('Login Error:',err);
                        console.log('Authentication Failed!');
                        res.json({message:"Authentication Failed!",error:"Authentication Failed!"});
                    })
            }
        })
    },
    
    // retrieve all users
    findAllUsers:function(req,res){
        console.log('smashControl->findallTeams()...');
        
        Team.find({},function(err,teams){
            if(err){
                console.log('Got Error from index:',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success",data:teams});
            }
        })
    },


    // index: function(req, res) {
    //     console.log('Inside Control->Index.');
    //     Restaurant.find({},function(err,restaurants){
    //         if(err){
    //             console.log('Got Error from index:',err);
    //             res.json({message:"Error",error:err});
    //         }
    //         else{
    //             res.json({message:"Success",data:restaurants});
    //         }
    //     })
    // },
    
    // getOne:function(req,res) {
    //     console.log('Inside Control->getOne..');
    //     console.log('req.params.id=',req.params.id);
    //     // FindOne !!
    //     Restaurant.findOne({_id:req.params.id},function(err,restaurant){
    //         if(err){
    //             console.log('Got Error from index:',err);
    //             res.json({message:"Error",error:err});
    //         }
    //         else{
    //             res.json({message:"Success",data:restaurant});
    //         }
    //     })
    // },

    // create new review
    // createReview:function(req,res){
    //     console.log('foodControl->createReview()');
    //     console.log('Rests Id=',req.params.id);
    //     console.log('req.body.name=',req.body.name);
    //     console.log('req.body.stars=',req.body.stars);
    //     console.log('req.body.review=',req.body.review);

    //     var newReview = new Review({
    //         name:req.body.name,
    //         stars:req.body.stars,
    //         review:req.body.review
    //     });

    //     newReview.save(function(err,review){
    //         if(err){
    //             console.log('Save failed:',err);
    //             res.json({message:"Error",error:err});
    //         }else{
    //             Restaurant.findOne(
    //                 {_id:req.params.id},function(err,restaurant){
    //                     if(err){
    //                         console.log('Rest Not found!');
    //                         res.json({message:"Error",error:err});
    //                     }else{
    //                         console.log('Found Restaurant:',restaurant);
    //                         restaurant.reviews.push(newReview);
    //                         restaurant.save(function(err,p){
    //                             if(err){
    //                                 console.log('save rest from create newReview failed!');
    //                                 res.json({message:"Error",error:err});
    //                             }else{
    //                                 res.json({message:"save restaurant success",data:p});
    //                             }   
    //                         })
    //                     }
    //                 }
    //             )
    //         }
    //     })

    // },

    // // update one by id
    // updateOneRest:function(req, res) {
    //     console.log('POST DATA',req.body);
    //     console.log('req.params.id=',req.params.id);
    //     console.log('req.body.name=',req.body.name);
    //     console.log('req.body.cuisine=',req.body.cuisine);

    //     Restaurant.findOne(
    //         {_id:req.params.id},function(err,restaurant){
    //             if(err){
    //                 console.log('Not found!');
    //                 res.json({message:"Error",error:err});
    //             }else{
    //                 console.log('Found Restaurant:',restaurant);
    //                 restaurant.name=req.body.name;
    //                 restaurant.cuisine=req.body.cuisine;
    //                 restaurant.save(function(err,p){
    //                     if(err){
    //                         console.log('Save from update failed!');
    //                         res.json({message:"Error",error:err});
    //                     }else{
    //                         res.json({message:"update success",data:p});
    //                     }   
    //                 })
    //             }
    //         }

    //     );
    // },

    // // delete one
    // deleteOne:function(req, res) {
    //     console.log('Delete one');
    //     console.log('req.params.id=',req.params.id);
    //     let date = new Date();
    //     var ts = date.getTime();
    //     console.log('Current time is',ts);
        
    //     Restaurant.findOne({_id:req.params.id},function(err,restaurant){
    //         if(err){
    //             console.log('Got Error from index:',err);
    //             res.json({message:"Error",error:err});
    //         }
    //         else{
    //                 console.log('CreatedAt:',restaurant.createdAt);
    //                 var diff = ts-restaurant.createdAt;
    //                 console.log('Diff is=',diff);
    //                 var sec = diff / 1000;
    //                 console.log('How many seconds for diff=',sec);
    //             if(Math.floor(sec)>30){
    //                 res.json({message:"Error",error:"You Cannot Delete This!"});
    //             }else{
    //                 // findOneAndDelete
    //                 Restaurant.findOneAndDelete(
    //                     {_id:req.params.id},function(err,restaurant){
    //                         if(err){
    //                             console.log('delete Restaurant got err:',err);
    //                             res.json({message:"Error",error:err});
    //                         }else{
                                
    //                             res.json({message:"delete success",data:restaurant});
    //                         }
    //                     }
    //                 );
    //             } 
    //         }
    //     })   
    // }
}