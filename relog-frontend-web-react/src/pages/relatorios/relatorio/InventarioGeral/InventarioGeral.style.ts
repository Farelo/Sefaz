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
            &.green {
              background-color: ${props => props.theme.colors.positive};
            }
            &.red {
              background-color: ${props => props.theme.colors.negative};
            }
            &.orange {
              background-color: ${props => props.theme.colors.orange};
            }
            &.blue {
              background-color: ${props => props.theme.colors.blue[50]};
            }
          }
        }
      }
    }
  }
  section {
    margin-top: 1rem;
    width: 62.5rem;
    display: flex;
    gap: 8px;
    h1 {
      ${props => props.theme.fonts.text};
      font-weight: bold;
      color: ${props => props.theme.colors.blue[100]};
      height: 1.3rem;
    }
    div {
      padding: 0.8rem 0rem;
      height: 100%;
      background-color: ${props => props.theme.colors.white[100]};
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 8px;
    }
    div#inventario-fisico {
      width: 12rem;
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
    div#inventario-online {
      width: 30rem;
      table {
        margin-top: 0.5rem;
        width: 29rem;
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
    div#diferenca-container {
      width: 6rem;
      table {
        margin-top: 1rem;
        width: 5rem;
        border-collapse: collapse;
        thead tr {
          display: flex;
          th {
            height: 2rem;
            width: 6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            ${props => props.theme.fonts.text};
            font-weight: bold;
            color: ${props => props.theme.colors.blue[100]};
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
        tbody tr:nth-child(1) td:nth-child(1) {
          margin-top: 1.2rem;
        }
      }
    }
    div#alertas {
      width: 13rem;
      table {
        width: 12rem;
        thead tr {
          display: flex;
          th {
            width: 100%;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            ${props => props.theme.fonts.text};
            border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
          }
        }
        tbody tr {
          margin-top: 0.3rem;
          display: flex;
          justify-content: space-between;
          td {
            display: flex;
            align-items: center;
            height: 1.95rem;

            span {
              display: flex;
              width: 1.25rem;
              height: 1.25rem;
              background-color: ${props => props.theme.colors.gray[5]};
              border-radius: 8px;
              align-items: center;
              justify-content: center;
              color: ${props => props.theme.colors.white[100]};
              &.green {
                background-color: ${props => props.theme.colors.positive};
              }
              &.red {
                background-color: ${props => props.theme.colors.negative};
              }
              &.orange {
                background-color: ${props => props.theme.colors.orange};
              }
              &.blue {
                background-color: ${props => props.theme.colors.blue[50]};
              }
            }
          }
        }
      }
    }
  }
`;
