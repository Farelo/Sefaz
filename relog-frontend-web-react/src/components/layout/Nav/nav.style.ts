import styled from 'styled-components';

export const Container = styled.ul`
  margin-top: 3.75rem;
  width: 100%;

  li {
    width: 100%;
    height: 4rem;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    background: ${props => props.theme.colors.white[50]};
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.95);
      cursor: pointer;
    }

    &.active {
      filter: brightness(0.95);
    }

    a {
      display: flex;
      padding-left: 1rem;
      gap: 1rem;
      display: flex;
      align-items: center;
      ${props => props.theme.fonts.menu};

      p {
        white-space: nowrap;
      }
    }
  }
`;
