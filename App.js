import React from 'react';
// import { ActivityIndicator } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ApolloProvider } from '@apollo/react-hooks';

import { persistor, store } from './src/redux/store'

import { client } from './src/apollo'
import AppNavigator from './src/navigation';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function App() {
  // const token = useSelector((state) => state.client.token)
  // const [client, setClient] = React.useState(null);
  // React.useEffect(() => {
  //   const client = makeApolloClient();
  //   setClient(client);
  // }, [])
  // if (!client) {
  //   return <ActivityIndicator />
  // }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaView>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

