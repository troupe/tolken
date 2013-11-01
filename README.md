# tolken

Simple token library for creating secure tokens that can be passed back to a client with a hash being stored in a database.

## Installing

    npm install tolken

## Usage

### Creating a token

To create a token, you'll need to provide an ID specific to your domain (userId, etc). Generally there should be one ID per token generated.

    var id = '123456';
    var jwtSecret = 'grumpycat';

    tolken.generate(id, jwtSecret, function(err, details) {
      if(err) return done(err);


      // Now, send details.clientToken to the client (but don't store it on the server)
      ...

      // And store details.serverToken in your database
      ...

    });



### Validating a token

There are two steps in validating the token.

Extract the ID from the token using `extractIdFromClientToken`

    var jwtSecret = 'grumpycat';

    var id = tolken.extractIdFromClientToken(clientToken, jwtSecret);

    // Use this ID to lookup the persisted token from the database

Once you have retrieved the server token hash from your database, use `verifyClientToken` to verify the token is valid

    tolken.verifyClientToken(clientToken, serverToken, jwtSecret, function(match) {
      if(match) {
        // The token is valid
      }
    }


## TODO

Lots, this is a first cut! Any suggestions welcome.


