const {
    graphql,
    buildSchema,
} = require('graphql');

const schema = buildSchema(`
    type Query {
        helloWorld: String
    }
`);

const resolvers = () => {
    return {
        helloWorld: () => "Hello World GraphQL",
    };
};

const excecuteQuery = async () => {
    const helloWorld = await graphql(schema, '{ helloWorld }', resolvers());
    console.log(helloWorld);
};

excecuteQuery();