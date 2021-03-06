import ReactHintFactory from 'react-hint'
import { Provider } from 'react-redux'
import reactDOM from 'react-dom'
import React from 'react'
import 'react-hint/css/index.css'

import getInitialState from './get-initial-state'
import createStore from './create-store'
import analytics from './analytics'
import config from './config'

import MetronomeStatus from './providers/MetronomeStatus'
import WalletVersion from './providers/WalletVersion'
import Rates from './providers/Rates'

import ConverterPage from './components/converter/Converter'
import AuctionPage from './components/auction/Auction'
import WalletPage from './components/wallet/Wallet'
import HomePage from './components/home/Home'
import Marquee from './components/common/Marquee'
import Portal from './components/common/Portal'

analytics.init()

if (module.hot) {
  module.hot.accept()
}

if (config.env === 'production' && window.Raven) {
  window.Raven.config(config.sentryDns).install()
  window.addEventListener('unhandledrejection', function(e) {
    window.Raven.captureException(e.reason)
  })
}

const store = createStore(getInitialState(config))

function getAppContent(content) {
  switch (content) {
    case 'home':
      return <HomePage />
    case 'converter':
      return <ConverterPage />
    case 'auction':
      return <AuctionPage />
    case 'wallet':
      return <WalletPage />
    default:
      return null
  }
}

const rootElement = document.getElementById('root')
const marqueeElement = document.getElementById('marquee')

if (rootElement || marqueeElement) {
  const rootContent = rootElement ? rootElement.getAttribute('content') : null
  const ReactHint = ReactHintFactory(React)

  // If document contains a root node for a main React app inject Marquee as a
  // React Portal, otherwise render the Marquee as a normal tree element.
  reactDOM.render(
    <Provider store={store}>
      <React.Fragment>
        {rootElement ? (
          <React.Fragment>
            <Portal selector="#marquee">
              <Marquee />
            </Portal>
            {getAppContent(rootContent)}
          </React.Fragment>
        ) : (
          <Marquee />
        )}
        <MetronomeStatus />
        <WalletVersion />
        <ReactHint autoPosition events />
        <Rates />
      </React.Fragment>
    </Provider>,
    rootElement || marqueeElement
  )
}
