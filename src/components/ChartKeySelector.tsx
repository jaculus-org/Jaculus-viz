import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'

interface ChartKeySelectorProps {
  dataKeys: (string | number)[]
  selectedKeys: (string | number)[]
  onChange: (keys: (string | number)[]) => void
  getDataCountForKey: (key: string | number) => number
  MenuProps: Record<string, unknown>
}

export default function ChartKeySelector({
  dataKeys,
  selectedKeys,
  onChange,
  getDataCountForKey,
  MenuProps,
}: ChartKeySelectorProps) {
  if (!dataKeys || dataKeys.length === 0) {
    return <div>No data keys available</div>
  }

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Data Keys</InputLabel>
      <Select
        multiple
        value={selectedKeys}
        label="Data Keys"
        onChange={e => {
          const value = e.target.value
          onChange(typeof value === 'string' ? value.split(',') : value)
        }}
        input={<OutlinedInput label="Data Keys" />}
        renderValue={selected => (selected as (string | number)[]).join(', ')}
        MenuProps={MenuProps}
      >
        {dataKeys.map(key => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={selectedKeys.indexOf(key) > -1} />
            <ListItemText primary={`${key} (${getDataCountForKey(key)} pts)`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
