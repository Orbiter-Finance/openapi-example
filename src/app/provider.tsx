"use client";

import ReData from '@/components/ReData';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import Header from './header';
import { SnackbarProvider } from 'notistack';
import { EvmProvider } from '@/providers/evm-providers';
import Loading from './loading';
import StarknetProviders from '@/providers/starknet-providers';

export default function Provider({
  children
}: { children: ReactNode; }
) {


  return (
    <RecoilRoot >
      <StarknetProviders>
        <EvmProvider>
          <SnackbarProvider
            disableWindowBlurListener
            preventDuplicate
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            maxSnack={5}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense
                fallback={<Loading />}
              >

                <ReData />
                <Header />
                <main>{children}</main>
              </Suspense>
            </ThemeProvider>
          </SnackbarProvider>
        </EvmProvider>
      </StarknetProviders>
    </RecoilRoot>
  );
}
