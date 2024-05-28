import './App.css'
import { Box, Button, CardMedia, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type ApiResponse = {
  plot1: string
  plot2: string
}

const API_URL = 'http://localhost:5000/process'

const App = () => {
  const [elementsCount, setElementsCount] = useState<number>(1)
  const [lambdas, setLambdas] = useState<(number | null)[]>([0])
  const [mus, setMus] = useState<(number | null)[]>([0])

  const [graphImage, setGraphImage] = useState<string>('')
  const [plotImage, setPlotImage] = useState<string>('')

  const handleSubmit = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: elementsCount,
        array1: lambdas,
        array2: mus,
      }),
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        setGraphImage(res.plot1)
        setPlotImage(res.plot2)
      })
      .catch(() => {})
  }

  return (
    <>
      <Box sx={{ margin: '40px', display: 'flex', gap: '20px' }}>
        <Box flexDirection="column" display="flex" gap="8px">
          <TextField
            type="number"
            label="Кол-во элементов сечения"
            value={elementsCount}
            sx={{ marginTop: '30px' }}
            onChange={(e) => {
              const value = e.target.value ? Math.max(1, +e.target.value) : 1
              setElementsCount(value)

              if (value) {
                setLambdas(new Array<number>(value).fill(0))
                setMus(new Array<number>(value).fill(0))
              }
            }}
          />

          <Button
            variant="contained"
            sx={{ maxHeight: '40px' }}
            onClick={handleSubmit}
          >
            Отправить
          </Button>
        </Box>

        <Box display="flex" gap="8px" flexDirection="column">
          <Typography lineHeight="22px">
            Интенсивность отказа элемента
          </Typography>

          {lambdas.map((lambda, index) => (
            <TextField
              onChange={(e) => {
                setLambdas((prevState) =>
                  prevState.map((v, i) => (i === index ? +e.target.value : v))
                )
              }}
              type="number"
              label={`λ${index + 1}`}
              value={lambda}
              inputProps={{
                step: 0.1,
              }}
            />
          ))}
        </Box>

        <Box display="flex" gap="8px" flexDirection="column">
          <Typography lineHeight="22px">
            Интенсивность восстановления элемента
          </Typography>

          {mus.map((mu, index) => (
            <TextField
              onChange={(e) => {
                setMus((prevState) =>
                  prevState.map((v, i) => (i === index ? +e.target.value : v))
                )
              }}
              type="number"
              label={`μ${index + 1}`}
              value={mu}
              inputProps={{
                step: 0.1,
              }}
            />
          ))}
        </Box>
      </Box>
      {!!graphImage.length && !!plotImage.length && (
        <Box display="flex" flexDirection="column" gap="16px" maxWidth="80%">
          <CardMedia
            component="img"
            src={`data:image/png;base64, ${graphImage}`}
          />
          <CardMedia
            component="img"
            src={`data:image/png;base64, ${plotImage}`}
          />
        </Box>
      )}
    </>
  )
}

export default App
