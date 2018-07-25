var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');  

/* User */
var UserSchema = new mongoose.Schema({
        firstName: {type: String, required: [true, "First name cannot be empty!"], minlength: [3, "First name must have at least 3 characters"]},
        lastName: {type: Number, required: [true, "Last name cannot be empty!"], minlength: [3, "Last name must have at least 3 characters"]},
        email: {type: String, required: [true, "Review cannot be empty!"],
                validate:{
                    validator:function(value){
                        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                        return emailRegex.test(value);
                    },
                    message:"Email address is not valid!"
                }
            },
        password:{
            type:String,
            required: [true, "Password is required."],
            minlength: [8,"Password must be between 8-255 characters."],
            maxlength: [255,"Password must be between 8-255 characters."],
            validate: {
                validator: function( value ) {
                  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{2,32}/.test( value );
                },
                message: "Password failed validation, you must have at least 1 number, uppercase and special character"
              }
        },
    }, 
    {timestamps: true});
    
UserSchema.plugin(uniqueValidator,{message: 'Error, {PATH} {VALUE} is already TAKEN!'});
    
mongoose.model('User', UserSchema);

/*  Team  */
var teamSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : [5, "Teamname required to be at least 5 characters long "]
    },
    //url will just be the same as the name but all lowercase with no spaces
    url : {
        type : String,
        required : true
    },
    // One to many relationship. Has many personas (who are users) in a team.
    personas : [{
        type: Schema.Types.ObjectId,
        ref : "Persona"
    }],
    // One to many Relationship Personas can browse the channels in the Team
    channels : [{
        type: Schema.Types.ObjectId,
        ref : "Channel"
    }]
}, {timestamps : true})
//---------------------- Presave Create channels  (general and random)------------------
teamSchema.pre('save', function(done){
  if (this.isNew){
    var self = this;
    var randomChannel = new Channel({
        name : "Random",
        private : false,
        _team : self._id
    })
    var generalChannel = new Channel({
        name : "General",
        private : false,
        _team : self._id
    })

    //Creates two default channels upon team creation
    // Will log Error for which team it failed to created basic channels for.
    randomChannel.save(function(randomErr ){
        if (randomErr){
            console.log("Random Channel for: " + self.name + "team")
            done(randomErr)
        }else{
            generalChannel.save(function(generalErr){
                if (generalErr){
                    console.log('General Channel for: ' + self.name + "team")
                }else {
                    self.channels.push(randomChannel._id);
                    self.channels.push(generalChannel._id);
                    done();
                }
            })
        }
    })
  } else {
    done();
  }
});

mongoose.model('Team', teamSchema);

/* persona */
personaSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        minlength : [2,"Username for this group is too short!"]
    },
    // ------ One to One relationship to a User.. User can have multiple personas
    _user : {
        type: Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    // ---- One to One relationship here to a team
    _team : {
        type : Schema.Types.ObjectId,
        ref : "Team",
        required : true
    },
    // -- Links to picture stored locally.
    profilePic : {
        type: Schema.Types.ObjectId,
        ref : "File",
        required : false
    },
    password : {
        type: String,
        minlength : 8,
        maxlength : 100,
        validate: {
            validator: function (password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test(password);
            },
            message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        }

    }

},{timestamps : true})


personaSchema.pre('save', function (done) {
  console.log("Entered persona pre save function")
  if (!this.isModified('password')){
    console.log("Password hasn't changed")
    return done()
  };
  console.log("Hashing password")
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  done();
})

mongoose.model('Persona', personaSchema);

/* Post */
var postSchema = new mongoose.Schema ({
        // post does not require the user to type something... could be a file or link
        content : {
            type: String,
            required : false
        },
        notification : {
            type: Boolean,
            required: false
        },
    
        _persona : {
            type : Schema.Types.ObjectId,
            ref : "Persona",
            required : true
        },
    
        _channel : {
            type : Schema.Types.ObjectId,
            ref : "Channel",
            required : true
        },
        // post does not require user to upload a file each time.
        _file : {
            type : Schema.Types.ObjectId,
            ref : "File",
            required : false
        },
    
        // personas can comment on these Posts
        comments : [{
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }]
    
    
    
    }, {timestamps : true})
    
    postSchema.pre('remove', function(next){
         // Remove all the assignment docs that reference the removed post.
        var self = this
        Comment.remove({_post : self._id}).exec();
        File.remove({_post : self._id}).exec();
        next();
    })

/* Comment */
var commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },

    _persona :{
        type : Schema.Types.ObjectId, ref : "Persona",
        required : true
    },

    _post : {
        type : Schema.Types.ObjectId, ref : "Post",
        required : true
    }

 }, {timestamps : true})



mongoose.model("Comment", commentSchema);

/*Channel*/   
var channelSchema = new Schema ({

    name : {
        type : String,
        required : true,
        minlength : [5, 'Minimum length on channel name is 5 characters']
    },
    purpose : {
        type: String,
        required : false,
        minlength : [10, "Minimum length of a channel purpose is 10 characters"]
    },

    private : {
        type : Boolean,
        required: true
    },

    //Adding personas to specfic channels.
    members : [{
        type : Schema.Types.ObjectId,
        ref : "Persona"
    }],

    posts : [{
        type : Schema.Types.ObjectId,
        ref : "Post"
    }],

    files : [{
        type: Schema.Types.ObjectId,
        ref : "File"
    }],

    _team : {
        type : Schema.Types.ObjectId,
        ref: "Team"
    }

}, {timestamps : true})

channelSchema.pre('remove', function(next) {
    var self = this
    // Remove all the assignment docs that reference the removed channel.
    Post.remove({ _channel : self._id }).exec();
    File.remove({_channel : self._id}).exec();
    next();
});





mongoose.model("Channel", channelSchema);
mongoose.model('Post', postSchema);