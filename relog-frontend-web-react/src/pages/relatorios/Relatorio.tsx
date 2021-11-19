import { ChangeEvent, useState } from 'react';
import { Render } from './Render/index';
import { Container } from './Relatorio.style';
import { SearchComponent } from '../../components/layout/index';

export function Relatorio(): JSX.Element {
  const [value, setValue] = useState(() => {
    const storage = localStorage.getItem('@evoy:lugar');
    if (storage) {
      return storage;
    }

    return 'default';
  });

  function handleSelectModel(event: ChangeEvent<HTMLSelectElement>) {
    setValue(event.target.value);
    localStorage.setItem('@evoy:lugar', event.target.value);
  }

  return (
    <Container>
      <SearchComponent handleSelectModel={handleSelectModel} />
      <Render search={value} />
    </Container>
  );
}
