// @refresh reload
import { Suspense } from 'solid-js';
import { ErrorBoundary, FileRoutes, Routes, Scripts } from 'solid-start';
import { Body, Head, Html, Meta, Title } from 'solid-start';
import './root.css';

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Huna-Huna</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
