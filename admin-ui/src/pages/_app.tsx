import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/app.css'
import '@/styles/centercontent.css'
import '@/styles/dashboard.css'
import '@/styles/editlocation.css'
import '@/styles/login.css'
import '@/styles/navbar.css'
import '@/styles/settings.css'
import '@/styles/sidebar.css'
import type { AppProps } from 'next/app'
import nextI18nConfig from '../../next-i18next.config'
import { WithTranslation, appWithTranslation, withTranslation } from 'next-i18next'
import { Ajax } from 'flexspace-commons'
import React from 'react'
import Loading from '@/components/Loading'
import dynamic from 'next/dynamic'
import Head from 'next/head'

interface State {
  isLoading: boolean;
}

interface Props extends WithTranslation, AppProps {
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV.toLowerCase() === "development") {
        Ajax.URL = "http://" + window.location.host.split(':').shift() + ":8080";
      }
    }
    setTimeout(() => {
      this.initAjax();
    }, 10);
  }

  initAjax = async () => {
    Ajax.PERSISTER.readCredentialsFromSessionStorage().then(c => {
      Ajax.CREDENTIALS = c;
      this.setState({
        isLoading: false
      });
    });
  }

  render() {
    if ((this.state.isLoading) || (!this.props.tReady)) {
      return <Loading />;
    }

    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link rel="icon" href="/admin/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#343a40" />
          <link rel="manifest" href="/admin/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <link rel="shortcut icon" href="/admin/favicon-192.png" />
          <link rel="apple-touch-icon" href="/admin/favicon-192.png" />
          <link rel="apple-touch-startup-image" href="/admin/favicon-1024.png" />
          <title>Seatsurfing</title>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

const NoSSRApp = dynamic(async () => withTranslation()(App), { ssr: false });
export default appWithTranslation(NoSSRApp, nextI18nConfig);
