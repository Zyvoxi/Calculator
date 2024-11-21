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

const Display = styled(Typography)({
  color: 'white',
  fontSize: '4em',
  letterSpacing: -1,
  fontWeight: 'bold',
  margin: 'auto 10px',
  width: '100%',
  maxWidth: 'inherit',
});

const StyledButton = styled(Button)({
  height: '100%',
  maxHeight: '90px',
  width: '100%',
  maxWidth: '90px',
  color: 'white',
  fontSize: '2em',
  fontWeight: 'bold',
  borderRadius: 5,
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

  return (
    <Container
      maxWidth='xl'
      sx={{ height: '90vh', display: 'flex', padding: 0 }}
    >
      <Paper
        elevation={15}
        sx={{
          bgcolor: 'transparent',
          display: 'inherit',
          my: 'auto',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            bgcolor: '#313131',
            display: 'inherit',
            borderRadius: 2.5,
            flexDirection: 'column',
            height: '100%',
            width: '400px',
          }}
        >
          <Box
            sx={{
              bgcolor: '#0003',
              display: 'inherit',
              borderRadius: 'inherit',
              height: '150px',
              m: 1,
              textAlign: 'right',
            }}
          >
            <Display>{display}</Display>
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
                  /* eslint-disable indent */
                  switch (true) {
                    case num === ' ' || num === '\u200B':
                      break;
                    case num === '=': {
                      try {
                        const res = eval(
                          display.replace('x', '*').replace(',', '.'),
                        );
                        setDisplay(`${res}`);
                        break;
                        // eslint-disable-next-line no-unused-vars
                      } catch (error) {
                        setDisplay('Error');
                        break;
                      }
                    }
                    case num === 'AC':
                      setDisplay('0');
                      break;
                    case num === '-' ||
                      num === '+' ||
                      num === '/' ||
                      num === 'X': {
                      const lastElement = display.trim().split(' ').pop();

                      if (isNaN(lastElement.replace(',', '.'))) {
                        setDisplay(
                          (prev) =>
                            ` ${prev.trim().slice(0, -1) + num.toLowerCase()} `,
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
                        prevDisplay.length > 1 ? prevDisplay.slice(0, -1) : '0',
                      );
                      console.log(num);
                  }
                  /* eslint-enable indent */
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
