const {
    graphql,
    buildSchema,
} = require('graphql');

const schema = buildSchema(`
    type Query {
        greeting(name: String): String
    }
`);

const resolvers = () => {
    return {
        greeting: ({ name }) => `Hello ${ name }`,
    };
};

const excecuteQuery = async () => {
    const greeting = await graphql(schema, '{ greeting(name: "Edson") }', resolvers());
    console.log(greeting);
};

excecuteQuery();