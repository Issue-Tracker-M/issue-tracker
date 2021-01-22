import React from 'react'
import {
  Box,
  Text,
  Editable,
  EditableInput,
  EditablePreview
} from '@chakra-ui/react'

interface EditableProps {
  label: string
  title: string
}

const EditableComp = ({ title, label }: EditableProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      w="80%"
      mb={4}
    >
      <Text mb={2} fontSize="sm">
        {label}
      </Text>
      <Editable defaultValue={title} w="70%">
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  )
}

export default EditableComp
