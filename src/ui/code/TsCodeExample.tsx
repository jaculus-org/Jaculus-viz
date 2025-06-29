import { CodeBlock, monokai } from 'react-code-blocks'

interface TsCodeExampleProps {
  code: string
}

export function TsCodeExample({ code }: TsCodeExampleProps) {
  return (
    <CodeBlock
      // console.log('CodeBlock rendered with TypeScript example')
      text={code
        .split('\n')
        .map(line => `consosle.log('${line}');`)
        .join('\n')}
      language="ts"
      theme={monokai}
      showLineNumbers={false}
    />
  )
}
