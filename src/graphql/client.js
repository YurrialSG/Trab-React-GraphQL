import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';


const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const allLinks = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    new WebSocketLink({
        uri: 'ws://localhost:4000/graphql',
        options: { reconnect: true },
    }),
    authLink.concat(new HttpLink({
        uri: 'http://localhost:4000/graphql'
    }))
)

export const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.forEach(({ message, locations, path }) => {
                    console.log(`[GraphQL error]: Message: ${message}, 
                    Location: ${locations}, Path: ${path}`)
                })
            }
            if (networkError) {
                console.log(`[NetworkError]: ${networkError}`)
            }
        }),
        allLinks
    ]),
    cache: new InMemoryCache()
})