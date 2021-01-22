import React, { useState } from 'react'
import { useFocus } from '../../utils/useFocus'
import { Box, Button, Input } from '@chakra-ui/react'

interface NewItemFormProps {
  onAdd(text: string): void
  setShowForm(value: boolean): void
}

export const NewItemForm = (props: NewItemFormProps) => {
  const [text, setText] = useState('')
  const inputRef = useFocus()

  return (
    <Box
      padding={2}
      cursor="pointer"
      mb={5}
      borderRadius={5}
      backgroundColor="#fff"
      minWidth="100%"
      boxShadow="#091e4240 0px 1px 0px 0px"
    >
      <Input
        marginBottom={3}
        ref={inputRef}
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
      />
      <Button mr={5} onClick={() => props.onAdd(text)}>
        Create
      </Button>
      <Button onClick={() => props.setShowForm(false)}>Cancel</Button>
    </Box>
  )
}
