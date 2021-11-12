import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 2.5rem;
  height: 5.5rem;
  width: 62.5rem;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0rem 1.5rem;

  background-color: ${props => props.theme.colors.white[100]};

  h1 {
    ${props => props.theme.fonts.title}
    opacity: 0.7;
  }
  .select-container {
    margin-left: 9.3125rem;
    display: flex;
    gap: 0.5rem;

    div {
      width: 19.5rem;
      height: 3.375rem;

      select {
        width: 100%;
        height: 2rem;
        border-radius: 8px;
        background-color: #fff;
        opacity: 0.5;
      }
    }
  }
  .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p {
      ${props => props.theme.fonts.text};
      color: ${props => props.theme.colors.blue[100]};
      font-weight: bold;
    }
  }
`;
