import React, { useState } from 'react'
import {
  Box,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button
} from '@chakra-ui/react'
import EditableComp from '../editable'

interface CardProps {
  title: string
  key: string | number
  taskId: string | number
  labels: (string | number)[] | undefined
}

const Card = ({ title, taskId, labels }: CardProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Box
        padding={2}
        cursor="pointer"
        mb={5}
        borderRadius={5}
        backgroundColor="#fff"
        minWidth="100%"
        boxShadow="#091e4240 0px 1px 0px 0px"
        onClick={() => setOpen(true)}
      >
        <Text mb={2} fontSize="sm">
          {title}
        </Text>
      </Box>
      <Drawer
        isOpen={open}
        placement="right"
        onClose={() => setOpen(false)}
        size="lg"
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <EditableComp label="Title" title={title} />
          </DrawerHeader>

          <DrawerBody>
            <p>Hello</p>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Card
