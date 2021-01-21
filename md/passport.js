const LocalStrategy = require('passport-local').Strategy
const bcryptjs = require('bcryptjs')
const  User = require('../model/User')

console.log(LocalStrategy)
module.exports = (passport) => {

    passport.use(new LocalStrategy(
        function(username, password, done) {
         User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }  
            bcryptjs.compare(password , user.password , (err , match) => {
                console.log(match)
                if(err){
                    console.log(err)
                }
                if(match){
                    done(null, user)
                }else{
                    done(null , false , {message: 'Tizmga ulanish jarayonida xatolik yuz berdi'})
                }
    
            })
          });
        }
        
      ));
            passport.serializeUser(function(users, done) {
                done(null, users.id);
            });
            
            passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, users) {
                done(err, users);
                });
            });

}