import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 2rem;
  width: 62.5rem;
  background-color: #fff;
  height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);

  h1 {
    ${props => props.theme.fonts.title}
  }
`;
