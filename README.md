# Example of a microservice API module: Inventory Stocks

Part of a bigger API infrastructure designed to handle thousands of simultaneous request, this module implements functional programming, a repository pattern, as well as dependency injection techniques to remove any imports required outside of the module itself.  

Each request to the API is stateless meaning no state is carried from one request to another. For each request the user authenticates with a JWT and goes through a series of middlewares to ensure the user is authorized. 

Once authenticated and authorized, the request reaches the Express.js router functions configured in this module. 

## The Repository Pattern

Router -> Controller -> Service -> Repository (and back)

Basically the flow of the request goes as follows:

1. The router configures each endpoint by passing the functions as parameters to the controller.
2. The controller accesses the request, extracts any queries and proceeds to validate (and transform) any user input.
3. The service then handles any business logic and executes repository functions.
4. Repository functions perform any database operations or external http requests with the support of helper functions.

5. Once the database operation or http request is succesful, the repository function receives the updated data, proceeds to transform it (if necessary) and handles it to the service.
6. Once the service finishes executing, it returns the data to the controller.
7. The controller transforms the data for user consumption if required (for example date formatting) and sends the response.


### Advantages 

In the end, we obtain a really powerful API capable of working with its own inner types of data, as its capable of implementing data transformation before it gets in and before it gets out. 

This has the advantage of easily applying any data formatting on a consistent point and being able to easily fix any external API changes that might break the module.

### Disadvantages

These levels of abstraction, while clearly separates concerns among the functions, adds complexity and development time. The use of dependency injection may confuse developers that are not used to writing functions that return functions.
