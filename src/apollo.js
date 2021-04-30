import { gql, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloClient } from 'apollo-client';
import { onError } from "apollo-link-error";
import { fromPromise, ApolloLink } from "apollo-link";

import { setContext } from '@apollo/client/link/context';
import { store } from './redux/store'
import { logout, setTokens } from './redux/clientSlice'

let client;

const getNewToken = () => {
    let state = store.getState()
    let refreshToken = state?.client?.refreshToken
    return client.mutate({
        mutation: gql`
        mutation refreshToken{
            app_refresh{
                accessToken
                process
                refreshToken
                tel_id
            }
        }
        `,
        context: {
            headers: {
                'auth': true,
                'refresh_token': refreshToken
            }
        }
    }).then((response) => {
        // extract your accessToken from your response data and return it
        const { accessToken, refreshToken, tel_id } = response?.data?.app_refresh;
        store.dispatch(setTokens({ accessToken, refreshToken, tel_id }))
        return { accessToken, refreshToken, tel_id };
    }).catch(e => {
        store.dispatch(logout())
        return false
    });
};
const httpLink = new HttpLink({
    uri: 'https://hasura-spzf.onrender.com/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    let state = store.getState()
    let accessToken = state?.client?.accessToken
    return {
        headers: {
            ...headers,
            ...(accessToken && !headers?.auth ? { Authorization: `Bearer ${accessToken}` } : {})
        }
    }
});
const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                if (err.message.includes("Error")) {
                    store.dispatch(logout())
                }
                switch (err.extensions.code) {
                    case "invalid-jwt":
                        return fromPromise(
                            getNewToken().catch((error) => { })
                        )
                            .filter((value) => Boolean(value))
                            .flatMap(({ accessToken }) => {
                                const oldHeaders = operation.getContext().headers;
                                operation.setContext({
                                    headers: {
                                        ...oldHeaders,
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });

                                // retry the request, returning the new observable
                                return forward(operation);
                            });
                }
            }
        }
    }
);

client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache()
});

export { client, getNewToken };