### Application powered by mongodb, express, nodejs
## ** **
#### NPM package manager
## ** **
### To start the server npm run dev in server package 

## To send messages, you must add env variable with email password SMTP_PASSWORD = 1234 (example)

##  Endpoints 
- login
    methods: post
    accepts: { email : String [required],  password : String [required]}
- registration
    methods: post
    accepts: { email : String [required] unique, password : String [required] , favoriteFilms: Array<strings>, picture : string} 
    // picture can be send using form data
- /activate/:link
    methods: get
   // after clicking on this link, activation occurs
- /refresh
    methods: get
   // refresh current token
- /users
    methods: get
    // return list of users : 
    Array<{
    email: String unique: true [required] ,
    password:  String [required],
    isActivated: Boolean default: false ,
    activationLink: String,
    favoriteFilms: Array,
    picture: String,
    _id: String
    _v : 0
    }>
- /user
    methods: post
    // accepts an object type : 
    {  email: String unique: true [required] ,
        password:  String [required],
        isActivated: Boolean default: false ,
        activationLink: String,
        favoriteFilms: Array,
        picture: String,
        _id: String [required]
        _v : 0
    }
    // if field if dont match with origin user._id key loss may occur
