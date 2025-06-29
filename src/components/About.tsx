import { Box, Typography } from '@mui/material'
import { TsCodeExample } from '@/ui/code/TsCodeExample.tsx'

export function About() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data log format for Jaculus-viz parser:
      </Typography>
      <Typography gutterBottom>
        <b>Format:</b> <br />
        <img
          src="/assets/ebnf.png"
          alt="EBNF railroad diagram"
          style={{
            maxWidth: '100%',
            background: '#fff',
            borderRadius: 6,
            margin: '8px 0',
          }}
        />
        <br />
        <code>{'{key:} value [; {key:} value]*'}</code>
      </Typography>
      <Typography gutterBottom>
        <b>Examples:</b>
      </Typography>
      <TsCodeExample code={`temperature: 23.5; humidity: 60.2`} />
      <Typography variant="body2" gutterBottom>
        → <code>{'{ key: "temperature", value: 23.5, timestamp: ... }'}</code>
        <br />→ <code>{'{ key: "humidity", value: 60.2, timestamp: ... }'}</code>
      </Typography>
      <TsCodeExample code={`1; 8; 45`} />

      <Typography variant="body2" gutterBottom>
        → <code>{'{ key: 0, value: 1, timestamp: ... }'}</code>
        <br />→ <code>{'{ key: 1, value: 8, timestamp: ... }'}</code>
        <br />→ <code>{'{ key: 2, value: 45, timestamp: ... }'}</code>
      </Typography>
      <TsCodeExample code={`altitude: 1000; 5`} />
      <Typography variant="body2" gutterBottom>
        → <code>{'{ key: "altitude", value: 1000, timestamp: ... }'}</code>
        <br />→ <code>{'{ key: 0, value: 5, timestamp: ... }'}</code>
      </Typography>
      <Typography variant="h6" gutterBottom>
        How to compose logs:
      </Typography>
      <Typography gutterBottom>
        Just print lines in the above format from your device or script. For example:
      </Typography>
      <TsCodeExample code={`temperature: 22.1; humidity: 55.2\npressure: 1012.3`} />
      <Typography variant="body2" gutterBottom>
        Each line and each semicolon-separated entry will be parsed as a separate data point.
      </Typography>
    </Box>
  )
}
