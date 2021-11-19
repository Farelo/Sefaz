import styled from 'styled-components';

export const Container = styled.div`
  width: 62.5rem;

  .head-container {
    margin-top: 2.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      ${props => props.theme.fonts.menu};
      font-size: 1rem;
      font-weight: 700;
      color: ${props => props.theme.colors.blue[100]};
      span {
        ${props => props.theme.fonts.menu};
        font-size: 1rem;
        color: ${props => props.theme.colors.black};
      }
    }
    div {
      display: flex;
      gap: 0.5rem;
      button {
        border: none;
        height: 1.75rem;
        width: 4.5rem;
        background-color: transparent;
        border: 2px solid ${props => props.theme.colors.blue[100]};
        border-radius: 8px;
        color: ${props => props.theme.colors.blue[100]};
        ${props => props.theme.fonts.menu};
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
      }
      button:nth-child(2) {
        border: 2px solid ${props => props.theme.colors.negative};
        color: ${props => props.theme.colors.negative};
      }
    }
  }
  #legenda {
    margin-top: 1.5rem;
    display: flex;
    width: 48.8125rem;
    gap: 4.9375rem;
    p {
      ${props => props.theme.fonts.text};
      font-style: italic;
      opacity: 0.8;
    }
    .legenda-alertas {
      display: flex;
      gap: 2.75rem;
      div {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        p {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          span {
            display: flex;
            width: 0.3rem;
            height: 0.3rem;
            background-color: red;
            border-radius: 50%;
          }
        }
      }
    }
  }
  section {
    margin-top: 1rem;
    width: 62.5rem;
    div#inventario-fisico {
      padding: 0.8rem 0rem;
      height: 100%;
      width: 12rem;
      background-color: ${props => props.theme.colors.white[100]};
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 8px;
      h1 {
        ${props => props.theme.fonts.text};
        font-weight: bold;
        color: ${props => props.theme.colors.blue[100]};
        height: 1.3rem;
      }
      table {
        margin-top: 0.5rem;
        width: 10rem;
        border-collapse: collapse;
        thead tr {
          display: flex;
          th {
            height: 2.5rem;
            width: 6rem;
            border: 1px solid ${props => props.theme.colors.gray[100]};
            display: flex;
            align-items: center;
            justify-content: center;
            ${props => props.theme.fonts.text};
            font-weight: bold;
          }
        }
        tbody tr {
          display: flex;
          td {
            width: 6rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid ${props => props.theme.colors.gray[100]};
          }
        }
      }
    }
  }
`;
