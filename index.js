const {
    ApolloServer,
    PubSub,
    gql,
} = require('apollo-server');

const pubSub = new PubSub();
const db = {
    cars: [
        {
            id: 'a',
            brand: 'Ford',
            color: 'Blue',
            doors: 4,
            type: 'Sedan',
            parts: [
                { id: '1' },
                { id: '2' },
            ],
        },
        {
            id: 'b',
            brand: 'Tesla',
            color: 'Red',
            doors: 4,
            type: 'SUV',
            parts: [
                { id: '1' },
                { id: '3' },
            ],
        },
        {
            id: 'c',
            brand: 'Toyota',
            color: 'White',
            doors: 4,
            type: 'Coupe',
            parts: [
                { id: '2' },
                { id: '3' },
            ],
        },
        {
            id: 'd',
            brand: 'Toyota',
            color: 'Red',
            doors: 4,
            type: 'Coupe',
            parts: [
                { id: '1' },
                { id: '3' },
            ],
        },
    ],
    parts: [
        {
            id: '1',
            name: 'Transmission',
            cars: [
                { id: 'a' },
                { id: 'b' },
                { id: 'd' },
            ],
        },
        {
            id: '2',
            name: 'Suspension',
            cars: [
                { id: 'a' },
                { id: 'c' },
            ],
        },
        {
            id: '3',
            name: 'Spoiler',
            cars: [
                { id: 'b' },
                { id: 'c' },
                { id: 'd' },
            ],
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
        parts: [Part]
    }
    type Part {
        id: ID!
        name: String
        cars: [Car]
    }
    type Query {
        carsByType(type: CarTypes!): [Car]
        carById(id: ID!): Car
        partById(id: ID!): Part
    }
    type Mutation {
        addCar(
            brand: String!,
            color: String!,
            doors: Int!,
            type: CarTypes!,
        ): [Car]!
    }
    type Subscription {
        carAdded: Car
    }
`);

const resolvers = {
    Query: {
        carById: (parent, args, context, info) => args,
        carsByType: (parent, args, context, info) => args,
        partById:  (parent, args, context, info) => args,
    },
    Car: {
        brand: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === parent.id).brand,
        type: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === parent.id).type,
        color: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === parent.id).color,
        doors: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === parent.id).doors,
        parts: (
            parent,
            args,
            context,
            info
        ) => context.db.cars.find(car => car.id === parent.id).parts,
    },
    Mutation: {
        addCar: (
            _,
            {
                brand,
                color,
                doors,
                type,
            },
            context,
        ) => {
            const newCar = {
                id: Math.random().toString(),
                brand,
                color,
                doors,
                type,
                parts: [{ id: '1'}],
            };
            context.db.cars.push(newCar);

            pubSub.publish('CAR_ADDED', {
                carAdded: newCar
            });

            return context.db.cars;
        }
    },
    Part: {
        name: (parent, args, context, info) => {
            const part = context.db.parts.find(part => part.id === parent.id);
            return part ? part.name : '';
        },
        cars: (parent, args, context, info) => {
            const part = context.db.parts.find(part => part.partId === parent.partId);
            return part ? part.cars : [];
        },
    },
    Subscription: {
        carAdded: {
            subscribe: () => pubSub.asyncIterator(['CAR_ADDED'])
        }
    }
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
