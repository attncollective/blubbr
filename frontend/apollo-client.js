import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client'

const directionalLink = new ApolloLink.split(
    (operation) => operation.getContext().isMainnet, // condition
    new HttpLink({ uri: 'https://api.lens.dev' }), // if condition is true
    new HttpLink({ uri: 'https://api-mumbai.lens.dev' }) // if condition is false
)

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: directionalLink,
})

export default client
