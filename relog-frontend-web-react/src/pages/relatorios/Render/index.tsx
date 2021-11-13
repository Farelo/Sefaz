import { lazy, Suspense } from 'react';

type RenderProps = {
  search: string;
};

export function Render({ search }: RenderProps): JSX.Element {
  const Component = lazy(() => import(`../relatorio/${search}`));

  return (
    <>
      {search && (
        <Suspense fallback={<div>load..</div>}>
          <Component />
        </Suspense>
      )}
    </>
  );
}
