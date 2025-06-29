import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import type { FC } from 'react'

interface ExampleListProps {
  items: string[]
  codeBlockType?: 'json' | 'text'
}

export const ExampleList: FC<ExampleListProps> = ({ items, codeBlockType = 'text' }) => (
  <List dense>
    {items.map((item, idx) => (
      <ListItem key={idx} sx={{ pl: 0, alignItems: 'flex-start' }}>
        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
          <ArrowRightAltIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={
            <pre style={{ margin: 0, fontSize: '0.95em', background: 'none', padding: 0 }}>
              <code className={codeBlockType}>{item}</code>
            </pre>
          }
        />
      </ListItem>
    ))}
  </List>
)
