import React, {Fragment, Suspense} from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Login from "./components/Login"
import './scss/index.scss'
import {useDispatch} from "react-redux";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

const App = () => {
  
  const dispatch = useDispatch()
  
  const PrivateRedirect = props => {
    // const token = localStorage.getItem(AUTH_TOKEN_KEY)
    
    // const isAuthUser = token !== null
    
    // if (!isAuthUser) return <Redirect to="/login"/>;
    // dispatch(updateUser())
    return (
      <>
        <Header/>
        <SideBar/>
        <Route {...props} />
      </>
    )
  };
  
  return (
    <Fragment>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/login">
              <Login/>
            </Route>
            <Route render={() => <Redirect to='/login'/>}/>
          </Switch>
        </Suspense>
      </Router>
    </Fragment>
  )
}

export default App
