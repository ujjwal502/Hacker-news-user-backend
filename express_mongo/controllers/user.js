// init code
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const user = require('./../models/user');


// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// routes goes here

// default route
router.all(
  '/',
  function (req, res) {
    return res.json({
      status: true,
      message: 'User controller working...'
    });
  }
);
//ALL CRUD OPERATIONS WILL BE DONE HERE!

// create new user route
router.post(
  '/createNew',
  [
    // check not empty fields
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('title').not().isEmpty().trim().escape(),
    check('comment').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
    
  ],
  function (req, res) {
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Form validation error.',
        errors: errors.array()
      });
    }

    //hashing password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    //create new user model
    var temp = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      title: req.body.title,
      comment: req.body.comment
    });

    //Now we will insert data into database
    temp.save(function (error, result) {
      if (error) {
        return res.json({
          status: false,
          message: 'DB insert fail',
          error: error
        });
      }
      //when its working fine
      return res.json({
        status: true,
        message: 'DB insert success....',
        result: result
      })
    });
  }
);

//Reading operations
router.get(
  '/find',
  function (req, res) {
    //find user by document
    user.find(function (error, result) {
      //check error
      if (error) {
        return res.json({
          status: false,
          message: 'DB reading failed.....',
          error: error
        });
      }
      //if everything is ok
      return res.json({
        status: true,
        message: 'DB reading success....',
        result: result
      });
    });


  }
);

//update user document
router.put(
  '/update/:email',
  function (req, res) {
    user.update(
      { email: req.params.email },
      { username: 'clark kent' },
      function (error, result) {
        //check error
        if (error) {
          return res.json({
            status: false,
            message: 'DB update failed....',
            error: error
          });
        }

        //if everything is okay
        return res.json({
          status: true,
          message: 'DB is working....',
          result: result
        });
      }
    );
  }
);

//delete operation
router.delete(
  '/delete/:email',
  function (req, res) {
    //check if email is not empty
    if (req.params.email) {
      user.remove(
        { email: req.params.email },
        function (error, result) {
          //check for the error
          if (error) {
            return res.json({
              status: false,
              message: 'DB delete fail.....',
              error: error
            });
          }
          //if everything works fine
          return res.json({
            status: true,
            message: 'DB delete working....',
            result: result
          });
        }



      );
    } else {
      return res.json({
        status: false,
        message: 'Email not provided!'
      });
    }
  }
);





module.exports = router;