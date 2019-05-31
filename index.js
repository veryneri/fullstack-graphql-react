const {
    graphql,
    buildSchema,
} = require('graphql');

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
`);

const resolvers = () => {
    return {
        carsByType: ({type}) => db.cars.filter(car => car.type === type),
        carById: ({id}) => db.cars.find(car => car.id === id),
    }; 
};

const excecuteQuery = async () => {
    const carsByType = `
        {
            carsByType(type:Coupe) {
                brand
                color
                type
                id
            }
        }
    `;

    const carById = `
        {
            carById(id:"a") {
                brand
                color
                type
                id
            }
        }
    `;

    const carsByTypeResult = await graphql(schema, carsByType, resolvers());
    console.log(carsByTypeResult);
    const carByIdResult = await graphql(schema, carById, resolvers());
    console.log(carByIdResult);
};

excecuteQuery();