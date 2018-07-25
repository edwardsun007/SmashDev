var mongoose = require("mongoose");

var User=mongoose.model('User')


module.exports = {
    // this is the second part in taskAPI , that starts with function(req,res)

    // retrieve all
    index: function(req, res) {
        console.log('Inside Control->Index.');
        Restaurant.find({},function(err,restaurants){
            if(err){
                console.log('Got Error from index:',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success",data:restaurants});
            }
        })
    },
    
    getOne:function(req,res) {
        console.log('Inside Control->getOne..');
        console.log('req.params.id=',req.params.id);
        // FindOne !!
        Restaurant.findOne({_id:req.params.id},function(err,restaurant){
            if(err){
                console.log('Got Error from index:',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success",data:restaurant});
            }
        })
    },

    // create new Restaurant
    createRest: function(req, res) {
        console.log('foodControl->createRest()');
        console.log('POST DATA',req.body);
        console.log('req.body.name=',req.body.name);
        console.log('req.body.cuisine=',req.body.cuisine);
        console.log('req.body.image=',req.body.image);

        // add from req to database
        var newRest = new Restaurant({
            name:req.body.name,
            cuisine:req.body.cuisine,
        });
    
        newRest.save(function(err){
            if(err){
                console.log('We have error from control->createRest!',err);
                res.json({message:"Error",error:err});
            }
            else{
                res.json({message:"Success created new newRest!"});
            }
        });
    },

    // create new review
    createReview:function(req,res){
        console.log('foodControl->createReview()');
        console.log('Rests Id=',req.params.id);
        console.log('req.body.name=',req.body.name);
        console.log('req.body.stars=',req.body.stars);
        console.log('req.body.review=',req.body.review);


        var newReview = new Review({
            name:req.body.name,
            stars:req.body.stars,
            review:req.body.review
        });

        newReview.save(function(err,review){
            if(err){
                console.log('Save failed:',err);
                res.json({message:"Error",error:err});
            }else{
                Restaurant.findOne(
                    {_id:req.params.id},function(err,restaurant){
                        if(err){
                            console.log('Rest Not found!');
                            res.json({message:"Error",error:err});
                        }else{
                            console.log('Found Restaurant:',restaurant);
                            restaurant.reviews.push(newReview);
                            restaurant.save(function(err,p){
                                if(err){
                                    console.log('save rest from create newReview failed!');
                                    res.json({message:"Error",error:err});
                                }else{
                                    res.json({message:"save restaurant success",data:p});
                                }   
                            })
                        }
                    }
                )
            }
        })

    },

    // update one by id
    updateOneRest:function(req, res) {
        console.log('POST DATA',req.body);
        console.log('req.params.id=',req.params.id);
        console.log('req.body.name=',req.body.name);
        console.log('req.body.cuisine=',req.body.cuisine);

        Restaurant.findOne(
            {_id:req.params.id},function(err,restaurant){
                if(err){
                    console.log('Not found!');
                    res.json({message:"Error",error:err});
                }else{
                    console.log('Found Restaurant:',restaurant);
                    restaurant.name=req.body.name;
                    restaurant.cuisine=req.body.cuisine;
                    restaurant.save(function(err,p){
                        if(err){
                            console.log('Save from update failed!');
                            res.json({message:"Error",error:err});
                        }else{
                            res.json({message:"update success",data:p});
                        }   
                    })
                }
            }

        );
    },

    // delete one
    deleteOne:function(req, res) {
        console.log('Delete one');
        console.log('req.params.id=',req.params.id);
        let date = new Date();
        var ts = date.getTime();
        console.log('Current time is',ts);
        
        Restaurant.findOne({_id:req.params.id},function(err,restaurant){
            if(err){
                console.log('Got Error from index:',err);
                res.json({message:"Error",error:err});
            }
            else{
                    console.log('CreatedAt:',restaurant.createdAt);
                    var diff = ts-restaurant.createdAt;
                    console.log('Diff is=',diff);
                    var sec = diff / 1000;
                    console.log('How many seconds for diff=',sec);
                if(Math.floor(sec)>30){
                    res.json({message:"Error",error:"You Cannot Delete This!"});
                }else{
                    // findOneAndDelete
                    Restaurant.findOneAndDelete(
                        {_id:req.params.id},function(err,restaurant){
                            if(err){
                                console.log('delete Restaurant got err:',err);
                                res.json({message:"Error",error:err});
                            }else{
                                
                                res.json({message:"delete success",data:restaurant});
                            }
                        }
                    );
                } 
            }
        })

        
    }

}