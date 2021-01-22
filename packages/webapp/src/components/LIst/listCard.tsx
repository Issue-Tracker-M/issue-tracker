import React, { useState } from 'react'
import {
  Box,
  Text,
  Tag,
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
  key: string
  priority: string
  due_date: string
  description: string
}

const ListCard = ({ title, priority, due_date, description }: CardProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Box
        backgroundColor="#fff"
        cursor="pointer"
        minWidth="100%"
        borderTop="1px solid black"
        p={2}
        onClick={() => setOpen(true)}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text w="30%" fontSize="sm">
          {title}
        </Text>
        <Tag w="5%" size="sm" variantcolor="red">
          {priority}
        </Tag>
        <Text w="10%" color="tomato" fontSize="12px">
          {due_date}
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
            <EditableComp label="Description" title={description} />
            <EditableComp label="Due Date" title={due_date} />
            <EditableComp label="Priority" title={priority} />
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

export default ListCard
