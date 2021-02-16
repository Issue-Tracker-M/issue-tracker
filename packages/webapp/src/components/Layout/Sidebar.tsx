import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  PropsOf,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { MotionContainer } from "./MotionContainer";

interface IProps extends UseDisclosureProps, PropsOf<typeof MotionContainer> {
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

  const animate = {
    animate: { opacity: 1, width: "max-content", scaleX: 1 },
    initial: open
      ? { opacity: 1, width: "max-content", scaleX: 1 }
      : { opacity: 0, width: "0px", scaleX: 0 },
  };

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
              {...animate}
              exit={{ opacity: 0, width: "0px", scaleX: 0 }}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionContainer>
    </AnimateSharedLayout>
  );
};
