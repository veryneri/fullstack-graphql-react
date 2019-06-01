const {
    graphql,
    buildSchema,
} = require('graphql');
const express = require('express');
const expressGraphQL = require('express-graphql');

const db = {
    cars: [
        {
            id: 'a',
            brand: 'Ford',
            color: 'Blue',
            doors: 4,
            type: 'Sedan',
        },
        {
            id: 'b',
            brand: 'Tesla',
            color: 'Red',
            doors: 4,
            type: 'SUV',
        },
        {
            id: 'c',
            brand: 'Toyota',
            color: 'White',
            doors: 4,
            type: 'Coupe',
        },
        {
            id: 'd',
            brand: 'Toyota',
            color: 'Red',
            doors: 4,
            type: 'Coupe',
        },
    ], 
};

const schema = buildSchema(`
    enum CarTypes {
        Sedan
        SUV
        Coupe
    }
    type Car {
        id: ID!,
        brand: String!
        color: String!
        doors: Int!
        type: CarTypes!
    }
    type Query {
        carsByType(type: CarTypes!): [Car]
        carById(id: ID!): Car
    }
    type Mutation {
        addCar(
            brand: String!,
            color: String!,
            doors: Int!,
            type: CarTypes!,
        ): [Car]!
    }
`);

const resolvers = () => {
    return {
        carsByType: ({type}) => db.cars.filter(car => car.type === type),
        carById: ({id}) => db.cars.find(car => car.id === id),
        addCar: ({ brand, color, doors, type }) => {
            db.cars.push({
                id: 'e',
                brand,
                color,
                doors,
                type,
            });

            return db.cars;
        },
    }; 
};

const app = express();
const port = 3000;
app.use(
    '/graphql',
    expressGraphQL({
        graphiql: true,
        rootValue: resolvers(),
        schema,
    })
);

app.listen(port, () =>  console.log(`GraphQL server is listening on port ${ port }`));