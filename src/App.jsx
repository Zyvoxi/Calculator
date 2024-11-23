import * as React from 'react';
import {
  Container,
  Box,
  Paper,
  styled,
  Typography,
  Button,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { evaluate } from 'mathjs';

const Display = styled(Typography)({
  color: 'white',
  fontSize: '4em',
  letterSpacing: -1,
  fontWeight: 'bold',
  margin: 'auto 10px',
  width: '100%',
  maxWidth: 'inherit',
  textWrap: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  direction: 'rtl',
});

const StyledButton = styled(Button)({
  height: '100%',
  maxHeight: '90px',
  width: '100%',
  maxWidth: '90px',
  color: 'white',
  fontSize: '2em',
  fontWeight: 'bold',
  borderRadius: 10,
  padding: 10,
  margin: '0 0 10px 0',
  textTransform: 'none',
  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.25)',
  transition: 'background-color 0.1s cubic-bezier(0.25, 0.5, 0.5, 1)',
});

const buttons = [
  ['AC', 'X', '/', <BackspaceIcon key='backspace' />],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  [' ', '0', ',', '\u200B'],
];

export default function App() {
  const [clicked, setClicked] = React.useState(null);
  const [display, setDisplay] = React.useState('0');

  const handleClick = (key) => {
    setClicked(key);
    setTimeout(() => {
      setClicked(null);
    }, 120); // Duração do escurecimento em milissegundos
  };

  const invert = (value) => {
    // Remove espaços desnecessários
    const trimmedExpression = value.trim();

    // Divide a expressão em partes (assume que é separada por espaço)
    const parts = trimmedExpression.split(' ');

    // Inverte a ordem das partes e junta de volta como string
    return parts.reverse().join(' ');
  };

  const handleCalculator = (num) => {
    /* eslint-disable indent */
    switch (true) {
      case num === ' ' || num === '\u200B':
        break;
      case num === '=': {
        try {
          const sanitisedDisplay = display
            .replace(/x/g, '*')
            .replace(/,/g, '.');
          const calc = evaluate(sanitisedDisplay);
          setDisplay(`${calc}`.replace('.', ','));
          break;
        } catch (error) {
          console.error(error);
          setDisplay('Error');
          break;
        }
      }
      case num === 'AC':
        setDisplay('0');
        break;
      case num === '-' || num === '+' || num === '/' || num === 'X': {
        const lastElement = display.trim().split(' ').pop();

        if (isNaN(lastElement.replace(',', '.'))) {
          setDisplay(
            (prev) => ` ${prev.trim().slice(0, -1) + num.toLowerCase()} `,
          );
        } else {
          setDisplay((prev) => `${prev} ${num.toLowerCase()} `);
        }
        break;
      }

      case num === ',':
        setDisplay((prevDisplay) => `${prevDisplay},`);
        break;
      case !isNaN(num):
        if (display === '0') {
          setDisplay(num);
          break;
        }
        setDisplay((prevDisplay) => prevDisplay + num);
        break;
      default:
        setDisplay((prevDisplay) =>
          prevDisplay[prevDisplay.length - 1] === 'r'
            ? '0'
            : prevDisplay[prevDisplay.length - 1] === 'y'
              ? '0'
              : prevDisplay.length > 1
                ? prevDisplay.trim().slice(0, -1)
                : '0',
        );
        console.log(num);
    }
    /* eslint-enable indent */
  };

  return (
    <Container
      maxWidth='xl'
      sx={{ height: '90vh', display: 'flex', padding: 0 }}
    >
      <Paper
        elevation={10}
        sx={{
          bgcolor: 'transparent',
          display: 'inherit',
          borderRadius: 5,
          my: 'auto',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            bgcolor: '#313131',
            display: 'inherit',
            borderRadius: 5,
            flexDirection: 'column',
            height: '100%',
            width: '400px',
          }}
        >
          <Box
            sx={{
              bgcolor: '#0213',
              display: 'inherit',
              borderRadius: 5,
              height: '150px',
              m: 1,
              textAlign: 'right',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Display>{invert(display).replace(/x/g, '\u00D7')}</Display>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderRadius: 'inherit',
              height: '500px',
              width: '392px',
              m: 1,
            }}
          >
            {buttons.flat().map((num) => (
              <StyledButton
                key={num}
                onClick={() => {
                  handleClick(num);
                  handleCalculator(num);
                }}
                disableRipple={true}
                sx={{
                  bgcolor: clicked === num ? '#0005' : '#0003',
                }}
              >
                {num}
              </StyledButton>
            ))}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}