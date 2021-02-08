import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { MotionContainer } from "./MotionContainer";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends UseDisclosureProps {
  toggleControl?: ReactNode;
}

export const Sidebar: FC<IProps> = ({
  children,
  onClose,
  onOpen,
  defaultIsOpen,
  toggleControl,
  isOpen: open,
  ...rest
}) => {
  const { isOpen, onToggle } = useDisclosure({
    onOpen,
    onClose,
    isOpen: open,
    defaultIsOpen,
  }); /* Control panel opening */
  return (
    <AnimateSharedLayout>
      <MotionContainer layout position="relative" {...rest}>
        <MotionContainer layout top="3" position="absolute" right="-3rem">
          {toggleControl ? (
            toggleControl
          ) : (
            <IconButton
              onClick={onToggle}
              aria-label="Open nav"
              colorScheme="teal"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              isRound
            />
          )}
        </MotionContainer>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, width: "0px", scaleX: 0 }}
              animate={{ opacity: 1, width: "max-content", scaleX: 1 }}
              exit={{ opacity: 0, width: "0px", scaleX: 0 }}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionContainer>
    </AnimateSharedLayout>
  );
};
