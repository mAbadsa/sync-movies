import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';

import Layout from '../pages/layout';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';

// import store from '../redux/configureStore';

import './App.css';

let socket;

function App() {
  const [socketio, setSocketio] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  // const { roomId } = useParams();
  console.log('App');

  useEffect(() => {
    socket = io.connect('/', { rejectUnauthorized: false });
    setSocketio(socket);
    // return socket.on('disconnect', () => {
    //   console.log(socket.id);
    // });
  }, []);

  console.log(socketio);

  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route exact path="/">
            {socketio !== null && (
              <Home handleIsJoined={setIsJoined} socket={socketio} />
            )}
          </Route>
          <Route exact path="/:roomId">
            {socketio !== null && (
              <Dashboard isJoined={isJoined} socket={socketio} />
            )}
          </Route>
        </Switch>
        {/* <Provider store={store} /> */}
      </Layout>
    </div>
  );
}

export default App;
