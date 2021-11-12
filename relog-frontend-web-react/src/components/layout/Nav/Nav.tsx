import { useState } from 'react';
import {
  BsClipboardData,
  BsClipboardMinus,
  BsExclamationDiamond,
  BsFileEarmarkText,
  BsGeoAlt,
  BsUpload,
} from 'react-icons/bs';
import { Container } from './nav.style';
import { LiNav } from './NavLi/LiNav';

export function Nav(): JSX.Element {
  return (
    <Container>
      <LiNav title="Dashboard" to="/dashboard" icon={BsClipboardMinus} />
      <LiNav title="Relatórios" to="/relatorio" icon={BsClipboardData} />
      <LiNav title="Alertas" to="/alertas" icon={BsExclamationDiamond} />
      <LiNav title="Cadastros" to="/cadastros" icon={BsFileEarmarkText} />
      <LiNav title="Geolocalização" to="/geolocalização" icon={BsGeoAlt} />
      <LiNav title="Importar Dados" to="/import" icon={BsUpload} />
    </Container>
  );
}
