const {
    ApolloServer,
    gql,
} = require('apollo-server');

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

const typeDefs = gql(`
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

const resolvers = {
    Query: {
        carsByType: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.filter(car => car.type === args.type),
        carById: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === args.id),
    },
    Car: {
        brand: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.filter(car => car.brand === parent.brand)[0].brand,
    },
    Mutation: {
        addCar: (
            _,
            {
                brand,
                color,
                doors,
                type,
            }
        ) => {
            context.db.cars.push({
                id: Math.random().toString(),
                brand,
                color,
                doors,
                type,
            });

            return context.db.cars;
        }
    },
};

const dbConnection = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(db), 2000);
    });
};

const context = async () => {
    return {
        db: await dbConnection(),
    };
}

const server = new ApolloServer({
    context,
    resolvers,
    typeDefs,
});

server.listen().then(({ url }) =>  console.log(`🚀  Server ready at ${url}`));