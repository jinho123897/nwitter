import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile'
import Navigation from 'components/Navigation'

const AppRouter = ({ refreshUser, isLoggedIn, userObj}) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
            <>
              <Route exact path="/">
                <Home userObj={userObj}></Home>
              </Route>
              <Route exact path="/profile">
                <Profile userObj={userObj} refreshUser={refreshUser}/>
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/">
                <Auth></Auth>
              </Route>
            </>
          )}
      </Switch>
    </Router>
  )
}

export default AppRouter;