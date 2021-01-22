/* eslint-disable react/jsx-filename-extension */
import React, { ComponentType, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CSSReset, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'

const AllTheProviders: ComponentType<any> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider>
          <CSSReset /> {children}
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  )
}

const customRender = (ui: ReactElement<any>, options?: RenderOptions) =>
  render(ui, {
    ...options,
    wrapper: AllTheProviders
  })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
