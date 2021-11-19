import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  ul {
    background-color: ${props => props.theme.colors.white[100]};
    width: 10.5rem;
    height: 20.5rem;
    list-style-type: none;
    border-radius: 8px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    li {
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.colors.white[10]};
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      ${props => props.theme.fonts.text};
    }
    li:hover {
      cursor: pointer;
    }
    a {
      color: ${props => props.theme.colors.black};
    }
  }
  table {
    margin-top: 1.625rem;
    width: 46.5rem;
    tr {
      display: flex;
      width: 46.5rem;
      //gap: 2rem;
      border-radius: 8px;
      padding: 0rem 0.5rem;
      transition: all 0.3s ease-in-out;
    }
    tbody tr:hover {
      background-color: ${props => props.theme.colors.white[10]};
      td.crud {
        button {
          background-color: ${props => props.theme.colors.white[100]};
        }
      }
    }
    th {
      width: 9.9rem;
      ${props => props.theme.fonts.menu}
      color: ${props => props.theme.colors.blue[50]};
      font-weight: bold;
      display: flex;
      //justify-content: flex-start;
    }
    td {
      width: 10rem;
      display: flex;
      align-items: center;
      // justify-content: flex-start;
      ${props => props.theme.fonts.menu};

      &.crud {
        display: flex;
        height: 2.5rem;
        justify-content: flex-end;
        gap: 1rem;

        button {
          border: none;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
      }
    }
  }
`;
