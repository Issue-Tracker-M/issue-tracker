import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { getToken } from '../helpers'

interface PrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props
  return (
    <Route
      {...rest}
      render={(props) =>
        getToken() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute
